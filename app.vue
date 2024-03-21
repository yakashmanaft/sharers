<script lang="ts" setup>
// import IndexPage from '@/pages/index.vue'
// import { useCurrentUserStore } from '@/stores/auth'

// const store = useCurrentUserStore()

  const checkLocalStorage = () => {
    console.log('App is ready')
  }
  onMounted(() => {
    // checkLocalStorage()
  })
</script>

<template>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>

</template>

<style>
html {
    width:100vw;
    overflow-x:hidden;
}
/* # Тестировать docker */
/* # https://www.youtube.com/watch?v=w9Ls34MvZTs */
/* # environment settings nuxt */
/* # https://www.youtube.com/watch?v=eCKjCoWGCUA */
</style>


