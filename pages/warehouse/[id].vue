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
const allTransactions = ref(null);
const currentItemTransactions = ref(null);
//
const switchedLocation = ref({
  location: "",
  locationID: null,
});
// const linkAllIsActive = ref(false);

onMounted(async () => {
  //
  projects.value = await getProjects();
  items.value = await getItems();
  locations.value = await getLocations();
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

// const locationLinkColorized = (location: string, id: number) => {
//   if (location) {
//     if (+route.params.id === id) {
//       if (!linkAllIsActive.value) {
//         return `link_${location} link_current-route`;
//       } else {
//         return `link_${location}`;
//       }
//     } else {
//       return `link_${location}`;
//     }
//   }
// };

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
async function getWarehouseTransaction() {
  return await $fetch("/api/warehouse/ledger");
}

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
    <div v-if="item" style="margin-top: 7rem">
      <div
        style="display: flex; flex-direction: column; justify-content: center"
      >
        <h1>{{ item.title }}</h1>
        <!-- {{ linkAllIsActive }} -->
        <p style="margin: 0">
          Мера: <span>{{ item.measure }}</span>
        </p>

        <!--  -->
        <h2>Описание</h2>
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
          impedit facilis voluptatum. Quod expedita nihil eaque commodi, cum
          molestias a ea nulla quis numquam. Rerum quasi, dolores molestiae,
          quibusdam laudantium numquam veritatis, accusamus impedit quam aliquid
          atque laborum fugiat omnis corrupti officiis quae cupiditate molestias
          neque illo. Nulla tenetur necessitatibus asperiores voluptatibus fuga,
          earum deserunt totam culpa dolorum. Aliquam quas quibusdam,
          dignissimos libero exercitationem tempora quisquam earum voluptate,
          nesciunt sapiente eos provident optio fugit aliquid ab velit
          voluptatibus iusto! Vitae, voluptatem! Aperiam totam officia nisi
          accusamus temporibus animi, quo omnis repellendus, nihil impedit
          possimus dolores, nesciunt voluptates maxime inventore odio. Culpa
          perspiciatis nesciunt pariatur illo modi reprehenderit.
        </p>

        <!-- {{ projects }} -->
        <!-- Материалы -->
        <div v-if="item.type === 'stuff'" class="item-locations_block">
          <!-- set item to view -->
          <fieldset id="item-locations" class="switch-item_wrapper">
            <div class="switch-item_el" v-if="itemLocations.length > 1">
              <input
                type="radio"
                id="all-item-view"
                name="item-locations"
                :value="{ location: 'all', locationID: null }"
                v-model="switchedLocation"
              />
              <label for="all-item-view">Всего {{ sumItemsQty() }}</label>
            </div>
            <div
              class="switch-item_el"
              v-for="(location, i) in itemLocations"
              :key="i"
            >
              <input
                type="radio"
                :id="location.id"
                name="item-locations"
                :value="{
                  location: location.location,
                  locationID: location.locationID,
                }"
                v-model="switchedLocation"
              />
              <label :for="location.id"
                >{{
                  translateLocation(location.locationID, location.location)
                }}
                {{ location.qty }}</label
              >
            </div>
          </fieldset>
          <!-- Показать динамически места, в которых есть данный материал. Стили как в общем списке ТЦ. По клику переходим на ТМЦ по выбранному месту. Выделить текущее местоположение выбранного ТМЦ -->
          <!-- <div
            class="link link-location link-all link-all_block"
            :class="{ 'link-all_active': linkAllIsActive }"
            v-if="itemLocations.length > 1"
            @click="linkAllIsActive = true"
          >
            <span> Всего</span>
            <span class="item-location_qty">{{ sumItemsQty() }}</span>
          </div>
          <div v-for="(location, i) in itemLocations" :key="i">
            <router-link
              class="link link-location"
              :class="`${locationLinkColorized(
                location.location,
                location.id
              )}`"
              @click="linkAllIsActive = false"
              :to="`${location.id}`"
              style="
                text-decoration: none;
                display: flex;
                justify-content: center;
                align-items: center;
                height: inherit;
              "
            >
              <span>
                {{ translateLocation(location.locationID, location.location) }}
              </span>
              <span class="item-location_qty">{{ location.qty }}</span>
            </router-link>
          </div> -->
        </div>
        <!-- Если прсомотреть хочется по всем объектам общую инфу по предмету -->
        <div
          v-for="element in switchedItem"
          :key="element.id"
          style="margin-top: 1rem"
        >
          {{ element }}
        </div>
      </div>

      <!-- Инструмент -->
      <div v-if="item.type === 'tools'">
        <ul>
          <li>Серийник (если есть)</li>
          <li>Описание?</li>
        </ul>
      </div>

      <!-- Материалы -->
      <div v-if="item.type === 'consumables'">
        <h2>РАСХОДНИКИ</h2>
        {{ item }}
      </div>
      <!-- Техника -->
      <div v-if="item.type === 'technic'">
        <h2>ТЕХНИКА</h2>
        {{ item }}
      </div>
      <br />

      <div v-if="currentItemTransactions.length !== 0">
        <h2>История</h2>
        <ul style="list-style: none; padding: 0">
          <li v-for="(transaction, i) in currentItemTransactions" :key="i">
            <!-- <div> -->
            {{ transaction }}

            <!-- <ul style="list-style: none; padding: 0">
              <li style="display: flex; align-items: center; gap: 1rem">
                <div>2024-03-23T13:54:12.000Z</div>
                <div>"Склад на Бригадирской" (Камини собственник)</div>
                <div>-</div>
                <div>"Склад на Бригадирской" (Камини собственник)</div>
                <div>Анфалов С.В.</div>
              </li>
              <li style="display: flex; align-items: center; gap: 1rem">
                <div>{{ item.created_at }}</div>
                <div>
                  Добавлен на "Склад на Бригадирской" (Камини собственник)
                </div>
                <div>Анфалов С.В.</div>
              </li>
            </ul> -->
            <!-- </div> -->
          </li>
          <br />
          <li>Стоимость закупа (руб.)</li>
          <li>Ценность (руб.)</li>
        </ul>
      </div>
    </div>
  </Container>
</template>

<style scoped>
.switch-item_wrapper {
  width: 100%;
  display: flex;
  overflow-x: scroll;
  gap: 1rem;
}
.switch-item_wrapper::-webkit-scrollbar {
  display: none;
}
.switch-item_el {
  text-wrap: nowrap;
}
.switch-item_el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}
.switch-item_el label {
  cursor: pointer;
  padding: 4px 10px;
  border: 1px solid black;
  border-radius: 16px;
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
</style>
