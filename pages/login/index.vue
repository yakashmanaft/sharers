<script setup>
//
// https://www.youtube.com/watch?v=pXBxTF_u-6c
useHead({
  title: "Login",
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
import { Container } from "@/shared/container";
import { onBeforeMount } from "vue";

// import { userToLog } from '@/stores/auth';

const { loggedIn, user, session, clear, fetch } = useUserSession();
// const { userToLog } = useAuthStore()
// const { userToLog } = setUserSession()

const router = useRouter();
// import { useCurrentUserStore } from '@/stores/auth'

// if (user.value) {
//   router.push("/");
// }
const tempUser = ref({
  email: "anfalov@camini-pk.ru",
  password: null,
});

const login = async () => {
  // Пользвоатель вводит данные в форму
  // tempUser.value.email = "anfalov@camini-pk.ru";
  // tempUser.value.password = "Anfalov123[eq";

  // Сравниваем с БД

  // Если есть такой в БД - создаем объект уже с id user и передаем в signIn()
  // Или в login post будем сравнивать пароли... потом надо думать как шифровать)
  if (tempUser.value.email) {
    await useAuthStore().signIn(tempUser.value);
    // router.push("/dashboard");
  } else {
    alert('Вы не указали email')
  }
};

onBeforeMount(() => {
  // if(user.value) {
  //   router.push("/dashboard");
  // }
});
// const users = ref(null)

// const store = useCurrentUserStore()
// const { setCurrentUser, isAuthFunc, isAuth } = store

// onMounted(async () => {
//     users.value = await getUsers()

// })

// const login = (user) => {
//     const { email, password } = user

//     if(email && password) {

//         if(users.value) {
//             let user = users.value.find(item => {
//                 if(item.email === tempUser.value.email) {
//                     return item.password === tempUser.value.password
//                 }
//             })

//             if(user) {

//                 setCurrentUser(user)
//                 isAuthFunc()
//                 console.log(user)

//             } else {
//                 console.log(tempUser.value.email)
//                 console.log(tempUser.value.password)
//                 console.log('Пользователя с такими данными не сущействует')
//             }
//         }
//     } else {
//         console.log('Форма не может быть пустой')
//     }

// }
// /**
//  * @desc запрос к серверу
//  */
// async function getUsers() {
//     return await $fetch('api/users')
// }
// const loginloggedIn = async () => {
//   // if (tempUser.value.email && tempUser.value.email === user.value.email) {
//   //   } else {
//   //     alert('Пользователь не найден')
//   // }
//     await useAuthStore().signIn();
//     router.push("/dashboard");
// };
const onClickRegister = () => {
  alert("В разработке");
};
</script>

<template>
  <Container>
    <div
      style="
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
    >
      <h1 style="margin-top: 5rem">Вход</h1>

      <!-- <button @click="onClickRegister">Зарегистрироваться</button> -->

      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        "
      >
        <label for="login">Введите имейл</label>
        <input id="login" v-model="tempUser.email" type="text" />
      </div>
      <br />

      <!-- <button @click="loginloggedIn">Войти</button> -->
      <button @click="login">Войти</button>
      <!--
            <div>
                <label for="password">Введите пароль</label>
                <input id='password' v-model="tempUser.password" type="password">
            </div> -->

      <!-- <button @click="$emit('loginUserEmit', tempUser)">LogIn</button> -->
      <!-- <button @click="login(tempUser)">Login</button>
            {{ tempUser }} -->
    </div>
  </Container>
</template>

<style scoped></style>
