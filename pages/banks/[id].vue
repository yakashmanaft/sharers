<script setup>
import { Container } from "@/shared/container";

//
const route = useRoute();

useHead({
  title: "Банк",
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

// const listItemType = ref([])

// Инструмент
// tools

// Расходники
// consumables

// Техника
// technic

// Материалы
// stuff

const trns_toggle_type = ref("all");
const trns_toggle_type_array = ref([
  {
    id: 1,
    name: "income",
    translate: "Доход",
  },
  {
    id: 2,
    name: "expense",
    translate: "Расход",
  },
  {
    id: 3,
    name: "invest",
    translate: "Инвестиции",
  },
]);

const computedBank = computed(() => banks.value[0]);

const {
  pending,
  error,
  refresh,
  data: banks,
  status,
} = await useFetch("/api/banks/bank", {
  lazy: false,
  transform: (banks) => {
    return banks.filter((bank) => bank.id === +route.params.id);
  },
});

const computedBank_ledger = computed(() =>
  transactions.value.filter((item) => {
    if (trns_toggle_type.value === "all") {
      return item;
    }
    if (item.type === trns_toggle_type.value) {
      return item.type === trns_toggle_type.value;
    }
  })
);

const { data: transactions } = await useFetch("/api/funds/partnerLedger", {
  lazy: false,
  transform: (trns) => {
    return trns.filter((trn) => trn.bankID === +route.params.id);
  },
});

const computedBalance = computed(() => {
  if (transactions.value.length) {
    let result = 0;

    result = [...transactions.value].reduce((acc, current) => {
      if (current.type === "income") {
        return (acc += current.price * current.qty);
      } else if (current.type === "invest") {
        return (acc -= current.price * current.qty);
      } else {
        return (acc -= current.price * current.qty);
      }
    }, 0);

    return result;
  } else {
    return 0;
  }
});

// TRANSFORM
const setTrnsSign = (type) => {
  if (type) {
    if (type === "income") {
      return "+";
    }
    if (type === "expense") {
      return "-";
    }
    if (type === "invest") {
      return "-";
    }
  }
};
</script>

<template>
  <Container style="margin-top: 5rem">
    <h1 class="show-max-767">Банк {{ computedBank.title }}</h1>

    <div>
      {{ computedBank }}
    </div>

    <!-- Дата создания -->
    <div style="margin-top: 1rem">
      <p>Дата создания: {{ computedBank.created_at }}</p>
    </div>

    <!-- Партнеры фонда -->
    <div style="margin-top: 1rem">
      <h2>Партнеры</h2>
      <div v-for="partner in computedBank.users">
        {{ partner }}
      </div>
    </div>

    <!-- ======================== balance ========================= -->

    <!-- total -->
    <div style="margin-top: 2rem">
      <h2>{{ computedBalance }}</h2>
    </div>
    <!-- wallet banks -->
    <div v-for="(wallet, idx) in computedBank.walletBank">
      {{ wallet }}
    </div>

    <!-- current banks ledger -->
    <div style="margin-top: 1rem">
      <h2>Операции</h2>

      <!-- Фильтры по транзакциям -->
      <div class="filter-toggle-type_container">
        <div class="filter-toggle-type_el">
          <input
            type="radio"
            name="trn-input"
            id="i-0"
            value="all"
            v-model="trns_toggle_type"
          />
          <label for="i-0">Все</label>
        </div>
        <div
          class="filter-toggle-type_el"
          v-for="(trn, i) in trns_toggle_type_array"
          :key="i"
        >
          <input
            type="radio"
            name="trn-input"
            :id="i"
            :value="trn.name"
            v-model="trns_toggle_type"
          />
          <label :for="i">{{ trn.translate }}</label>
        </div>
      </div>

      <!-- Лист транзакций -->
      <div class="transaction-list_container">
        <div v-if="computedBank_ledger.length">
          <div
            class="transaction-item_wrapper"
            v-for="transactionItem in computedBank_ledger.reverse()"
          >
            <!-- DATE of trsn -->
            <div>
              <span>{{ transactionItem.created_at }}</span>
            </div>

            <!-- TYPE, QTY, CURRENCY -->
            <div>
              <span>{{ setTrnsSign(transactionItem.type) }}</span>
              <span>{{ transactionItem.price * transactionItem.qty }}</span>
              <span>{{ transactionItem.currency }}</span>
            </div>

            <!-- APPOINTMENT, APPOINTMENT TARGET -->
            <div>
              <span>{{ transactionItem.appointment }}</span>
              <span>{{ transactionItem.appointmentTarget }}</span>
              <span v-if="transactionItem.desc">{{transactionItem.desc}}</span>
            </div>

            <!-- AUTHOR of trsn -->
            <div>
              <span
                >{{ transactionItem.authorType }} -
                {{ transactionItem.authorID }}</span
              >
            </div>

            <!-- WALLET of BANK -->
            <div>
              <span>walletID: {{ transactionItem.walletBankID }}</span>
            </div>
          </div>
        </div>
        <div v-else>Нет историии транзакций</div>
      </div>
    </div>
  </Container>
</template>

<style scoped>
.filter-toggle-type_container {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.transaction-list_container {
  margin-top: 1rem;
}
.filter-toggle-type_el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}
.filter-toggle-type_el label {
  cursor: pointer;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  background-color: var(--bs-border-color);
  white-space: nowrap;
}
.filter-toggle-type_el input[type="radio"]:checked + label {
  background-color: var(--bs-body-color);
  color: var(--bs-body-bg);
}

.transaction-item_wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

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
