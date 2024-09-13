<template>
  <div>
    <!--  -->
    <AppHeader />

    <!--  -->
    <div>
      <!--  -->
      <slot />
    </div>

    <!--  -->
    <div v-if="useAuthStore().loggedIn === true">
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
// You might choose this based on an API call or logged-in status
// const layout = "custom";
// const windowScreenWidth = ref()
// onMounted(() => {
//   windowScreenWidth.value = window.screen.width
// })
</script>
