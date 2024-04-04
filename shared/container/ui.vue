<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<style scoped>
.container {
  /* max-width: 1208px; */
  max-width: 1399px;
  margin: 0 auto;
}
@media screen and (max-width: 575px) {
  .container {
    padding: 0;
    margin: 0;
  }
}
</style>

<!-- https://github.com/vadimkaKharitonenko/severyanochka/tree/master -->
