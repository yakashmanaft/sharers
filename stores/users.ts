import { defineStore } from "pinia";

type User = {
    id: string;
    uuid: string;
    email: string;
    name: string;
    role: string
}

export const useUsersStore = defineStore('Users', () => {
    // Create state for holding users
    const users = ref<User[]>([])

    //** Function to load user data */
    const loadData = async () => {
        try {
            // Fetch data from the server
            users.value = await $fetch('api/users')
        } catch (error: any) {
            alert({

                toString: function () {
                    return `Error: ${error.data.message}`
                }
            })
        }
    }

    return {
        users, loadData
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}