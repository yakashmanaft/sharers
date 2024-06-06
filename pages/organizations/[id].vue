<template>
  <Container>
    <h1 style="margin-top: 5rem">Банда #{{ $route.params.id }}</h1>

    <div v-if="organization">
      <p>{{ organization.title }}</p>
      <p>Дата создания: {{ organization.created_at }}</p>
      <!-- <div>
        <p>{{ organization }}</p>
      </div> -->
    </div>

    <!-- USERS IN BAND -->
    <div v-if="usersInBand">
      <h2>Соучастники</h2>
      <p>Количество соучастников: {{ usersInBand.length }}</p>
      <div>
        <div v-for="(user, index) in usersInBand">
          <p>{{ user }}</p>
        </div>
      </div>
    </div>

    <!-- ФОТ -->
    <!-- Изменения может вносить только пахан -->
    <!-- v-if="user.role === 'MASTER' -->
    <div>
      <!-- Заголовок -->
      <h2>ФОТ</h2>
      <!-- data-bs-toggle="modal"
      data-bs-target="#newWarehouseItemModal" -->
      <button type="button" class="btn btn-primary btn-create-modal-open-767">
        <span> Создать новый</span>
      </button>

      <!-- ПЕРИОДы и просомтр ФОТ -->
      <div v-if="computedSalaryFund.length !== 0">
        <!-- Фильтры просмотра ФОТ -->
        <div style="display: flex; align-items: center; gap: 1rem">
          <!-- Выбор года -->
          <select name="" id="" v-model="currentYear" style="cursor: pointer">
            <option v-for="year in computedYearsList" :value="year">
              {{ year }}
            </option>
            <!-- <option :value="2024">2024</option> -->
          </select>

          <!-- выбор по месяцам-->
          <div style="display: flex; align-items: center; gap: 1rem">
            <div v-for="(period, i) in computedPeriodList" :key="i">
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
              <label :for="`${i}`" style="cursor: pointer">{{
                translateFundPeriod(period.periodStart, period.periodEnd)
              }}</label>
            </div>
          </div>
        </div>

        <!-- Таблицы ФОТ -->
        <div
          v-for="fund in salaryFundArray.filter(item =>  item.bandID === +route.params.id && item.periodStart === choosenFundPeriod.periodStart && item.periodEnd === choosenFundPeriod.periodEnd)"
          :key="fund.id"
          style="display: flex; align-items: center; gap: 1rem"
        >
          <!-- <p>{{ fund.id }}</p> -->
          <p>{{ fund.periodStart }}</p>
          <p>{{ fund.periodEnd }}</p>
          <p>wageRate: {{ fund.wageRate }}</p>
          <p>band: {{ fund.bandID }}</p>
        </div>
      </div>
      <div v-else>Ни одной таблицы ФОТ...</div>
    </div>

    <!-- ТМЦ организации -->
    <div v-if="items">
      <!-- Заголовок -->
      <h2>ТМЦ</h2>
      <!--  -->
      <div v-if="pending">Loading...</div>
      <div v-else>
        <div v-if="items.length">
          <div v-for="(item, index) in items" :key="index">
            {{ item }}
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

const route = useRoute();

const organizations = ref(null);
const organization = ref(null);

const users = ref(null);
const usersInBand = ref(null);

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

// pseudo object of Fund Salary
// LONGBLOB or BLOB
// хотя JSON формат тоже вроде поддерживает
const salaryFundArray = ref([
  {
    id: 1,
    bandID: 2,
    periodStart: "2023-03-01",
    periodEnd: "2023-03-30",
    wageRate: 1264.0,
  },
  {
    id: 2,
    bandID: 2,
    periodStart: "2023-02-01",
    periodEnd: "2023-02-29",
    wageRate: 1264.0,
  },
  {
    id: 3,
    bandID: 1,
    periodStart: "2023-04-01",
    periodEnd: "2023-04-30",
    wageRate: 1264.0,
  },
  {
    id: 4,
    bandID: 2,
    periodStart: "2024-04-01",
    periodEnd: "2024-04-30",
    wageRate: 1264.0,
  },
  {
    id: 5,
    bandID: 2,
    periodStart: "2024-05-01",
    periodEnd: "2024-05-15",
    wageRate: 1264.0,
  },
  {
    id: 6,
    bandID: 2,
    periodStart: "2024-05-16",
    periodEnd: "2024-05-30",
    wageRate: 1264.0,
  },
  {
    id: 7,
    bandID: 1,
    periodStart: "2024-06-01",
    periodEnd: "2024-06-30",
    wageRate: 1264.0,
  },
]);

// COMPUTED
const computedSalaryFund = computed(() => {
  // current ФОТ
  return salaryFundArray.value.filter(
    (item) => item.bandID === +route.params.id
    // item.periodStart === choosenFundPeriod.value.periodStart &&
    // item.periodEnd === choosenFundPeriod.value.periodEnd
  );
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

const {
  pending,
  error,
  refresh,
  data: items,
  status,
} = await useFetch("/api/warehouse/item", {
  lazy: false,
  transform: (items: any) => {
    return items.sort((x, y) => {
      if (x.title < y.title) {
        return -1;
      }

      if (x.title > y.title) {
        return 1;
      }

      return x.locationID - y.locationID;
    });
  },
});

onBeforeMount(async () => {
  // организации
  organizations.value = await getOrganizations();
  if (organizations.value) {
    organization.value = organizations.value.find(
      (company) => company.id == route.params.id
    );
  }

  // тмц организации
  items.value = items.value.filter(
    (item) =>
      item.ownerType === "company" && item.ownerID === organization.value.id
  );

  // пользователи в организации, по ним ФОТ и рассчитывается...
  users.value = await getAllUsers();
  if (users.value) {
    usersInBand.value = users.value.filter(
      (user) => user.groupID === +route.params.id
    );
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
  if (computedSalaryFund.value) {

    // Сортируем да дате окончания отчетного периода. Может имеет смысл добавить строку created_at и по ней сортировать???
    computedSalaryFund.value.sort((a, b) => new Date(a.periodStart) - new Date(b.periodEnd))
    
    
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
      return `${monthTextUpper} 1`;
    } else if (diffInDays <= 15 && date1.getDate() > 15) {
      return `${monthTextUpper} 2`;
    } else {
      return `${monthTextUpper}`;
    }
  }
};

// Wathers
watch(choosenFundPeriod, () => {
  console.log(choosenFundPeriod.value);
  console.log(computedSalaryFund.value);
});
watch(currentYear, () => {
  console.log(choosenFundPeriod.value);
  console.log(computedSalaryFund.value);
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

<style scoped></style>
