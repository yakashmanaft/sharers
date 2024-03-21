<script lang="ts" setup>
import { Container } from "@/shared/container";

import { H3Error } from "h3";
import { v4 as uuidv4 } from "uuid";
import { onMounted } from "vue";

// const projects = [
//   {
//     id: 1,
//     title: "Машзавод",
//     address: "г. Пермь, ул. Новозвягинская, д. 57",
//     partner: 'ООО "РусРазвитие"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Бетонные работы",
//     completion: 0.15,
//   },
//   {
//     id: 2,
//     title: "Машзавод",
//     address: "г. Пермь, ул. Новозвягинская, д. 57",
//     partner: 'ООО "Атом Строй"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Бетонные работы",
//     completion: 0.78,
//   },
//   {
//     id: 3,
//     title: "Монолит G14 THULE",
//     address: "г. Пермь, ул. Горького, д. 14",
//     partner: 'ООО "СупеПупер"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Бетонные работы",
//     completion: 0.1,
//   },
//   {
//     id: 4,
//     title: "Вилла",
//     address: "г. Пермь, ул. Утренняя, д. 11",
//     partner: 'ООО "СупеПупер"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Реализация дизайн проекта",
//     completion: 0.55,
//   },
//   {
//     id: 5,
//     title: "Клиника",
//     address: "г. Пермь, ул. Мильчакова, д. 18",
//     partner: 'ООО "СупеПупер"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Реализация дизайн проекта",
//     completion: 0.32,
//   },
//   {
//     id: 6,
//     title: "Машзавод",
//     address: "г. Пермь, ул. Новозвягинская, д. 57",
//     partner: 'ООО "РусРазвитие"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Бетонные работы",
//     completion: 0.66,
//   },
//   {
//     id: 7,
//     title: "Машзавод",
//     address: "г. Пермь, ул. Новозвягинская, д. 57",
//     partner: 'ООО "Атом Строй"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Бетонные работы",
//     completion: 0.13,
//   },
//   {
//     id: 8,
//     title: "Горького, 14",
//     address: "г. Пермь, ул. Горького, д. 14",
//     partner: 'ООО "СупеПупер"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Бетонные работы",
//     completion: 0.85,
//   },
//   {
//     id: 9,
//     title: "Вилла",
//     address: "г. Пермь, ул. Утренняя, д. 11",
//     partner: 'ООО "СупеПупер"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Реализация дизайн проекта",
//     completion: 1,
//   },
//   {
//     id: 10,
//     title: "Клиника",
//     address: "г. Пермь, ул. Мильчакова, д. 18",
//     partner: 'ООО "СупеПупер"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Реализация дизайн проекта",
//     completion: 1,
//   },
//   {
//     id: 11,
//     title: "Горького, 14",
//     address: "г. Пермь, ул. Горького, д. 14",
//     partner: 'ООО "СупеПупер"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Бетонные работы",
//     completion: 0.15,
//   },
//   {
//     id: 12,
//     title: "Вилла",
//     address: "г. Пермь, ул. Утренняя, д. 11",
//     partner: 'ООО "СупеПупер"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Реализация дизайн проекта",
//     completion: 0.45,
//   },
//   {
//     id: 13,
//     title: "Офис",
//     address: "г. Пермь, ул. Героев Хасана, д. 48 корп. 1, офис 201",
//     partner: 'ООО "Камини"',
//     creator: "Игорь Александрович Смирнягин",
//     workType: "Офис",
//     completion: 0.37,
//   },
// ];

useHead({
  title: "Мои проекты",
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

const {
  pending,
  error,
  refresh,
  data: projects,
  status,
} = useFetch("api/projects/projects", {
  lazy: false,
});

// tmp project item
const project = ref({
  uuid: null,
  title: null,
  address: null,
  partner: null,
  creator: null,
  workType: null,
  completion: null,
});

onMounted(async () => {
  refresh();
});

async function addProject(project) {
  let addedProject = null;

  if (project) {
    addedProject = await $fetch("api/projects/projects", {
      method: "POST",
      body: {
        uuid: uuidv4(),
        title: project.title,
        address: project.address,
        partner: project.partner,
        creator: project.creator,
        workType: project.workType,
        completion: project.completion,
      },
    });

    // refetching
    refresh();
  }
}
</script>
<template>
  <Container>
    <h1>Проекты</h1>

    <!-- fetch data is error -->
    <div v-if="error">
      <p>Error Code {{ error.statusCode }}</p>
      <p>Error Message {{ error.message }}</p>
    </div>

    <!-- <span>{{ projects.length }}</span> -->

    <br />
    <form>
      <div class="mb-3">
        <label for="projectTitle" class="form-label">Title</label>
        <input
          v-model="project.title"
          type="text"
          class="form-control"
          id="projectTitle"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="projectAddress" class="form-label">Address</label>
        <input
          v-model="project.address"
          type="text"
          class="form-control"
          id="projectAddress"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="projectPartner" class="form-label">Partner</label>
        <input
          v-model="project.partner"
          type="number"
          class="form-control"
          id="projectPartner"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="projectCreator" class="form-label">Creator</label>
        <input
          v-model="project.creator"
          type="number"
          class="form-control"
          id="projectCreator"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="projectWorkType" class="form-label">Work Type</label>
        <input
          v-model="project.workType"
          type="string"
          class="form-control"
          id="projectWorkType"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="projectCompletion" class="form-label">Completion</label>
        <input
          v-model="project.completion"
          type="number"
          class="form-control"
          id="projectCompletion"
          aria-describedby="nameHelp"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        @click.prevent="addProject(project)"
      >
        Add project
      </button>
    </form>

    <div v-if="pending">
      <p>Loading...</p>
    </div>
    <div class="projects-container" v-else>
      <!-- Нумерация проектов: несколько первых необходимо определить под технические (ремонт технники или инструмента )  -->
      <div
        class="projects-item"
        v-for="(project, index) in projects"
        :key="index"
        @click="$router.push(`/projects/${project.id}`)"
      >
        <h2>{{ project.title }}</h2>
        <p>{{ project.address }}</p>
        <p>{{ project.workType }}</p>
        <p>{{ project.partner }}</p>
        <div class="completion-container">
          <span>{{ (project.completion * 100).toFixed(0) }}%</span>
        </div>
      </div>
    </div>
  </Container>
</template>

<style scoped>
.projects-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
}
.projects-item {
  box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.3s;
  position: relative;
}
.projects-item:hover {
  cursor: pointer;
  box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.3);
}

.completion-container {
  width: 2rem;
  height: 2rem;
  background-color: gray;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}
.completion-container span {
  font-size: 12px;
}
</style>
