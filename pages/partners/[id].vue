<script setup>
import { ref } from "vue";
import { Container } from "@/shared/container";

/*
*
    временно
*/
import { v4 as uuidv4 } from "uuid";
/*
*
    убрать
*/

const route = useRoute();
const router = useRouter();

const users = ref(null);
const user = ref(null);

const isFlipperPrevUserBtnExist = ref(true);
const isFlipperNextUserBtnExist = ref(true);

// ФОТ
const wageFund = ref(0);
const productionFund = ref(0);
// Ставка заработной платы
const wageRate = ref(1264.0);
// Приколюхи на стол
const rest = ref(1150);
// Список участников
const usersInBand = ref(null);

usersInBand.value = [
  {
    id: 1,
    uuid: uuidv4(),
    name: "Вячеслав",
    surname: "Клименко",
    category: "#1",
    hours: 62,
    // Вписываем вручную
    stakeIndex: 1.1,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 85900.0,
  },
  {
    id: 2,
    uuid: uuidv4(),
    name: "Денис",
    surname: "Байкалов",
    category: "#1",
    hours: 52,
    stakeIndex: 1.1,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 72000.0,
  },
  {
    id: 3,
    uuid: uuidv4(),
    name: "Дмитрий",
    surname: "Лузин",
    category: "#1",
    hours: 52,
    stakeIndex: 1.1,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 72000.0,
  },
  {
    id: 4,
    uuid: uuidv4(),
    name: "Михаил",
    surname: "Лялин",
    category: "#1",
    hours: 48,
    stakeIndex: 1.0,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 60600.0,
  },
  {
    id: 5,
    uuid: uuidv4(),
    name: "Александр",
    surname: "Власов",
    category: "#1",
    hours: 48,
    stakeIndex: 1.1,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 66900.0,
  },
  {
    id: 6,
    uuid: uuidv4(),
    name: "Сергей",
    surname: "Филиппов",
    category: "#1",
    hours: 59,
    stakeIndex: 1.1,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 82100.0,
  },
  {
    id: 7,
    uuid: uuidv4(),
    name: "Сергей",
    surname: "Майер",
    hours: 62,
    stakeIndex: 1.1,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 85900.0,
    category: "#1",
  },
  {
    id: 8,
    uuid: uuidv4(),
    name: "Максим",
    surname: "Плюснин",
    category: "#1",
    hours: 57,
    stakeIndex: 0.9,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 64400.0,
  },
  {
    id: 9,
    uuid: uuidv4(),
    name: "Владимир",
    surname: "Юров",
    category: "#1",
    hours: 69,
    stakeIndex: 1.1,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 96000.0,
  },
  {
    id: 10,
    uuid: uuidv4(),
    name: "Никита",
    surname: "Решетников",
    category: "#1",
    hours: 49,
    stakeIndex: 0.7,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 42900.0,
  },
  {
    id: 11,
    uuid: uuidv4(),
    name: "Вадим",
    surname: "Ердяков",
    category: "#1",
    hours: 21,
    stakeIndex: 0.6,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 16400.0,
  },
  {
    id: 12,
    uuid: uuidv4(),
    name: "Александр",
    surname: "Атрошкин",
    category: "#1",
    hours: 29,
    stakeIndex: 0.7,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 25200.0,
  },
  {
    id: 13,
    uuid: uuidv4(),
    name: "Олег",
    surname: "Печенкин",
    category: "#1",
    hours: 58,
    stakeIndex: 0.7,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 51800.0,
  },
  {
    id: 14,
    uuid: uuidv4(),
    name: "Алексей",
    surname: "Безматерных",
    category: "#1",
    hours: 36,
    stakeIndex: 0.7,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 31600.0,
  },
  {
    id: 15,
    uuid: uuidv4(),
    name: "Чебасов",
    surname: "Виталий",
    category: "#2",
    hours: 22,
    stakeIndex: 1.0,
    // stakeHoursIndex: ???
    // salary: ???
    // Вписываем вручную
    salary: 15000.0,
  },
];

// When accessing /posts/1, route.params.id will be 1

// onMounted(async () => {
//   users.value = await getUsers()
//   // user.value = `${users.value}.${this.$route.params.users}`
//   console.log(users.value)
// })
// let btnPrev = document.querySelector('#prevUserBtn')
// console.log(btnPrev)
onMounted(async () => {
  users.value = await getUsers();
  user.value = users.value.find((item) => item.id == route.params.id);

  console.log(users.value.length - 1);
  console.log(users.value.indexOf(user.value));

  if (users.value.indexOf(user.value) === 0) {
    isFlipperPrevUserBtnExist.value = false;
  } else if (users.value.length - 1 === users.value.indexOf(user.value)) {
    isFlipperNextUserBtnExist.value = false;
  }

  wageFund.value = sumUserSalary() + rest.value;
  productionFund.value = sumUserProductionSalary() + rest.value;
});
/**
 * @desc Get users
 */
async function getUsers() {
  return await $fetch("/api/usersList/users");
}

/**
 * @desc Users flipper
 */
