<template>
  <!-- https://www.youtube.com/watch?v=3MPlTDgQaaE -->
  <Container style="padding-top: 5rem">
    <!-- Modal EDIT USER-->
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
            <!-- Телефон -->
            <div class="mb-3">
              <label for="editedUserPhone" class="form-label">Мобильный</label>
              <input
                v-model="editedUser.phone"
                type="phone"
                class="form-control"
                id="editedUserPhone"
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
            <!-- User Status In Group -->
            <!-- <div class="mb-3">
              <label for="editedUserStatusInGroup" class="form-label"
                >Status in Group (foreman - бригадир, sectionForeman - начальник
                участка, worker - рабочий, leader - лидер), projectManager -
                менеджер проекта (снабжение), hrOfficer (Кадровик), accountant -
                бухгалтер, marketolog - маркетолог</label
              >
              <input
                v-model="editedUser.groupStatus"
                type="text"
                class="form-control"
                id="editedUserStatusInGroup"
                aria-describedby="nameHelp"
              />
            </div> -->
            <!--  -->
            <div class="mb-3">
              <label class="form-label">Модули</label>
              <div class="access-module_container">
                <!-- Подключены соучастнику -->
                <div
                  class="access-module_el"
                  v-for="(item, idx) in editedUser.accessModules"
                >
                  <input
                    type="checkbox"
                    :id="`edited-module-${idx}`"
                    :name="`edited-module-${idx}`"
                    :value="item"
                    v-model="editedUser.accessModules"
                  />
                  <label :for="`edited-module-${idx}`">
                    {{ translateModuleName(item.name) }}
                  </label>
                </div>

                <!-- Какие еще есть в сервисе и не подключены у соучастника -->
                <div
                  class="access-module_el"
                  v-for="(el, id) in accessModulesArray.filter((el) => {
                    let modulesNames = [];
                    editedUser.accessModules.forEach((item) =>
                      modulesNames.push(item.name)
                    );

                    if (modulesNames.includes(el.name)) {
                      return;
                    } else {
                      return el;
                    }
                  })"
                >
                  <input
                    type="checkbox"
                    :id="`add-module-${id}`"
                    :name="`add-module-${id}`"
                    :value="{
                      name: el.name,
                      accessTo: '',
                      accessFrom: today,
                    }"
                    v-model="editedUser.accessModules"
                  />
                  <label :for="`add-module-${id}`">
                    {{ el.translate }}
                  </label>
                </div>
              </div>
              <!-- {{ editedUser.accessModules }} -->
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

    <!-- MODAL CREATE USER -->
    <div
      class="modal fade"
      id="userCreateModal"
      tabindex="-1"
      aria-labelledby="userCreateModal"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h1>Добавить соучастника</h1>

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
            <!-- ТЕЛЕФОН -->
            <div class="mb-3">
              <label for="userPhone" class="form-label">Мобильный</label>
              <input
                v-model="user.phone"
                type="text"
                class="form-control"
                id="userPhone"
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
            <!-- USER STATUS IN GROUP -->
            <!-- <div class="mb-3">
              <label for="userStatusInGroup" class="form-label"
                >Status in Group (foreman - бригадир, sectionForeman - начальник
                участка, worker - рабочий, leader - лидер), projectManager -
                менеджер проекта (снабжение), hrOfficer (Кадровик), accountant -
                бухгалтер, marketolog - маркетолог</label
              >
              <input
                v-model="user.groupStatus"
                type="text"
                class="form-control"
                id="userStatusInGroup"
                aria-describedby="nameHelp"
              />
            </div> -->
            <!--  -->
            <div class="mb-3">
              <label class="form-label">Модули</label>
              <div class="access-module_container">
                <div
                  class="access-module_el"
                  v-for="(item, idx) in accessModulesArray"
                >
                  <input
                    type="checkbox"
                    :id="`module-${idx}`"
                    :name="`module-${idx}`"
                    :value="{
                      name: item.name,
                      accessTo: '',
                      accessFrom: today,
                    }"
                    v-model="user.accessModules"
                  />
                  <label :for="`module-${idx}`">{{ item.translate }}</label>
                </div>
              </div>

              <!-- {{ user.accessModules }} -->
            </div>
            <!-- EMAIL -->
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
            <!-- PASSWORD -->
            <div class="mb-3">
              <label for="userEmail" class="form-label">Password</label>
              <input
                v-model="user.password"
                type="text"
                class="form-control"
                id="userEmail"
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
              Отмена
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              :disabled="createUserBtnIsDisabled"
              @click.prevent="checkAndAddUser(user)"
            >
              Добавить соучастника
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL CREATE COMPANY -->
    <div
      class="modal fade createModal"
      id="companyCreateModal"
      tabindex="-1"
      aria-labelledby="companyCreateModal"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h1>Добавить банду</h1>
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
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Отмена
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              :disabled="createCompanyBtnIsDisabled"
              @click.prevent="checkAndCreateCompany(company)"
            >
              Добавить банду
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

    <!-- TOGGLE TITLE -->
    <div class="toggle-title">
      <div v-for="(title, i) in titles" class="switch-title_el">
        <input
          type="radio"
          :id="i"
          :value="title.name"
          v-model="currentTitle"
        />
        <label :for="i"
          ><h1>{{ title.title }}</h1></label
        >
      </div>
    </div>

    <!-- BTNS OPEN MODAL CREATE -->
    <div style="display: flex; align-items: center; gap: 1rem">
      <!-- КНОПКА СОЗДАТЬ Банду NeeD TO CHOOSE ROLE WITH ACCES -->
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#userCreateModal"
        v-if="sessionUser.role === 'SUPER_ADMIN' && currentTitle === 'sharers'"
      >
        Соучастник +
      </button>

      <!-- КНОПКА СОЗДАТЬ ПОЛЬЗОВАТЕЛЯ if user session role === 'SUPER_ADMIN' -->
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#companyCreateModal"
        v-if="currentTitle === 'organizations'"
      >
        Банда +
      </button>
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
      <div v-if="currentTitle === 'sharers'" class="partners_container">
        <!-- Search -->
        <div class="partners-search_wrapper">
          <input
            type="text"
            class="form-control"
            placeholder="Поиск по фамилии"
            v-model="searchInput"
          />
          <Icon
            name="ic:baseline-search"
            size="24px"
            color="var(--bs-body-color)"
          />
        </div>

        <!-- list -->
        <div class="partners-list_wrapper">
          <!-- Если ничего не найдено -->
          <div>
            <div v-if="searchInput && !computedUsers.length">
              По запросу ничего не найдено
            </div>
          </div>

          <!-- Список пользователей -->
          <div
            class="list_item"
            v-for="(user, index) in computedUsers"
            :key="index"
          >
            <!--  -->
            <div>
              <!-- ФИО -->
              <div class="item_name">
                <p
                  class="link"
                  style="margin: 0"
                  @click="$router.push(`/partners/${user.id}`)"
                >
                  <span style="font-weight: bold">{{ user.surname }}</span>
                  {{ user.name }} {{ user.middleName }}
                </p>
                <!-- accessed modules fo users -->
                <div style="display: flex; flex-direction: column">
                  <div
                    v-for="moduleObj in user.accessModules"
                    style="font-size: 0.8rem"
                    v-if="sessionUser.role === 'SUPER_ADMIN'"
                  >
                    {{ moduleObj }}
                  </div>
                </div>
              </div>
            </div>

            <!-- ATCTION ICONS -->
            <div class="item_icons" v-if="sessionUser.role === 'SUPER_ADMIN'">
              <!-- EDIT -->
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#userEditModal"
                @click="
                  {
                    editedUser.id = user.id;
                    editedUser.surname = user.surname;
                    editedUser.name = user.name;
                    editedUser.middleName = user.middleName;
                    editedUser.phone = user.phone;
                    editedUser.role = user.role;
                    editedUser.accessModules = user.accessModules;
                  }
                "
              >
                <!-- editedUser.groupStatus = user.groupStatus; -->
                <Icon
                  class="item_icon icon_edit"
                  name="material-symbols-light:edit-note-outline-rounded"
                  size="28px"
                />
              </button>
              <!-- DELETE -->
              <button type="button" @click="deleteUser(user.id)">
                <Icon
                  class="item_icon icon_delete"
                  name="material-symbols-light:delete-forever-outline-rounded"
                  size="28px"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ORGANIZATIONS -->
      <div v-if="currentTitle === 'organizations'" class="partners_container">
        <!-- Search -->
        <div class="partners-search_wrapper">
          <input
            type="text"
            class="form-control"
            placeholder="Поиск названию"
            v-model="searchOrganizationsInput"
          />
          <Icon
            name="ic:baseline-search"
            size="24px"
            color="var(--bs-body-color)"
          />
        </div>

        <!-- LIST -->
        <div class="partners-list_wrapper">
          <!-- Если ничего не найдено -->
          <div>
            <div
              v-if="searchOrganizationsInput && !computedOrganizations.length"
            >
              По запросу ничего не найдено
            </div>
          </div>

          <!-- Список -->
          <div
            v-for="(companyItem, index) in computedOrganizations"
            class="list_item"
          >
            <!-- Наименование -->
            <div class="org_label">
              <p @click="$router.push(`/organizations/${companyItem.id}`)">
                {{ companyItem.title }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- <table v-if="currentTitle === 'organizations'" class="table">
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
      </table> -->
    </div>
  </Container>
</template>

<script setup>
import { Container } from "@/shared/container";
//
import { H3Error } from "h3";
import { v4 as uuidv4 } from "uuid";

const sessionUser = useUserSession().user;
const router = useRouter();

//
const today = ref(new Date());

const accessModulesArray = ref([
  {
    name: "projects",
    translate: "Проекты",
  },
  {
    name: "warehouse",
    translate: "Склад",
  },
  {
    name: "demands",
    translate: "Заявки",
  },
  // {
  //   name: "location",
  //   translate: "Места"
  // },
  {
    name: "banks",
    translate: "Банки",
  },
  {
    name: "funds",
    translate: "Фонды",
  },
]);

// Шаблон нового user'a
const user = ref({
  uuid: null,
  email: null,
  password: null,
  name: null,
  middleName: null,
  surname: null,
  phone: null,
  accessModules: [],
  // groupStatus: null,
  role: "USER",
});

const company = ref({
  uuid: null,
  title: null,
  // ownerID: sessionUser.id
});

// const error = ref(null);
const editedUser = ref({
  id: 0,
  uuid: null,
  email: null,
  password: null,
  name: null,
  middleName: null,
  phone: null,
  surname: null,
  accessModules: [],
  // groupStatus: null,
  role: null,
});

//
const createCompanyBtnIsDisabled = ref(true);
const createUserBtnIsDisabled = ref(true);

// choosen title
const titles = ref([
  {
    title: "Соучастники",
    name: "sharers",
  },
  {
    title: "Банды",
    name: "organizations",
  },
]);
const currentTitle = ref("sharers");

const searchInput = ref("");
const searchOrganizationsInput = ref("");

// accessed modules
const tempModulesArray = ref([]);

onMounted(() => {
  // users.value = await getUsers()
  refresh();
  refreshCompanies();

  // reset inputs in modals
  // companies
  const createCompanyModalEl = document.getElementById("companyCreateModal");
  if (createCompanyModalEl) {
    createCompanyModalEl.addEventListener("hidden.bs.modal", (event) => {
      // company.value = {
      //   uuid: null,
      //   title: null
      // }
      company.value.title = null;
    });
  }
  // users
  const createUserModalEl = document.getElementById("userCreateModal");
  if (createUserModalEl) {
    createUserModalEl.addEventListener("hidden.bs.modal", (event) => {
      user.value.uuid = null;
      user.value.email = null;
      user.value.password = null;
      user.value.name = null;
      user.value.middleName = null;
      user.value.surname = null;
      user.value.phone = null;
      user.value.accessModules = [];
      // user.value.groupStatus = null;
      user.value.role = "USER";
    });
  }
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
  transform: (users) => {
    return users
      .sort((x, y) => {
        if (x.surname < y.surname) {
          return -1;
        }

        if (x.surname > y.surname) {
          return 1;
        }
      })
      .map((user) => {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          middleName: user.middleName,
          surname: user.surname,
          phone: user.phone,
          role: user.role,
          accessModules: user.accessModules,
          // groupStatus: user.groupStatus,
          // created_at: user.created_at,
          // update_at: user.update_at,
        };
      });
  },
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

// COMPUTED
const computedUsers = computed(() =>
  // {
  searchInput.value === ""
    ? users.value
    : users.value.filter((user) =>
        user.surname
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(searchInput.value.toLowerCase().replace(/\s+/g, ""))
      )
);
const computedOrganizations = computed(() =>
  searchOrganizationsInput.value === ""
    ? companies.value
    : companies.value.filter((company) =>
        company.title
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(
            searchOrganizationsInput.value.toLowerCase().replace(/\s+/g, "")
          )
      )
);

/**
 * @desc Add user
 * @param user The user to add
 */
async function checkAndAddUser(user) {
  let compareUser = users.value.find(
    (e) =>
      e.email === user.email &&
      // e.password === user.password &&
      e.name === user.name &&
      e.middleName === user.middleName &&
      e.surname === user.surname
    // e.phone === user.phone
    // e.accessModules === user.accessModules && тут такто массив...
    // e.groupStatus === user.groupStatus &&
    // e.role === user.role
  );
  if (compareUser) {
    alert("Соучастник уже есть");
  } else {
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
          phone: user.phone,
          accessModules: user.accessModules,
          // groupStatus: user.groupStatus,
          role: user.role,
        },
      });

    // if (addedUser) users.value = await getUsers();
    if (addedUser) refresh();
    createUserBtnIsDisabled.value = true;
  }
}

