<script lan="ts" setup>
import { Container } from "@/shared/container";

useHead({
  title: "Соучастники | Управление строительством",
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

const { users } = storeToRefs(useUsersStore());
const { loadData } = useUsersStore();
const headers = ["ID", "Name", "Email"];

const { loggedIn, user, session, clear } = useUserSession();
</script>
<template>
  <Container>
    <!-- <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div>
        <h1>Users</h1>

        <p>Manage users here</p>
      </div>
      <button @click="loadData">Load users</button>
    </div>
    <br /> -->
    <h1 style="margin-top: 5rem">Landing page about "СОУЧАСТНИКИ"</h1>
    <br />
    <div v-if="user">
      <router-link to="/dashboard">Доска</router-link>
    </div>
    <div v-else>
      <router-link to="/login">Войти</router-link>
    </div>
    <!-- Show if no users loaded -->
    <!-- <div v-if="!users.length">
      <p>No users loaded</p>
    </div> -->

    <!-- Show when users are loaded -->
    <!-- <div v-else>
      <table>
        <thead>
          <tr>
            <td v-for="h in headers">{{ h }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td><a :href="`mailto:${user.email}`">{{ user.email }}</a></td>
          </tr>
        </tbody>
      </table>
    </div> -->
  </Container>
</template>

<style scoped>
/* html {
    width:100vw;
    overflow-x:hidden;
} */
</style>
