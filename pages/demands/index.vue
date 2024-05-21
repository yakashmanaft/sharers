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
const demands = ref([
  {
    id: 1,
    created_At: "2024.02.19",
    updated_At: "2024.02.21",
    title: "Заявка #001",
    status: "research",
    deliveryDate: "",
    type: "building-materials",
    creatorID: 3,
    responserID: 15,
    locationType: "office",
    locationID: 1,
  },
  {
    id: 2,
    created_At: "2024.02.22",
    updated_At: "2024.02.24",
    title: "Заявка #002",
    status: "picking",
    deliveryDate: "",
    type: "building-materials",
    creatorID: 3,
    responserID: 4,
    locationType: "office",
    locationID: 1,
  },
  {
    id: 3,
    created_At: "2024.02.23",
    updated_At: "2024.02.25",
    title: "Заявка #003",
    status: "delivery",
    deliveryDate: "2024.02.25",
    type: "building-materials",
    creatorID: 2,
    responserID: 1,
    locationType: "project",
    locationID: 6,
  },
  {
    id: 4,
    created_At: "2024.02.24",
    updated_At: "2024.02.25",
    title: "Заявка #004",
    status: "completed",
    deliveryDate: "",
    type: "building-materials",
    creatorID: 1,
    responserID: 3,
    locationType: "project",
    locationID: 4,
  },
  {
    id: 5,
    created_At: "2024.02.24",
    updated_At: "2024.02.25",
    title: "Заявка #004",
    status: "completed",
    deliveryDate: "",
    type: "building-materials",
    creatorID: 1,
    responserID: 3,
    locationType: "project",
    locationID: 1,
  },
  {
    id: 6,
    created_At: "2024.02.24",
    updated_At: "2024.02.25",
    title: "Заявка #004",
    status: "completed",
    deliveryDate: "",
    type: "building-materials",
    creatorID: 1,
    responserID: 15,
    locationType: "sklad",
    locationID: 5,
  },
]);

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
  // console.log(projects)
});

/**
 * @desc Get users
 */
async function getUsers() {
  return await $fetch("api/usersList/users");
}
const refreshProjects = () => refreshNuxtData("projects");
const refreshLocations = () => refreshNuxtData("locations");

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
    // // PROJECT
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
    // ELSE location
    else {
      return alert(
        "demands page index.vue error - strange object.location in translateLocation function"
      );
    }
  } else {
    alert("demands page index.vue translateLocation function error");
  }
  return location;
};
</script>
<template>
  <Container>
    <h1 style="margin-top: 5rem">Заявки</h1>

    <div class="demands_warpper">
      <div
        class="demands_item"
        v-for="(demand, index) in demands"
        :key="index"
        @click="$router.push(`demands/${demand.id}`)"
      >
        <h2>{{ demand.title }}</h2>
        <p>Статус: {{ translateStatus(demand.status) }}</p>
        <p v-if="demand.deliveryDate">{{ demand.deliveryDate }}</p>
        <p>От кого: {{ translateDemandUsers(demand.creatorID) }}</p>
        <p>Кому: {{ translateDemandUsers(demand.responserID) }}</p>
        <p>
          Куда:
          {{ translateLocation(demand.locationID, demand.locationType) }}
        </p>
        <!-- id: 1,
            created_At: '2024.02.19',
            updated_At: '2024.02.21',
            title: 'заявка #001',
            status: 'Проработка',
            type: 'building-materials', -->
      </div>
    </div>
  </Container>
</template>

<style scoped>
.demands_warpper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.demands_item {
  /* border: 1px solid black; */
  transition: all 0.2s ease-in;
}
.demands_item:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
