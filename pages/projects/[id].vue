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

onMounted(async () => {
  //
  projects.value = await getProjects();
  project.value = projects.value.find((item) => item.id == route.params.id);
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
</script>

<template>
  <Container>
    <h1>Проект #{{ $route.params.id }}</h1>

    <div>
      <p>{{ project }}</p>
    </div>
  </Container>
</template>
