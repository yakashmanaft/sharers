<script lang="ts" setup>
import { Container } from "@/shared/container";
onMounted(() => {
    const { user } = useUserSession();
    console.log(user.value)
})

</script>
<template>
  <div class="footer_container">
    <Container>
      <div class="footer_wrapper">
        <Icon
          name="material-symbols-light:dashboard-outline-rounded"
          size="48px"
          color="var(--bs-primary)"
        />
        <Icon
          name="material-symbols-light:account-balance-wallet-outline"
          size="48px"
          color="var(--bs-primary)"
        />
        <Icon
          name="material-symbols-light:account-balance-wallet-outline"
          size="48px"
          color="var(--bs-primary)"
        />
      </div>
      
    </Container>
  </div>
</template>

<style scoped>
.footer_container {
  position: fixed;
  bottom: 0;
  background-color: var(--bs-body-bg);
  width: 100%;
  box-shadow: -2px -2px 8px 0px rgba(0, 0, 0, 0.2);
}
.footer_wrapper {
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bs-body-bg);
}
@media screen and (min-width: 769px) {
    .footer_container {
        display: none;
    }
}
</style>
