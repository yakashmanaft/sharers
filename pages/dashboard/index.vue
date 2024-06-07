<template>
  <Container style="padding-top: 5rem;">
    <h1 class="max-width-585_hide">Доска</h1>

    <!--  -->
    <div class="dashboard-container">

      <!--  -->
      <div class="dashboard-item">
        <h2 class="dashboard-item_header">Проекты</h2>
        <div class="dashboard-item_indicator">
          2 шт.
        </div>
      </div>

      <!--  -->
      <div class="dashboard-item">
        <h2 class="dashboard-item_header">Соучастники</h2>
        <div class="dashboard-item_indicator">
          12 Соучастников
        </div>
        <div class="dashboard-item_indicator">
          3 Организации
        </div>
      </div>

      <!--  -->
      <div class="dashboard-item">
        <h2 class="dashboard-item_header">Заявки</h2>
        <div class="dashboard-item_indicator">
          3 Акутальные 
        </div>
        <div class="dashboard-item_indicator">
          3 Я автор 
        </div>
        <div class="dashboard-item_indicator">
          3 Я исполнитель 
        </div>
      </div>

      <!--  -->
      <div class="dashboard-item">
        <h2 class="dashboard-item_header">Склад</h2>
        <div class="dashboard-item_indicator">
          3 220 300,00 Потенциальная капитализация
        </div>
      </div>

      <!--  -->
      <div class="dashboard-item">
        <h2 class="dashboard-item_header">Деньги</h2>
        <div class="dashboard-item_indicator">
          320 790,00 (+5% к обороту) За последний месяц
        </div>
        <div class="dashboard-item_indicator">
          11 935 700,00 Свободные средства
        </div>
        <div class="dashboard-item_indicator">
          -793 846,00 Остаток по займам
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { Container } from "@/shared/container";

useHead({
  title: "Доска | Соучастники",
  link: [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
      integrity:
        "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
      crossorigin: "anonymous",
      type: "text/css",
    },
  ],
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
      integrity:
        "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
      crossorigin: "anonymous",
    },
  ],
});
</script>

<style scoped>

/*  */
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.dashboard-item {
  transition: all 0.2s ease-in;
}
.dashboard-item:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}
.dashboard-item_indicator {

}

/*  */
@media screen and (max-width: 585px) {

}
@media screen and (max-width: 767px) {
  .max-width-585_hide {
    display: none;
  }
  .dashboard-item_header {
    font-size: 1rem;
  }
}
@media screen and (min-width: 768px) and (max-width: 991px) {

}
</style>
