import { defineStore } from "pinia";

type Project = {
    id: number;
    uuid: string;
    title: string;
    address: string;
    partnerType: string;
    partnerID: number;
    creator: number
    curatorType: string;
    curatorID: number;
    workType: string;
    completion: GLfloat;
    phone: string;
    created_at: string;
    update_at: string;
    sharers: JSON;
    bandID: number;
    stages: JSON;
}

export const useProjectsStore = defineStore('Projects', () => {
    // Create state for holding users
    const projects = ref<Project[]>([])

    //** Function to load projects data */
    const loadProjectsData = async () => {
        try {
            // Fetch data from the server
            projects.value = await $fetch('/api/projects/projects')
        } catch (error: any) {
            alert({

                toString: function () {
                    return `Error: ${error.data.message}`
                }
            })
        }
    }

    return {
        projects, loadProjectsData
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot))
}