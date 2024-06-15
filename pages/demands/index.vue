<script setup lang="ts">
import { Container } from "@/shared/container";
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

const demandStatusTypes = ref([
  {
    type: "research",
    title: "Проработка",
  },
  {
    type: "research",
    title: "Проработка",
  },
  {
    type: "picking",
    title: "Комлектация",
  },
  {
    type: "delivery",
    title: "Поставка",
  },
  {
    type: "completed",
    title: "Исполнено",
  },
]);
// const demandType = ref([
//   {
//     type: 'building-materials',
//     title: 'Материалы'
//   }
// ])
const demands = ref([
  {
    id: 1,
    created_At: "2024.02.19",
    updated_At: "2024.02.21",
    deadline: "2024.06.29",
    type: "stuff",
    status: "research",
    deliveryDate: "",
    // type: "building-materials",
    creatorID: 3,
    responserID: 15,
    locationType: "office",
    locationID: 1,
  },
  {
    id: 2,
    created_At: "2024.02.22",
    updated_At: "2024.02.24",
    deadline: "2024.06.29",
    // title: "Заявка #002",
    type: "consumables",
    status: "picking",
    deliveryDate: "",
    // type: "building-materials",
    creatorID: 3,
    responserID: 4,
    locationType: "office",
    locationID: 1,
  },
  {
    id: 3,
    created_At: "2024.02.23",
    updated_At: "2024.02.25",
    deadline: "2024.06.29",
    // title: "Заявка #003",
    type: "stuff",
    status: "delivery",
    deliveryDate: "2024.02.25",
    // type: "building-materials",
    creatorID: 2,
    responserID: 1,
    locationType: "project",
    locationID: 6,
  },
  {
    id: 4,
    created_At: "2024.02.24",
    updated_At: "2024.02.25",
    deadline: "2024.06.29",
    // title: "Заявка #004",
    type: "stuff",
    status: "completed",
    deliveryDate: "2024.02.25",
    // type: "building-materials",
    creatorID: 1,
    responserID: 3,
    locationType: "project",
    locationID: 4,
  },
  {
    id: 5,
    created_At: "2024.02.24",
    updated_At: "2024.02.25",
    deadline: "2024.06.29",
    // title: "Заявка #004",
    type: "tools",
    status: "picking",
    deliveryDate: "",
    // type: "building-materials",
    creatorID: 1,
    responserID: 2,
    locationType: "project",
    locationID: 1,
  },
  {
    id: 6,
    created_At: "2024.02.24",
    updated_At: "2024.02.25",
    deadline: "2024.06.29",
    // title: "Заявка #004",
    type: 'office equipment',
    status: "completed",
    deliveryDate: "",
    // type: "building-materials",
    creatorID: 1,
    responserID: 15,
    locationType: "sklad",
    locationID: 5,
  },
  {
    id: 7,
    created_At: "2024.05.29",
    updated_At: "2024.05.01",
    deadline: "2024.06.29",
    // title: "Заявка #004",
    type: "stuff",
    status: "research",
    deliveryDate: "",
    // type: "tools",
    creatorID: 1,
    responserID: 15,
    locationType: "sklad",
    locationID: 5,
  },
]);

// Категории ТМЦ (пока хардкорно)
const warehouseCategories = ref([
  {
    type: "all",
    name: "Все",
  },
  {
    type: "tools",
    name: "Инструмент",
  },
  {
    type: "stuff",
    name: "Материалы",
  },
  {
    type: "consumables",
    name: "Расходники",
  },
  {
    type: "technic",
    name: "Техника",
  },
  {
    type: "office equipment",
    name: "Оргтехника",
  },
]);

// demand filter types
const currentDemandFilterType = ref("all");
const demandFilterTypes = ref([
  {
    name: "all",
    title: "Все",
  },
  {
    name: "author",
    title: "Я автор",
  },
  {
    name: "contractor",
    title: "Я исполнитель",
  },
]);
// Фильтры
const computedDemands = computed(() => {
  if (demands.value.length) {
    if (currentDemandFilterType.value === "all") {
      return demands.value;
    } else if (currentDemandFilterType.value === "author") {
      let filteredDemands = demands.value.filter(
        (demand) => demand.creatorID === useAuthStore().user.id
      );
      return filteredDemands;
    } else if (currentDemandFilterType.value === "contractor") {
      let filteredDemands = demands.value.filter(
        (demand) => demand.responserID === useAuthStore().user.id
      );
      return filteredDemands;
    } else {
      alert("Вы пытаетесь воспользоваться несуществуюющим фильтром :)");
    }
  } else {
    return `А что-о ничего нет...`;
  }
});

const users = ref(null);
// const userCreatorData = ref(null)

const { data: projects } = useLazyAsyncData("projects", () =>
  $fetch("api/projects/projects")
);
const { data: locations } = useLazyAsyncData("locations", () =>
  $fetch("api/locations/locations")
);

onMounted(async () => {
  users.value = await getUsers();
  refreshProjects();
  refreshLocations();
});

/**
 * @desc Get users
 */
async function getUsers() {
  return await $fetch("api/usersList/users");
}
const refreshProjects = () => refreshNuxtData("projects");
const refreshLocations = () => refreshNuxtData("locations");

