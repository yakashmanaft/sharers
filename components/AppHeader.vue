<script lang="ts" setup>
import { Container } from "@/shared/container";
import { watch } from "vue";

const route = useRoute();
const router = useRouter();

const burgerIsOpened = ref(false);
const accountMenuIsOpened = ref(false);

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
  // {
  //   path: "/bonds",
  //   title: "Бонды",
  //   auth: true,
  // },
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
  accountMenuIsOpened.value = false;
  useAuthStore().clear();
};

// const onClickRegister = () => {
//   alert("В разработке");
// };

const closeBurgerMenu = () => {
  if (burgerIsOpened.value) {
    setTimeout(((burgerIsOpened.value = false), 2000));
  } else if (accountMenuIsOpened.value) {
    accountMenuIsOpened.value = false;
  } else {
    return;
  }
};

const toggleAccountMenu = () => {
  accountMenuIsOpened.value = !accountMenuIsOpened.value;
};

watch(burgerIsOpened, () => {
  // console.log(`burgerIsOpened: ${burgerIsOpened.value}`);
});
watch(accountMenuIsOpened, () => {
  console.log(accountMenuIsOpened.value);
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
                <!-- ACCOUNT -->
                <div class="account-menu">
                  <div class="account-user_icon" @click="toggleAccountMenu">
                    <Icon
                      name="material-symbols-light:account-circle"
                      size="42px"
                    />
                  </div>
                  <div
                    class="account-menu_list"
                    :class="
                      accountMenuIsOpened
                        ? 'display-block-576'
                        : 'display-none-576'
                    "
                  >
                    <div class="account-menu_user">
                      <router-link to="/account" @click="closeBurgerMenu">
                        <p>Анфалов С.В.</p>
                      </router-link>
                    </div>
                    <p @click="logout()">Выйти</p>
                  </div>
                </div>
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

.user-name {
  text-wrap: nowrap;
}

@media screen and (max-width: 767px) {
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
    /* display: flex !important; */
  }
  .links_wrapper {
    background-color: #fff;
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* gap: 10rem; */
    /* margin-left: 30%; */
  }
  .links_container .header-features__list,
  .links_container .login_wrapper .account-container {
    flex-direction: column;
  }

  .login_wrapper {
    position: absolute;
    /* order: -1; */
    top: 10rem;
    left: 50%;
    transform: translateX(-50%);
  }
  .account-container {
    flex-direction: row !important;
  }
  .login_wrapper {
    position: unset;
    order: -1;
  }
  .account-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .account-menu_list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Технические стили max-width: 575px*/
  .display-none {
    display: none;
  }

  .display-block {
    display: block;
  }
  .account-btn {
    display: none;
  }
}

/* @media screen and (min-width: 576px) and (max-width: 767px) {
} */

@media screen and (min-width: 768px) {
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
  .account-menu {
    position: relative;
  }
  .account-user_icon {
    cursor: pointer;
  }
  .account-menu_list {
    position: absolute;
    top: 2rem;
    right: 0;
    background-color: #fff;
    /* border: 1px solid black; */
  }

  /* Технические  */
  .display-none-576 {
    display: none;
  }

  .display-block-576 {
    display: block;
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
.account-user_icon {
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
  background-color: #fff;
}

label input:checked + .menu .hamburger:after {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  bottom: 0;
  background-color: #fff;
}

label input:checked + .menu .hamburger:before {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  top: 0;
  background-color: #fff;
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
