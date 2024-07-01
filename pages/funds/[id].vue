<script setup>
import { Container } from "@/shared/container";

//
const route = useRoute();

useHead({
  title: "Фонд",
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

// choose title
const titles = ref([
  {
    title: "Активы",
    name: "assets",
  },
  {
    title: "История",
    name: "history",
  },
]);
const currentTitle = ref("assets");

// const listItemType = ref([])

// Инструмент
// tools

// Расходники
// consumables

// Техника
// technic

// Материалы
// stuff

// Находим выбранный ФОНД фондового рынка
const computedFund = computed(() => funds.value[0]);
const {
  pending,
  error,
  refresh,
  data: funds,
  status,
} = await useFetch("/api/funds/partnerStockFunds", {
  lazy: false,
  transform: (funds) => {
    return funds.filter((fund) => fund.id === +route.params.id);
  },
});

// Ищем транзакции по фонду в трех леджерах (бонды, акции, деньги)
const computedTransactions = computed(() => {
    let array = []

    array = [...transactions_shares.value, ...transactions_bonds.value].filter(transaction => transaction.fundID === +route.params.id)

    return array
})
const { data: transactions_bonds } = await useFetch("/api/funds/stockBondsLedger", {
    lazy: false,
    transform: (transactions) => {
        return transactions
    }
})
const { data: transactions_shares } = await useFetch("/api/funds/stockShareLedger", {
    lazy: false,
    transform: (transactions) => {
        return transactions
    }
})

// Translaters
const translateStockFundType = (type) => {
  if(type) {
    if(type === 'iia') {
      return 'ИИС'
    } else if (type === 'ba') {
      return 'Брокерский счет'
    }
  }
}
</script>

<template>
  <Container style="margin-top: 5rem">
    <h1 class="show-max-767">Фонд {{ computedFund.title }}</h1>

    <div>
      {{ computedFund }}
    </div>

    <br />

    <div>
      <p>Дата создания: {{ computedFund.created_at }}</p>
      <p>Основатель: {{ computedFund.creatorID }}</p>
      <p>Брокер: {{ computedFund.stockBroker.title }}</p>
      <p>Тип счета: {{ translateStockFundType(computedFund.accountType) }}</p>
    </div>

    <!-- Кнопки - заголовки -->
    <h2 class="switch-title_container">
      <div v-for="(title, i) in titles" class="switch-title_el">
        <input
          type="radio"
          :id="i"
          :value="title.name"
          v-model="currentTitle"
        />
        <label :for="i">{{ title.title }}</label>
      </div>
    </h2>

    <!-- list of assets -->
    <div v-if="currentTitle === 'assets'">

        <!--  -->
        <div v-for="(asset, index) in computedFund.assets">
            {{ asset }}
        </div>
    </div>
    <!-- list of history -->
    <div v-else-if="currentTitle === 'history'">

        <!--  -->
        <div v-if="!computedTransactions.length">
            ничего нет
        </div>

        <!--  -->
        <div v-else>

            <div v-for="(transaction) in computedTransactions">
                {{ transaction }}
            </div>
        </div>
    </div>
    <!-- list of else -->
    <div v-else>Ни того, ни другого...</div>
  </Container>
</template>

<style scoped>
/*  */
.switch-title_container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.switch-title_el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}
.switch-title_el label {
  color: var(--bs-tertiary-color);
}
.switch-title_el label:hover {
  cursor: pointer;
}
.switch-title_el input[type="radio"]:checked + label {
  color: unset;
}

/*  */
@media screen and (max-width: 767px) {
  /* h1 {
        margin-top: 4rem;
    } */
  .show-max-767 {
    display: none;
  }
}
@media screen and (min-width: 768px) {
  /* h1 {
    margin-top: 6rem;
  } */
}
</style>