// Переводчики
const translateDemandUsers = (userID) => {
  if (users.value) {
    let demandUserName;
    users.value.forEach((item) => {
      if (item.id === userID) {
        demandUserName = `${item?.surname} ${item?.name[0]}. ${item.middleName[0]}.`;
      }
    });
    return demandUserName;
  }
};

const translateStatus = (status) => {
  if (demands.value) {
    let translatedString;
    demandStatusTypes.value.forEach((item) => {
      if (item.type === status) {
        translatedString = item.title;
      }
    });

    return translatedString;
  }
};

const translateLocation = (id: any, location: string) => {
  if (location && id) {
    // PROJECT
    if (location === "project") {
      if (projects.value) {
        let project = projects.value.find((project) => project.id == id);
        return project.title;
      }
    }
    // SKLAD (locations)
    else if (location === "sklad") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return `${locationItem.title}`;
      }
    }
    // OFFICE (locations)
    else if (location === "office") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return `${locationItem.title}`;
      }
    }
    //   // ELSE location
    //   else {
    //     return alert(
    //       "demands page index.vue error - strange object.location in translateLocation function"
    //     );
    //   }
    // } else {
    //   alert("demands page index.vue translateLocation function error");
  }
  return location;
};

const translateType = (type: string) => {
  let category = warehouseCategories.value.find(el => el.type === type)
  if(type && category) {
    return category.name
  }
}

// Раскраски
const locationColorized = (location: string) => {
  if (location) {
    return `location_${location}`;
  }
};
</script>
<template>
  <Container style="margin-top: 5rem;">
    <h1 class="show-max-767">Заявки</h1>

    <!-- Фильтры -->
    <div v-if="demandFilterTypes.length">
      <fieldset id="demand-filter-types" class="filter-types_wrapper">
        <div
          class="filter-types_el"
          v-for="(element, index) in demandFilterTypes"
          :key="index"
        >
          <input
            type="radio"
            :id="element.name"
            name="demand-filter-types"
            v-model="currentDemandFilterType"
            :value="element.name"
          />
          <label :for="element.name">{{ element.title }}</label>
        </div>
      </fieldset>
    </div>

    <!-- DEMANDS LIST -->
    <div class="demands_wrapper">
      <div
        class="demands_item"
        v-for="(demand, index) in computedDemands"
        :key="index"
        @click="$router.push(`demands/${demand.id}`)"
      >
        <!-- <h2>{{ translateDemandType(demand.type) }}</h2> -->
        <h2>{{ translateType(demand.type) }}</h2>
        <p>
          Статус: {{ translateStatus(demand.status) }}
          <span v-if="demand.status === 'delivery'">{{
            demand.deliveryDate
          }}</span>
        </p>
        <!-- <p>Автор: {{ translateDemandUsers(demand.creatorID) }}</p> -->
        <!-- <p>Исполнитель: {{ translateDemandUsers(demand.responserID) }}</p> -->
        <p v-if="demand.deadline">Deadline: {{ demand.deadline }}</p>
        <span
          class="location"
          :class="locationColorized(demand.locationType)"
          >{{ translateLocation(demand.locationID, demand.locationType) }}</span
        >
      </div>
    </div>
  </Container>
</template>

<style scoped>
.demands_wrapper {
  display: grid;
  /* grid-template-columns: repeat(5, 1fr); */
  /* gap: 1rem; */
  margin: 1rem auto;
}
.demands_item {
  padding: 1rem;
  transition: all 0.2s ease-in;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
}
.demands_item h2,
.demands_item p {
  margin: 0;
}
.demands_item:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}
.location {
  padding: 4px 10px;
  border-radius: 16px;
  white-space: nowrap;
}
.location:hover {
  cursor: pointer;
}
.location_project {
  color: var(--bs-success);
  border: none;
  background-color: var(--bs-success-bg-subtle);
}
.location_sklad,
.location_office {
  /* color: white; */
  border: none;
  background-color: var(--bs-primary-bg-subtle);
}
.filter-types_wrapper {
  width: 100%;
  overflow-x: auto;
  display: flex;
  gap: 0.2rem;
  align-items: center;
  scrollbar-width: none;
}
.filter-types_wrapper::-webkit-scrollbar {
  display: none;
}
.filter-types_el {
  white-space: nowrap;
  position: relative;
}
.filter-types_el label {
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.15s ease-in;
  padding: 4px 10px;
}
.filter-types_el label:hover {
  background-color: var(--bs-secondary-bg);
}
.filter-types_el input[type="radio"] {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  opacity: 0;
}

.filter-types_el input[type="radio"]:checked + label {
  color: var(--bs-body-bg);
  background-color: var(--bs-body-color);
  border: unset;
  /* border-bottom-left-radius: unset;
  border-bottom-right-radius: unset; */
}
@media screen and (max-width: 575px) {
  .demands_wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and (min-width: 576px) and (max-width: 768px) {
  .demands_wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
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
@media screen and (min-width: 768px) and (max-width: 1199px) {
  .demands_wrapper {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (min-width: 1200px) {
  .demands_wrapper {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
