<script setup>
useHead({
    title: "Login",
    link: [
        { 
            rel: 'stylesheet', 
            href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
            integrity: "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
            crossorigin: "anonymous",
            type: "text/css"
        }
    ],
    script: [
        {
            src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
            integrity: "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
            crossorigin: "anonymous",
        }
    ]
})
import { Container } from '@/shared/container'
// import { useCurrentUserStore } from '@/stores/auth'

const tempUser = ref({
    email: null,
    password: null
})

const users = ref(null)

const store = useCurrentUserStore()
const { setCurrentUser, isAuthFunc, isAuth } = store

onMounted(async () => {
    users.value = await getUsers()

})

const login = (user) => {
    const { email, password } = user

    if(email && password) {

        if(users.value) {
            let user = users.value.find(item => {
                if(item.email === tempUser.value.email) {
                    return item.password === tempUser.value.password
                }
            })

            if(user) {

                setCurrentUser(user)
                isAuthFunc()
                console.log(user)

            } else {
                console.log(tempUser.value.email)
                console.log(tempUser.value.password)
                console.log('Пользователя с такими данными не сущействует')
            }
        }
    } else {
        console.log('Форма не может быть пустой')
    }
    
}
/**
 * @desc запрос к серверу
 */
async function getUsers() {
    return await $fetch('api/users')
}
</script>

<template>
    <Container>

        <div style="height: 100vh; transform: translateY(-10%); display: flex; flex-direction: column; align-items: center; justify-content: center;">

            <h1>Login</h1>
    
            <div>
                <label for="login">Введите имейл</label>
                <input id='login' v-model="tempUser.email" type="text">
            </div>

            <div>
                <label for="password">Введите пароль</label>
                <input id='password' v-model="tempUser.password" type="password">
            </div>

            <!-- <button @click="$emit('loginUserEmit', tempUser)">LogIn</button> -->
            <button @click="login(tempUser)">Login</button>
            {{ tempUser }}
        </div>

    </Container>    
</template>

<style scoped>

</style>