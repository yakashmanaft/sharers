<script lang="ts" setup>
// import IndexPage from '@/pages/index.vue'
// import { useCurrentUserStore } from '@/stores/auth'
const router = useRouter();
const { loggedIn, user, session, clear, fetch } = useUserSession();
// const store = useCurrentUserStore()

const checkLocalStorage = () => {
  console.log("App is ready");
};
onMounted(() => {
  // checkLocalStorage()
  console.log(user.value);
  if (!user.value) {
    router.replace("/login");
  }
});

watch(session, () => {
  console.log(user.value);
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html {
  width: 100vw;
  overflow-x: hidden;
}
/* # Тестировать docker */
/* # https://www.youtube.com/watch?v=w9Ls34MvZTs */
/* # environment settings nuxt */
/* # https://www.youtube.com/watch?v=eCKjCoWGCUA */
</style>
