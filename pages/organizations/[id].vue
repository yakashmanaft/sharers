<template>
  <Container style="padding-top: 5rem">
    <h1 class="show-max-767">Банда #{{ $route.params.id }}</h1>

    <div v-if="organization" class="padding-left-right-1rem">
      <p>{{ organization.title }}</p>
      <p>Дата создания: {{ organization.created_at }}</p>
      <!-- <div>
        <p>{{ organization }}</p>
      </div> -->
    </div>

    <!-- USERS IN BAND -->
    <div class="padding-left-right-1rem">
      <h2>Соучастники</h2>

      <!--  -->
      <button
        type="button"
        class="btn btn-primary btn-create-modal-open-767"
        @click.prevent="checkAndAddUser()"
      >
        <span>Добавить соучастника</span>
      </button>

      <!--  -->
      <div v-if="usersInBand.length">
        <!-- Список участников -->
        <div class="sharers-list_container">
          <!-- ICON -->
          <div class="sharers-list_icon_wrapper" @click="toggleSharersList">
            <label>
              <input
                type="checkbox"
                id="sharers-list"
                v-model="sharersListIsOpened"
              />
              <Icon
                class="sharers-list_icon"
                name="material-symbols-light:expand-more"
                size="28px"
                @click="toggleSharersList"
              />
            </label>
            <p class="sharers-list_count">
              {{ usersInBand.length }} {{ transformEndingTheWord("человек") }}
            </p>
          </div>
          <!-- LIST -->
          <div class="sharers-list_wrapper" v-if="sharersListIsOpened">
            <div v-for="(user, index) in usersInBand" class="sharers-list_item">
              <!-- NAME -->
              <div
                style="display: flex; align-items: space-between"
                @click="$router.push(`/partners/${user.id}`)"
                class="link"
              >
                <p style="margin: 0">
                  <span style="font-weight: bold; display: block">{{
                    user.surname
                  }}</span>
                  <span>{{ user.name }} {{ user.middleName }}</span>
                </p>
              </div>

              <!-- PHONE -->
              <div class="item_phone">
                <!-- style="pointer-events: none;" -->
                <nuxt-link :to="`tel:${user.phone}`">{{
                  user.phone
                }}</nuxt-link>
              </div>

              <!-- GROUP STATUS -->
              <div>
                <p style="margin: 0; margin-top: 1rem">
                  {{ user.groupStatus }}
                </p>
              </div>
              <!-- <p>{{ user }}</p> -->
            </div>
          </div>
        </div>
      </div>

      <div v-else style="margin-top: 1rem">Нет соучастников</div>
    </div>

    <!-- ФОТ -->
    <!-- Изменения может вносить только пахан -->
    <!-- v-if="user.role === 'MASTER' -->
    <div v-if="usersInBand.length" style="margin-top: 0.5rem">
      <!-- Заголовок -->
      <h2>ФОТ</h2>
      <!-- data-bs-toggle="modal"
      data-bs-target="#newWarehouseItemModal" -->
      <button
        type="button"
        class="btn btn-primary btn-create-modal-open-767"
        @click="checkAndAddFund()"
      >
        <span> Создать новый</span>
      </button>

      <!-- ПЕРИОДы и просомтр ФОТ -->
      <div style="margin-top: 1rem">
        <div v-if="computedSalaryFund.length !== 0">
          <!-- Фильтры просмотра ФОТ -->
          <div
            class="filter-fund_wrapper"
            style="display: flex; align-items: center; gap: 1rem"
          >
            <!-- Выбор года -->
            <select
              name=""
              id=""
              v-model="currentYear"
              class="filter-fund_select"
            >
              <option v-for="year in computedYearsList" :value="year">
                {{ year }}
              </option>
              <!-- <option :value="2024">2024</option> -->
            </select>

            <!-- выбор по месяцам-->
            <div class="filter-fund_period">
              <div
                class="filter-fund_period-el"
                v-for="(period, i) in computedPeriodList"
                :key="i"
              >
                <input
                  type="radio"
                  :id="`${i}`"
                  name="fund-period"
                  :value="{
                    periodStart: period.periodStart,
                    periodEnd: period.periodEnd,
                  }"
                  v-model="choosenFundPeriod"
                />
                <label :for="`${i}`">{{
                  translateFundPeriod(period.periodStart, period.periodEnd)
                }}</label>
              </div>
            </div>

            <!-- <div>Today: {{ new Date() }}</div> -->
            <!-- <div>{{computedPeriodList}}</div> -->
          </div>

          <!-- Таблицы ФОТ -->
          <div class="table-fund_wrapper">
            <div
              v-for="fund in salaryFundArray.filter(
                (item) =>
                  item.bandID === +route.params.id &&
                  item.periodStart === choosenFundPeriod.periodStart &&
                  item.periodEnd === choosenFundPeriod.periodEnd
              )"
              :key="fund.id"
              style="display: flex; align-items: center; gap: 1rem"
            >
              <!-- <p>{{ fund.id }}</p> -->
              <!-- <p>{{ fund.periodStart }}</p>
              <p>{{ fund.periodEnd }}</p>
              <p>wageRate: {{ fund.wageRate }}</p>
              <p>band: {{ fund.bandID }}</p> -->

              <div v-if="fund.list.length">
                <!-- Статус -->
                <div v-if="fund.status" class="table-fund_status">
                  <p style="margin: 0">Статус:</p>
                  <!-- <div v-if="fund.status.status === 'paid out'">Выплачено</div>
                  <div v-else>Ожидает оплаты</div> -->
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span
                      :class="
                        fund.status.status === 'paid out'
                          ? 'status_paid-out'
                          : 'status_awaiting-payment'
                      "
                      >{{ transformShowFundStatus(fund.status) }}</span
                    >
                    <span v-if="fund.status.status === 'paid out'" style="color: var(--bs-tertiary-color)">{{
                      transformFundStatusDate(fund.status.date)
                    }}</span>
                  </div>
                </div>
                <!-- Ставка -->
                <div style="margin-top: 1rem;">Ставка: {{ fund.wageRate }} в час.</div>

                <!-- Строка участника банды -->
                <table class="table">
                  <thead class="item-table_header">
                    <tr>
                      <th scope="col">п/п</th>
                      <th scope="col">Соучастник</th>
                      <th scope="col">Час</th>
                      <th scope="col">КТУ</th>
                      <th scope="col">Час * КТУ</th>
                      <th scope="col">ЗП (Выработка)</th>
                      <th scope="col">ЗП (К получению)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(el, i) in fund.list" class="table-row_wrapper">
                      <!-- № п/п -->
                      <td>{{ i + 1 }}.</td>
                      <!-- Соучастник -->
                      <td>
                        <span
                          class="link"
                          @click="$router.push(`/partners/${el.userID}`)"
                          >{{ translateFundListUser(el.userID) }}</span
                        >
                      </td>
                      <!-- Отработано часов -->
                      <td>{{ el.hours }}</td>
                      <!-- КТУ -->
                      <td>{{ el.stakeIndex }}</td>
                      <!-- Час * КТУ -->
                      <td>
                        <span v-if="el.stakeIndex !== ''">{{
                          (el.hours * el.stakeIndex).toFixed(2)
                        }}</span>
                        <span v-else>-</span>
                      </td>
                      <!-- ЗП (выработка) -->
                      <td>
                        <span v-if="el.stakeIndex !== ''">
                          {{
                            (el.hours * el.stakeIndex * fund.wageRate).toFixed(
                              2
                            )
                          }}
                        </span>
                        <span v-else>-</span>
                      </td>
                      <!-- ЗП (к получению) -->
                      <td>
                        Сюда вписывать надо... Если в БД еще не вписали, так и
                        показываем что надо вписать
                      </td>
                    </tr>

                    <!-- Итого -->
                    <tr></tr>
                  </tbody>
                </table>
              </div>
              <!-- <p>{{ fund.list }}</p> -->
            </div>
          </div>
        </div>
        <div v-else>Ни одной таблицы ФОТ...</div>
      </div>
    </div>

    <!-- ТМЦ организации -->
    <div v-if="items" style="margin-top: 1rem">
      <!-- Заголовок -->
      <h2>ТМЦ</h2>
      <!--  -->
      <!-- <div v-if="pending">Loading...</div> -->
      <div>
        <div v-if="items.length">
          <div
            v-for="(item, index) in items"
            :key="index"
            style="display: flex"
          >
            <div>{{ item.title }}</div>
            <div>-{{ item.qty }} {{ item.measure }}</div>
            <div>-{{ item.location }}_{{ item.ownerID }}</div>
          </div>
        </div>
        <div v-else>Ничего нет</div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { Container } from "@/shared/container";