async function checkAndCreateCompany(company) {
  let compareCompany = companies.value.find((e) => e.title === company.title);

  if (compareCompany) {
    alert("Банда с таким именем уже существует!");
  } else {
    let addedCompany = null;

    let sharers = [];
    // sharers.push({
    //   userID: sessionUser.value.id,
    //   userType: 'user'
    // })

    if (company && sessionUser)
      addedCompany = await $fetch("api/organizations/organizations", {
        method: "POST",
        body: {
          uuid: uuidv4(),
          title: company.title,
          ownerID: sessionUser.value.id,
          sharers: sharers,
        },
      });
    // reset company comst

    // refresh list
    if (addedCompany) refreshCompanies();
    // company.value = {
    //   uuid: null,
    //   title: null
    // };
    // addedCompany = null
    // company = null
    // createCompanyBtnIsDisabled.value = true
  }
}

// router push functions

/**
 * @desc Delete users
 */
async function deleteUser(id) {
  let isUserReady = confirm("Точно удалить пользователя?");

  if (isUserReady) {
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
  } else {
    return;
  }
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
        phone: editedUser.phone,
        role: editedUser.role,
        accessModules: editedUser.accessModules,
        // groupStatus: editedUser.groupStatus,
      },
    });

  // if (user) users.value = await getUsers();
  if (user) refresh();
}

