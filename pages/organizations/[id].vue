<template>
  <Container>
    <h1>Банда #{{ $route.params.id }}</h1>

    <div>
      <p>{{ organization }}</p>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { Container } from "@/shared/container";

useHead({
  title: "Банда # ",
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

const route = useRoute();

const organizations = ref(null);
const organization = ref(null);

onMounted(async () => {
  organizations.value = await getOrganizations();
  organization.value = organizations.value.find(
    (company) => company.id == route.params.id
  );
});

async function getOrganizations() {
  return await $fetch("/api/organizations/organizations");
}
</script>

<style scoped></style>
