<template>
  <Container style="margin-top: 5rem">
    <!-- BANKS -->
    <!-- <h1 class="show-max-767">Банки</h1> -->

    <!-- TOGGLE TITLE -->
    <div class="toggle-title">
      <div v-for="(title, i) in titles" class="switch-title_el">
        <input
          type="radio"
          :id="i"
          :value="title.name"
          v-model="currentTitle"
        />
        <label :for="i"
          ><h1>{{ title.title }}</h1></label
        >
      </div>
    </div>

    <!-- БАНКИ -->
    <div v-if="currentTitle === 'banks'">
      <!-- <h2 style="margin-top: 1rem">Банки</h2> -->
      <!-- Если есть банки в управлении или session user принимает участие  -->
      <div v-if="computedBanks.length" class="items-container">
        <div
          class="item-wrapper"
          @click="$router.push(`banks/${bank.id}`)"
          v-for="bank in computedBanks"
        >
          <!-- Bank title -->
          <p style="font-weight: bold">{{ bank.title }}</p>

          <!-- Partners in Bank -->
          <!-- <div style="display: flex; gap: 0.5rem;">
          <div v-for="user in bank.users" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 48px;">
            <div style="background-color: var(--bs-primary); width: 100%; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="color: var(--bs-body-bg); font-weight: bold;">ЕП</span>
            </div>
            <span style="font-size: 0.7rem;">1/2</span>
          </div>
        </div> -->

          <!-- <p>{{ bank.users }}</p> -->

          <!-- Balance -->
          <div style="margin-top: 1rem">
            <p>999 999 999,99 Р (Баланс)</p>
            <p>000 000 000,00 Р (Долги)</p>
          </div>
        </div>
      </div>
      <!-- Если пусто -->
      <div v-else>У вас нет банков</div>
    </div>

    <!-- INVEST -->
    <div v-if="currentTitle === 'stock_invested'">
      <!-- <h2 style="margin-top: 1rem">Stock IMOEX/SPB invested</h2> -->

      <!-- Если есть фонды в управлении или session user принимает участие  -->
      <div v-if="computedStockFunds.length" class="items-container">
        <div
          class="item-wrapper"
          @click="$router.push(`fundstock/${fund.id}`)"
          v-for="fund in computedStockFunds"
        >
          <p style="font-weight: bold">{{ fund.title }}</p>
          <!-- <p>{{ fund.assets }}</p> -->
          <p>{{ fund.stockBroker.title }}</p>
          <p>{{ translateStockFundType(fund.accountType) }}</p>
          <p>999 999 999,99 P (-999 999 999,99 P)</p>
        </div>
      </div>
      <!-- Если пусто -->
      <div v-else>У вас нет фондов</div>
    </div>

    <!-- <br />
    <p>На сумму: {{ summaryWastedValue }}</p>
    <ul>
      <li v-for="item in myBondsList">
        | На сумму: {{ item.buy_price }} (ЦенаКомиссия: {{ item.fee }}, НКД:
        {{ item.accumulated_coupon_income }}) | {{ item.name }} |
        {{ item.ticker }} | {{ item.qty }}
      </li>
    </ul> -->

    <!-- <br />
    <div style="display: flex; align-items: center; gap: 0.5rem">
      <div
        style="cursor: pointer"
        @click="moexTickerLast(`${promtTicker}`).then(console.log)"
      >
        <span>Запросить котировку по тикеру</span>
      </div>
      <input type="text" v-model="promtTicker" placeholder="Впишите тикер" />
    </div> -->

    <!-- <br />
    <div @click="parser">
      <span style="cursor: pointer">Парсить котировки</span>
    </div>
    <br />
    <ul>
      <li v-for="item in testmyBondsList">
        | На сумму: {{ item.buy_price }} (ЦенаКомиссия: {{ item.fee }}, НКД:
        {{ item.accumulated_coupon_income }}) | {{ item.name }} |
        {{ item.ticker }} | {{ item.qty }}
      </li>
    </ul> -->

    <!-- <h2>Ledger</h2>
    <ul>
      <li v-for="transaction in bondsLedger">
        {{ transaction }}
      </li>
    </ul> -->
  </Container>
</template>

<script setup>
import { Container } from "@/shared/container";
import { onBeforeMount } from "vue";

//
const router = useRouter();
const sessionUser = useAuthStore().user;

