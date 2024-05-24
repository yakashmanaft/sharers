<script lang="ts" setup>
import { onMounted, watch } from "vue";
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
const organizations = ref(null);
const allTransactions = ref(null);
const currentItemTransactions = ref(null);
//
const sumQtyUniqLocations = ref(null);
//
const switchedLocation = ref({
  location: "",
  locationID: null,
});
// other locations info actions buttons
const infoActionsBtns = ref([
  {
    name: "available",
    title: "Наличие",
  },
  {
    name: "history",
    title: "История",
  },
]);
const infoActionBtn = ref("available");
const showCaseByAvailable = ref(null);
const showCaseByHistory = ref(null);

// Дергаем пользователей из БД с помощью функций из стора
const { users } = storeToRefs(useUsersStore());
const { loadData } = useUsersStore();

onMounted(async () => {
  //
  await loadData();
  projects.value = await getProjects();
  items.value = await getItems();
  locations.value = await getLocations();
  organizations.value = await getOrganizations();
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

  if (item.value) {
    switchedLocation.value.location = item.value.location;
    switchedLocation.value.locationID = item.value.locationID;
  }

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
        element.itemTitle === item.value.title
        // &&
        //   element.locationTo === switchedLocation.value.location &&
        //   element.locationToID === switchedLocation.value.locationID)
        // (element.itemTitle === item.value.title &&
        //   element.locationFrom === switchedLocation.value.location &&
        //   element.locationFromID === switchedLocation.value.locationID)
      ) {
        return element;
      }
    });
  }

  showCase();
});

// translators functions
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
};
const translateResponsibles = (id: any) => {
  if (id) {
    let responsible = users.value.find((user) => user.id === id);
    return `${responsible?.surname} ${responsible?.name[0]}. ${responsible?.middleName[0]}.`;
  }
};

