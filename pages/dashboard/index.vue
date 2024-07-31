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
      >
        <h2 class="dashboard-item_header">Текущие</h2>
        <div class="dashboard-item_indicator" v-if="projects">
          <p>{{ currentProjectsCount(projects) }}</p>
        </div>
      </div>

      <!-- USERS AND DEMANDS-->
      <div class="dashboard-item_group">
        <div
          v-if="demands"
          style="width: 100%"
          class="dashboard-item height-100 width-100"
          @click="router.push('/demands')"
        >
          <h2 class="dashboard-item_header">Заявки</h2>
          <!--  -->
          <div class="dashboard-item_indicator" v-for="data in demandsInfo">
            <p>{{ data.count }} {{ data.title }}</p>
          </div>
        </div>

        <div
          style="height: 100%"
          v-if="users"
          class="dashboard-item height-100 width-100"
          @click="router.push('/partners')"
        >
          <h2 class="dashboard-item_header">Контакты</h2>
        </div>
      </div>

      <div
        class="dashboard-item_group computed-bands_container"
        v-if="computedMyBands.length"
      >
        <div
          v-for="myBand in computedMyBands"
          style="width: 100%; position: relative"
          class="dashboard-item height-100 width-100 computed-bands_wrapper"
          @click="router.push(`/organizations/${myBand.id}`)"
        >
          <h2 class="dashboard-item_header">{{ myBand.title }}</h2>
          <!-- ICON owner-->
          <Icon
            v-if="myBand.ownerID === sessionUser.id"
            style="position: absolute; bottom: 1rem; right: 0.5rem"
            name="mdi:crown"
            size="24px"
            color="var(--bs-warning)"
          />
          <span style="white-space: nowrap;">{{ myBand.sharers.length }} чел</span>
        </div>
      </div>
      <!-- ******** -->
      <!-- <div
        v-if="users"
        class="dashboard-item"
        @click="router.push('/partners')"
      >
        <h2 class="dashboard-item_header">Соучастники</h2>
        <div class="dashboard-item_indicator">

          <p v-if="users">
            {{ users.length }} {{ transformEndingTheWord("соучастников") }}
          </p>


          <div
            style="
              border-top: 1px solid var(--bs-border-color);
              margin-top: 1rem;
              padding-top: 1rem;
            "
          >

            <p v-if="organizations">
              {{ organizations.length }} {{ transformEndingTheWord("банды") }}
            </p>

            <p v-if="organizations">
              {{ computedMyBands }} организовал
              {{ computedSharerOrganizations }} соучаствую
            </p>
          </div>
        </div>
      </div> -->

      <!-- DEMANDS -->
      <!-- v-if="demands" -->
      <div
        v-if="userAccesedLink('banks')"
        class="dashboard-item"
        @click="router.push('/banks')"
      >
        <h2 class="dashboard-item_header">Банки</h2>
        <!--  -->
        <!-- <div>{{ banks?.length }}</div> -->
        <div class="dashboard-item_indicator">
          <p>{{ banksCount() }}</p>
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
      <div class="dashboard-item" @click="router.push('/wallet')">
        <h2 class="dashboard-item_header">Кошелек</h2>
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
const route = useRoute();

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
// const users = ref(null);
// const organizations = ref(null);
// const projects = ref(null);
// const demands = ref(null);
const demandsInfo = ref([]);
// const banksInfo = ref([]);

onBeforeMount(async () => {
  // users.value = await getAllUsers();
  // organizations.value = await getOrganizations();
  // projects.value = await getProjects();
  // demands.value = await getDemands();
  demandsCount();
  // banksCount();
  // BD
  // async function getAllUsers() {
  //   return await $fetch("/api/usersList/users");
  // }
  // async function getOrganizations() {
  //   return await $fetch("/api/organizations/organizations");
  // }
  // async function getProjects() {
  //   return await $fetch("/api/projects/projects");
  // }
  // async function getDemands() {
  //   return await $fetch("/api/demands/demand");
  // }
});

// DB
const { data: users } = await useFetch("/api/usersList/users", {
  lazy: false,
});
const { data: projects } = await useFetch("/api/projects/projects", {
  laze: false,
});
const { data: demands } = await useFetch("/api/demands/demand", {
  laze: false,
  transform: (demands) => {
    return demands;
  },
});
const { data: organizations } = await useFetch(
  "/api/organizations/organizations",
  {
    laze: false,
  }
);
const { data: banks } = await useFetch("/api/banks/bank", {
  lazy: false,
  // transform: (banks) => {
  //   return banks.filter((bank) => bank.creatorID === sessionUser.value.id);
  // },
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

    // Всего заявок
    let countAll = [];
    [...demands.value].filter((demand) => {
      if (demand.responserID === sessionUser.value.id) {
        countAll.push(demand);
      } else if (demand.creatorID === sessionUser.value.id) {
        countAll.push(demand);
      }
    });
    demandsInfo.value.push({
      title: stringActual,
      count: countAll.length,
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
const banksCount = () => {
  if (banks.value && sessionUser.value) {
    return "Показывать бы такто средства";
  }
};

// HELPERS

// display link to modules if has access
const userAccesedLink = (moduleName) => {
  let userModulesArray = [];
  if (useAuthStore().user) {
    useAuthStore().user.accessModules.forEach((item) =>
      userModulesArray.push(item.name)
    );

    return userModulesArray.includes(moduleName);
  }
};

const computedMyBands = computed(() => {
  if (organizations.value) {
    let array = [];
    organizations.value.forEach((organization) => {
      if (organization.ownerID === sessionUser.value.id) {
        array.push(organization);
      } else if (
        organization.sharers.length !== 0 &&
        organization.ownerID !== sessionUser.value.id
      ) {
        organization.sharers.forEach((sharer) => {
          if (
            sharer.userType === "user" &&
            sharer.userID === sessionUser.value.id
          ) {
            array.push(organization);
          }
        });
      }
    });
    return array;
  } else {
    return;
  }
});

const computedSharerOrganizations = computed(() => {
  if (organizations.value) {
    let organizationsArrayWhereUserIs = [];

    organizations.value.forEach((organization) => {
      organization.sharers.forEach((sharer) => {
        if (
          sharer.userType === "user" &&
          sharer.userID === sessionUser.value.id
        ) {
          organizationsArrayWhereUserIs.push(organization);
        }
      });
    });

    return organizationsArrayWhereUserIs.length;
  }
});

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
.width-100 {
  width: 100%;
}
.height-100 {
  height: 100%;
}
/*  */
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}
.dashboard-item_group {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.dashboard-item {
  transition: all 0.2s ease-in;

  border: 1px solid var(--bs-border-color);
  padding: 1rem;
  border-radius: 1rem;
}
.dashboard-item:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}
.dashboard-item_indicator p {
  margin: 0;
}
.computed-bands_container {
  /* flex-wrap: wrap; */
  overflow: scroll;
  scrollbar-width: none;
}
.computed-bands_container::-webkit-scrollbar {
  display: none;
}
.computed-bands_wrapper {
  /* width: 100px!important; */
}

/*  */
@media screen and (max-width: 575px) {
  .dashboard-container {
    grid-template-columns: 1fr !important;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media screen and (max-width: 767px) {
  .dashboard-container {
    grid-template-columns: 1fr 1fr;
  }
  .max-width-585_hide {
    display: none;
  }
  .dashboard-item_header {
    font-size: 1rem;
    margin: 0;
    white-space: nowrap;
  }
}
@media screen and (max-width: 1199px) {
  .dashboard-container {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
