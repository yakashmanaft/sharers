<template>
  <!-- https://www.youtube.com/watch?v=3MPlTDgQaaE -->
  <Container>
    <!-- Modal EDIT USER???-->
    <div
      class="modal fade"
      id="userEditModal"
      tabindex="-1"
      aria-labelledby="userEditModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="userEditModalLabel">Edit user</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- SURNAME -->
            <div class="mb-3">
              <label for="editedUserSurname" class="form-label">Фамилия</label>
              <input
                v-model="editedUser.surname"
                type="text"
                class="form-control"
                id="editedUserSurname"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- NAME -->
            <div class="mb-3">
              <label for="editedUserName" class="form-label">Имя</label>
              <input
                v-model="editedUser.name"
                type="text"
                class="form-control"
                id="editedUserName"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- Отчество -->
            <div class="mb-3">
              <label for="editedUserMiddleName" class="form-label"
                >Отчество</label
              >
              <input
                v-model="editedUser.middleName"
                type="text"
                class="form-control"
                id="editedUserMiddleName"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- Role -->
            <div class="mb-3">
              <label for="editedUserRole" class="form-label"
                >Role в сервисе</label
              >
              <input
                v-model="editedUser.role"
                type="text"
                class="form-control"
                id="editedUserRole"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- GROUP ID -->
            <div class="mb-3">
              <label for="editedUserGroupID" class="form-label"
                >groupID (1 - Камини, 2 - банда Славы)</label
              >
              <input
                v-model="editedUser.groupID"
                type="number"
                class="form-control"
                id="editedUserGroupID"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- User Status In Group -->
            <div class="mb-3">
              <label for="editedUserStatusInGroup" class="form-label"
                >Status in Group (foreman - бригадир, sectionForeman - начальник
                участка, worker - рабочий, leader - лидер), projectManager -
                менеджер проекта (снабжение)</label
              >
              <input
                v-model="editedUser.groupStatus"
                type="text"
                class="form-control"
                id="editedUserStatusInGroup"
                aria-describedby="nameHelp"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="editUser(editedUser)"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- РАЗОБРАТЬСЯ КАК РЕНДЕРИТЬ ОШИБКУ ЧТО ЛИ... -->
    <!-- <div
      v-if="error"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <strong>Error:</strong> Delete Error
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-lebel="Close"
        @click="error = null"
      ></button>
    </div> -->
    <h1>Соучастники</h1>

    <!-- FORMS ADD SMTHNG -->
    <div style="display: flex; gap: 2rem; margin-top: 2rem">
      <!-- Форма добавления соучастника (у кого права создания будут?) -->
      <form>
        <h2>Add User</h2>
        <!-- Фамилия -->
        <div class="mb-3">
          <label for="userSurname" class="form-label">Фамилия</label>
          <input
            v-model="user.surname"
            type="text"
            class="form-control"
            id="userSurname"
            aria-describedby="nameHelp"
          />
        </div>
        <!-- ИМЯ -->
        <div class="mb-3">
          <label for="userName" class="form-label">Имя</label>
          <input
            v-model="user.name"
            type="text"
            class="form-control"
            id="userName"
            aria-describedby="nameHelp"
          />
        </div>
        <!-- Отчество -->
        <div class="mb-3">
          <label for="userMiddleName" class="form-label">Отчество</label>
          <input
            v-model="user.middleName"
            type="text"
            class="form-control"
            id="userMiddleName"
            aria-describedby="nameHelp"
          />
        </div>
        <!-- Role in WEB SERVICE -->
        <div class="mb-3">
          <label for="userRole" class="form-label">Role в сервисе</label>
          <input
            v-model="user.role"
            type="text"
            class="form-control"
            id="userRole"
            aria-describedby="nameHelp"
          />
        </div>
        <!-- GROUP ID -->
        <div class="mb-3">
          <label for="userGroupID" class="form-label"
            >groupID (1 - Камини, 2 - банда Славы)</label
          >
          <input
            v-model="user.groupID"
            type="number"
            class="form-control"
            id="userGroupID"
            aria-describedby="nameHelp"
          />
        </div>
        <!-- USER STATUS IN GROUP -->
        <div class="mb-3">
          <label for="userStatusInGroup" class="form-label"
            >Status in Group (foreman - бригадир, sectionForeman - начальник
            участка, worker - рабочий, leader - лидер), projectManager -
            менеджер проекта (снабжение)</label
          >
          <input
            v-model="user.groupStatus"
            type="text"
            class="form-control"
            id="userStatusInGroup"
            aria-describedby="nameHelp"
          />
        </div>
        <div class="mb-3">
          <label for="userEmail" class="form-label">Email</label>
          <input
            v-model="user.email"
            type="text"
            class="form-control"
            id="userEmail"
            aria-describedby="nameHelp"
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          @click.prevent="addUser(user)"
        >
          Add User
        </button>
      </form>
      <!-- Форма добавления компании -->
      <form>
        <h2>Add Company</h2>
        <div class="mb-3">
          <label for="userName" class="form-label">Название</label>
          <input
            v-model="company.title"
            type="text"
            class="form-control"
            id="userName"
            aria-describedby="nameHelp"
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          @click.prevent="addCompany(company)"
        >
          Add Company
        </button>
      </form>
    </div>

    <!-- Отображение списка соучастников -->
    <!-- fetch data is error -->
    <div v-if="error">
      <p>Error Code {{ error.statusCode }}</p>
      <p>Error Message {{ error.message }}</p>
    </div>

    <!-- data is loading -->
    <div v-if="pending">
      <p>Loading...</p>
    </div>

    <!-- data is loaded -->
    <div v-else>
      <!-- USERS -->
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">User</th>
            <th scope="col">Group | Status</th>
            <th scope="col">Email</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td scope="col">{{ index + 1 }}</td>
            <td scope="col">
              <span @click="$router.push(`/partners/${user.id}`)" class="link">
                {{ user.surname }} {{ user.name }} {{ user.middleName }} |
                {{ user.role }}
              </span>
            </td>
            <td scope="col">
              {{ translateGroupData(user.groupID, user.groupStatus) }}
            </td>
            <td scope="col">{{ user.email }}</td>
            <td scope="col">
              <!-- Button trigger edit user modal -->
              <button
                type="button"
                class="btn btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#userEditModal"
                @click="
                  {
                    editedUser.id = user.id;
                    editedUser.surname = user.surname;
                    editedUser.name = user.name;
                    editedUser.middleName = user.middleName;
                    editedUser.role = user.role;
                    editedUser.groupID = user.groupID;
                    editedUser.groupStatus = user.groupStatus;
                  }
                "
              >
                Edit
              </button>
            </td>
            <td scope="col">
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="deleteUser(user.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ORGANIZATIONS -->
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Банда</th>
            <th scope="col">uuid</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(companyItem, index) in companies">
            <td scope="col">{{ index + 1 }}</td>
            <td scope="col">
              <span
                @click="$router.push(`/organizations/${companyItem.id}`)"
                class="link"
              >
                {{ companyItem.title }}
              </span>
            </td>
            <td scope="col">{{ companyItem.uuid }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Container>
</template>

<script setup>
import { Container } from "@/shared/container";

import { H3Error } from "h3";
import { v4 as uuidv4 } from "uuid";

// Шаблон нового user'a
const user = ref({
  uuid: null,
  email: null,
  password: "Anfalov123[eq",
  name: null,
  middleName: null,
  surname: null,
  groupID: 0,
  groupStatus: null,
  role: "USER",
});

const company = ref({
  uuid: null,
  title: null,
});

// const error = ref(null);
const editedUser = ref({
  id: 0,
  uuid: null,
  email: null,
  password: null,
  name: null,
  middleName: null,
  surname: null,
  groupID: null,
  groupStatus: null,
  role: null,
});
onMounted(() => {
  // users.value = await getUsers()
  refresh();
  refreshCompanies();
});

// const refreshCompanies = () => refreshNuxtData("companies");
/**
 * @desc Get users
 */
// async function getUsers() {
//     return await $fetch('api/users')
// }
const {
  pending,
  refresh,
  data: users,
  error,
} = useFetch("api/usersList/users", {
  lazy: false,
});

const { refresh: refreshCompanies, data: companies } = await useLazyFetch(
  "api/organizations/organizations"
);
// const { data: companies } = useFetch("api/organizations/organizations", {
//   lazy: false,
// });
// watch(companies, (newData) => {
//   console.log(newData);
// });

/**
 * @desc Add user
 * @param user The user to add
 */
async function addUser(user) {
  let addedUser = null;

  if (user) console.log(user);
  addedUser = await $fetch("api/usersList/users", {
    method: "POST",
    body: {
      uuid: uuidv4(),
      email: user.email,
      password: user.password,
      name: user.name,
      middleName: user.middleName,
      surname: user.surname,
      groupID: user.groupID,
      groupStatus: user.groupStatus,
      role: user.role,
    },
  });

  // if (addedUser) users.value = await getUsers();
  if (addedUser) refresh();
}

async function addCompany(company) {
  let addedCompany = null;

  if (company)
    addedCompany = await $fetch("api/organizations/organizations", {
      method: "POST",
      body: {
        uuid: uuidv4(),
        title: company.title,
      },
    });

  if (addedCompany) refreshCompanies();
}

/**
 * @desc Delete users
 */
async function deleteUser(id) {
  let deletedUserOrError = null;
  // id = 'aoaoaoao'

  if (id)
    deletedUserOrError = await $fetch("api/usersList/users", {
      method: "DELETE",
      body: {
        id: id,
      },
    });

  if (deletedUserOrError instanceof H3Error) {
    error.value = deletedUserOrError;
    console.log("error: ", error);
    return;
  }

  // users.value = await getUsers();
  refresh();
}

/**
 * @desc Edit user
 * @param user The user to add
 */
async function editUser(editedUser) {
  let user = null;

  if (editedUser.id && editedUser.name)
    user = await $fetch("api/usersList/users", {
      method: "PUT",
      body: {
        id: editedUser.id,
        surname: editedUser.surname,
        name: editedUser.name,
        middleName: editedUser.middleName,
        role: editedUser.role,
        groupID: editedUser.groupID,
        groupStatus: editedUser.groupStatus,
      },
    });

  // if (user) users.value = await getUsers();
  if (user) refresh();
}

// translate
const translateGroupData = (groupID, groupStatus) => {
  if (companies.value) {
    if (!groupID) {
      return `Одиночка`;
    } else {
      let group = companies.value.find((company) => company.id === groupID);
      // return `${groupID} | ${groupStatus}`
      return `${group.title} | ${groupStatus}`;
    }
  }
};

useHead({
  title: "Соучастники",
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
</script>

<style scoped>
.link {
  cursor: pointer;
}
</style>
