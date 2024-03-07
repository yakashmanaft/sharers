import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrentUserStore = defineStore('currentUserStore', () => {

    const router = useRouter()

    const currentUser: any = ref(null)
    const isAuth = ref(false)

    function isAuthFunc () {
        
        if(currentUser.value) {

            
            // console.log(isAuth.value)
            
            if(!localStorage.getItem('isAuth')) {
                isAuth.value = true
                localStorage.setItem('isAuth', 'true')
                router.push('/dashboard')
            } else {
                localStorage.getItem('isAuth')
                isAuth.value = true
                router.push('/dashboard')
            }
            
            if(!localStorage.getItem('user')) {
                localStorage.setItem('user', currentUser.value.uuid)
            }

        }
    }

    function isNotAuthFunc () {
        isAuth.value = false
        currentUser.value = null
        router.replace('/login')
        // console.log(isAuth.value)
    }

    function setCurrentUser (user: any) {
        currentUser.value = user
    }

    function userFromLS (user: any) {
        currentUser.value = user
    }
    
    return {
        currentUser,
        setCurrentUser,
        isAuth,
        isAuthFunc,
        isNotAuthFunc,
        userFromLS
    }
})