<script lang="ts" setup>
import { Container } from "@/shared/container";
import { watch } from "vue";

const route = useRoute();
const router = useRouter();

const burgerIsOpened = ref(false);

const featuresListAuth = ref([
  {
    path: "/dashboard",
    title: "Доска",
    auth: true,
  },
  {
    path: "/projects",
    title: "Проекты",
    auth: true,
  },
  {
    path: "/partners",
    title: "Соучастники",
    auth: true,
  },
  {
    path: "/demands",
    title: "Заявки",
    auth: true,
  },
  {
    path: "/warehouse",
    title: "Склад",
    auth: true,
  },
  {
    path: "/bonds",
    title: "Бонды",
    auth: true,
  },
]);

const featuresListNoAuth = ref([
  {
    path: "/about",
    title: "О сервисе",
    auth: false,
  },
  {
    path: "/policy",
    title: "Политика конфиденциальности",
    auth: false,
  },
  {
    path: "/contract",
    title: "Соглашение",
    auth: false,
  },
]);

onMounted(async () => {});

const logout = () => {
  router.replace("/login");
  closeBurgerMenu();
  useAuthStore().clear();
};

// const onClickRegister = () => {
//   alert("В разработке");
// };

const closeBurgerMenu = () => {
  if (burgerIsOpened.value) {
    setTimeout(((burgerIsOpened.value = false), 2000));
  } else {
    return;
  }
};

watch(burgerIsOpened, () => {
  // console.log(`burgerIsOpened: ${burgerIsOpened.value}`);
});
</script>

<template>
  <div class="header-wrapper">
    <Container>
      <!-- <div class="burger" id="burger">
        <span></span>
      </div> -->
      <div class="header-container">
        <!-- LOGO -->
        <router-link to="/" class="header-logo" @click="closeBurgerMenu">
          <span>stepbuild.ru</span>
        </router-link>

        <!-- LIST of links -->
        <div
          class="links_container"
          :class="burgerIsOpened ? 'display-block' : 'display-none'"
        >
          <div class="links_wrapper">
            <!-- Auth -->
            <ul
              class="header-features__list"
              v-if="useAuthStore().loggedIn === true"
            >
              <li
                v-for="(item, index) in featuresListAuth"
                @click="closeBurgerMenu"
              >
                <router-link :to="`${item.path}`">{{ item.title }}</router-link>
              </li>
            </ul>

            <!-- !Auth -->
            <ul
              class="header-features__list"
              v-if="useAuthStore().loggedIn === false"
            >
              <li
                v-for="(item, index) in featuresListNoAuth"
                @click="closeBurgerMenu"
              >
                <router-link :to="`${item.path}`">{{ item.title }}</router-link>
              </li>
            </ul>

            <!-- LOGIN -->
            <div class="login_wrapper">
              <!-- to login page if !loggin -->
              <router-link
                v-if="!useAuthStore().loggedIn && route.name !== 'login'"
                to="/login"
                class="account-btn"
                @click="closeBurgerMenu"
              >
                Войти
              </router-link>

              <!-- IF LOGGED IN -->
              <div v-if="useAuthStore().loggedIn" class="account-container">
                <!-- LOGOUT BTN -->
                <div class="account-btn" @click="logout()">Выйти</div>
                <span>|</span>
                <!-- ACCOUNT -->
                <router-link
                  to="/account"
                  class="account-info_block"
                  @click="closeBurgerMenu"
                >
                  <p>Анфалов С.В.</p>
                  <Icon
                    name="material-symbols-light:account-circle"
                    size="36px"
                  />
                </router-link>
              </div>
              <!-- </div> -->
            </div>
          </div>
        </div>

        <!-- BURGER -->
        <label class="burger">
          <input type="checkbox" v-model="burgerIsOpened" />
          <span class="menu">
            <span class="hamburger"></span>
          </span>
        </label>
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
  gap: 1rem;
}
/* .burger {
  display: none;
} */
/* .header-shared {
  display: flex;
  align-items: center;
  gap: 1rem;
} */
.header-logo {
  text-decoration: none;
}
/* .links_wrapper {
  flex: 1;
} */
.links_container {
  /* flex: 1; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-features__list {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 0;
  margin: 0;
}
.header-features__list li a {
  text-decoration: none;
}

@media screen and (max-width: 575px) {
  .header-container {
    padding: 1rem;
  }
  .login_contaner {
    display: none;
  }
  .links_container {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }
  .links_wrapper {
    background-color: #fff;
    width: 100%;
    height: 100%;
    /* margin-left: 30%; */
  }
  .links_container .header-features__list,
  .links_container .login_wrapper .account-container {
    flex-direction: column;
  }

  /* Технические стили max-width: 575px*/
  .display-none {
    display: none;
  }

  .display-block {
    display: block;
  }
}

@media screen and (min-width: 576px) {
  .burger {
    display: none;
  }
  .links_container {
    width: 100%;
  }
  .links_wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
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
.account-container a {
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
.header-logo {
  z-index: 100;
}
label .menu {
  /* position: relative; */
  /* right: 80px;
  top: -100px; */
  z-index: 100;
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 50% 50% 50% 50%;
  -webkit-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  box-shadow: 0 0 0 0 #fff, 0 0 0 0 #fff;
  cursor: pointer;
}

label .hamburger {
  position: absolute;
  /* top: 135px; */
  top: 50%;
  right: 1rem;
  /* left: 50px; */
  width: 32px;
  height: 2px;
  background: var(--bs-primary);
  display: block;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
}

label .hamburger:after,
label .hamburger:before {
  -webkit-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  content: "";
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  background: var(--bs-primary);
}

label .hamburger:before {
  top: -10px;
}

label .hamburger:after {
  bottom: -10px;
}

label input {
  width: 32px;
  height: 10px;
  display: none;
}

/* label input:checked + .menu {
  box-shadow: 0 0 0 100vw #fff, 0 0 0 100vh #fff;
  border-radius: 0;
  height: 100vh;
} */

label input:checked + .menu .hamburger {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

label input:checked + .menu .hamburger:after {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  bottom: 0;
}

label input:checked + .menu .hamburger:before {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  top: 0;
}

label input:checked + .menu + ul {
  opacity: 1;
}

label ul {
  /* z-index: 200; */
  /* position: absolute; */
  /* top: 50%;
  left: 50%; */
  /* -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  opacity: 0;
  -webkit-transition: 0.25s 0s ease-in-out;
  transition: 0.25s 0s ease-in-out; */
}

label a {
  margin-bottom: 1em;
  display: block;
  color: var(--bs-primary);
  text-decoration: none;
}
</style>
