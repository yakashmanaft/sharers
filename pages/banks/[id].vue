<script setup>
import { Container } from "@/shared/container";

// Unidrum 2023-03-30
// ИС 2022-11-21
// Соучастники 2022-11-05
// ЮД 2022-09-12
// ЮС 2021-05-13
// AC 2020-11-16

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

const { user } = useUserSession();
// const listItemType = ref([])

// Инструмент
// tools

// Расходники
// consumables

// Техника
// technic

// Материалы
// stuff

// toggle title data
const currentTitle = ref('partners')
const titles = ref([
  {
    title: 'Партнеры',
    name: 'partners',
    guard: false
  },
  {
    title: 'Операции',
    name: 'transaction',
    guard: true
  },
  {
    title: 'Кредиты',
    name: 'credit',
    guard: true
  },
  {
    title: 'Инвестиции',
    name: 'invested',
    guard: true
  },
])


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
  // {
  //   id: 3,
  //   name: "invest",
  //   translate: "Инвестиции",
  // },
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
    if(trns_toggle_type.value === "expense") {
      if(item.type === 'expense' || item.type === 'invest') {

        return item
      }
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
      if(current.bankID === +route.params.id) {
        if(current.type === "income") {
          return (acc += current.price * current.qty);  
        } else if (current.type === 'expense') {
          acc -= current.price * current.qty
        } else if (current.type === 'invest') {
          acc -= current.price * current.qty
        } else {
          acc += 0
        }
      } else {
        acc += 0  
      }
      return acc
    }, 0);

    let calcFormatted = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      // currencyDisplay: "code",
    }).format(result);

    return calcFormatted;
  } else {
    return 0;
  }
});

const computedCredits = computed(() => {
  if(transactions.value) {
    let array = [];
    transactions.value.filter(el => {
      if(el.appointment === 'Ссуда') {
        array.push(el)
      } else if (el.appointment === 'Выдача кредита') {
        array.push(el)
      }
    })

    return array
  } else {

    return []
  }
})
const computedInvested = computed(() => {
  if(transactions.value) {
    return transactions.value.filter(el => el.type === 'invest' && el.appointment !== 'Выдача кредита')
  }
  return []
})

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
const transformTransactionDate = (date) => {
  // return date.toISOString().slice(0, 10)
  let newDate = new Date(date);
  // console.log(newDate.toLocaleDateString());
  return newDate.toLocaleDateString();
};
const transformToRUB = (number) => {
  let calcFormatted = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      // currencyDisplay: "code",
    }).format(number);
  return calcFormatted
}

// CALC
const calcWalletBanksBalance = (walletID) => {
  if(transactions.value.length) {
    let result = transactions.value.reduce((acc, current) => {
      if(current.walletBankID === walletID) {
        if(current.type === 'income') {
          acc += current.price * current.qty
        } else if (current.type === 'expense') {
          acc -= current.price * current.qty
        } else if (current.type === 'invest') {
          acc -= current.price * current.qty
        } else {
          acc += 0
        }
      } else {

        acc += 0
      }
      return acc
    }, 0)

    let calcFormatted = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      // currencyDisplay: "code",
    }).format(result);
    return calcFormatted
  } else {
    return 0
  }
}
const calcReturnedInvestings = (appointmentTarget) => {
  if(transactions.value.length) {
    let result;

   let array = [...transactions.value].filter(item => {
      if(item.appointmentTarget === appointmentTarget && item.appointment === 'Возврат') {
        return item
      } 
    })

    if(array.length) {

      result = array.reduce((acc, current) => {
        return (acc += current.price * current.qty)
      }, 0)
    } else {
      result = 0
    }
    let calcFormatted = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      // currencyDisplay: "code",
    }).format(result);
    return calcFormatted
    // return result
  } else {
    return 0
  }
}

// CHECK DATA
const sessionUserIsPartner = () => {
  if(computedBank.value.users) {
    let sharerIsaPatnerOfBank = [...computedBank.value.users].find(el => {
      if(el.partnerType === 'user') {
        if(+el.partnerID === user.value.id) {
          return el
        }
      }
    })
    return sharerIsaPatnerOfBank ? true : false
  }
}