import { onBeforeMount } from "vue";

useHead({
  title: "Банда # ",
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

const router = useRoute();

const { user } = useUserSession();

const route = useRoute();

const organizations = ref(null);
const organization = ref(null);

const users = ref(null);
const usersInBand = ref([]);

// SHARERS LIST
const sharersListIsOpened = ref(false);

// ФОТ
const currentYear = ref();
const yearsList = ref([]);
const periodList = ref([]);
const fundPeriodArray = ref([]);
const choosenFundPeriod = ref({
  periodStart: "",
  periodEnd: "",
});

// Модалка созданя нового ФОТ
const choosenStartDate = ref();
const choosenEndDate = ref();
// Массив salary funds
const salaryFundArray = ref([]);
// pseudo object of Fund Salary
// LONGBLOB or BLOB

// warehouse items
const items = ref([]);

// COMPUTED
const computedSalaryFund = computed(() => {
  // current ФОТ
  if (salaryFundArray.value) {
    salaryFundArray.value.forEach((element) => {
      try {
        const result = JSON.parse(element).list;
        console.log(result);
      } catch (err) {
        // 👇️ This runs
        console.log("Error: ", err.message);
      }
    });
    return salaryFundArray.value;
  }
});

const computedYearsList = computed(() => {
  if (computedSalaryFund.value) {
    let yearsSet = new Set(
      computedSalaryFund.value.map((num) => num.periodEnd.slice(0, 4))
    );
    yearsList.value = [...yearsSet];

    // Задаем текущий год к показу
    currentYear.value = yearsList.value[yearsList.value.length - 1];

    return yearsList.value;
  }
});

const computedPeriodList = computed(() => {
  if (computedSalaryFund.value) {
    let monthPeriod = new Set(
      computedSalaryFund.value.map((el) => {
        let obj = {
          periodStart: el.periodStart,
          periodEnd: el.periodEnd,
        };
        return obj;
      })
    );
    periodList.value = [...monthPeriod];

    return periodList.value.filter(
      (period) => period.periodEnd.slice(0, 4) === currentYear.value
    );
  }
});

// SHARERS LIST
const toggleSharersList = () => {
  sharersListIsOpened.value = !sharersListIsOpened.value;
};
// const {
//   pending,
//   error,
//   refresh,
//   data: items,
//   status,
// } = await useFetch("/api/warehouse/item", {
//   lazy: false,
//   transform: (items: any) => {
//     return items.sort((x, y) => {
//       if (x.title < y.title) {
//         return -1;
//       }

//       if (x.title > y.title) {
//         return 1;
//       }

//       return x.locationID - y.locationID;
//     });
//   },
// });

onBeforeMount(async () => {
  // warehouse items
  items.value = await getWarehouseItems();
  if (items.value) {
    items.value = items.value.filter(
      (item) => item.ownerID === +route.params.id
    );
    items.value = items.value.sort((x, y) => {
      if (x.title < y.title) {
        return -1;
      }

      if (x.title > y.title) {
        return 1;
      }

      return x.locationID - y.locationID;
    });
  }

  // salary funds
  salaryFundArray.value = await getSalaryFunds();
  if (salaryFundArray.value) {
    salaryFundArray.value = salaryFundArray.value.filter(
      (item) => item.bandID === +route.params.id
    );
  }
  // организации
  organizations.value = await getOrganizations();
  if (organizations.value) {
    organization.value = organizations.value.find(
      (company) => company.id == +route.params.id
    );
  }

  // тмц организации
  items.value = items.value.filter(
    (item) =>
      item.ownerType === "company" && item.ownerID === organization.value.id
  );

  // пользователи в организации, по ним ФОТ и рассчитывается...
  users.value = await getAllUsers();
  if (users.value.length) {
    // usersInBand.value = users.value.filter(
    //   (user) => user.groupID === +route.params.id
    // );

    usersInBand.value = [...users.value]
      .filter((user) => user.groupID === +route.params.id)
      .map((user) => {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          middleName: user.middleName,
          surname: user.surname,
          phone: user.phone,
          // role: user.role,
          groupID: user.groupID,
          groupStatus: user.groupStatus,
          created_at: user.created_at,
          update_at: user.update_at,
        };
        // if (user.groupID === +route.params.id) {
        // } else {
        //   console.log('map гавно...')
        // }
      });
    // "id": 1,
    // "uuid": "f230e473-1ee6-43a4-9d2b-bcf87d32b6de",
    // "email": "klimenko@yandex.ru",
    // "password": "123",
    // "name": "Вячеслав",
    // "middleName": "Николаевич",
    // "surname": "Клименко",
    // "role": "MASTER",
    // "groupID": 2,
    // "groupStatus": "leader",
    // "created_at": "2024-03-21T05:06:39.000Z",
    // "update_at": "2024-03-21T05:06:38.974Z"
  }

  //
  async function getSalaryFunds() {
    return await $fetch("/api/funds/salary");
  }

  //
  async function getWarehouseItems() {
    return await $fetch("/api/warehouse/item");
  }

  //
  async function getOrganizations() {
    return await $fetch("/api/organizations/organizations");
  }

  async function getAllUsers() {
    return await $fetch("/api/usersList/users");
  }
});

onMounted(async () => {
  // При монтирвоаниии всегда показываем самую свежу таблицу ФОТ
  if (computedSalaryFund.value.length) {
    // Сортируем да дате окончания отчетного периода. Может имеет смысл добавить строку created_at и по ней сортировать???
    computedSalaryFund.value.sort(
      (a, b) => new Date(a.periodStart) - new Date(b.periodEnd)
    );

    let lastFundInArray =
      computedSalaryFund.value[computedSalaryFund.value.length - 1];
    //
    choosenFundPeriod.value = {
      periodStart: lastFundInArray.periodStart,
      periodEnd: lastFundInArray.periodEnd,
    };
  }
});

// TRANSLATERS
const translateFundPeriod = (periodStart, periodEnd) => {
  if (periodStart && periodEnd) {
    const oneDay = 1000 * 60 * 60 * 24;

    const date1 = new Date(periodStart);
    const date2 = new Date(periodEnd);

    let options = {
      month: "long",
    };

    const monthText = date1.toLocaleDateString("ru-Ru", options);
    let monthTextUpper = `${monthText[0].toUpperCase()}${monthText.slice(1)}`;

    let diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);

    if (diffInDays <= 15 && date1.getDate() >= 1 && date1.getDate() <= 15) {
      return `${monthTextUpper} 1ая`;
    } else if (diffInDays <= 15 && date1.getDate() > 15) {
      return `${monthTextUpper} 2ая`;
    } else {
      return `${monthTextUpper}`;
    }
  }
};
const translateFundListUser = (userID) => {
  if (usersInBand.value.length && userID) {
    let usersArr = [...usersInBand.value].filter((user) => user.id === +userID);

    return `${usersArr[0].surname} ${usersArr[0].name[0]}. ${usersArr[0].middleName[0]}.`;
  }
};

