<script lang="ts" setup>
import { onMounted } from "vue";
import { Container } from "@/shared/container";

useHead({
  title: `Склад | Соучастники`,
  meta: [
    {
      name: "description",
      content: "My Description",
    },
  ],
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
//
const items = ref(null);
const item = ref(null);
const itemLocations = ref(null);
const projects = ref(null);
const locations = ref(null);
//
const linkAllIsActive = ref(false);

onMounted(async () => {
  //
  projects.value = await getProjects();
  items.value = await getItems();
  locations.value = await getLocations();
  item.value = items.value.find((item: any) => item.id == route.params.id);

  itemLocations.value = items.value.filter((element) => {
    if (element.type === "stuff" && element.title === item.value.title) {
      return element;
    }
  });
});

// const { data: projects } = useLazyAsyncData("projects", () =>
//   $fetch("@/api/projects/projects")
// );
// console.log(projects)

const locationLinkColorized = (location: string, id: number) => {
  if (location) {
    if (+route.params.id === id) {
      if (!linkAllIsActive.value) {
        return `link_${location} link_current-route`;
      } else {
        return `link_${location}`;
      }
    } else {
      return `link_${location}`;
    }
  }
};

const translateLocation = (id: any, location: string) => {
  if (location && id) {
    // PROJECTS
    if (location === "project") {
      if (projects.value) {
        let project = projects.value.find((project) => project.id == id);
        return project.title;
      }
    }

    // SKLAD (location)
    else if (location === "sklad") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return locationItem.title;
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

    // REPAIR (locations)
    else if (location === "repair") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return `Ремонт: ${locationItem.title}`;
      }
    }

    // ARCHIVE
    else if (location === "archive") {
      return `Архив`;
    }

    // DELETED
    else if (location === "deleted") {
      return "Списание";
    }

    // ELSE location
    else {
      return alert(
        "warehouse :id.vue error - strange object.location in translateLocation function"
      );
    }
  } else {
    alert("warehouse :id.vue translateLocation function error");
  }
  return location;
};

//
/**
 * @desc Get warehouse items from BD
 */
async function getItems() {
  return await $fetch("/api/warehouse/item");
}

async function getProjects() {
  return await $fetch("/api/projects/projects");
}

async function getLocations() {
  return await $fetch("/api/locations/locations");
}

// sum items qty
const sumItemsQty = () => {
  if (items.value && item.value) {
    let filtered = items.value.filter((el) => {
      if (el.title === item.value.title && el.measure === item.value.measure) {
        return el;
      }
    });

    return 1;
  }
};
</script>

