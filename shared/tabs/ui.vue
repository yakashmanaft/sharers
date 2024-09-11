<template>
    <div class="tab_wrapper">

        <div class="tab" v-for="(tab, index) in tabs">
            <input type="radio" :id="`tab-title_item_${index}`" :value="tab.name" v-model="currentTitle"/>
                <label :for="`tab-title_item_${index}`" @click="emit_TitleName(tab.name)"><h2>
                    {{ tab.title }}
                </h2></label>
        </div>
    </div>
</template>

<script lang="ts" setup>

// PROPS
const props = defineProps({
    tabs: Array,
    default: String
})
const currentTitle = ref(props?.default)

// EMITS
// = variables
const emit = defineEmits(['name_changed'])
// = emits
const emit_TitleName = (name: string) => {
    if(name) {

        emit('name_changed', name)
        // console.log(name)
    }
}

// WATCHERS
// = titles
</script>
  
<style scoped>
.tab_wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow-x: scroll;
    scrollbar-width: none;
    border-bottom: 1px solid var(--bs-border-color);
    padding-bottom: 1rem;
}
.tab_wrapper::-webkit-scrollbar {
  display: none;
}
.tab input[type="radio"] {
    opacity: 0;
    position: fixed;
    width: 0;
}
.tab label h2 {
  color: var(--bs-tertiary-color);
  white-space: nowrap;
}
.tab label h2:hover {
  cursor: pointer;
}

.tab input[type="radio"]:checked + label h2 {
  color: unset;
}

@media screen and (max-width: 575px) {
    .tab_wrapper {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }
}

@media screen and (max-width: 767px) {
    .tab_wrapper {
        border: unset;
        padding-bottom: unset;
    }
}
</style>