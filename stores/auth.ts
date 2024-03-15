import { defineStore } from 'pinia'

export const useAuthStore = defineStore('Auth', () => {

    const { loggedIn, user, session, clear, fetch } = useUserSession()

    const signIn = async () => {
        await $fetch('/api/auth/login', { method: 'POST' })
        await fetch()
        console.log(user)
    }


    return {
        signIn, loggedIn, user, session, clear, fetch
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}