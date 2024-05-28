<template>
  <Container>
    <div v-if="location">
      <h1 style="margin-top: 5rem">{{ location.title }}</h1>

      <div>
        <p>Тип: <span>{{ translateLocationType(location.type) }}</span></p>
        <p>
          Адрес: <span>{{ location.address }}</span>
        </p>
        <div>
          <p>{{ location }}</p>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { Container } from "@/shared/container";

useHead({
  title: "Место # ",
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

const locations = ref(null);
const location = ref(null);

const users = ref(null);
// const usersInBand = ref(null)

onMounted(async () => {
  //
  locations.value = await getLocations();
  if (locations.value) {
    location.value = locations.value.find((el) => el.id == route.params.id);
  }

  //
  //   users.value = await getAllUsers()
  //   if(users.value) {
  //     usersInBand.value = users.value.filter(
  //       (user) => user.groupID === +route.params.id
  //     )
  //   }
});

async function getLocations() {
  return await $fetch("/api/locations/locations");
}

async function getAllUsers() {
  return await $fetch("/api/usersList/users");
}

// translations
const translateLocationType = (type) => {
  if(type === 'sklad') {
    return 'Склад'
  } else if (type === 'office') {
    return 'Офис'
  } else if (type === 'repair') {
    return 'Сервисный центр (ремонт)'
  }
}
</script>

<style scoped></style>
