<script setup>
import { Container } from "@/shared/container";

useHead({
  title: "Проект # ",
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

//
const route = useRoute();
const router = useRouter();
//
const sessionUser = useUserSession().user;
// PROJECT
const project = ref(null);
// BAND
const band = ref(null);

// тмц организации
// items.value = items.value.filter(
//   (item) =>
//     item.location === 'project' && item.locationID === project.value.id
// );

// toggle title data
const titles = ref([
  {
    title: "План график",
    name: "schedule",
    guard: true,
  },
  {
    title: "Заявки",
    name: "demands",
    guard: true,
  },
  {
    title: "Соучастники",
    name: "sharers",
    guard: false,
  },
  {
    title: "ТМЦ",
    name: "warehouse-items",
    guard: true,
  },
  {
    title: "Балланс",
    name: "balance",
    guard: true,
  },
]);

const currentTitle = ref("schedule");

// DB PROJECTS
const { data: projects } = await useFetch("/api/projects/projects", {
  lazy: false,
});
// DB BANDS
const { data: bands } = await useFetch("/api/organizations/organizations", {
  lazy: false,
});
// DB WAREHOUSE ITEMS
const { data: items } = await useFetch("/api/warehouse/item", {
  laze: false,
  transform: (items) => {
    return items.filter(
      (el) => el.location === "project" && el.locationID === +route.params.id
    );
  },
});

// CHECK FUNC
const isRelated = (obj) => {
  if (sessionUser && obj) {
    // console.log(obj)
    // console.log(sessionUser)
    if (
      obj.creator === sessionUser.value.id ||
      (obj.curatorType === "user" && obj.curator === sessionUser.value.id) ||
      (obj.partnerType === "user" && obj.partnerID === sessionUser.value.id) ||
      (band.value &&
        band.value.sharers.find(
          (el) => el.userType === "user" && el.userID === sessionUser.value.id
        ))
    ) {
      return true;
    } else if (
      obj.sharers &&
      obj.sharers.find(
        (el) => el.sharerType === "user" && el.sharerID === sessionUser.value.id
      )
    ) {
      return true;
    }
    // else if (band.value && band.value.sharers.find(el => el.userType === 'user' && el.userID === sessionUser.value.id)) {
    //   console.log(band.value)
    //   return true
    // }
    else if (sessionUser.value.role === "SUPER_ADMIN") {
      return true;
    }
  }
};

onBeforeMount(async () => {
  // PROJECTS
  project.value = projects.value.find((item) => item.id == route.params.id);
  // BANDS
  band.value = bands.value.find((band) => band.id === project.value.bandID);
});

onMounted(async () => {

  // CHECK if session user is not ine the band, but in sharer of project...
  if (
    band.value &&
    band.value.sharers.find(
      (el) => el.userType === "user" && el.userID === sessionUser.value.id
    )
  ) {
    return;
  } else {
    if (
      project.value.sharers &&
      project.value.sharers.find(
        (el) => el.sharerType === "user" && el.sharerID === sessionUser.value.id
      )
    ) {
      titles.value = [...titles.value].filter((el) => !(el.name === "balance"));
    }
  }
});
</script>

<template>
  <Container>
    <div v-if="project">
      <!-- <h1 style="margin-top: 5rem;">Проект {{ $route.params.id }}</h1> -->
      <h1 style="margin-top: 5rem">{{ project.title }}</h1>
      <p>
        Вид работ: <span>{{ project.workType }}</span>
      </p>
      <p>
        Адрес: <span>{{ project.address }}</span>
      </p>

      <div>
        Проект:
        <p>{{ project }}</p>
      </div>
      <!-- Заголовок - переключатель / toggle title-->
      <div class="toggle-title">
        <div
          v-for="(title, index) in titles.filter((el) => {
            if (el.guard && isRelated(project)) {
              return el;
            } else if (!el.guard) {
              return el;
            }
          })"
          class="switch-title_el"
        >
          <input
            type="radio"
            :id="`${index}_el`"
            :value="title.name"
            v-model="currentTitle"
          />
          <label :for="`${index}_el`">
            <h2>{{ title.title }}</h2>
          </label>
        </div>
      </div>

      <!-- SCHEDULE -->
      <div v-if="currentTitle === 'schedule'">
        <div class="schedule_container">
          <div>Ничего нет</div>
        </div>
      </div>

      <!-- DEMANDS -->
      <div v-if="currentTitle === 'demands'">
        <div class="demands_container">
          <div>Ничего нет</div>
        </div>
      </div>

      <!-- SHARERS -->
      <div v-if="currentTitle === 'sharers'">
        <!-- container -->
        <div class="sharers_container">
          <!-- project.sharers -->
          <div v-if="project.sharers">
            <!-- sharer -->
            <div v-for="sharer in project.sharers">
              {{ sharer }}
            </div>
          </div>
          <!-- else -->
          <div v-else>Ничего нет</div>
        </div>
      </div>

      <!-- ТМЦ на проекте -->
      <div v-if="currentTitle === 'warehouse-items'">
        <!-- container -->
        <div class="warehouse-items_container">
          <div v-if="items.length">
            <div v-for="(item, index) in items" :key="index">
              {{ item }}
            </div>
          </div>
          <div v-else>
            <p style="margin: 0">Ничего нет</p>
          </div>
        </div>
        <!-- { "id": 159, "uuid": "ac07b3c9-c0f2-45dc-a400-b6005d70c098", "title": "Щит опалубочный 1200х3000", "type": "stuff", "qty": 1, "measure": "шт.", "location": "project", "locationID": 1, "position": null, "serial": null, "productionDate": null, "ownerID": 1, "ownerType": "company", "responsible": 1, "created_at": "2024-05-29T04:46:12.000Z", "update_at": "2024-05-29T04:46:11.784Z" } -->
      </div>

      <!-- BALANCE -->
      <div v-if="currentTitle === 'balance'">
        <div class="balance_container">
          <div>Ничего нет</div>
        </div>
      </div>
    </div>
  </Container>
</template>

<style scoped>
/* TOGGLE TITLE */
.toggle-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: scroll;
  scrollbar-width: none;
  border-bottom: 1px solid var(--bs-tertiary-color);
  padding-bottom: 1rem;
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

.schedule_container,
.demands_container,
.sharers_container,
.warehouse-items_container,
.balance_container {
  margin-top: 1rem;
}
@media screen and (max-width: 575px) {
  .toggle-title {
    margin-top: 1rem;
    /* margin: 1rem 1rem 0 1rem; */
    padding: unset !important;
    border: unset;
  }
  .switch-title_el:first-child {
    margin-left: 1rem;
  }
  .schedule_container,
  .demands_container,
  .sharers_container,
  .warehouse-items_container,
  .balance_container {
    margin: 0 1rem;
  }
}
@media screen and (min-width: 576) and (max-width: 767px) {
  .switch-title_el:first-child {
    margin-left: unset;
  }
  .toggle-title {
    padding-left: unset !important;
    /* padding-left: 0.5rem; */
    padding-right: 0.5rem;
  }
}

@media screen and (max-width: 767px) {
  .toggle-title {
    /* padding-left: 0.5rem; */
    padding-right: 0.5rem;
  }
}
</style>