// =================== =========================
// CREATE FUNCTIONS
const createCreditItem = () => {
  alert('Создание кредита в разработке...')
}
const createInvestItem = () => {
  alert('Создание инвестиции в разработке...')
}

</script>

<template>
  <Container style="margin-top: 5rem">
    <h1 class="show-max-767">Банк {{ computedBank.title }}</h1>

    <!-- <div>
      {{ computedBank }}
    </div> -->

    <!-- Дата создания -->
    <!-- <div style="margin-top: 1rem">
      <p>Дата создания: {{ computedBank.created_at }}</p>
    </div> -->

    <!-- ======================== balance ========================= -->
    <div class="balance_container">
      <!-- total -->
      <div class="balance-item_wrapper">
        <h3>Свободные средства</h3>
        <h4>{{ computedBalance }}</h4>
      </div>

      <!-- banks acccounts / wallets in the bank-->
      <div class="balance-item_wrapper" v-for="(wallet, idx) in computedBank.walletBank">
        <h3>{{ wallet.name }}</h3>
        <h4>{{ calcWalletBanksBalance(wallet.id) }}</h4>
      </div>
    </div>

    <!-- Переключатель заголовков -->
    <div class="toggle-title">
      <div v-for="(title, index) in titles.filter((el) => {
        if(computedBank) {
          if(el.guard && (computedBank.creatorID === user.id || sessionUserIsPartner())) {
            return el
          } else if (!el.guard) {
            return el
          }
        }
      })" class="switch-title_el">
        <input type="radio" :id="`${index}_bank_wallet`" :value="title.name" v-model="currentTitle">
        <label :for="`${index}_bank_wallet`"><h2>{{ title.title }}</h2></label>
      </div>
    </div>

    <!-- ===================   ======================= -->

    <!-- Операции -->
    <div v-if="currentTitle === 'transaction'">
      <!-- <h2>Операции</h2> -->

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
              <span>{{
                transformTransactionDate(transactionItem.created_at)
              }}</span>
            </div>

            <!-- TYPE, QTY, CURRENCY -->
            <div>
              <span>{{ setTrnsSign(transactionItem.type) }}</span>
              <span>{{ transactionItem.price * transactionItem.qty }}</span>
              <span>{{ transactionItem.currency }}</span>
            </div>

            <!-- APPOINTMENT, APPOINTMENT TARGET -->
            <div>
              <span>{{ transactionItem.type }} - </span>
              <span>{{ transactionItem.appointment }} - </span>
              <span>{{ transactionItem.appointmentTarget }}</span>
              <span v-if="transactionItem.desc">
                - {{ transactionItem.desc }}</span
              >
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

      <br />
    </div>

    <!-- Партнеры -->
    <div v-if="currentTitle === 'partners'">
      <!-- <h2>Партнеры</h2> -->
      <div v-for="partner in computedBank.users">
        {{ partner }}
      </div>
    </div>

    <!-- Кредиты -->
    <div v-if="currentTitle === 'credit'">

      <div v-if="computedCredits">

        <!--  -->
        <div class="transaction-item_wrapper" v-for="transactionItem in computedCredits">

          <!-- DATE of trsn -->
          <div>
            <span>{{
              transformTransactionDate(transactionItem.created_at)
            }}</span>
          </div>

          <!-- TYPE, QTY, CURRENCY -->
          <div>
            <div>
              <!-- <span>{{ setTrnsSign(transactionItem.type) }}</span> -->
              <span>Тело кредита: {{ transformToRUB(transactionItem.price * transactionItem.qty) }}</span>
              <!-- calcReturnedInvestings -->
            </div>
            <div>
              <span>Процент:ххх</span>
            </div>
            <div>
              <span>Вернулось: {{ calcReturnedInvestings(transactionItem.appointmentTarget) }}</span>
            </div>
          </div>


          <!-- APPOINTMENT, APPOINTMENT TARGET -->
          <div>
            <span>{{ transactionItem.type }} - </span>
            <span>{{ transactionItem.appointment }} - </span>
            <span>{{ transactionItem.appointmentTarget }}</span>
            <span v-if="transactionItem.desc">
              - {{ transactionItem.desc }}</span
            >
            <!--  -->
            <div v-if="transactionItem.appointment === 'Выдача кредита' || transactionItem.appointment === 'Ссуда'">
              <div v-if="transactions">
                <div v-for="item in transactions.filter(el => {
                  if(el.type === 'income' && el.appointment === 'Возврат' && transactionItem.appointmentTarget === el.appointmentTarget) {
                    return el
                  }
                }).reverse()">
                  <p>{{ transformTransactionDate(item.created_at) }} - {{  item.qty * item.price  }} - {{ item.appointment }} - {{ item.appointmentTarget }} - {{ item.authorType }} - {{ item.authorID }} - {{ transactionItem.walletBankID }}</p>
                </div>
              </div>
            </div> 
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
      <div v-else>
        Нет кредитов. <span class="link" @click="createCreditItem()">Начать</span>
      </div>
    </div>
    <!-- Инвестиции -->
    <div v-if="currentTitle === 'invested'">
      
      <div v-if="computedInvested">

        <!--  -->
        <div class="transaction-item_wrapper" v-for="transactionItem in computedInvested">
          <!-- DATE of trsn -->
          <div>
            <span>{{
              transformTransactionDate(transactionItem.created_at)
            }}</span>
          </div>

          <!-- TYPE, QTY, CURRENCY -->
          <div>
            <div>
              <!-- <span>{{ setTrnsSign(transactionItem.type) }}</span> -->
              <span>Тело инвестиции: {{ transformToRUB(transactionItem.price * transactionItem.qty) }}</span>
              <!-- <span>{{ transactionItem.currency }}</span> -->
            </div>
            <!-- <div>
              <span>Процент:ххх</span>
            </div> -->
            <div>
              <span>Вернулось:{{ calcReturnedInvestings(transactionItem.appointmentTarget) }}</span>
            </div>
          </div>

          <!-- APPOINTMENT, APPOINTMENT TARGET -->
          <div>
            <span>{{ transactionItem.type }} - </span>
            <span>{{ transactionItem.appointment }} - </span>
            <span>{{ transactionItem.appointmentTarget }}</span>
            <span v-if="transactionItem.desc">
              - {{ transactionItem.desc }}</span
            >
            <!--  -->
            <div>
              <div v-if="transactions">
                <div v-for="item in transactions.filter((el) => {
                  if(el.type === 'income' && el.appointment === 'Возврат' && transactionItem.appointmentTarget === el.appointmentTarget) {
                    return el
                  }
                }).reverse()">
                  <p>{{ item.appointment }} - {{ transformTransactionDate(item.created_at) }} - {{  item.qty * item.price  }} - {{ item.appointmentTarget }} - {{ item.authorType }} - {{ item.authorID }} - {{ transactionItem.walletBankID }}</p>
                </div>
              </div>  
            </div>
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
      <div v-else>
        Нет инвестиций. <span class="link" @click="createInvestItem()">Начать</span>
      </div>
    </div>
  </Container>