const myBondsList = ref([]);
const testmyBondsList = ref([]);
const summaryWastedValue = ref(0);
const state_tax = ref(0.13);
const bondsList = ref({
  name: "Россети Центр 001Р-03",
  ticker: "RU000A107AG6",
  coupons: [
    {
      coupon_value: 13.89,
      payment_date: new Date(2024, 1, 12),
    },
  ],
});
const bondsLedger = ref([
  {
    transaction_id: 22,
    transaction_type: "buy",
    buy_at: new Date(2024, 2, 4),
    name: "Россети Центр 001Р-03",
    ticker: "RU000A107AG6",
    buy_price: 1001,
    qty: 6,
    fee: 18.02,
    accumulated_coupon_income: 2.76,
  },
  {
    transaction_id: 21,
    transaction_type: "buy",
    buy_at: new Date(2024, 1, 12),
    name: "Россети Центр 001Р-03",
    ticker: "RU000A107AG6",
    buy_price: 1000.8,
    qty: 1,
    fee: 3.0,
    accumulated_coupon_income: 4.63,
  },
  {
    transaction_id: 20,
    transaction_type: "buy",
    buy_at: new Date(2024, 1, 2),
    name: "Россети Центр 001Р-03",
    ticker: "RU000A107AG6",
    buy_price: 1000.8,
    qty: 1,
    fee: 3.0,
    accumulated_coupon_income: 0.93,
  },
  {
    transaction_id: 19,
    transaction_type: "buy",
    buy_at: new Date(2024, 0, 29),
    name: "Россети Центр 001Р-03",
    ticker: "RU000A107AG6",
    buy_price: 1000.2,
    qty: 1,
    fee: 3.0,
    accumulated_coupon_income: 12.04,
  },
  {
    transaction_id: 18,
    transaction_type: "buy",
    buy_at: new Date(2024, 0, 26),
    name: "Нафтатранс Плюс выпуск 5",
    ticker: "RU000A106Y21",
    buy_price: 1032.3,
    qty: 1,
    fee: 3.1,
    accumulated_coupon_income: 2.6,
  },
  {
    transaction_id: 17,
    transaction_type: "buy",
    buy_at: new Date(2024, 0, 18),
    name: "Россети Центр 001Р-03",
    ticker: "RU000A107AG6",
    buy_price: 1000.4,
    qty: 1,
    fee: 3.0,
    accumulated_coupon_income: 6.95,
  },
  {
    transaction_id: 16,
    transaction_type: "buy",
    buy_at: new Date(2024, 0, 12),
    name: "РЖД 1P28R",
    ticker: "RU000A106ZL5",
    buy_price: 1005.0,
    qty: 10,
    fee: 30.15,
    accumulated_coupon_income: 40.3,
  },
  {
    transaction_id: 15,
    transaction_type: "buy",
    buy_at: new Date(2023, 9, 27),
    name: "РЖД 1P26R",
    ticker: "RU000A106K43",
    buy_price: 1011.3,
    qty: 3,
    fee: 10,
    accumulated_coupon_income: 40.68,
  },
  {
    transaction_id: 14,
    transaction_type: "buy",
    buy_at: new Date(2023, 9, 24),
    name: "ТЕХНО Лизинг выпуск 3",
    ticker: "RU000A102234",
    buy_price: 939.3,
    qty: 2,
    fee: 5.64,
    accumulated_coupon_income: 20.56,
  },
  {
    transaction_id: 13,
    transaction_type: "buy",
    buy_at: new Date(2023, 9, 24),
    name: "ТЕХНО Лизинг выпуск 3",
    ticker: "RU000A102234",
    buy_price: 936.6,
    qty: 2,
    fee: 5.64,
    accumulated_coupon_income: 20.56,
  },
  {
    transaction_id: 12,
    transaction_type: "buy",
    buy_at: new Date(2023, 9, 24),
    name: "СДЭК-Глобал выпуск 1",
    ticker: "RU000A102SM7",
    buy_price: 947.2,
    qty: 2,
    fee: 5.6,
    accumulated_coupon_income: 12.48,
  },
  {
    transaction_id: 11,
    transaction_type: "buy",
    buy_at: new Date(2023, 9, 24),
    name: "СДЭК-Глобал выпуск 1",
    ticker: "RU000A102SM7",
    buy_price: 947.2,
    qty: 1,
    fee: 2.84,
    accumulated_coupon_income: 3.12,
  },
  {
    transaction_id: 10,
    transaction_type: "buy",
    buy_at: new Date(2023, 9, 24),
    name: "Делимобиль 1Р-03",
    ticker: "RU000A106UW3",
    buy_price: 994.6,
    qty: 1,
    fee: 2.98,
    accumulated_coupon_income: 6.38,
  },
  {
    transaction_id: 9,
    transaction_type: "buy",
    buy_at: new Date(2023, 9, 24),
    name: "Делимобиль 1Р-03",
    ticker: "RU000A106UW3",
    buy_price: 994.6,
    qty: 2,
    fee: 2.98,
    accumulated_coupon_income: 25.52,
  },
  {
    transaction_id: 8,
    transaction_type: "buy",
    buy_at: new Date(2023, 9, 22),
    name: "Самолет БО-П112",
    ticker: "RU000A104YT6",
    buy_price: 1016.6,
    qty: 1,
    fee: 3.05,
    accumulated_coupon_income: 6.17,
  },
  {
    transaction_id: 7,
    transaction_type: "buy",
    buy_at: new Date(2021, 10, 19),
    name: "МТС выпуск 14",
    ticker: "RU000A101FH6",
    buy_price: 908.22,
    qty: 1,
    fee: 2.72,
    accumulated_coupon_income: 0.72,
  },
  {
    transaction_id: 6,
    transaction_type: "buy",
    buy_at: new Date(2021, 3, 8),
    name: "АФК Система выпуск 7",
    ticker: "RU000A0ZYQY7",
    buy_price: 974.4,
    qty: 1,
    fee: 0.49,
    accumulated_coupon_income: 13.23,
  },
  {
    transaction_id: 5,
    transaction_type: "buy",
    buy_at: new Date(2021, 3, 8),
    name: "МаксимаТелеком выпуск 2",
    ticker: "RU000A102DK3",
    buy_price: 994.4,
    qty: 1,
    fee: 0.5,
    accumulated_coupon_income: 36.33,
  },
  {
    transaction_id: 4,
    transaction_type: "buy",
    buy_at: new Date(2021, 3, 8),
    name: "Ренессанс Кредит выпуск 6",
    ticker: "RU000A102RN7",
    buy_price: 987.8,
    qty: 1,
    fee: 0.49,
    accumulated_coupon_income: 11.39,
  },
  {
    transaction_id: 3,
    transaction_type: "buy",
    buy_at: new Date(2021, 3, 8),
    name: "Ренессанс Кредит выпуск 4",
    ticker: "RU000A102H83",
    buy_price: 994.5,
    qty: 1,
    fee: 0.5,
    accumulated_coupon_income: 26.22,
  },
  {
    transaction_id: 2,
    transaction_type: "buy",
    buy_at: new Date(2021, 3, 8),
    name: "ОФЗ 26232",
    ticker: "SU26232RMFS7",
    buy_price: 952.01,
    qty: 1,
    fee: 0.48,
    accumulated_coupon_income: 29.1,
  },
  {
    transaction_id: 1,
    transaction_type: "buy",
    buy_at: new Date(2021, 3, 8),
    name: "Казахстан выпуск 11",
    ticker: "RU000A101RZ3",
    buy_price: 967.2,
    qty: 1,
    fee: 0.48,
    accumulated_coupon_income: 3.07,
  },
]);

