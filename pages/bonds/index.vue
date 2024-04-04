<template>
  <Container>
    <h2 style="margin-top: 5rem">My Bonds List</h2>
    <p>На сумму: {{ summaryWastedValue }}</p>
    <ul>
      <li v-for="item in myBondsList">
        | На сумму: {{ item.buy_price }} (ЦенаКомиссия: {{ item.fee }}, НКД:
        {{ item.accumulated_coupon_income }}) | {{ item.name }} |
        {{ item.ticket }} | {{ item.qty }}
      </li>
    </ul>

    <br />
    <ul>
      <li v-for="item in testmyBondsList">
        | На сумму: {{ item.buy_price }} (ЦенаКомиссия: {{ item.fee }}, НКД:
        {{ item.accumulated_coupon_income }}) | {{ item.name }} |
        {{ item.ticket }} | {{ item.qty }}
      </li>
    </ul>

    <h2>Ledger</h2>
    <ul>
      <li v-for="transaction in bondsLedger">
        {{ transaction }}
      </li>
    </ul>
  </Container>
</template>

<script setup>
import { Container } from "@/shared/container";
const myBondsList = ref([]);
const testmyBondsList = ref([]);
const summaryWastedValue = ref(0);
const state_tax = ref(0.13);
const bondsList = ref({
  name: "Россети Центр 001Р-03",
  ticket: "RU000A107AG6",
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
    ticket: "RU000A107AG6",
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
    ticket: "RU000A107AG6",
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
    ticket: "RU000A107AG6",
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
    ticket: "RU000A107AG6",
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
    ticket: "RU000A106Y21",
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
    ticket: "RU000A107AG6",
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
    ticket: "RU000A106ZL5",
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
    ticket: "RU000A106K43",
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
    ticket: "RU000A102234",
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
    ticket: "RU000A102234",
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
    ticket: "RU000A102SM7",
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
    ticket: "RU000A102SM7",
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
    ticket: "RU000A106UW3",
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
    ticket: "RU000A106UW3",
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
    ticket: "RU000A104YT6",
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
    ticket: "RU000A101FH6",
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
    ticket: "RU000A0ZYQY7",
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
    ticket: "RU000A102DK3",
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
    ticket: "RU000A102RN7",
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
    ticket: "RU000A102H83",
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
    ticket: "SU26232RMFS7",
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
    ticket: "RU000A101RZ3",
    buy_price: 967.2,
    qty: 1,
    fee: 0.48,
    accumulated_coupon_income: 3.07,
  },
]);

onMounted(() => {
  myBondsList.value = Object.values(
    bondsLedger.value.reduce(
      (a, n) => (
        ((a[n.ticket] = a[n.ticket] || { ...n, qty: 0 }).qty += n.qty), a
      ),
      {}
    )
  );

  // testmyBondsList.value = Object.values(bondsLedger.value.reduce(
  //     function (acc, current) {
  //         return acc[current.ticket] = a[current.ticket] || {...current, qty: 0}
  //     }
  // ))

  summaryWastedValue.value = bondsLedger.value.reduce(function (acc, current) {
    acc +=
      current.qty *
      (current.buy_price + current.fee + current.accumulated_coupon_income);
    return +acc.toFixed(2);
  }, 0);
});

useHead({
  title: "Мои облигации",
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

<style scoped></style>
