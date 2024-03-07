<script lang="ts" setup>
// import IndexPage from '@/pages/index.vue'
import { useCurrentUserStore } from '@/stores/auth'

const store = useCurrentUserStore()

  const checkLocalStorage = () => {
    console.log('App is ready')
  }
  onMounted(() => {
    checkLocalStorage()
  })
</script>

<template>

    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>

</template>

<style>
html {
    width:100vw;
    overflow-x:hidden;
}
</style>