</template>

<style scoped>
.link {
  color: var(--bs-primary);
}
.link:hover {
  cursor: pointer;
  color: var(--bs-primary);
}
.filter-toggle-type_container {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.transaction-list_container {
  margin-top: 2rem;
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
  grid-template-columns: 1fr 1fr 3fr 1fr 1fr;
  margin-top: 1rem;
}
.balance_container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}
.balance_container .balance-item_wrapper {
  background-color: var(--bs-secondary-bg);
  padding: 1rem;
}
.balance_container .balance-item_wrapper:first-child {
  background-color: var(--bs-success-bg-subtle);
  color: var(--bs-success);
}
.balance_container .balance-item_wrapper h3,
.balance_container .balance-item_wrapper h4 {
  margin: 0;
}
.balance_container .balance-item_wrapper h3 {
  font-size: 1rem;
  color: var(--bs-tertiary-color);
  font-weight: unset;
}

/* TOGGLle TITLE */
.toggle-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: scroll;
  scrollbar-width: none;
  /* border-bottom: 1px solid var(--bs-tertiary-color); */
  padding-bottom: 1rem;
  margin-top: 2rem;
}
.toggle-title::-webkit-scrollbar {
  display: none;
}

.switch-title_el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}
.switch-title_el label h2 {
  color: var(--bs-tertiary-color);
  white-space: nowrap;
}
.switch-title_el label h2:hover {
  cursor: pointer;
}

.switch-title_el input[type="radio"]:checked + label h2 {
  color: unset;
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