// TRANSLATE
const translateModuleName = (name) => {
  if (accessModulesArray.value) {
    let accessModule = [...accessModulesArray.value].find(item => item.name === name)
    return accessModule.translate
  } else {
    return name;
  }
};

// WATHERS

watch(company.value, () => {
  // console.log(company.value.title);
  if (company.value.title) {
    createCompanyBtnIsDisabled.value = false;
  } else {
    createCompanyBtnIsDisabled.value = true;
  }
});
watch(user.value, () => {
  // console.log(user.value);
  if (
    user.value.email &&
    user.value.password &&
    user.value.name &&
    // user.value.middleName &&
    user.value.surname &&
    user.value.phone &&
    user.value.phone.length === 12 &&
    // user.value.groupStatus !== null &&
    user.value.accessModules.length > 0 &&
    user.value.role
  ) {
    createUserBtnIsDisabled.value = false;
  } else {
    createUserBtnIsDisabled.value = true;
  }
});
watch(editedUser.value, () => {
  // let modulesArray = editedUser.value.accessModules
  // let modulesNames = []
  // modulesArray.forEach(item => modulesArray.push(item.name))
  // console.log(tempModulesArray.value)
});

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
.link:hover {
  color: var(--bs-primary);
}
.mt-1rem {
  margin-top: 1rem;
}

