import { defineStore } from 'pinia'


// await loadData()
// // const users = loadData()

// const promise = new Promise(function (resolve, reject) {
//     const data = loadData() // делаем асинхронную операцию: запрос в БД, API, etc.
//     resolve(data) // переводим промис в состояние fulfilled. Результатом выполнения будет объект data
// })
// const errorPromise = new Promise(function (resolve, reject) {
//     reject(new Error('ошибка')) // переводим промис в состояние rejected. Результатом выполнения будет объект Error
// })

// console.log(promise)
// console.log(errorPromise)
// console.log(users.value)


export const useAuthStore = defineStore('Auth', () => {

    const { loggedIn, user, session, clear, fetch } = useUserSession()

    const signIn = async (loggedUser: any) => {


        const { loadData } = useUsersStore();
        const { users } = storeToRefs(useUsersStore());
        await loadData()


        if (users.value && loggedUser) {
            let userObj = users.value.find(item => item.email === loggedUser.email && item.password === loggedUser.password)
            if(userObj) {

                await $fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(
                        userObj
                    ),
                })
            } else {
                alert('Введенные данные неверны... auth.ts')
            }
            // console.log(userObj)
        }

        await fetch()
    }

    return {
        signIn, loggedIn, user, session, clear, fetch
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}