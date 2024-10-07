import { defineStore } from "pinia";

type Organization = {
    id: number;
    uuid: string;
    title: string;
    ownerID: number;
    sharers: JSON;
    created_at: string;
    update_at: string;
}

export const useOrganizationsStore = defineStore('Organizations', () => {
    // Create state for holding organizations
    const organizations = ref<Organization[]>([])

    //** Function to load organizations data */
    const loadOrganizationsData = async () => {
        try {
            // Fetch data from the server
            organizations.value = await $fetch('/api/organizations/organizations')
        } catch (error: any) {
            alert({
                toString: function () {
                    return `Error: ${error.data.message}`
                }
            })
        }
    }

    return {
        organizations, loadOrganizationsData
    } 
})

if(import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useOrganizationsStore, import.meta.hot))
}