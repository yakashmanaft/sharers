<script lang="ts" setup>
import { Container } from "@/shared/container";

const router = useRouter();
const route = useRoute();
const currentRoute = ref("");
const hotBtnList = ref([
  {
    name: "dashboard",
    icon_name: "material-symbols-light:dashboard-outline-rounded",
    icon_clicked_name: "material-symbols-light:dashboard-rounded",
    target: "dashboard",
  },
  {
    name: "warehouse",
    icon_name: "material-symbols-light:warehouse-outline-rounded",
    icon_clicked_name: "material-symbols-light:warehouse-rounded",
    target: "warehouse",
  },
  {
    name: "calendar",
    icon_name: "material-symbols-light:calendar-month-outline",
    icon_clicked_name: "material-symbols-light:calendar-month-rounded",
    target: "calendar",
  },
  {
    name: "partners",
    icon_name: "material-symbols-light:group-outline-rounded",
    icon_clicked_name: "material-symbols-light:group-rounded",
    target: "partners",
  },
  {
    name: "favorite",
    icon_name: "material-symbols-light:favorite-outline-rounded",
    icon_clicked_name: "material-symbols-light:favorite-rounded",
    target: "modal",
  },
]);

const clickBy = (el: any) => {
  console.log(`name: ${el.name}`);
  console.log(`target: ${el.target}`);
  if (el) {
    if (el.name === el.target) {
      router.push(`/${el.target}`);
      // router.push(`/projects/${object.locationID}`);
    } else {
        alert(`${el.name} в разработке`)
    }
  }
};

onMounted(() => {
  //   const { user } = useUserSession();
});

watch(
  () => route.path,
  (newRoute, prevRoute) => {
    currentRoute.value = newRoute.substring(1);
    // console.log(currentRoute.value);
  }
);
</script>
<template>
  <div class="footer_container">
    <Container>
      <!-- <div v-if="useAuthStore().user.favorite" class="footer_wrapper">
        {{ useAuthStore().user.favorite }} 
      </div> -->
      <div class="footer_wrapper">
        <Icon
          @click="clickBy(el)"
          v-for="el in hotBtnList"
          :name="
            currentRoute === el.target ? el.icon_clicked_name : el.icon_name
          "
          size="48px"
          :color="
            currentRoute === el.target
              ? 'var(--bs-success)'
              : 'var(--bs-primary)'
          "
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
  justify-content: space-around;
  background-color: var(--bs-body-bg);
}
@media screen and (min-width: 769px) {
  .footer_container {
    display: none;
  }
}
</style>
