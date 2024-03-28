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
            <input
              v-model="editedUser.name"
              type="text"
              class="form-control"
              id="exampleInputName1"
              aria-describedby="nameHelp"
            />
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

    <!-- Форма добавления соучастника (у кого права создания будут?) -->
    <form>
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
      <div class="mb-3">
        <label for="userRole" class="form-label">Role</label>
        <input
          v-model="user.role"
          type="text"
          class="form-control"
          id="userRole"
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
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">User</th>
            <th scope="col">Email</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td scope="col">{{ index + 1 }}</td>
            <td @click="$router.push(`/partners/${user.id}`)">
              {{ user.surname }} {{ user.name }} {{ user.middleName }} |
              {{ user.role }}
            </td>
            <td>{{ user.email }}</td>
            <td>
              <!-- Button trigger edit user modal -->
              <button
                type="button"
                class="btn btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#userEditModal"
                @click="
                  {
                    editedUser.id = user.id;
                    editedUser.name = user.name;
                  }
                "
              >
                Edit
              </button>
            </td>
            <td>
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
  role: "USER",
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
  role: null,
});
onMounted(async () => {
  // users.value = await getUsers()
  await refresh();
});
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

/**
 * @desc Add user
 * @param user The user to add
 */
async function addUser(user) {
  let addedUser = null;

  if (user)
    addedUser = await $fetch("api/usersList/users", {
      method: "POST",
      body: {
        uuid: uuidv4(),
        email: user.email,
        password: user.password,
        name: user.name,
        middleName: user.middleName,
        surname: user.surname,
        role: user.role,
      },
    });

  // if (addedUser) users.value = await getUsers();
  if (addedUser) refresh();
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
        name: editedUser.name,
        middleName: editedUser.middleName,
        surname: editedUser.surname,
      },
    });

  // if (user) users.value = await getUsers();
  if (user) refresh();
}

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