//
/**
 * @desc Get warehouse items, projects, locations, organizations, warehouseTransactions from BD
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
  return await $fetch("/api/organizations/organizations");
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

// SHOW CASE HISTORY or AVAILABLE
const showCase = () => {
  if (
    itemLocations.value.length <= 1 &&
    currentItemTransactions.value.length !== 0
  ) {
    showCaseByAvailable.value = false;
    showCaseByHistory.value = true;
  } else if (
    itemLocations.value.length <= 1 &&
    currentItemTransactions.value.length === 0
  ) {
    showCaseByAvailable.value = false;
    showCaseByHistory.value = false;
  } else {
    if (infoActionBtn.value === "available") {
      showCaseByAvailable.value = true;
      showCaseByHistory.value = false;
    } else if (infoActionBtn.value === "history") {
      showCaseByAvailable.value = false;
      showCaseByHistory.value = true;
    }
  }
  // itemLocations.value.length > 1
  // currentItemTransactions.value.length !== 0
};

//
const currentExpendedItemBlock = ref(null);

const toggleExpendedItemBlock = (itemID: number) => {
  if (itemID) {
    currentExpendedItemBlock.value = `expended-item-${itemID}_block`;
    let block = document.querySelector(`#${currentExpendedItemBlock.value}`);
    // console.log(block);
    // console.log(currentExpendedItemBlock.value);
    if (block) {
      //   console.log(block)
      if (block.classList.contains("expended-item_opened")) {
        block.classList.remove("expended-item_opened");
      } else {
        block.classList.add("expended-item_opened");
      }
    }

    console.log(currentExpendedItemBlock.value);
  }
};

// Добавляет знак "минус" или "плюс" в зависимости от транзакции
const addArithmeticMark = (type, from, fromID, to, toID) => {
  if (item.value) {
    if (switchedLocation.value.location === "all") {
      return "";
    } 
    // if(currentItemTransactions.value.find(item => item.locationFrom === switchedLocation.value.location && item.locationFromID === switchedLocation.value.locationID)) {
    //   return '-'
    // }
    // else {
    //   if (type === "move") {
    //     if (from === item.value.location && fromID === item.value.locationID) {
    //       return "-";
    //     }
    //   }
    // }
  }
  //   // CREATED ITEM
  //   if (type === "created") {
  //     return "+";
  //   }
  //   // ADD
  //   else if (type === "add") {
  //     return "+";
  //   }
  //   // SUB
  //   else if (type === "sub") {
  //     return "-";
  //   }
  //   // MOVE
  //   else if (type === "move") {
  //     // Если перенсли из текущей выбранной локации
  //     if (
  //       from === item.value.location &&
  //       fromID === item.value.locationID &&
  //       to !== item.value.location &&
  //       toID !== item.value.locationID
  //     ) {
  //       return "-";
  //     }
  //     // Если перенесли в текущую выбранную локацию
  //     else if (
  //       to === item.value.location &&
  //       toID === item.value.locationID &&
  //       from !== item.value.location &&
  //       fromID !== item.value.locationID
  //     ) {
  //       return "+";
  //     }
  //     //
  //     else {
  //       return "Косяк";
  //     }
  //   }
  //   //
  //   else if (switchedLocation.value.location === "all") {
  //     return "555";
  //   }
};

// WATHERS
watch(switchedLocation, () => {
  // infoActionBtn.value = "available";
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
      } else if (
        element.itemTitle === item.value.title &&
        element.locationFrom === switchedLocation.value.location &&
        element.locationFromID === switchedLocation.value.locationID
      ) {
        return 123;
      }
    });
  }
});

watch(infoActionBtn, () => {
  // console.log(switchedLocation.value.location)
  if (switchedLocation.value.location === "all") {
    currentItemTransactions.value = allTransactions.value.filter((element) => {
      if (element.itemTitle === item.value.title) {
        return element;
      }
    });
  } else {
    currentItemTransactions.value = allTransactions.value.filter((element) => {
      if (
        (element.itemTitle === item.value.title &&
          element.locationTo === switchedLocation.value.location &&
          element.locationToID === switchedLocation.value.locationID) ||
        (element.locationFrom === switchedLocation.value.location &&
          element.locationFromID === switchedLocation.value.locationID)
      ) {
        return element;
      }
    });
  }

  showCase();
  // console.log(currentItemTransactions.value);
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
        <div style="margin: 0; margin-top: 1rem">
          <!-- Кол-во, местонахождение -->
          <p>
            {{ item.qty }} <span>{{ item.measure }}</span>
            <span class="item-location" style="margin-left: 0.5rem"
              ><label for="">{{
                translateLocation(item.locationID, item.location)
              }}</label>
            </span>
          </p>

          <!-- Собственник -->
          <p>
            Собственник:
            <span>{{ translateOwner(item.ownerID, item.ownerType) }}</span>
          </p>
          <!-- Отвественный -->
          <p>
            Ответственный:
            <span>{{ translateResponsibles(item.responsible) }}</span>
          </p>
          <span></span>
        </div>

        <div>
          <h2 style="margin-top: 1rem">Описание</h2>

          <!-- ПО ТИПУ ПРЕДМЕТА -->
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
            aliquam quod ex dolore placeat labore fuga ullam, id commodi
            repellat eum. Deserunt nam dicta error excepturi atque quam qui cum
            reiciendis suscipit officiis libero nesciunt dolor voluptatibus hic
            laudantium voluptate doloremque doloribus corporis facere velit
            animi, cumque neque. Quae, distinctio beatae architecto aperiam
            ratione accusantium, sunt nam autem incidunt aliquam eum nobis
            maiores modi, temporibus praesentium sed ab. Dolor veritatis non
            magnam commodi architecto sit qui magni vel perspiciatis laborum
            praesentium, atque officiis aspernatur quasi voluptates perferendis
            quaerat vero illo deserunt aut
            <br />
            <span>Это item:{{ item }}</span>
          </p>
        </div>

        <!-- Показываем другие локации, где есть текущий предмет -->
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
          <!-- v-if="
                itemLocations.length > 1 && currentItemTransactions.length !== 0
              " -->
          <div style="margin-top: 1rem">
            <h3 class="infoActionBtns_wrapper">
              <div
                class="infoActionBtns_el"
                v-for="(btn, index) in infoActionsBtns"
                :key="index"
              >
                <input
                  type="radio"
                  :id="btn.name"
                  name="info-action-btns"
                  :value="btn.name"
                  v-model="infoActionBtn"
                />
                <label :for="btn.name">
                  {{ btn.title }}
                </label>
              </div>
            </h3>

            <!-- {{ infoActionBtn }} -->
          </div>
        </div>

        <!-- AVAILABLE IN LOCATION -->
        <div class="item-locations_block" v-if="showCaseByAvailable">
          <h3>Наличие на местеэ</h3>
          <!-- Предметы по разным параметрам, но на одной локации -->
          <table class="table table-by-available" v-if="switchedItem.length">
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
                <div v-if="!switchedItem.length">Ничего нет</div>
              </div>

              <!--  -->
              <tr
                class="table-row_wrapper"
                v-for="element in switchedItem"
                :key="element.id"
              >
                <!-- {{ element }} -->
                <!-- 1 -->
                <!-- @click="toggleExpendedItemBlock(item.id)" -->
                <td>
                  <label>
                    <input
                      type="checkbox"
                      id="expend-item"
                      :class="`expended-item-${element.id}_block`"
                    />
                    <Icon
                      class="expand-item_icon"
                      @click="toggleExpendedItemBlock(element.id)"
                      name="material-symbols-light:expand-more"
                      size="28px"
                    />
                  </label>
                </td>

                <!-- 2 -->
                <!-- :class="locationMarkColorized(item.location)" -->
                <td class="item-qty" scope="col">
                  <div class="location-mark">
                    <span>{{ element.qty }} {{ element.measure }}</span>
                  </div>
                </td>

                <!-- 3 -->
                <td class="span-2 hide-767 hide-991" scope="col">
                  <span class="link">
                    {{ translateOwner(element.ownerID, element.ownerType) }}
                  </span>
                  <!-- @click="onClickOwner(item.ownerID, item.ownerType)" -->
                </td>

                <!-- 5 -->
                <td class="span-2 hide-767 hide-991" scope="col">
                  <span
                    class="link"
                    @click="$router.push(`/partners/${item.responsible}`)"
                  >
                    {{ translateResponsibles(item.responsible) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- hISTOrY TRANSACTIONS -->
      <!-- currentItemTransactions.length !== 0 -->
      <div v-if="showCaseByHistory">
        <h3>История предмета в локации</h3>
        <table class="table table-by-history">
          <thead class="item-table_header">
            <tr>
              <th scope="col">Дата</th>
              <th scope="col">Автор</th>
              <th scope="col">Тип</th>
              <th scope="col">Кол-во</th>
              <th scope="col">Откуда</th>
              <th scope="col">Куда</th>
            </tr>
          </thead>

          <tbody>
            <div v-if="currentItemTransactions">
              <div v-if="!currentItemTransactions.length">Нет истории</div>
            </div>

            <!-- trasactions -->
            <tr
              v-for="(transaction, i) in currentItemTransactions"
              :key="i"
              class="table-row_wrapper"
            >
              <!-- 1 -->
              <td scope="col">
                <span>{{ transaction.id }}</span
                ><br />
                <span>{{ transaction.created_at }}</span>
              </td>
              <!-- 2 -->
              <td scope="col">
                <span>{{ translateResponsibles(transaction.authorID) }}</span>
              </td>
              <!-- 3 -->
              <td scope="col">
                <span>{{ transaction.transactionType }}</span>
              </td>
              <!-- 3 -->
              <td scope="col">
                <span
                  >{{ addArithmeticMark(transaction.transactionType)
                  }}{{ transaction.qty }} {{ transaction.measure }}</span
                >
              </td>
              <!-- 3 -->
              <td scope="col">
                <span
                  >{{ transaction.locationFrom }}
                  {{ transaction.locationFromID }}</span
                >
              </td>
              <!-- 4 -->
              <td scope="col">
                <span
                  >{{ transaction.locationTo }}
                  {{ transaction.locationToID }}</span
                >
              </td>
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
.infoActionBtns_wrapper {
  display: flex;
  gap: 0.5rem;
}
.infoActionBtns_el,
.switch-item_el {
  /* text-wrap: nowrap; */
  white-space: nowrap;
  position: relative;
}

