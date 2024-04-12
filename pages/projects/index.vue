<script lang="ts" setup>
import { Container } from "@/shared/container";

import { H3Error } from "h3";
import { v4 as uuidv4 } from "uuid";

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
  partnerID: null,
  partnerType: null,
  creator: null,
  curator: null,
  workType: null,
  completion: null,
});

const { users } = storeToRefs(useUsersStore());
const { loadData } = useUsersStore();

const { data: organizations } = useLazyAsyncData("organizations", () =>
  $fetch("api/organizations/organizations")
);
const refreshOrganizations = () => refreshNuxtData("organizations");

onMounted(async () => {
  refresh();
  await refreshOrganizations();
  await loadData();
});

// *********** ДОБАВЛЯЕМ New Project newProjectModal ***********
// флаг disabled для кнопки submit
const createNewProjectBtnIsDisabled = ref(true);

async function addProject(project) {
  let addedProject = null;

  if (
    project.title &&
    project.address &&
    project.partnerID &&
    project.partnerType &&
    project.creator &&
    project.curator &&
    project.workType &&
    project.completion
  ) {
    addedProject = await $fetch("api/projects/projects", {
      method: "POST",
      body: {
        uuid: uuidv4(),
        title: project.title,
        address: project.address,
        partnerID: project.partnerID,
        partnerType: project.partnerType,
        creator: project.creator,
        curator: project.curator,
        workType: project.workType,
        completion: project.completion,
      },
    });

    // clear all inputs in modal
    clearModalInputs(project);

    // refetching
    refresh();
  }
}

//
const clearModalInputs = (project: any) => {
  project.uuid = null;
  project.title = null;
  project.address = null;
  project.partnerID = null;
  project.partnerType = null;
  project.creator = null;
  project.curator = null;
  project.workType = null;
  project.completion = null;
};

//
const translateCurator = (curatorID: number) => {
  if (curatorID) {
    let curator = users.value.find((user) => user.id === curatorID);
    return `${curator?.surname} ${curator?.name[0]}. ${curator?.middleName[0]}`;
  }
  // return curatorID
};

const translatePartner = (partnerID, partnerType) => {
  if (partnerID) {
    if (partnerType === "user") {
      let userItem = users.value.find((item) => item.id === partnerID);
      return `${userItem?.surname} ${userItem?.name[0]}. ${userItem?.middleName[0]}.`;
    } else if (partnerType === "company" && organizations.value) {
      let organizationItem = organizations.value.find(
        (item) => item.id === partnerID
      );
      return `${organizationItem.title}`;
    }
  }
};

// Check before submit creating new project
watch(project.value, () => {
  if (
    project.value.title &&
    project.value.address &&
    project.value.partnerID &&
    project.value.partnerType &&
    project.value.creator &&
    project.value.curator &&
    project.value.workType &&
    project.value.completion
  ) {
    createNewProjectBtnIsDisabled.value = false;
  } else {
    createNewProjectBtnIsDisabled.value = true;
  }
});
</script>
<template>
  <Container>
    <h1 style="margin-top: 5rem">Проекты</h1>

    <!-- fetch data is error -->
    <div v-if="error">
      <p>Error Code {{ error.statusCode }}</p>
      <p>Error Message {{ error.message }}</p>
    </div>

    <!-- ADD NEW PROJECT MODAL -->
    <!-- Button trigger modal -->
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#newProjectModal"
    >
      Создать
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="newProjectModal"
      tabindex="-1"
      aria-labelledby="newProjectModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <form class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="newProjectModalLabel">
              Новый проект
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- TITLE -->
            <div class="mb-3">
              <label for="projectTitle" class="form-label"
                >Название проекта</label
              >
              <input
                v-model="project.title"
                type="text"
                class="form-control"
                id="projectTitle"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- ADDRESS -->
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
            <!-- PARTNER TYPE-->
            <div class="mb-3">
              <label for="projectPartnerType" class="form-label"
                >Partner Type (user | company)</label
              >
              <input
                v-model="project.partnerType"
                type="text"
                class="form-control"
                id="projectPartnerType"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- PARTNER ID -->
            <div class="mb-3">
              <label for="projectPartnerID" class="form-label">PartnerID</label>
              <input
                v-model="project.partnerID"
                type="number"
                class="form-control"
                id="projectPartnerID"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- CREATOR -->
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
            <!-- CURATOR -->
            <div class="mb-3">
              <label for="projectCurator" class="form-label"
                >Curator (user id)</label
              >
              <input
                v-model="project.curator"
                type="number"
                class="form-control"
                id="projectCurator"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- WORK TYPE -->
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
            <!-- COMPLETION -->
            <div class="mb-3">
              <label for="projectCompletion" class="form-label"
                >Completion</label
              >
              <input
                v-model="project.completion"
                type="number"
                class="form-control"
                id="projectCompletion"
                aria-describedby="nameHelp"
              />
            </div>
          </div>

          <!-- MODAL FOOTER -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="clearModalInputs(project)"
            >
              Отменить
            </button>
            <button
              type="button"
              id="createNewProjectBtn"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              :disabled="createNewProjectBtnIsDisabled"
              @click="addProject(project)"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="pending">
      <p>Loading...</p>
    </div>

    <div v-else class="projects_container">
      <div
        v-for="(project, index) in projects"
        :key="index"
        class="project-item_container"
        @click="$router.push(`/projects/${project.id}`)"
      >
        <div class="project-item_left">
          <div class="project-completion">
            <span>{{ (project.completion * 100).toFixed(0) }}%</span>
          </div>
          <div>
            <h2>{{ project.title }}</h2>
            <span class="project-address"
              >{{ project.address }} | {{ project.workType }}</span
            >
          </div>
        </div>
        <div class="project-item_right">
          <span>Куратор проекта: {{ translateCurator(project.curator) }}</span>
          <span
            >Заказчик:
            {{ translatePartner(project.partnerID, project.partnerType) }}</span
          >
        </div>
      </div>
    </div>

    <br />
    <br />
    <br />
    <br />
  </Container>
</template>

<style scoped>
.projects_container {
  margin-top: 2rem;
}
.project-item_container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.2);
  /* margin-top: 1rem; */
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in;
}
.project-item_container h2 {
  margin: 0;
}

.project-item_container:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.project-item_left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.project-item_right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.project-item_right span,
.project-address {
  color: rgba(0, 0, 0, 0.6);
}

.project-completion {
  min-width: 3rem;
  min-height: 3rem;
  background-color: #b1e3c1;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
