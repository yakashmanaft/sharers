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

    <div v-if="usersInBand">
      <h2>Соучастники банды</h2>
      <p>Количество соучастников: {{ usersInBand.length }}</p>
      <div>
        <div v-for="(user, index) in usersInBand">
          <p>{{ user }}</p>
        </div>
      </div>
    </div>

    <!-- ТМЦ организации -->
    <div>
      <!-- Заголовок -->
      <h2>ТМЦ</h2>
      <!--  -->
      <div v-if="items.length">
        <div v-for="(item, index) in items" :key="index">
          {{ item }}
        </div>
      </div>
      <!-- { "id": 160, "uuid": "d8ea7bba-e93d-4994-8b53-ac77880ec59e", "title": "Доска пола", "type": "stuff", "qty": 33, "measure": "кв. м.", "location": "project", "locationID": 1, "position": null, "serial": null, "productionDate": null, "ownerID": 1, "ownerType": "company", "responsible": 1, "created_at": "2024-05-29T09:23:49.000Z", "update_at": "2024-05-29T09:23:48.700Z" } -->
      <!--  -->
      <div v-else>Ничего нет</div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { Container } from "@/shared/container";

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

onMounted(async () => {
  // организации
  organizations.value = await getOrganizations();
  if (organizations.value) {
    organization.value = organizations.value.find(
      (company) => company.id == route.params.id
    );
  }

  // пользователи
  users.value = await getAllUsers();
  if (users.value) {
    usersInBand.value = users.value.filter(
      (user) => user.groupID === +route.params.id
    );
  }

  // тмц организации
  items.value = items.value.filter(
    (item) =>
      item.ownerType === 'company' &&
      item.ownerID === organization.value.id
  );
});


async function getOrganizations() {
  return await $fetch("/api/organizations/organizations");
}

async function getAllUsers() {
  return await $fetch("/api/usersList/users");
}
</script>

<style scoped></style>