// TRANSFORMERS
const transformEndingTheWord = (string) => {
  // человек
  if (string === "человек") {
    if (usersInBand.value.length) {
      if (
        usersInBand.value.length % 10 === 4 ||
        usersInBand.value.length % 10 === 2
      ) {
        return "человека";
      } else {
        return string;
      }
    }
  } else if ((string = "банды")) {
  }
};
const transformShowFundStatus = (statusObj) => {
  if (statusObj.status === "paid out") {
    return "Выплачено";
  } else if (statusObj.status === "awaiting payment") {
    return "Ожидает оплаты";
  }
};
const transformFundStatusDate = (statusDate) => {
  if(statusDate === '') {
    return
  } else {
    return statusDate
  }
}

// CHECK AND CREATE
const checkAndAddUser = () => {
  alert("В разработке...");
};
const checkAndAddFund = () => {
  alert("В разработке...");
};

// Wathers
watch(choosenFundPeriod, () => {
  // console.log(choosenFundPeriod.value);
  // console.log(computedSalaryFund.value);
});
watch(currentYear, () => {
  // console.log(choosenFundPeriod.value);
  // console.log(computedSalaryFund.value);
  // При изменении года всегда показываем самую последнюю таблицу ФОТ выбранного года
  if (computedSalaryFund.value) {
    let fundByYearSet = new Set(
      computedSalaryFund.value.filter(
        (el) => el.periodEnd.slice(0, 4) === currentYear.value
      )
    );
    //
    let fundByYearArray = [...fundByYearSet];
    let lastFundInArray = fundByYearArray[fundByYearArray.length - 1];
    //
    choosenFundPeriod.value = {
      periodStart: lastFundInArray.periodStart,
      periodEnd: lastFundInArray.periodEnd,
    };
    //
  }
});
watch(periodList, () => {
  // console.log(choosenFundPeriod.value);
});
</script>

