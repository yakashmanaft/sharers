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
const router = useRouter();
//
const items = ref(null);
const item = ref(null);
const itemLocations = ref(null);
const switchedItem = ref(null);
const projects = ref(null);
const locations = ref(null);
const organizations = ref(null);
// const allTransactions = ref(null);
const currentItemTransactions = ref(null);
//
const sumQtyUniqLocations = ref(null);
//
const switchedLocation = ref({
  location: "",
  locationID: null,
});
// other locations info actions buttons
const infoActionBtns = ref([
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

// Получаем и сразу трансформируем массив транзакций из БД
const { data: allTransactions } = await useFetch("/api/warehouse/ledger", {
  transform: (allTransactions) => {
    return allTransactions.sort((a, b) =>
      b.created_at > a.created_at ? 1 : -1
    );
  },
});

// onBeforeMount(async () => {
//   if(!switchedItem.value.length) {
//     infoActionBtn.value = 'history'
//   }
// })

onMounted(async () => {
  //
  await loadData();
  projects.value = await getProjects();
  items.value = await getItems();
  locations.value = await getLocations();
  organizations.value = await getOrganizations();
  // allTransactions.value = await getWarehouseTransaction();

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

  // суммируем количество одной и той ж позиции (но которая может быть с разными собственниками или отвесттвенными)
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

  // showCase();
  if (!switchedItem.value.length) {
    infoActionBtn.value = "history";
  }
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
const translateItemType = (type) => {
  if (type === "tools") {
    return "Инструмент";
  } else if (type === "stuff") {
    return "Материалы";
  } else if (type === "consumables") {
    return "Расходники";
  } else if (type === "technic") {
    return "Техника";
  } else if (type === "office equipment") {
    return "Оргтехника";
  } else {
    return type;
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
// async function getWarehouseTransaction() {
//   return await $fetch("/api/warehouse/ledger");
// }

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
// const addArithmeticMark = (type, from, fromID, to, toID) => {
//   if (
//     item.value &&
//     switchedLocation.value.location &&
//     switchedLocation.value.locationID
//   ) {
//     if (switchedLocation.value.location === "all") {
//       return "";
//     }
//     // MOVE
//     else if (type === "move") {
//       if (
//         switchedLocation.value.location === from &&
//         switchedLocation.value.locationID === fromID
//       ) {
//         return "-";
//       }
//       //
//       else if (
//         switchedLocation.value.location === to &&
//         switchedLocation.value.locationID === toID
//       ) {
//         return "+";
//       }
//     }
//   }
// };

// Router create link to locations function
const routerLocationsFunc = (locationID, location) => {
  if (location === "project") {
    router.push(`/projects/${locationID}`);
  } else if (
    location === "sklad" ||
    location === "repair" ||
    location === "office"
  ) {
    router.push(`/locations/${locationID}`);
  } else {
    alert("Путь не найден (warehouse :id... routerLocationsFunc )");
  }
};
// Router create link to owner  function
const routerUsersFunc = (ownerID, ownerType) => {
  if (ownerType === "company") {
    router.push(`/organizations/${ownerID}`);
  } else if (ownerType === "user") {
    router.push(`/partners/${ownerID}`);
  } else {
    alert("Путь не найден (warehouse :id... routerUsersFunc )");
  }
};

const addSignToTransaction = (
  locationFromID,
  locationFrom,
  locationToID,
  locationTo
) => {
  if (item.value && switchedLocation.value.location !== "all") {
    if (
      locationFromID === switchedLocation.value.locationID &&
      locationFrom === switchedLocation.value.location
    ) {
      return "-";
    } else if (
      locationToID === switchedLocation.value.locationID &&
      locationTo === switchedLocation.value.location
    ) {
      return "+";
    }
  }
};

// WATHERS
watch(switchedLocation, () => {
  // ALL
  if (switchedLocation.value.location === "all") {
    switchedItem.value = itemLocations.value;
    //
    currentItemTransactions.value = allTransactions.value.filter((element) => {
      if (element.itemTitle === item.value.title) {
        return element;
      }
    });
  }
  //
  else {
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

const hide = () => {
  console.log(window.screen.width)
  if (switchedLocation.value.location === "all" && window.screen.width < 576 ) {
    return `display: none`;
  }
};

watch(infoActionBtn, (next, prev) => {
  if (prev === "available" && switchedLocation.value.location === "all") {
    switchedLocation.value = {
      location: item.value.location,
      locationID: item.value.locationID,
    };
  }
  if (next === "history") {
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
        return element;
      }
    });
  }
});
</script>

<template>
  <Container>
    <div v-if="item">
      <!-- ХЭДЕР страницы -->
      <div class="page_header">
        <!-- Заголовок -->
        <h1>{{ item.title }}</h1>

        <!-- ДОП инфа -->
        <div style="margin: 0; margin-top: 1rem">
          <!-- Кол-во -->
          <p>
            Кол-во:
            <span style="font-weight: bold"
              >{{ item.qty }} <span>{{ item.measure }}</span></span
            >
          </p>
          <!-- Собственник -->
          <p>
            Собственник:
            <span
              style="font-weight: bold"
              class="link_hover"
              @click="routerUsersFunc(item.ownerID, item.ownerType)"
              >{{ translateOwner(item.ownerID, item.ownerType) }}</span
            >
          </p>
          <!-- Отвественный -->
          <p>
            Ответственный:
            <span
              style="font-weight: bold"
              class="link_hover"
              @click="$router.push(`/partners/${item.responsible}`)"
              >{{ translateResponsibles(item.responsible) }}</span
            >
          </p>
          <!-- Местонахождени -->
          <p>
            Где:
            <span
              class="item-location"
              @click="routerLocationsFunc(item.locationID, item.location)"
              ><label for="">{{
                translateLocation(item.locationID, item.location)
              }}</label>
            </span>
          </p>
        </div>

        <!-- ОПИСАНИЕ -->
        <div>
          <h2 style="margin-top: 1rem">Описание</h2>

          <!-- ПО ТИПУ ПРЕДМЕТА -->
          <div>
            <!-- Инструмент -->
            <div
              v-if="item.type === 'tools' || item.type === 'office equipment'"
            >
              <!-- <p>Тип: {{ item.type }}</p> -->
              <ul>
                <li>Тип: {{ translateItemType(item.type) }}</li>
                <li>Серийник: {{ item.serial }}</li>
                <li>Дата производства: {{ item.productionDate }}</li>
                <li>Закупочная цена?</li>
              </ul>
            </div>
            <!-- Материалы -->
            <div v-if="item.type === 'stuff'">
              <p>Тип: {{ translateItemType(item.type) }}</p>
            </div>
            <!-- Расходники -->
            <div v-if="item.type === 'consumables'">
              <p>Тип: {{ translateItemType(item.type) }}</p>
              <!-- {{ item }} -->
            </div>
            <!-- Техника -->
            <div v-if="item.type === 'technic'">
              <p>Тип: {{ translateItemType(item.type) }}</p>
              <ul>
                <li>Какие данные по технике чекать имеет смысл?</li>
              </ul>
              <!-- {{ item }} -->
            </div>
          </div>

          <!-- Текст -->
          <p>Это item:{{ item }}</p>
        </div>
      </div>

      <!-- AVAILABLE AND HISTORY -->
      <div>
        <!-- infoActionBtns -->
        <h2 class="infoActionBtns_wrapper">
          <span
            class="infoActionBtns_el"
            v-for="(btn, index) in infoActionBtns.filter((btn) => {
              if (btn.name === infoActionBtn && !switchedItem.length) {
                return btn;
              } else if (switchedItem.length) {
                return btn;
              } else if (btn.name === infoActionBtn) {
                return btn;
              }
            })"
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
          </span>
        </h2>

        <!-- ЛОКАЦИИ -->
        <div v-if="itemLocations.length > 1">
          <!-- <h2>{{ item.title }} в других местах</h2> -->
          <!-- set item to view -->
          <fieldset id="item-locations" class="switch-item_wrapper">
            <!-- ALL only for available items in location / project -->
            <div class="switch-item_el" v-if="infoActionBtn === 'available'">
              <input
                type="radio"
                id="all-item-view"
                name="item-locations"
                :value="{ location: 'all', locationID: null }"
                v-model="switchedLocation"
              />
              <label class="item-label_element" for="all-item-view">
                Всего
                <span v-if="infoActionBtn === 'available'">{{
                  sumItemsQty()
                }}</span>
              </label>
              <!-- infoActionBtn -->
            </div>

            <!-- Если location только один (в массиве itemLocations нет повторений и других location) -->
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
              <label
                class="item-label_element"
                :for="`${location.location}${location.id}`"
                >{{
                  translateLocation(location.locationID, location.location)
                }}
                <span v-if="infoActionBtn === 'available'">{{
                  location.qty
                }}</span></label
              >
            </div>
          </fieldset>
        </div>

        <!-- AVAILABLE IN LOCATION -->
        <div class="item-locations_block" v-if="infoActionBtn === 'available'">
          <!-- <h3>Наличие</h3> -->
          <!-- Предметы по разным параметрам, но на одной локации -->
          <table class="table table-by-available" v-if="switchedItem.length">
            <thead class="item-table_header">
              <tr>
                <th scope="col"></th>
                <!-- <th scope="col">Наименование</th> -->
                <th v-if="switchedLocation.location === 'all'" scope="col">
                  Где
                </th>
                <th scope="col">Кол-во</th>
                <th scope="col" class="hide-991" :style="hide()">Собственник</th>
                <th scope="col" class="hide-max-767">Ответственный</th>
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
                <!-- 1 -->
                <!-- btn expend -->
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
                <!-- IF ALL LOCATIONS -->
                <td scope="col" v-if="switchedLocation.location === 'all'">
                  <span
                    class="link_hover"
                    @click="
                      routerLocationsFunc(element.locationID, element.location)
                    "
                    >{{
                      translateLocation(element.locationID, element.location)
                    }}</span
                  >
                </td>

                <!-- 3 -->
                <!-- QTY, MEASURE -->
                <td class="item-qty" scope="col">
                  <div class="location-mark">
                    <span>{{ element.qty }} {{ element.measure }}</span>
                  </div>
                </td>

                <!-- 4 -->
                <!-- OWNER -->
                <!-- v-if="switchedLocation.location !== 'all'" -->
                <td class="span-2 hide-767" scope="col" :style="hide()">
                  <span
                    style="white-space: nowrap"
                    class="link_hover"
                    @click="routerUsersFunc(element.ownerID, element.ownerType)"
                  >
                    {{ translateOwner(element.ownerID, element.ownerType) }}
                  </span>
                </td>

                <!-- 5 -->
                <!-- RESPONSIBLE -->
                <td class="span-2 hide-767 hide-max-767" scope="col">
                  <span
                    style="white-space: nowrap"
                    class="link_hover"
                    @click="$router.push(`/partners/${element.responsible}`)"
                  >
                    {{ translateResponsibles(element.responsible) }}
                  </span>
                </td>

                <!-- 6 -->
                <!-- Expended item block -->
                <td
                  class="span-5 expended-item"
                  :id="`expended-item-${element.id}_block`"
                >
                  <div class="expended-item_content">
                    <!-- show owner -->
                    <div
                      class="hide-max-575 expended-content_article"
                      v-if="switchedLocation.location === 'all'"
                    >
                      <p>
                        Собственник:
                        <span
                          @click="
                            routerUsersFunc(element.ownerID, element.ownerType)
                          "
                          class="link_hover"
                          >{{
                            translateOwner(element.ownerID, element.ownerType)
                          }}</span
                        >
                      </p>
                    </div>
                    <!-- show responsible -->
                    <div class="hide-min-768 expended-content_article">
                      <p>
                        Ответственный:
                        <span
                          class="link_hover"
                          @click="
                            $router.push(`/partners/${element.responsible}`)
                          "
                          >{{
                            translateResponsibles(element.responsible)
                          }}</span
                        >
                      </p>
                    </div>
                    <!--  -->
                    <div class="expended-content_article">
                      <p>В разработке...</p>
                      <p>{{ currentExpendedItemBlock }}</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- hISTOrY TRANSACTIONS -->
        <div class="item-history_block" v-if="infoActionBtn === 'history'">
          <!-- <h3>История</h3> -->
          <table class="table table-by-history">
            <thead class="item-table_header">
              <tr>
                <th scope="col">Дата</th>
                <th scope="col">Транзакция</th>
                <th scope="col">Автор</th>
              </tr>
            </thead>

            <tbody>
              <div v-if="currentItemTransactions">
                <div v-if="!currentItemTransactions.length">Нет истории</div>
              </div>

              <!-- transactions -->
              <tr
                v-for="(transaction, i) in currentItemTransactions"
                :key="i"
                class="table-row_wrapper"
              >
                <!-- 1 -->
                <td scope="col">
                  <span>{{ transaction.created_at }}</span>
                </td>

                <!-- 2 -->
                <!-- Варианты описания транзакции -->
                <td scope="col">
                  <!-- CREATED -->
                  <p
                    class="transaction_paragraph"
                    v-if="transaction.transactionType === 'created'"
                  >
                    +{{ transaction.qty }}{{ transaction.measure }}
                    <span
                      style="
                        background-color: var(--bs-success-bg-subtle);
                        padding: 4px 10px;
                        border-radius: 16px;
                        white-space: nowrap;
                      "
                      >Добавлен</span
                    >
                  </p>
                  <!-- ADD -->
                  <p
                    class="transaction_paragraph"
                    v-if="transaction.transactionType === 'add'"
                  >
                    +{{ transaction.qty }}{{ transaction.measure }}
                    <span
                      style="
                        background-color: var(--bs-success-bg-subtle);
                        padding: 4px 10px;
                        border-radius: 16px;
                        white-space: nowrap;
                      "
                      >Приход</span
                    >
                  </p>
                  <!-- SUB -->
                  <p
                    class="transaction_paragraph"
                    v-if="transaction.transactionType === 'sub'"
                  >
                    {{
                      addSignToTransaction(
                        transaction.locationFromID,
                        transaction.locationFrom,
                        transaction.locationToID,
                        transaction.locationTo
                      )
                    }}{{ transaction.qty }}{{ transaction.measure }}
                    <span
                      style="
                        background-color: var(--bs-danger-bg-subtle);
                        padding: 4px 10px;
                        border-radius: 16px;
                        white-space: nowrap;
                      "
                      >Расход</span
                    >
                  </p>
                  <!-- MOVE -->
                  <div
                    class="transaction_paragraph"
                    v-if="transaction.transactionType === 'move'"
                  >
                    <div>
                      {{
                        addSignToTransaction(
                          transaction.locationFromID,
                          transaction.locationFrom,
                          transaction.locationToID,
                          transaction.locationTo
                        )
                      }}{{ transaction.qty }}{{ transaction.measure }}
                    </div>

                    <!--  -->
                    <div class="transaction_path">
                      <!-- transaction location from -->
                      <div
                        style="
                          background-color: var(--bs-primary-bg-subtle);
                          padding: 4px 10px;
                          border-radius: 16px;
                          white-space: nowrap;
                        "
                        class="link_hover"
                        @click="
                          routerLocationsFunc(
                            transaction.locationFromID,
                            transaction.locationFrom
                          )
                        "
                      >
                        {{
                          translateLocation(
                            transaction.locationFromID,
                            transaction.locationFrom
                          )
                        }}
                      </div>

                      <!-- transaction loction to -->
                      <div>
                        <!--  -->
                        <span style="white-space: nowrap; padding-bottom: 2px"
                          >-></span
                        >
                        <!--  -->
                        <span
                          style="
                            background-color: var(--bs-primary-bg-subtle);
                            padding: 4px 10px;
                            border-radius: 16px;
                            white-space: nowrap;
                            margin-left: 0.5rem;
                          "
                          class="link_hover"
                          @click="
                            routerLocationsFunc(
                              transaction.locationToID,
                              transaction.locationTo
                            )
                          "
                          >{{
                            translateLocation(
                              transaction.locationToID,
                              transaction.locationTo
                            )
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                </td>

                <!-- 3 -->
                <!-- Автор транзакции -->
                <td scope="col">
                  <span class="hide-575" style="margin-right: 0.5rem"
                    >Автор:</span
                  >
                  <span
                    @click="$router.push(`/partners/${transaction.authorID}`)"
                    class="link_hover"
                    >{{ translateResponsibles(transaction.authorID) }}</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Container>
</template>

<style scoped>
.switch-item_wrapper {
  padding: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: auto;
  gap: 1rem;
  scrollbar-width: none;
  background-color: var(--bs-secondary-bg);
  /* background-color: var(--bs-tertiary-bg); */
}
.switch-item_wrapper::-webkit-scrollbar {
  display: none;
}
.infoActionBtns_wrapper {
  margin: 0;
  display: flex;
  /* gap: 0.5rem; */
  /* background-color: cyan; */
}
.infoActionBtns_el,
.switch-item_el {
  /* text-wrap: nowrap; */
  white-space: nowrap;
  position: relative;
}

.infoActionBtns_el label {
  padding: 0.5rem 1rem;
  transition: all 0.15s ease-in;
}
.infoActionBtns_el label:hover {
  cursor: pointer;
  /* background-color: var(--bs-tertiary-bg); */
  background-color: var(--bs-secondary-bg);
}

.infoActionBtns_el input[type="radio"],
.switch-item_el input[type="radio"] {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  opacity: 0;
}
.item-location {
  color: var(--bs-body-bg);
  background-color: var(--bs-body-color);
  padding: 4px 10px;
  border-radius: 16px;
}
.switch-item_el label {
  border-radius: 16px;
  transition: all 0.15s ease-in;
  padding: 4px 10px;
  border: 1px solid var(--bs-secondary-bg);
}
.switch-item_el label:hover {
  cursor: pointer;
  color: var(--bs-body-bg);
  background-color: var(--bs-body-color);
  /* background-color: var(--bs-secondary-bg); */
  /* background-color: var(--bs-tertiary-bg); */
}
.switch-item_el input[type="radio"]:checked + label {
  border-radius: 16px;
  padding: 4px 10px;
  color: var(--bs-body-bg);
  background-color: var(--bs-body-color);
}
.infoActionBtns_el input[type="radio"]:checked + label {
  background-color: var(--bs-secondary-bg);
  /* background-color: var(--bs-tertiary-bg); */
}

.table-by-available .item-table_header tr,
.table-by-available .table-row_wrapper {
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
  align-items: center;
  grid-template-columns: 50px 1fr 100px 1fr 1fr;
}

.table-by-available .item-table_header,
.table-by-history .item-table_header {
  border-bottom: 1px solid var(--bs-secondary-bg);
  background-color: var(--bs-secondary-bg);
}
.table-by-history .table-row_wrapper:nth-child(odd),
.table-by-available .table-row_wrapper:nth-child(odd) {
  background-color: var(--bs-secondary-bg);
}
.table-by-available .item-table_header tr th:nth-last-child(2),
.table-by-available .item-table_header tr th:nth-last-child(1),
.table-by-available .table-row_wrapper td:nth-last-child(3),
.table-by-available .table-row_wrapper td:nth-last-child(2),
.table-by-history .item-table_header tr th:nth-last-child(1),
.table-by-history .table-row_wrapper td:nth-last-child(1) {
  justify-self: flex-end;
}

.table-by-history .item-table_header tr,
.table-by-history .table-row_wrapper {
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
  align-items: center;
  grid-template-columns: 200px 1fr 1fr;
}

.table-row_wrapper td.span-5 {
  grid-column: span 5;
}

.item-location label,
.expand-item_icon {
  cursor: pointer;
}
label #expend-item {
  display: none;
}
label #expend-item:checked + .expand-item_icon {
  transform: rotate(180deg);
}
.expended-item {
  display: none;
}
.expended-item_opened {
  display: inline-block;
  border: none;
  margin-left: 4rem;
}
/* .expended-item_btns button span:hover {
  color: var(--bs-primary);
} */
.expended-item_container {
  justify-content: space-between;
}
.expended-item_content {
  margin-top: 1rem;
}
.link_hover:hover {
  color: var(--bs-primary);
  cursor: pointer;
}

/* LABEL */
.item-locations_block,
.item-history_block {
  /* padding: 1rem 0; */
  background-color: var(--bs-tertiary-bg);
}
.table > :not(caption) > * > * {
  padding: 0;
  color: unset;
  background-color: unset;
  box-shadow: unset;
  border: none;
}
.table .table-by-available {
  background-color: blue;
}
.transaction_paragraph {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.transaction_path {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.hide-575 {
  display: none;
}
.hide-min-768 {
  display: none;
}
.hide-max-575 {
  display: none;
}

@media screen and (max-width: 575px) {
  .hide-575 {
    display: inline-block;
  }
  .hide-max-575 {
    display: block;
  }
  .hide-min-575 {
    display: none;
  }
  .page_header {
    margin: 0 1rem;
  }
  /* .table-by-available .item-table_header tr, */
  .table-by-history .item-table_header tr {
    display: none;
  }
  .table-by-history .table-row_wrapper {
    /* margin-top: 1rem; */
    grid-template-columns: 1fr;
  }
  /* .table-by-available .item-table_header tr, */
  .table-by-available .item-table_header tr,
  .table-by-available .table-row_wrapper {
    grid-template-columns: 30px 1fr 1fr;
    grid-gap: unset;
    /* gap: 1rem !important; */
  }
  .item-qty {
    /* justify-self: flex-end; */
    background-color: red;
  }
  .table-by-history .item-table_header tr th:nth-last-child(1),
  .table-by-history .table-row_wrapper td:nth-last-child(1) {
    justify-self: flex-start;
  }
  .table-by-available .item-table_header tr th:nth-last-child(1),
  .table-by-available .table-row_wrapper td:nth-last-child(1) {
    justify-self: flex-start;
  }
  .expended-item_opened {
    margin-left: 2rem !important;
  }
}

@media screen and (min-width: 576px) and (max-width: 767px) {
  .table-by-history .item-table_header tr,
  .table-by-history .table-row_wrapper {
    grid-template-columns: 150px 1fr 150px;
  }
  .table-by-available .item-table_header tr,
  .table-by-available .table-row_wrapper {
    grid-template-columns: 30px 1fr 70px 1fr;
    gap: 1rem !important;
  }
  .table-by-available .table-row_wrapper {
    grid-gap: unset;
  }
  .transaction_path {
  }
  .expended-item_opened {
    margin-left: 3rem !important;
  }
}

@media screen and (max-width: 767px) {
  h1 {
    margin-top: 4rem;
  }
  .hide-min-768 {
    display: block;
  }
  .hide-max-767 {
    display: none;
  }
  .transaction_paragraph {
    flex-direction: column;
    align-items: flex-start;
  }
  /* .table-by-available .table-row_wrapper */
}

@media screen and (min-width: 768px) {
  h1 {
    margin-top: 6rem;
  }
  /* .table-by-available .item-table_header tr,
  .table-by-available .table-row_wrapper {
    grid-template-columns: 50px 1fr 1fr 1fr 1fr;
  } */
  .item-history_block,
  .item-locations_block {
    /* margin-top: 1rem; */
    width: 100%;
    /* background-color: red; */
    /* position: relative; */
  }
  .hide-min-768 {
    display: none;
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
/* .hide-991 {
} */

@media screen and (max-width: 991px) {
  .transaction_path {
    flex-direction: column;
    align-items: flex-start;
    /* gap: 0.1rem; */
  }
}
</style>
