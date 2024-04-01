<template>
  <Container>
    <h1>Аккаунт</h1>

    <!-- fetch data is error -->
    <div v-if="error">
      <p>Error Code {{ error.statusCode }}</p>
      <p>Error Message {{ error.message }}</p>
    </div>

    <div>
      <!-- MODALS -->
      <div style="display: flex; gap: 2rem">
        <!-- ADD NEW LOCATION MODAL -->
        <div>
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
                    <label for="locationTitle" class="form-label"
                      >Название (отображается в списке ТМЦ на складе)</label
                    >
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
                  <!-- LOCATION OWNER ID -->
                  <div class="mb-3">
                    <label for="locationOwnerID" class="form-label"
                      >Owner ( 0 &null - не в базе | 1 & company - Камини | 2
                      &company - Банда Славы )</label
                    >
                    <input
                      v-model="location.ownerID"
                      type="number"
                      class="form-control"
                      id="locationOwnerID"
                      aria-describedby="nameHelp"
                    />
                  </div>
                  <!-- LOCATION OWNER TYPE -->
                  <div class="mb-3">
                    <label for="locationOwnerType" class="form-label"
                      >Owner ( user | company )</label
                    >
                    <input
                      v-model="location.ownerType"
                      type="number"
                      class="form-control"
                      id="locationOwnerType"
                      aria-describedby="nameHelp"
                    />
                  </div>
                  <!-- ADDRESS -->
                  <div class="mb-3">
                    <label for="locationAddress" class="form-label"
                      >Address</label
                    >
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
        </div>

        <!-- ADD NEW WORK TYPE MODAL -->
        <div>
          <!-- Button trigger modal -->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#newWorkTypeModal"
          >
            Добавить новый вид работ
          </button>

          <!-- Modal -->
          <div
            class="modal fade"
            id="newWorkTypeModal"
            tabindex="-1"
            aria-labelledby="newWorkTypeModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <form class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="newWorkTypeModalLabel">
                    Новый вид работ
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">123</div>
              </form>
            </div>
          </div>
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
                <th scope="col">Собственник</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(location, index) in locations" :key="index">
                <td scope="col">{{ index + 1 }}</td>
                <td scope="col">{{ location.title }}</td>
                <td scope="col">{{ location.type }}</td>
                <td scope="col">{{ location.address }}</td>
                <td scope="col">
                  <span
                    class="link"
                    @click="onClickOwner(location.ownerID, location.ownerType)"
                  >
                    {{ translateOwner(location.ownerID, location.ownerType) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- список видов работ -->
        <div style="margin-top: 2rem">
          <h3>Виды работ / прайс</h3>
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

//
const router = useRouter();

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
  ownerID: null,
  ownerType: null,
});

const { users } = storeToRefs(useUsersStore());
const { loadData } = useUsersStore();
const { data: organizations } = useLazyAsyncData("organizations", () =>
  $fetch("/api/organizations/organizations")
);
const refreshOrganizations = () => refreshNuxtData("organizations");

onMounted(async () => {
  refresh();
  // data from store
  await loadData();
  refreshOrganizations();
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
        ownerID: location.ownerID,
        ownerType: location.ownerType,
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
  location.ownerID = null;
  location.ownerType = null;
};

// translates
const translateOwner = (ownerID: number, ownerType: string) => {
  if (ownerID && ownerType && users.value && organizations.value) {
    if (ownerType === "user") {
      let userItem = users.value.find((item) => item.id === ownerID);
      return `${userItem?.surname} ${userItem?.name[0]}. ${userItem?.middleName[0]}`;
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

// OnClick event
const onClickOwner = (ownerID: number, ownerType: string) => {
  if (ownerID && ownerType) {
    if (ownerType === "user") {
      router.push(`/partners/${ownerID}`);
    } else if (ownerType === "company") {
      router.push(`/organizations/${ownerID}`);
    }
  } else if (ownerID === 0 && !ownerType) {
    alert("Сторонний контакт. Не является соучастником.");
  }
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

<style scoped>
.link {
  cursor: pointer;
}
</style>