.infoActionBtns_el label {
  /* color: var(--bs-primary); */
  font-weight: normal;
  font-size: 1rem;
  border: 1px solid var(--bs-border-color);
  padding: 4px 10px;
  border-radius: 16px;
  transition: all 0.15s ease-in;
}
.infoActionBtns_el label:hover {
  cursor: pointer;
  background-color: var(--bs-primary-bg-subtle);
}

.infoActionBtns_el input[type="radio"],
.switch-item_el input[type="radio"] {
  /* opacity: 0;
  position: fixed!important;
  width: 0; */
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  opacity: 0;
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
.infoActionBtns_el input[type="radio"]:checked + label {
  color: var(--bs-body-bg);
  background-color: var(--bs-primary);
}
.table-by-available .item-table_header tr,
.table-by-available .table-row_wrapper {
  display: grid;
  grid-template-columns: 50px 1fr 1fr 1fr;
}

.table-by-history .item-table_header tr,
.table-by-history .table-row_wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 100px 1fr 1fr 1fr;
}
.expand-item_icon {
  cursor: pointer;
}
label #expend-item {
  display: none;
}
label #expend-item:checked + .expand-item_icon {
  transform: rotate(180deg);
}
/* .expended-item {
  display: none;
} */
/* .expended-item_opened {
  display: block;
  border: none;
} */
/* .expended-item_btns button span:hover {
  color: var(--bs-primary);
} */
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
