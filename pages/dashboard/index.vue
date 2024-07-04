<template>
  <Container style="padding-top: 5rem">
    <h1 class="max-width-585_hide">Доска</h1>

    <!--  -->
    <div class="dashboard-container">
      <!-- PROJECTS -->
      <div
        v-if="projects"
        class="dashboard-item"
        @click="router.push('/projects')"
        style="
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 1rem;
          border-radius: 1rem;
        "
      >
        <h2 class="dashboard-item_header">Текущие</h2>
        <div class="dashboard-item_indicator" v-if="projects">
          <p>{{ currentProjectsCount(projects) }}</p>
        </div>
      </div>

      <!-- USERS -->
      <div
        v-if="users"
        class="dashboard-item"
        @click="router.push('/partners')"
        style="
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 1rem;
          border-radius: 1rem;
        "
      >
        <h2 class="dashboard-item_header">Соучастники</h2>
        <div class="dashboard-item_indicator">
          <!-- ALL service users-->
          <p v-if="users">
            {{ users.length }} {{ transformEndingTheWord("соучастников") }}
          </p>
          <!-- ALL sevice organizations -->
          <p v-if="organizations">
            {{ organizations.length }} {{ transformEndingTheWord("банды") }}
          </p>
        </div>
      </div>

      <!-- DEMANDS -->
      <div
        class="dashboard-item"
        v-if="demands"
        @click="router.push('/demands')"
        style="
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 1rem;
          border-radius: 1rem;
        "
      >
        <h2 class="dashboard-item_header">Заявки</h2>
        <!--  -->
        <div class="dashboard-item_indicator" v-for="data in demandsInfo">
          <p>{{ data.count }} {{ data.title }}</p>
        </div>
      </div>

      <!-- WAREHOUSE -->
      <div class="dashboard-item" @click="router.push('/warehouse')">
        <h2 class="dashboard-item_header">Склад</h2>
        <div class="dashboard-item_indicator">
          3 220 300,00 Потенциальная капитализация
        </div>
        <div class="dashboard-item_indicator">
          100500 предметов личных 1000 предметов банды
        </div>
      </div>

      <!-- BANK -->
      <div class="dashboard-item">
        <h2 class="dashboard-item_header">Деньги</h2>
        <div class="dashboard-item_indicator">
          320 790,00 (+5% к обороту) За последний месяц
        </div>
        <div class="dashboard-item_indicator">
          11 935 700,00 Свободные средства
        </div>
        <div class="dashboard-item_indicator">
          -793 846,00 Остаток по займам
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { Container } from "@/shared/container";

const sessionUser = useUserSession().user;
const router = useRouter();

// HEADER
useHead({
  title: "Доска | Соучастники",
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

// BODY?
const users = ref(null);
const organizations = ref(null);
const projects = ref(null);
const demands = ref(null);
const demandsInfo = ref([]);

onBeforeMount(async () => {
  users.value = await getAllUsers();
  organizations.value = await getOrganizations();
  projects.value = await getProjects();
  demands.value = await getDemands();
  demandsCount();

  // BD
  async function getAllUsers() {
    return await $fetch("/api/usersList/users");
  }
  async function getOrganizations() {
    return await $fetch("/api/organizations/organizations");
  }
  async function getProjects() {
    return await $fetch("/api/projects/projects");
  }
  async function getDemands() {
    return await $fetch("/api/demands/demand");
  }
});

// COUNTS
const currentProjectsCount = (projects) => {
  if (projects) {
    let currentProjects = [...projects].filter(
      (project) => project.completion !== 1
    );

    let signature;

    if (currentProjects.length % 10 === 1) {
      signature = "проект";
    }
    if (
      currentProjects.length % 10 === 2 ||
      currentProjects.length % 10 === 3 ||
      currentProjects.length % 10 === 4
    ) {
      signature = "проекта";
    } else {
      signature = "проектов";
    }

    return `${currentProjects.length} ${signature}`;
  }
};
const demandsCount = () => {
  if (demands.value && sessionUser.value) {
    // Актуальные заявки (всего)
    let stringActual;
    if (demands.value.length % 10 === 1) {
      stringActual = "актуальная";
    } else if (
      demands.value.length % 10 === 2 ||
      demands.value.length % 10 === 3 ||
      demands.value.length % 10 === 4
    ) {
      stringActual = "актуальные";
    } else {
      stringActual = "актуальных";
    }

    demandsInfo.value.push({
      title: stringActual,
      count: demands.value.length,
    });

    // User исполнитель по заявке
    let countResponser = [];
    countResponser = [...demands.value].filter(
      (demand) => demand.responserID === sessionUser.value.id
    );
    demandsInfo.value.push({
      title: "я исполнитель",
      count: countResponser.length,
    });

    // User автор по заявке
    let countAuthor = [];
    countAuthor = [...demands.value].filter(
      (demand) => demand.creatorID === sessionUser.value.id
    );
    demandsInfo.value.push({
      title: "я автор",
      count: countAuthor.length,
    });
  }
};

// TRANSFORMERS
// Strings
const transformEndingTheWord = (string) => {
  // человек
  if (string === "человек") {
    if (usersInBand.value.length) {
      if (
        usersInBand.value.length % 10 === 4 ||
        usersInBand.value.length % 10 === 2
      ) {
        return "человека";
      } else {
        return string;
      }
    }
  }
  // соучастчников
  else if (string === "соучастников") {
    if (users.value.length) {
      if (users.value.length % 10 === 1) {
        return "соучастник";
      }
      if (
        users.value.length % 10 === 2 ||
        users.value.length % 10 === 3 ||
        users.value.length % 10 === 4
      ) {
        return "соучастника";
      } else {
        return string;
      }
    }
  }
  // банды
  else if (string === "банды") {
    if (organizations.value.length) {
      if (organizations.value.length % 10 === 1) {
        return "банда";
      } else if (
        organizations.value.length % 10 === 2 ||
        organizations.value.length % 10 === 3 ||
        organizations.value.length % 10 === 4
      ) {
        return "банды";
      } else if (organizations.value.length % 10 === 7) {
        return "банд";
      } else {
        return string;
      }
    }
  }
};
</script>

<style scoped>
/*  */
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}
.dashboard-item {
  transition: all 0.2s ease-in;
}
.dashboard-item:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}
.dashboard-item_indicator p {
  margin: 0;
}

/*  */
@media screen and (max-width: 585px) {
}
@media screen and (max-width: 767px) {
  .max-width-585_hide {
    display: none;
  }
  .dashboard-item_header {
    font-size: 1rem;
  }
}
@media screen and (min-width: 768px) and (max-width: 991px) {
}
</style>