<style scoped>
/* list of sharers */
label #sharers-list {
  display: none;
}
/* label #sharers-list + .sharers-list_icon {
  transform: rotate(270deg)
} */
label #sharers-list:checked + .sharers-list_icon {
  transform: rotate(180deg);
}
.sharers-list_icon_wrapper {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}
.sharers-list_icon_wrapper p {
  margin: 0;
}
.sharers-list_icon,
.sharers-list_count {
  cursor: pointer;
}

.sharers-list_wrapper {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.sharers-list_item {
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
}

.sharers-list_item:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}

.item_phone a {
  text-decoration: none;
}
.item_phone a:active,
.item_phone a:focus {
  border: none;
}

/* .item_phone_pointer-events_none {
  pointer-events: none;
} */

.link:hover {
  cursor: pointer;
  color: var(--bs-primary);
}

.filter-fund_wrapper {
  overflow-x: scroll;
  scrollbar-width: none;
}
.filter-fund_wrapper::-webkit-scrollbar {
  display: none;
}
.filter-fund_select {
  padding: 4px 10px;
  border-radius: 16px;
  background-color: var(--bs-primary-bg-subtle);
  border: unset;
  outline: unset;
  cursor: pointer;
  appearance: none;
}
.filter-fund_period {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.filter-fund_period-el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}
.filter-fund_period-el label {
  cursor: pointer;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  background-color: var(--bs-border-color);
}
.filter-fund_period-el input[type="radio"]:checked + label {
  background-color: var(--bs-body-color);
  color: var(--bs-body-bg);
}
.table-fund_wrapper {
  margin-top: 1.5rem;
}
.table-fund_status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.status_awaiting-payment,
.status_paid-out {
  padding: 4px 10px;
  border-radius: 16px;
}
.status_awaiting-payment {
  color: var(--bs-warning);
  background-color: var(--bs-warning-bg-subtle);
}
.status_paid-out {
  color: var(--bs-success);
  background-color: var(--bs-success-bg-subtle);
}
.list-el_wrapper {
  /* display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem; */
}
.list-el_wrapper > p {
  margin: 0;
}

/* Таблица ФОТ */
.table {
  margin-top: 1rem;
  width: 100%;
}
.item-table_header tr,
.table-row_wrapper {
  padding: 0;
  width: 100%;
  display: inline-grid;
  grid-template-columns: 50px 1fr 1fr 1fr 1fr 1fr 1fr;
}
.item-table_header tr th,
.table-row_wrapper td {
  padding: 0;
  display: flex;
  align-items: center;
}
.table-row_wrapper:hover td {
  background-color: var(--bs-border-color) !important;
  cursor: pointer;
}

@media screen and (max-width: 575px) {
  .padding-left-right-1rem {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .sharers-list_wrapper {
    grid-template-columns: 1fr;
    /* margin: 0 1rem; */
  }
}

@media screen and (min-width: 576px) {
  .sharers-list_wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 767px) {
  .show-max-767 {
    display: none;
  }
}

@media screen and (min-width: 768px) {
  .sharers-list_wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (min-width: 992px) {
  .sharers-list_wrapper {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
