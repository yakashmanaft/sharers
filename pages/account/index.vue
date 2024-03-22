<template>
  <Container>
    <h1>Аккаунт</h1>

    <!-- fetch data is error -->
    <div v-if="error">
      <p>Error Code {{ error.statusCode }}</p>
      <p>Error Message {{ error.message }}</p>
    </div>

    <!-- УПРАВЛЕНИЕ locations -->
    <div>
      <!-- ADD NEW LOCATION MODAL -->
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#newLocationModal"
      >
        Создать location
      </button>

      <!-- Modal -->
      <div
        class="modal fade"
        id="newLocationModal"
        tabindex="-1"
        aria-labelledby="newLocationModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <form class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="newLocationModalLabel">
                Новый location
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
                <label for="locationTitle" class="form-label">Название</label>
                <input
                  v-model="location.title"
                  type="text"
                  class="form-control"
                  id="locationTitle"
                  aria-describedby="nameHelp"
                />
              </div>
              <!-- TYPE -->
              <div class="mb-3">
                <label for="locationType" class="form-label"
                  >Type ( sklad | office | repair )</label
                >
                <input
                  v-model="location.type"
                  type="text"
                  class="form-control"
                  id="locationType"
                  aria-describedby="nameHelp"
                />
              </div>
              <!-- ADDRESS -->
              <div class="mb-3">
                <label for="locationAddress" class="form-label">Address</label>
                <input
                  v-model="location.address"
                  type="text"
                  class="form-control"
                  id="locationAddress"
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
                @click="clearModalInputs(location)"
              >
                Отменить
              </button>
              <button
                type="button"
                id="createNewProjectBtn"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                :disabled="createNewLocationBtnIsDisabled"
                @click="addLocation(location)"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- waiting for a data -->
      <div v-if="pending">
        <p>Loading...</p>
      </div>

      <!-- Data is fetched -->
      <div v-else>
        <!-- список locations -->
        <div style="margin-top: 2rem">
          <h3>Locations</h3>

          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">title</th>
                <th scope="col">type</th>
                <th scope="col">address</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(location, index) in locations" :key="index">
                <td scope="col">{{ index + 1 }}</td>
                <td scope="col">{{ location.title }}</td>
                <td scope="col">{{ location.type }}</td>
                <td scope="col">{{ location.address }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { Container } from "@/shared/container";

import { H3Error } from "h3";
import { v4 as uuidv4 } from "uuid";

useHead({
  title: "Аккаунт",
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

// УПРАВЛЕНИЕ locations
const {
  pending,
  error,
  refresh,
  data: locations,
  status,
} = useFetch("/api/locations/locations", {
  laze: false,
});

const location = ref({
  uuid: null,
  title: null,
  type: null,
  address: null,
});

onMounted(async () => {
  refresh();
});

// Добавляем новый location
// флаг disabled для кнопки submit
const createNewLocationBtnIsDisabled = ref(true);

async function addLocation(location) {
  let addedLocation = null;

  if (location.title && location.type && location.address) {
    addedLocation = await $fetch("api/locations/locations", {
      method: "POST",
      body: {
        uuid: uuidv4(),
        title: location.title,
        type: location.type,
        address: location.address,
      },
    });
  }

  // clear all inputs in modal
  clearModalInputs(location);

  // refetching
  refresh();
}

const clearModalInputs = (location: any) => {
  location.uuid = null;
  location.title = null;
  location.type = null;
  location.address = null;
};

// Check before submit creating new location
watch(location.value, () => {
  if (location.value.title && location.value.type && location.value.address) {
    createNewLocationBtnIsDisabled.value = false;
  } else {
    createNewLocationBtnIsDisabled.value = true;
  }
});
</script>

<style scoped></style>