// current choosen title
const currentTitle = ref("banks");
// choosen title
const titles = ref([
  {
    title: "Банки",
    name: "banks",
  },
  {
    title: "Фонды IMOEX/SPB",
    name: "stock_invested",
  },
]);

const promtTicker = ref(null);

// BANKS
const computedBanks = computed(() => {
  let banksArray = [];

  if (banks.value.length) {
    [...banks.value].forEach((item) => {
      // iamapartner
      item.users.forEach((el) => {
        if (el.partnerType === "user" && +el.partnerID === sessionUser.id) {
          banksArray.push(item);
        }
      });
      // iamacreator
      if (+item.creatorID === sessionUser.id) {
        banksArray.push(item);
      }
    });
  }

  return [...new Set(banksArray)];
});

const {
  pending,
  error,
  refresh,
  data: banks,
  status,
} = await useFetch("/api/banks/bank", {
  lazy: false,
  transform: (banks) => {
    return banks.sort((x, y) => {
      if (x.title < y.title) {
        return -1;
      }

      if (x.title > y.title) {
        return 1;
      }
    });
  },
});

// STOCK FUNDS
const computedStockFunds = computed(() => {
  let fundsArray = [];

  if (stockFunds.value.length) {
    [...stockFunds.value].forEach((item) => {
      // iamapartner
      item.partners.forEach((el) => {
        if (el.partnerType === "user" && +el.partnerID === sessionUser.id) {
          fundsArray.push(item);
        }
      });
      // iamacreator
      if (+item.creatorID === sessionUser.id) {
        fundsArray.push(item);
      }
    });
  }
  return [...new Set(fundsArray)];
});

