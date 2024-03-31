<script lang="ts" setup>
import { Container } from "@/shared/container";

// import { useCurrentUserStore } from '@/stores/auth'

const route = useRoute();
const router = useRouter();
// const store = useCurrentUserStore();

// const users: any = ref(null);

onMounted(async () => {
  //   const { isAuth, isAuthFunc, currentUser, isNotAuthFunc, userFromLS } = store;
  //   if (!isAuth && !currentUser) {
  //     if (
  //       route.fullPath.includes("/dashboard") ||
  //       route.fullPath.includes("/projects") ||
  //       route.fullPath.includes("/partners") ||
  //       route.fullPath.includes("/demands") ||
  //       route.fullPath.includes("/warehouse") ||
  //       route.fullPath.includes("/bonds")
  //     ) {
  //       isNotAuthFunc();
  //     }
  //   }
  //   users.value = await getUsers();
  //   if (users.value) {
  //     let user = users.value.find(
  //       (item: any) => item.uuid === localStorage.getItem("user")
  //     );
  //     // userFromLS(user);
  //     // isAuthFunc();
  //     // console.log(route);
  //   }
});

// const checkIsAuth = () => {
//   const { isAuth } = store;
//   if (isAuth) return true;
//   if (!isAuth) return false;
// };

// const userInfoFunc = () => {
//   const { currentUser }: any = store;

//   return currentUser.name;
// };

// const logout = () => {
//   const { isNotAuthFunc } = store;
//   localStorage.removeItem("isAuth");
//   localStorage.removeItem("user");
//   isNotAuthFunc();
// };

// async function getUsers() {
//   return await $fetch("api/users");
// }
const logout = () => {
  router.replace("/login");
  useAuthStore().clear();
};

// const onClickRegister = () => {
//   alert("В разработке");
// };
</script>

<template>
  <div class="header-wrapper">
    <Container>
      <div class="header-container">
        <div class="header-shared">
          <router-link to="/" class="header-logo">
            <span>stepbuild.ru</span>
          </router-link>

          <ul v-if="useAuthStore().loggedIn" class="header-features__list">
            <li>
              <router-link to="/dashboard">Доска</router-link>
            </li>
            <li>
              <router-link to="/projects">Проекты</router-link>
            </li>
            <li>
              <router-link to="/partners">Соучастники</router-link>
            </li>
            <li>
              <router-link to="/demands">Заявки</router-link>
            </li>
            <li>
              <router-link to="/warehouse">Склад</router-link>
            </li>
            <li>
              <router-link to="/bonds">bonds chart</router-link>
            </li>
          </ul>
          <ul v-else class="header-features__list" b>
            <li>
              <router-link to="/about">О сервисе</router-link>
            </li>
            <li>
              <router-link to="/policy"
                >Политика конфиденциальности</router-link
              >
            </li>
            <li>
              <router-link to="/contract">Соглашение</router-link>
            </li>
          </ul>
        </div>

        <!-- <div v-if="$auth.loggedIn">
                    Сергей
                    <button>Logout</button>
                </div> -->
        <!-- <div v-if="checkIsAuth()" class="user-login__container">
          <div>{{ userInfoFunc() }}</div>
          <router-link to="/login">Выйти</router-link>
        </div> -->
        <div>
          <!-- <router-link to="/login">Войти</router-link> -->
          <!-- login -->
          <!-- logout -->
          <router-link
            v-if="!useAuthStore().loggedIn && route.name !== 'login'"
            to="/login"
            class="account-btn"
          >
            Войти
          </router-link>

          <!-- <button
            v-if="!useAuthStore().loggedIn && route.name === 'login'"
            @click="onClickRegister"
          >
            Зарегистрироваться
          </button> -->

          <!-- IF LOGGED IN -->
          <div v-if="useAuthStore().loggedIn" class="account-container">
            <!-- LOGOUT BTN -->
            <div class="account-btn" @click="logout()">Выйти</div>
            <span>|</span>
            <!-- ACCOUNT -->
            <router-link to="/account" class="account-info_block">
              <p>Анфалов С.В.</p>
              <Icon name="material-symbols-light:account-circle" size="36px" />
            </router-link>

          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.header-wrapper {
  position: fixed;
  top: 0;
  width: 100%;
  /* background-color: var(--bs-primary-bg-subtle);  */
  box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  z-index: 99;
}
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}
.header-shared {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.header-logo {
  text-decoration: none;
}
.header-features__list {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0;
  margin: 0;
}
.header-features__list li a {
  text-decoration: none;
}
.user-login__container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.account-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.account-container a{
  text-decoration: none;
}
.account-container p {
  margin: 0;
}
.account-info_block {
  display: flex;
  align-items: center;
}
.account-btn {
  text-decoration: none;
  cursor: pointer;
}
</style>
