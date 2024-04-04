<script setup>
import { Container } from "@/shared/container";

const demands = [
  {
    id: 1,
    created_At: "2024.02.19",
    updated_At: "2024.02.21",
    title: "заявка #001",
    status: "Проработка",
    type: "building-materials",
    creatorID: 7,
    responserID: 7,
    projectID: 1,
  },
  {
    id: 2,
    created_At: "2024.02.22",
    updated_At: "2024.02.24",
    title: "заявка #002",
    status: "Комлектация",
    type: "building-materials",
    creatorID: 9,
    responserID: 7,
    projectID: 6,
  },
  {
    id: 3,
    created_At: "2024.02.23",
    updated_At: "2024.02.25",
    title: "заявка #003",
    status: "Ожидание поставки",
    type: "building-materials",
    creatorID: 10,
    responserID: 7,
    projectID: 2,
  },
  {
    id: 4,
    created_At: "2024.02.24",
    updated_At: "2024.02.25",
    title: "заявка #004",
    status: "Исполнено",
    type: "building-materials",
    creatorID: 1,
    responserIDID: 7,
    projectID: 6,
  },
];

useHead({
  title: "Заявки",
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

const users = ref(null);
// const userCreatorData = ref(null)

onMounted(async () => {
  users.value = await getUsers();
});

/**
 * @desc Get users
 */
async function getUsers() {
  return await $fetch("api/usersList/users");
}

const findUserCreator = (userCreatorID) => {
  if (users.value) {
    let demandCreatorName;
    users.value.forEach((item) => {
      if (item.id === userCreatorID) {
        demandCreatorName = item.name;
      }
    });
    return demandCreatorName;
    // return userCreatorID
  }
};
const findProjectTitle = (demandProjectID) => {
  return demandProjectID;
};
const findDemandResponser = (demandRresponserID) => {
  return demandRresponserID;
};
</script>
<template>
  <Container>
    <h1 style="margin-top: 5rem">Заявки</h1>

    <div
      v-for="(demand, index) in demands"
      :key="index"
      @click="$router.push(`demands/${demand.id}`)"
    >
      <h2>{{ demand.title }}</h2>
      <p>Статус: {{ demand.status }}</p>
      <p>От кого: {{ findUserCreator(demand.creatorID) }}</p>
      <p>Кому: {{ findDemandResponser(demand.responserID) }}</p>
      <p>Проект: {{ findProjectTitle(demand.projectID) }}</p>
      <!-- id: 1,
            created_At: '2024.02.19',
            updated_At: '2024.02.21',
            title: 'заявка #001',
            status: 'Проработка',
            type: 'building-materials', -->
    </div>
  </Container>
</template>

<style scoped></style>
