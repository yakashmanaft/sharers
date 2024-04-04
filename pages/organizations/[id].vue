<template>
  <Container>
    <h1 style="margin-top: 5rem;">Банда #{{ $route.params.id }}</h1>

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
const usersInBand = ref(null)

onMounted(async () => {

  // 
  organizations.value = await getOrganizations();
  if(organizations.value) {

    organization.value = organizations.value.find(
      (company) => company.id == route.params.id
    );

  }

  // 
  users.value = await getAllUsers()
  if(users.value) {
    usersInBand.value = users.value.filter(
      (user) => user.groupID === +route.params.id
    )
  }
});

async function getOrganizations() {
  return await $fetch("/api/organizations/organizations");
}

async function getAllUsers() {
  return await $fetch("/api/usersList/users")
}
</script>

<style scoped></style>
