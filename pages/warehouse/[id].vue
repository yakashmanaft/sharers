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

onMounted(async () => {
  //
  items.value = await getItems();
  item.value = items.value.find((item: any) => item.id == route.params.id);

  itemLocations.value = items.value.filter((element) => {
    if(element.type === 'stuff' && element.title === item.value.title) {
      return element
    }
  })
});

// const { data: projects } = useLazyAsyncData("projects", () =>
//   $fetch("@/api/projects/projects")
// );
// console.log(projects)

const locationLinkColorized = (location: string, id: number) => {

  if (location) {

    if(+route.params.id === id) {
      return `link_${location} link_current-route`;
    } else {
      return `link_${location}`
    }
  }
};

const translateLocation = (id: any, location: string) => {
  return `${location} ${id}`
}

//
/**
 * @desc Get warehouse items from BD
 */
async function getItems() {
  return await $fetch("/api/warehouse/item");
}
</script>

<template>
  <Container>
    <p style="margin-top: 5rem">тмц #{{ $route.params.id }}</p>

    <div v-if="item">
      <div style="display: flex; flex-direction: column;">

        <h1>{{ item.title }}</h1>
        <!-- {{ projects }} -->
          <!-- Материалы -->
          <div v-if="item.type === 'stuff'" style="margin-top: 1rem; display: flex; gap: 1rem;">
            <!-- Показать динамически места, в которых есть данный материал. Стили как в общем списке ТЦ. По клику переходим на ТМЦ по выбранному месту. Выделить текущее местоположение выбранного ТМЦ --> 
            <div v-if="itemLocations.length > 1">
              <span class="link link-location">
                Всего ()
              </span>
            </div>
            <div v-for="(location, i) in itemLocations" :key="i">

            <router-link :to="`${location.id}`" style="text-decoration: none;">
              <span
                class="link link-location"
                :class="`${locationLinkColorized(location.location, location.id)}`"
              >
                {{ translateLocation(location.locationID, location.location) }} ({{ location.qty }} {{ location.measure }})
              </span>
            </router-link>
          </div>
        </div>
      </div>
      <!-- из warehouse page - warehouseCategories - перенести в store, чтобы можно было дергать сразу переведенный текст -->
      <br>
      <h2>{{ item.type }}</h2>

      <!-- Инструмент -->
      <div v-if="item.type === 'tools'">
        <ul>
          <li>Серийник (если есть)</li>
          <li>Описание?</li>
        </ul>
      </div>

      <!-- Материалы -->
      <div v-if="item.type === 'consumables'">
        РАСХОДНИКИ
      </div>
      <!-- Техника -->
      <div v-if="item.type === 'technic'">
        ТЕХНИКА
      </div>
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
.link-location {
  padding: 4px 10px;
  border-radius: 16px;
}
.link:hover {
  cursor: pointer;
}
.link_project {
  color: var(--bs-success);
  border: 1px solid var(--bs-success-bg-subtle);
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
  border: 1px solid var(--bs-warning-bg-subtle);
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
</style>
