<template>
  <!-- default: {{ default }}
  <br />
  currentTitle: {{ currentTitle }}
  <br /> -->
  <div class="tab_wrapper">

    <!-- Кнопка ALL -->
    <div class="tab" v-if="props.btn_all_exist">
      <input
        type="radio"
        :id="`tab-radio_item_null`"
        v-model="currentTitle"
        :value="default"
      />
      <label
        :for="`tab-radio_item_null`"
        @click="emit_object(props.default)"
      >
        <p>Все</p>
      </label>
    </div>

    <!-- Tabs Array -->
    <div class="tab" v-for="(tab, j) in tabs">
      <input
        type="radio"
        :id="`tab-radio_item_${j}`"
        :value="tab"
        v-model="currentTitle"
      />
      <label :for="`tab-radio_item_${j}`" @click="emit_object(tab)"
        ><p>
          {{ tab.title }}
        </p></label
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
// PROPS
const props = defineProps({
  tabs: Array,
  default: Object,
  btn_all_exist: Boolean
});
const currentTitle = ref(props?.default);

// EMITS
// = variables
const emit = defineEmits(["changed"]);
// = emits
const emit_object = (obj : any) => {
  if (obj) {
    emit("changed", obj);
    // console.log(name)
  }
};

// WATCHERS
// = titles
</script>

<style scoped>
.tab_wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: scroll;
  scrollbar-width: none;
  /* border-bottom: 1px solid var(--bs-border-color); */
  /* padding-bottom: 1rem;  */
}
.tab_wrapper::-webkit-scrollbar {
  display: none;
}
.tab input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}
.tab label p {
  border: 1px solid var(--bs-primary);
  padding: 2px 8px;
  border-radius: 2rem;
  color: var(--bs-primary);
  white-space: nowrap;
}
.tab label p {
  margin: 0;
}
.tab label p:hover {
  cursor: pointer;
}

/* .tab input[type="radio"]:checked + label h2 {
  color: unset;
} */
.tab input[type="radio"]:checked + label p {
  color: var(--bs-body-bg);
  background-color: var(--bs-primary);
}

@media screen and (max-width: 575px) {
  .tab_wrapper {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media screen and (max-width: 767px) {
  .tab_wrapper {
    border: unset;
    padding-bottom: unset;
  }
}
</style>
