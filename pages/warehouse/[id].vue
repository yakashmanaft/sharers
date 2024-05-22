<script lang="ts" setup>
import { onMounted } from "vue";
import { Container } from "@/shared/container";

useHead({
  title: `Склад | Соучастники`,
  meta: [
    {
      name: "description",
      content: "My Description",
    },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
      integrity:
        "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
      crossorigin: "anonymous",
      type: "text/css",
    },
  ],
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
      integrity:
        "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
      crossorigin: "anonymous",
    },
  ],
});

//
const route = useRoute();
//
const items = ref(null);
const item = ref(null);
const itemLocations = ref(null);
const switchedItem = ref(null);
const projects = ref(null);
const locations = ref(null);
const organizations = ref(null)
const allTransactions = ref(null);
const currentItemTransactions = ref(null);
//
const sumQtyUniqLocations = ref(null);
//
const switchedLocation = ref({
  location: "",
  locationID: null,
});

const { users } = storeToRefs(useUsersStore());
const { loadData } = useUsersStore();

// const linkAllIsActive = ref(false);

// const sumSimilar = (arr) => {
//   const res = [];

//   for (let i = 0; i < arr.length; i++) {
//     const ind = res.findIndex((el) => el.location === arr[i].location && el.locationID === arr[i].locationID);

//     if (ind === -1) {
//       res.push(arr[i]); // If not found, add the object to the result array.
//     } else {
//       res[ind].qty += arr[i].qty; // If found, add the 'value' property to the existing object.
//     }
//   }

//   return res;
// };

onMounted(async () => {
  //
  await loadData();
  projects.value = await getProjects();
  items.value = await getItems();
  locations.value = await getLocations();
  organizations.value = await getOrganizations()
  allTransactions.value = await getWarehouseTransaction();

  item.value = items.value.find((item: any) => item.id == route.params.id);

  itemLocations.value = items.value.filter((element) => {
    if (
      element.type === "stuff" &&
      element.title === item.value.title &&
      element.location !== "deleted" &&
      element.location !== "archive"
    ) {
      return element;
    }
  });

  sumQtyUniqLocations.value = Object.values(
    itemLocations.value.reduce((acc, { id, location, locationID, qty }) => {
      let key = location + "|" + locationID;

      acc[key] = acc[key] || { id, location, locationID, qty: 0 };
      acc[key].qty += qty;
      return acc;
    }, {})
  );

  switchedLocation.value.location = item.value.location;
  switchedLocation.value.locationID = item.value.locationID;

  switchedItem.value = itemLocations.value.filter((element) => {
    if (
      switchedLocation.value.location === element.location &&
      switchedLocation.value.locationID === element.locationID
    ) {
      return element;
    }
  });

  if (switchedLocation.value.location === "all") {
    currentItemTransactions.value = allTransactions.value.filter((element) => {
      if (element.itemTitle === item.value.title) {
        return element;
      }
    });
  } else {
    currentItemTransactions.value = allTransactions.value.filter((element) => {
      if (
        element.itemTitle === item.value.title &&
        element.locationTo === switchedLocation.value.location &&
        element.locationToID === switchedLocation.value.locationID
      ) {
        return element;
      }
    });
  }
});

const translateLocation = (id: any, location: string) => {
  if (location && id) {
    // PROJECTS
    if (location === "project") {
      if (projects.value) {
        let project = projects.value.find((project) => project.id == id);
        return project.title;
      }
    }

    // SKLAD (location)
    else if (location === "sklad") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return locationItem.title;
      }
    }

    // OFFICE (locations)
    else if (location === "office") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return `${locationItem.title}`;
      }
    }

    // REPAIR (locations)
    else if (location === "repair") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return `Ремонт: ${locationItem.title}`;
      }
    }

    // ARCHIVE
    else if (location === "archive") {
      return `Архив`;
    }

    // DELETED
    else if (location === "deleted") {
      return "Списание";
    }

    // ELSE location
    else {
      return alert(
        "warehouse :id.vue error - strange object.location in translateLocation function"
      );
    }
  } else {
    alert("warehouse :id.vue translateLocation function error");
  }
  return location;
};
const translateOwner = (ownerID: any, ownerType: string) => {
  if (ownerID && ownerType && users.value && organizations.value) {
    if (ownerType === "user") {
      // return `USER #${ownerID}`
      let userItem = users.value.find((item) => item.id === ownerID);
      return `${userItem?.surname} ${userItem?.name[0]}. ${userItem?.middleName[0]}.`;
    } else if (ownerType === "company") {
      // return `Компания #${ownerID}`
      let organizationItem = organizations.value.find(
        (item) => item.id === ownerID
      );
      return organizationItem.title;
    }
  } else if (ownerID === 0 && !ownerType) {
    return `Не соучастник`;
  }
}
const translateResponsibles = (id: any) => {
  if (id) {
    let responsible = users.value.find((user) => user.id === id);
    return `${responsible?.surname} ${responsible?.name[0]}. ${responsible?.middleName[0]}.`;
  }
}