const usersFlipper = (user, actionType, usersArray) => {
  let prevUserID = usersArray.indexOf(user)
    ? usersArray[usersArray.indexOf(user) - 1].id
    : null;
  let nextUserID =
    usersArray.indexOf(user) < usersArray.length - 1
      ? usersArray[usersArray.indexOf(user) + 1].id
      : null;

  if (actionType === "prev" && prevUserID) {
    router.push(`${prevUserID}`);
  }
  if (actionType === "next" && nextUserID) {
    router.push(`${nextUserID}`);
  }
};

/**
 * @desc  Calculation Salary
 */

const test = () => {
  return Object.values(usersInBand.value).reduce((acc, current) => {
    acc += current.hours;
    return acc;
  }, 0);
};

//  <!-- Час * КТУ -->
// {{ item.hours * item.c }}
const sumUserHourStakeIndex = () => {
  return Object.values(usersInBand.value).reduce((acc, current) => {
    if (current.category !== "#2") {
      acc += current.hours * current.stakeIndex;
    }
    return +acc.toFixed(2);
  }, 0);
};

// <!-- ЗП (выработка) -->
// {{ (item.hours * item.stakeIndex) * wageRate }}
const sumUserProductionSalary = () => {
  return Object.values(usersInBand.value).reduce((acc, current) => {
    if (current.category !== "#2") {
      acc += current.hours * current.stakeIndex * wageRate.value;
    }
    return acc;
  }, 0);
};

// <!-- ЗП (начисленная) -->
// {{ item.salary }}
const sumUserSalary = () => {
  return Object.values(usersInBand.value).reduce((acc, current) => {
    acc += current.salary;
    return acc;
  }, 0);
};

// <!-- НАЛОГ -->
// {{ (((item.hours * item.stakeIndex) * wageRate) - item.salary).toFixed(2) }}
const sumCommunityTax = () => {
  return Object.values(usersInBand.value).reduce((acc, current) => {
    if (current.category !== "#2") {
      acc +=
        current.hours * current.stakeIndex * wageRate.value - current.salary;
    }
    return +acc.toFixed(2);
  }, 0);
};

useHead({
  title: `Соучастники`,
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
</script>

<template>
  <Container v-if="user">
    <div class="page-title">
      <h1>Соучастник #{{ $route.params.id }}</h1>
      <div class="page-title__btn-container">
        <span
          :class="{ btn__disabled: !isFlipperPrevUserBtnExist }"
          @click="usersFlipper(user, 'prev', users)"
          >Prev</span
        >
        <span
          :class="{ btn__disabled: !isFlipperNextUserBtnExist }"
          @click="usersFlipper(user, 'next', users)"
          >Next</span
        >
      </div>
    </div>

    <div>
      <h2>{{ user.surname }} {{ user.name }} {{ user.middleName }}</h2>
      <p>{{ user.role }}</p>
    </div>

    <div v-if="user.role === 'MASTER'">
      <h3>ЗП (1ая половина февраля)</h3>
      <p>{{ usersInBand.length }} человек</p>
      <p>
        ФОТ (начисленный) <span>{{ wageFund }}</span>
      </p>
      <p>
        ФОТ (по выработке)
        <span
          >{{ productionFund }} |
          {{ +(productionFund - wageFund).toFixed(2) }}</span
        >
      </p>

      <table style="width: 100%">
        <tr>
          <th>ФИО</th>
          <th>Час</th>
          <th>КТУ</th>
          <th>Час * КТУ</th>
          <th>ЗП (выработка)</th>
          <th>ЗП (начисленная)</th>
          <th>Налог</th>
        </tr>
        <tr v-for="item in usersInBand" :key="item.id" style="">
          <td>
            <!-- ФИО -->
            {{ item.surname }}
          </td>
          <td>
            <!-- Час -->
            {{ item.hours }}
          </td>
          <td>
            <!-- КТУ -->
            <span v-if="item.category !== '#2'">{{ item.stakeIndex }}</span>
            <span v-else>-</span>
          </td>
          <td>
            <!-- Час * КТУ -->
            <span v-if="item.category !== '#2'">{{
              (item.hours * item.stakeIndex).toFixed(2)
            }}</span>
            <span v-else>-</span>
          </td>
          <td>
            <!-- ЗП (выработка) -->
            <span v-if="item.category !== '#2'">{{
              (item.hours * item.stakeIndex * wageRate).toFixed(2)
            }}</span>
            <span v-else>-</span>
          </td>
          <td>
            <!-- ЗП (начисленная) -->
            {{ item.salary }}
          </td>
          <td>
            <!-- НАЛОГ -->
            <span v-if="item.category !== '#2'">{{
              (item.hours * item.stakeIndex * wageRate - item.salary).toFixed(2)
            }}</span>
            <span v-else>-</span>
          </td>
        </tr>
        <tr style="font-weight: bold">
          <td>Итого</td>
          <td>{{ test() }}</td>
          <td></td>
          <td>{{ sumUserHourStakeIndex() }}</td>
          <td>{{ sumUserProductionSalary() }}</td>
          <td>{{ sumUserSalary() }}</td>
          <td>{{ sumCommunityTax() }}</td>
        </tr>
      </table>

      <div>
        <p>Прочее: {{ rest }}</p>
      </div>
    </div>
  </Container>
</template>

<style scoped>
.page-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
}
.page-title h1 {
  margin: 0;
}
.page-title__btn-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.page-title__btn-container span:hover {
  cursor: pointer;
}
.btn__disabled {
  color: gray;
  opacity: 0.3;
}
</style>
