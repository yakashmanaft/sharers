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
// const router = useRouter();
//
// const users = ref(null);
// const user = ref(null);
//
const projects = ref(null);
const project = ref(null);

// ТМЦ
const items = ref([])

// тмц организации
// items.value = items.value.filter(
//   (item) =>
//     item.location === 'project' && item.locationID === project.value.id
// );

onMounted(async () => {
  //
  projects.value = await getProjects();
  project.value = projects.value.find((item) => item.id == route.params.id);

  //
  items.value = await getItems();
  items.value = items.value.filter(
    (el) => el.location === "project" && el.locationID === project.value.id
  );
});
/**
 * @desc Get users
 */
// async function getUsers() {
//   return await $fetch("/api/usersList/users");
// }
/**
 * @desc Get projects
 */
async function getProjects() {
  return await $fetch("/api/projects/projects");
}
async function getItems() {
  return await $fetch("/api/warehouse/item");
}
</script>

<template>
  <Container>
    <div v-if="project">
      <!-- <h1 style="margin-top: 5rem;">Проект {{ $route.params.id }}</h1> -->
      <h1 style="margin-top: 5rem">Проект "{{ project.title }}"</h1>
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

      <!-- ТМЦ на проекте -->
      <div>
        <!--  -->
        <h2>ТМЦ</h2>
        <!--  -->
        <div v-if="items.length">
          <div v-for="(item, index) in items" :key="index">
            {{ item }}
          </div>
        </div>
        <!-- { "id": 159, "uuid": "ac07b3c9-c0f2-45dc-a400-b6005d70c098", "title": "Щит опалубочный 1200х3000", "type": "stuff", "qty": 1, "measure": "шт.", "location": "project", "locationID": 1, "position": null, "serial": null, "productionDate": null, "ownerID": 1, "ownerType": "company", "responsible": 1, "created_at": "2024-05-29T04:46:12.000Z", "update_at": "2024-05-29T04:46:11.784Z" } -->
        <div v-else>Ничего нет</div>
      </div>
    </div>
  </Container>
</template>