/* toggle title */
.toggle-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.switch-title_el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}

.switch-title_el label h1 {
  color: var(--bs-tertiary-color);
}
.switch-title_el label h1:hover {
  cursor: pointer;
}

.switch-title_el input[type="radio"]:checked + label h1 {
  color: unset;
}

/* SEARCH */
.partners-search_wrapper {
  position: relative;
  /* align-self: flex-start;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between !important; */
}

.partners-search_wrapper input {
  padding-left: 2.2rem;
}

.partners-search_wrapper svg {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0.5rem;
}

/* PARTNERS LIST */
.partners_container {
  margin-top: 1rem;
}
.partners-search_wrapper {
}
.partners-list_wrapper {
  margin-top: 1rem;
}
.list_item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin: 1rem 0; */
  padding: 1rem;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.2);
}
.list_item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.item_name {
}
.org_label {
  display: flex;
  gap: 0.3rem;
}
.org_label p {
  margin: 0;
  font-weight: bold;
}
.org_label:hover p {
  color: var(--bs-primary);
  cursor: pointer;
}
/* .org_desc {

}
.org_desc p {
  margin: 0;
} */
/* .org_label, */
.item_group {
  margin-top: 0.5rem;
  display: inline-block;
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 16px;
  border: unset;
}
/* .org_label,  */
/* .item_group-w-group {
  background-color: var(--bs-primary);
  color: var(--bs-body-bg);
} */
/* .item_group-wo-group {
  background-color: var(--bs-secondary-bg);
} */
.item_icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.item_icons button {
  background-color: unset;
  padding: unset;
  border: unset;
}
.item_icon {
  color: var(--bs-primary);
}
.item_icon:hover {
  cursor: pointer;
}
.item_icon:hover.icon_edit {
  color: var(--bs-warning);
}
.item_icon:hover.icon_delete {
  color: var(--bs-danger);
}

/* ACCESS MODULE BTNs */
.access-module_container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
}
.access-module_el label {
  text-align: center;
  width: 100%;
  padding: 4px 16px;
  background-color: var(--bs-primary-bg-subtle);
}
.access-module_el input[type="checkbox"]:checked + label {
  background-color: var(--bs-primary);
  color: var(--bs-body-bg);
}
.access-module_el label:hover {
  cursor: pointer;
}
.access-module_el input[type="checkbox"] {
  opacity: 0;
  position: fixed;
  width: 0;
}

@media screen and (max-width: 575px) {
  .item_icons {
    gap: 0.2rem;
  }
  .partners-search_wrapper {
    margin: 0.5rem;
  }
  .toggle-title {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
}
@media screen and (max-width: 767px) {
  .show-max-767 {
    display: none;
  }
  .toggle-title {
    margin-top: -1rem;
  }
}
@media screen and (min-width: 768px) {
  .toggle-title {
    margin-top: 1rem;
  }
}
</style>
