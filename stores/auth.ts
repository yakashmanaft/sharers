import { defineStore } from 'pinia'

export const useAuthStore = defineStore('Auth', () => {

    const { loggedIn, user, session, clear, fetch } = useUserSession()

    const signIn = async (loggedUser: any) => {
        console.log(loggedUser)
        await $fetch('/api/auth/login', {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            // },
            // headers: { 'Content-Type': 'multipart/form-data' },
            headers: { 'content-type':'application/json' },
            body: JSON.stringify(
                loggedUser
            ),
            // body: loggedUser,
        })
            // .then((response) => response)
            // .then((data) => {
            //     console.log(data)
            // })
        await fetch()
    }

    return {
        signIn, loggedIn, user, session, clear, fetch
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}