const { data: stockFunds } = await useFetch("/api/funds/partnerStockFunds", {
  lazy: false,
  transform: (stockFunds) => {
    return stockFunds.sort((x, y) => {
      if (x.title < y.title) {
        return -1;
      }

      if (x.title > y.title) {
        return 1;
      }
    });
  },
});

onBeforeMount(() => {
  // console.log(sessionUser)

  if (sessionUser) {
    let userModulesArray = [];
    sessionUser.accessModules.forEach((item) =>
      userModulesArray.push(item.name)
    );

    if (userModulesArray.includes("banks")) {
      return;
    } else {
      alert("У вас нет подписки на данный модуль");

      router.push("/");
    }
  }
});

onMounted(() => {
  myBondsList.value = Object.values(
    bondsLedger.value.reduce(
      (a, n) => (
        ((a[n.ticker] = a[n.ticker] || { ...n, qty: 0 }).qty += n.qty), a
      ),
      {}
    )
  );

  summaryWastedValue.value = bondsLedger.value.reduce(function (acc, current) {
    acc +=
      current.qty *
      (current.buy_price + current.fee + current.accumulated_coupon_income);
    return +acc.toFixed(2);
  }, 0);
});

async function moexTickerLast(ticker) {
  // /iss/engines/[engine]/markets/[market]/securities/[security]
  const json = await fetch(
    "https://iss.moex.com/iss/engines/stock/markets/bonds/securities/" +
      ticker +
      ".json"
  ).then(function (res) {
    return res.json();
  });
  // return json.marketdata.data.filter(function (d) {
  //   return ["TQBR", "TQTF"].indexOf(d[1]) !== -1;
  // })[0][12];
  return json.marketdata;
  // .data
  // .filter(function (d) {
  //   return ["TQBR", "TQTF"].indexOf(d[1]) !== -1;
  // });
}

const parser = async () => {
  // console.log('/iss/securities')
  const json = await fetch(
    "https://iss.moex.com/iss/securities.json?group_by=group&group_by_filter=stock_bonds&iss.meta=off&start=0&iss.json=extended"
    // 'https://iss.moex.com/iss/securities.json?q=Yandex'
    // "https://iss.moex.com/iss/securities.json?q=Северсталь&group_by=group&group_by_filter=stock_bonds&limit=10000&iss.meta=off&start=0&iss.json=extended"
  ).then(function (res) {
    return res.json();
  });
  console.log(json);
  return json;
};

// Translaters
const translateStockFundType = (type) => {
  if (type) {
    if (type === "iia") {
      return "ИИС";
    } else if (type === "ba") {
      return "Брокерский счет";
    }
  }
};

useHead({
  title: "Банки и фонды соучастников",
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
</script>

<style scoped>
.toggle-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.switch-title_el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}
.switch-title_el label h1 {
  color: var(--bs-tertiary-color);
}
.switch-title_el label h1:hover {
  cursor: pointer;
}

.switch-title_el input[type="radio"]:checked + label h1 {
  color: unset;
}
.items-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}
.item-wrapper {
  padding: 1rem;
  border: 1px solid var(--bs-border-color);
  border-radius: 16px;
  transition: all 0.15s ease-in;
}
.item-wrapper:hover {
  cursor: pointer;
  background-color: var(--bs-secondary-bg);
}
@media screen and (max-width: 575px) {
  .items-container {
    grid-template-columns: 1fr !important;
    margin: 0 1rem;
  }
  .toggle-title {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
}
@media screen and (min-width: 576px) and (max-width: 767px) {
  .items-container {
    grid-template-columns: 1fr 1fr !important;
  }
}
@media screen and (max-width: 767px) {
  .show-max-767 {
    display: none;
  }
  .items-container {
    margin-top: 2rem;
  }
}
@media screen and (min-width: 768px) and (max-width: 1199px){
  .toggle-title {
    margin-top: 6rem;
  }
}
@media screen and (max-width: 991px) {
  .items-container {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@media screen and (min-width: 1200px) {
  .items-container {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .toggle-title {
    margin-top: 6rem;
  }
}
</style>