//
/**
 * @desc Get warehouse items, projects, locations from BD
 */
async function getItems() {
  return await $fetch("/api/warehouse/item");
}

async function getProjects() {
  return await $fetch("/api/projects/projects");
}

async function getLocations() {
  return await $fetch("/api/locations/locations");
}
async function getOrganizations() {
  return await $fetch("/api/organizations/organizations")
}
async function getWarehouseTransaction() {
  return await $fetch("/api/warehouse/ledger");
}
// const { data: allTransactions } = await useFetch("/api/warehouse/ledger", {
//   transform: (allTransactions) => {
//     return allTransactions.filter(transaction => transaction.title === item.value.title)
//   }
// })

// sum items qty
const sumItemsQty = () => {
  let total;
  if (items.value) {
    if (itemLocations.value && item.value) {
      total = itemLocations.value.reduce((sum, el) => sum + el.qty, 0);
    }
  }
  return total;
};

// WATHERS
watch(switchedLocation, () => {
  if (switchedLocation.value.location === "all") {
    switchedItem.value = itemLocations.value;
    //
    currentItemTransactions.value = allTransactions.value.filter((element) => {
      if (element.itemTitle === item.value.title) {
        return element;
      }
    });
  } else {
    switchedItem.value = itemLocations.value.filter((element) => {
      if (
        switchedLocation.value.location === element.location &&
        switchedLocation.value.locationID === element.locationID
      ) {
        return element;
      }
    });
    //
    currentItemTransactions.value = allTransactions.value.filter((element) => {
      if (
        element.itemTitle === item.value.title &&
        element.locationTo === switchedLocation.value.location &&
        element.locationToID === switchedLocation.value.locationID
      ) {
        return element;
      }
    });
  }
});
</script>

