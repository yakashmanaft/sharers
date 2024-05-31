<template>
  <Container>
    <div v-if="location">
      <h1 style="margin-top: 5rem">{{ location.title }}</h1>

      <div>
        <p>
          Тип:
          <span style="padding: 4px 10px; border-radius: 16px;" :class="locationMarkColorized(location.type)">{{
            translateLocationType(location.type)
          }}</span>
        </p>
        <p>
          Адрес: <span>{{ location.address }}</span>
        </p>

        <p>
          Собственник:
          <span
            style="font-weight: bold"
            class="link_hover"
            @click="routerUsersFunc(location.ownerID, location.ownerType)"
            >{{ translateOwner(location.ownerID, location.ownerType) }}</span
          >
        </p>

        <br />
        <div>
          <p><span>Location: </span>{{ location }}</p>
        </div>

        <!-- ТМЦ -->
        <div>
          <h2>ТМЦ</h2>
          <div v-if="items.length">
            <div
              v-for="(item, index) in items"
              :key="`${item.type}-${item.id}`"
              style="margin-top: 1rem"
            >
              {{ item.title }} | {{ item.type }} | {{ item.qty }}
              {{ item.measure }} | {{ item.ownerType }} {{ item.ownerID }} |
              {{ item.responsible }}
            </div>
          </div>
          <div v-else>Здесь ничего нет</div>
        </div>

        <!-- { "id": 156, "uuid": "cb013f71-b4f0-48ba-a55a-ed0120dd531c", "title": "Доска пола", "type": "stuff", "qty": 150, "measure": "кв. м.", "location": "sklad", "locationID": 5, "position": null, "serial": null, "productionDate": null, "ownerID": 2, "ownerType": "user", "responsible": 2, "created_at": "2024-05-27T19:39:57.000Z", "update_at": "2024-05-29T09:22:43.703Z" } -->
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

//
const route = useRoute();
const router = useRouter();

//
const locations = ref(null);
const location = ref(null);

// Дергаем пользователей из БД с помощью функций из стора
const { users } = storeToRefs(useUsersStore());
const { loadData } = useUsersStore();
//
const organizations = ref(null);
// const usersInBand = ref(null)
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
  //
  await loadData();
  //
  locations.value = await getLocations();
  if (locations.value) {
    location.value = locations.value.find((el) => el.id == route.params.id);
  }

  //
  items.value = items.value.filter(
    (item) =>
      item.location === location.value.type &&
      item.locationID === location.value.id
  );

  organizations.value = await getOrganizations();
});

// РАБОТА С БД
async function getLocations() {
  return await $fetch("/api/locations/locations");
}

async function getAllUsers() {
  return await $fetch("/api/usersList/users");
}

async function getOrganizations() {
  return await $fetch("/api/organizations/organizations");
}

// translations
const translateLocationType = (type) => {
  if (type === "sklad") {
    return "Склад";
  } else if (type === "office") {
    return "Офис";
  } else if (type === "repair") {
    return "Сервисный центр (ремонт)";
  }
};
const translateOwner = (ownerID: number, ownerType: string) => {
  if (ownerID && ownerType && users.value && organizations.value) {
    if (ownerType === "user") {
      let userItem = users.value.find((item) => item.id === ownerID);
      return `${userItem?.surname} ${userItem?.name[0]}. ${userItem?.middleName[0]}.`;
    } else if (ownerType === "company") {
      let organizationItem = organizations.value.find(
        (item) => item.id === ownerID
      );
      return organizationItem.title;
    }
  } else if (ownerID === 0 && !ownerType) {
    return `Не соучастник`;
  }
};

// Router create link
const routerUsersFunc = (ownerID: number, ownerType: string) => {
  if (ownerType === "company") {
    router.push(`/organizations/${ownerID}`);
  } else if (ownerType === "user") {
    router.push(`/partners/${ownerID}`);
  } else {
    alert("Путь не найден (warehouse :id... routerUsersFunc )");
  }
};

// Раскраски
const locationMarkColorized = (location: string) => {
  if (location) {
    return `mark_${location}`;
  }
};
</script>

<style scoped>
.link_hover:hover {
  color: var(--bs-primary);
  cursor: pointer;
}

/* MARK LOCATION COLORIZED */
/* .mark_project {} 
 .mark_archive {}
 .mark_deleted {}
 НА ДАННОЙ СТРАНИЦЕ НЕ ИСПОЛЬЗУЕТСЯ*/

.mark_sklad {
  background-color: var(--bs-primary-bg-subtle);
}
.mark_office {
  background-color: var(--bs-primary-bg-subtle);
}
.mark_repair {
  color: var(--bs-warning);
  background-color: var(--bs-warning-bg-subtle);
}
</style>