<template>
  <Container>
    <!-- <p style="margin-top: 5rem">тмц #{{ $route.params.id }}</p> -->

    <!-- {{projects}} -->
    <!--  -->

    <div v-if="item" style="margin-top: 7rem">
      <div
        style="display: flex; flex-direction: column; justify-content: center"
      >
        <h1>{{ item.title }}</h1>
        <!-- {{ linkAllIsActive }} -->
        <p style="margin: 0">
          Мера: <span>{{ item.measure }}</span>
        </p>
        <!-- {{ projects }} -->
        <!-- Материалы -->
        <div v-if="item.type === 'stuff'" class="item-locations_block">
          <!-- Показать динамически места, в которых есть данный материал. Стили как в общем списке ТЦ. По клику переходим на ТМЦ по выбранному месту. Выделить текущее местоположение выбранного ТМЦ -->
          <div
            class="link link-location link-all link-all_block"
            :class="{ 'link-all_active': linkAllIsActive }"
            v-if="itemLocations.length > 1"
            @click="linkAllIsActive = true"
          >
            <span> Всего</span>
            <span class="item-location_qty">{{ sumItemsQty() }}</span>
          </div>
          <div v-for="(location, i) in itemLocations" :key="i">
            <router-link
              class="link link-location"
              :class="`${locationLinkColorized(
                location.location,
                location.id
              )}`"
              @click="linkAllIsActive = false"
              :to="`${location.id}`"
              style="
                text-decoration: none;
                display: flex;
                justify-content: center;
                align-items: center;
                height: inherit;
              "
            >
              <span>
                {{ translateLocation(location.locationID, location.location) }}
              </span>
              <span class="item-location_qty">{{ location.qty }}</span>
            </router-link>
          </div>
        </div>

        <!-- Если прсомотреть хочется по всем объектам общую инфу по предмету -->
        <div v-if="linkAllIsActive">
          <p>Показываем данные со всех объектов</p>
          {{ linkAllIsActive }}
        </div>
      </div>
      <!-- из warehouse page - warehouseCategories - перенести в store, чтобы можно было дергать сразу переведенный текст -->
      <br />
      <h2>{{ item.type }}</h2>

      <!-- Инструмент -->
      <div v-if="item.type === 'tools'">
        <ul>
          <li>Серийник (если есть)</li>
          <li>Описание?</li>
        </ul>
      </div>

      <!-- Материалы -->
      <div v-if="item.type === 'consumables'">РАСХОДНИКИ</div>
      <!-- Техника -->
      <div v-if="item.type === 'technic'">ТЕХНИКА</div>
      <br />
      {{ item }}
      <ul style="list-style: none; padding: 0">
        <li>
          <div>
            <h2>История</h2>

            <ul style="list-style: none; padding: 0">
              <li style="display: flex; align-items: center; gap: 1rem">
                <div>2024-03-23T13:54:12.000Z</div>
                <div>"Склад на Бригадирской" (Камини собственник)</div>
                <div>---></div>
                <div>"Склад на Бригадирской" (Камини собственник)</div>
                <div>Анфалов С.В.</div>
              </li>
              <li style="display: flex; align-items: center; gap: 1rem">
                <div>{{ item.created_at }}</div>
                <div>
                  Добавлен на "Склад на Бригадирской" (Камини собственник)
                </div>
                <div>Анфалов С.В.</div>
              </li>
            </ul>
          </div>
        </li>
        <br />
        <li>Стоимость закупа (руб.)</li>
        <li>Ценность (руб.)</li>
      </ul>
    </div>
  </Container>
</template>

<style scoped>
.link {
  text-wrap: nowrap;
}
.item-locations_block {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.item-locations_block::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.item-location_qty {
  margin-left: 5px;
  margin-right: -6px;
  background-color: #fff;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  color: var(--bs-dark);
}
.link-location {
  padding: 4px 10px;
  border-radius: 16px;
}
.link-all_block {
  display: flex;
  align-items: center;
  justify-content: center;
}
.link-all {
  padding: 0;
  padding: 4px 10px;
  border-radius: 16px;
  background-color: var(--bs-dark-bg-subtle);
}
.link-all_active {
  color: #fff;
  background-color: var(--bs-dark);
}
.link:hover {
  cursor: pointer;
}
.link_project {
  color: var(--bs-success);
  /* border: 1px solid var(--bs-success-bg-subtle); */
  background-color: var(--bs-success-bg-subtle);
}
.link_sklad {
  color: white;
  border: none;
  background-color: var(--bs-primary-bg-subtle);
}
.link_office {
  color: white;
  border: none;
  background-color: var(--bs-primary-bg-subtle);
}
.link_repair {
  color: var(--bs-warning);
  /* border: 1px solid var(--bs-warning-bg-subtle); */
  background-color: var(--bs-warning-bg-subtle);
}
.link_archive {
  color: var(--bs-dark-bg-subtle);
  border: none;
}
.link_deleted {
  color: var(--bs-danger-bg-subtle);
  border: none;
}
.link_current-route {
  color: red;
}

.link_project.link_current-route {
  color: #fff;
  background-color: var(--bs-success);
  border-color: var(--bs-success);
}
.link_sklad.link_current-route {
  color: #fff;
  background-color: var(--bs-primary);
  border: none;
}
.link_office.link_current-route {
  color: #fff;
  background-color: var(--bs-primary);
  border: none;
}
.link_repair.link_current-route {
  color: #fff;
  background-color: var(--bs-warning);
  border: none;
}
</style>