<template>
  <Container>
    <div v-if="item">
      <div
        style="display: flex; flex-direction: column; justify-content: center"
      >
        <h1>{{ item.title }}</h1>
        <!-- {{ linkAllIsActive }} -->
        <div style="margin: 0; margin-top: 1rem;">

          <!-- Кол-во, местонахождение -->
          <p>{{ item.qty }} <span>{{ item.measure }}</span> <span class="item-location"><label for="">{{ translateLocation(item.locationID, item.location) }}</label> </span></p>

          <!-- Собственник -->
          <p>Собственник: <span>{{ translateOwner(item.ownerID, item.ownerType) }}</span></p>
          <!-- Отвественный -->
          <p>Ответственный: <span>{{ translateResponsibles(item.responsible) }}</span></p>
          <span></span>
        </div>

        <div>
          <h2 style="margin-top: 1rem;">Описание</h2>

          <!-- ТИП ПРЕДМЕТА -->
          <div>
            <!-- Инструмент -->
            <div v-if="item.type === 'tools'">
              <p>Тип: {{ item.type }}</p> 
              <ul>
                <li>Серийник (если есть)</li>
              </ul>
            </div>
            <!-- Материалы -->
            <div v-if="item.type === 'consumables'">
              <p>Тип: {{ item.type }}</p>
              <!-- {{ item }} -->
            </div>
            <!-- Техника -->
            <div v-if="item.type === 'technic'">
              <p>Тип: {{ item.type }}</p>
              <!-- {{ item }} -->
            </div>
          </div>

          <!-- Текст -->
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae
            autem mollitia rerum fugit et nobis, facilis optio deserunt eligendi
            aliquam quod ex dolore placeat labore fuga ullam, id commodi repellat
            eum. Deserunt nam dicta error excepturi atque quam qui cum reiciendis
            suscipit officiis libero nesciunt dolor voluptatibus hic laudantium
            voluptate doloremque doloribus corporis facere velit animi, cumque
            neque. Quae, distinctio beatae architecto aperiam ratione accusantium,
            sunt nam autem incidunt aliquam eum nobis maiores modi, temporibus
            praesentium sed ab. Dolor veritatis non magnam commodi architecto sit
            qui magni vel perspiciatis laborum praesentium, atque officiis
            aspernatur quasi voluptates perferendis quaerat vero illo deserunt aut
            <br>
            <span>Это item:{{ item }}</span>
          </p>
        </div>

        <div v-if="itemLocations.length > 1">
          <h2>{{ item.title }} в других местах</h2>
          <!-- set item to view -->
          <fieldset id="item-locations" class="switch-item_wrapper">
            <div class="switch-item_el">
              <input
                type="radio"
                id="all-item-view"
                name="item-locations"
                :value="{ location: 'all', locationID: null }"
                v-model="switchedLocation"
              />
              <label for="all-item-view">Всего {{ sumItemsQty() }}</label>
            </div>
  
            <!-- Если location только один (в массиве itemLocations нет повторений и других location) -->
            <!-- <div 
              class="switch-item_el"
              v-if="itemLocations.length === 0"
            >
              <label for="">{{ translateLocation(item.locationID, item.location) }}</label>
            </div> -->
            <div
              class="switch-item_el"
              v-for="(location, i) in sumQtyUniqLocations"
              :key="i"
            >
              <input
                type="radio"
                :id="`${location.location}${location.id}`"
                name="item-locations"
                :value="{
                  location: location.location,
                  locationID: location.locationID,
                }"
                v-model="switchedLocation"
              />
              <label :for="`${location.location}${location.id}`"
                >{{
                  translateLocation(location.locationID, location.location)
                }}
                {{ location.qty }}</label
              >
            </div>
          </fieldset>

          <!--  -->
          <div style="margin-top: 1rem;">
            <h3 style="font-size: 1rem;">Наличие | История</h3>
          </div>
        </div>

        <!-- Местонахождение -->
        <div class="item-locations_block" v-if="itemLocations.length > 1" style="margin-top: 1rem;">
          <!-- <h3>Наличие на локациях</h3> -->
        </div>

        <!-- Предметы по разным параметрам, но на одной локации -->
        <table class="table" v-if="switchedItem.length" style="margin-top: 1rem;">
          <thead class="item-table_header">
            <tr>
              <th scope="col"></th>
              <!-- <th scope="col">Наименование</th> -->
              <th scope="col">Кол-во</th>
              <th scope="col" class="hide-991">Собственник</th>
              <th scope="col" class="hide-991">Ответственный</th>
            </tr>
          </thead>
          <tbody>
            <div v-if="switchedItem">
              <div v-if="!switchedItem.length">
                  Ничего нет
              </div>
            </div>

            <!--  -->
            <tr class="table-row_wrapper" 
            v-for="element in switchedItem"           
            :key="element.id"
            >
              <!-- {{ element }} -->
              <!-- 1 -->
              <!-- @click="toggleExpendedItemBlock(item.id)" -->
              <td>
                <label>
                  <input type="checkbox" id="expend-item" :class="`expended-item-${item.id}_block`">
                  <Icon
                    class="expand-item_icon"
                    name="material-symbols-light:expand-more"
                    size="28px"
                  />
                </label>
              </td>

              <!-- 2 -->
              <!-- :class="locationMarkColorized(item.location)" -->
              <td class="item-qty" scope="col">
                <div 
                class="location-mark"
                >
                  <span>{{ element.qty }} {{  element.measure  }}</span>
                </div>
              </td>

              <!-- 3 -->
              <td class="span-2 hide-767 hide-991" scope="col">
                <span
                  class="link"
                  >
                  {{ element.ownerType }} {{ element.ownerID }}
                </span>
                <!-- @click="onClickOwner(item.ownerID, item.ownerType)" -->
                <!-- {{ translateOwner(item.ownerID, item.ownerType) }} -->
              </td>

              <!-- 5 -->
              <td class="span-2 hide-767 hide-991" scope="col">
                <span
                  class="link"
                  @click="$router.push(`/partners/${item.responsible}`)"
                  >
                    {{ element.responsible }}
                  </span
                  >
                  <!-- {{ translateResponsibles(item.responsible) }} -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- hISTOrY TRANSACTIONS -->
      <div v-if="currentItemTransactions.length !== 0">
        <h3>История по локации</h3>
        <table class="table">
          <!-- <thead class="item-table_header">
            <tr>
              <th scope="col"></th>
              <th scope="col">Наименованиее</th>
            </tr>
          </thead> -->

          <tbody>
            <div v-if="currentItemTransactions">
              <div v-if="!currentItemTransactions.length">
                Нет истории
              </div>
            </div>

            <!-- trasactions -->
            <tr v-for="(transaction, i) in currentItemTransactions" :key="i">
              {{ transaction }}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </Container>
</template>

<style scoped>
.switch-item_wrapper {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  scrollbar-width: none;
}
.switch-item_wrapper::-webkit-scrollbar {
  display: none;
}
.switch-item_el {
  /* text-wrap: nowrap; */
  white-space: nowrap;
}
.switch-item_el input[type="radio"] {
  opacity: 0;
  position: fixed!important;
  width: 0;
}
.item-location,
.switch-item_el label {
  cursor: pointer;
  padding: 4px 10px;
  border: 1px solid black;
  border-radius: 16px;
}
.item-location {
  color: var(--bs-body-bg);
  background-color: var(--bs-body-color);
}
.switch-item_el label:hover {
  color: var(--bs-body-bg);
  background-color: var(--bs-body-color);
  transition: all 0.15s ease-in;
}
.switch-item_el input[type="radio"]:checked + label {
  color: var(--bs-body-bg);
  background-color: var(--bs-body-color);
}
@media screen and (max-width: 767px) {
  h1 {
    margin-top: 4rem;
  }
}

@media screen and (min-width: 768px) {
  h1 {
    margin-top: 7rem;
  }
  .item-locations_block {
    width: 100%;
    /* background-color: red; */
    /* position: relative; */
  }
  .switch-item_wrapper {
    /* display: flex;
    flex-direction: row; */
    /* position: absolute;
    display: inline-block;
    top: 100px;
    left: 0;
    padding: 100px 0 0 0;
    max-height: 500px;
    margin: 0;
    transform: rotate(-90deg) translateY(-80px);
    transform-origin: right top; */
    /* width: 100%; */
    /* 
    overflow-y: auto;
    overflow-x: scroll; */
    /* background: #abc; */
    /* overflow: scroll; */
    /* white-space: nowrap; */
    /* display: flex; */
    /* flex-wrap: nowrap; */
    /* overflow-x: auto; */
  }
  .switch-item_el {
    /* flex: 0 0 auto; */
    /* display: inline-block; */
    /* width: 140px; */
    /* height: 46px;
    margin: 50px 10px;
    padding: 5px; */
    /* background: #cab; */
    /* transform: rotate(90deg) translateY(80px); */
    /* transform-origin: right top; */
    /* display: inline-block; */
  }
  .switch-item_el:first-child {
  }
  .switch-item_el label {
    /* white-space: nowrap; */
  }
}

/* .link {
  text-wrap: nowrap;
}
.item-locations_block {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.item-locations_block::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.item-location_qty {
  margin-left: 5px;
  margin-right: -6px;
  background-color: #fff;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  color: var(--bs-dark);
} */
/* .link-location {
  padding: 4px 10px;
  border-radius: 16px;
} */
/* .link-all_block {
  display: flex;
  align-items: center;
  justify-content: center;
} */
/* .link-all {
  padding: 0;
  padding: 4px 10px;
  border-radius: 16px;
  border: 1px solid var(--bs-dark-bg-subtle);
} */
/* .link-all_active {
  color: #fff;
  background-color: var(--bs-dark);
}
.link:hover {
  cursor: pointer;
} */
/* .link_project {
  color: var(--bs-success);
  border: 1px solid var(--bs-success-bg-subtle);
} */
/* .link_sklad {
  color: var(--bs-primary-bg-subtle);
  border: 1px solid var(--bs-primary-bg-subtle);
} */
/* .link_office {
  color: var(--bs-primary-bg-subtle);
  border: 1px solid var(--bs-primary-bg-subtle);
}
.link_repair {
  color: var(--bs-warning);
  border: 1px solid var(--bs-warning-bg-subtle);
}
.link_archive {
  color: var(--bs-dark-bg-subtle);
  border: none;
}
.link_deleted {
  color: var(--bs-danger-bg-subtle);
  border: none;
}
.link_current-route {
  color: red;
} */
/* .link_project.link_current-route {
  color: #fff;
  background-color: var(--bs-success);
  border-color: var(--bs-success);
}
.link_sklad.link_current-route {
  color: #fff;
  background-color: var(--bs-primary);
  border: none;
}
.link_office.link_current-route {
  color: #fff;
  background-color: var(--bs-primary);
  border: none;
}
.link_repair.link_current-route {
  color: #fff;
  background-color: var(--bs-warning);
  border: none;
} */
.table {

}
.item-table_header {

}
.table-row_wrapper {
  /* background-color: rgba(0, 0, 0, 0.05); */
}
.table-row_wrapper td:hover {
  /* background-color: red; */
  /* cursor: pointer; */
  /* background-color: rgba(0, 0, 0, 0.05); */
}
.hide-991 {

}
</style>
