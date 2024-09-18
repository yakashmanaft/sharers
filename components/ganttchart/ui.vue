<template>
  <div class="gantt">
    <div class="guide">
      <span class="desc">{{ props.dateText }}</span>
      <span class="item">{{ props.itemText }}</span>
    </div>
    <div class="item-name-list">
        <div v-for="(item, index) in data" :key="index">
            {{ item.name }}
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// PROPS
const props = defineProps({
  // Данные (сами задачи, заявки, дела)
  data: {
    type: Array,
    required: true,
    default: [],
  },
  //  даты начала и конца отображения даиграммы
  dateRangeList: {
    type: Array,
    required: true,
    default: [],
    validator(value) {
      return value[0] && value.at(-1);
    },
  },
  //   Название столбца дел
  dateText: {
    type: String,
    required: true,
  },
  itemText: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.gantt-chart {
  --borderWidth: 1px;
  /* --borderColor: v-bind(props.borderColor);
  --border: 1px solid var(--borderColor);
  --fontSize: 14px;
  --fontColor: #333;
  --itemWidth: v-bind(props.itemWidth + 'px');
  --itemHeight: v-bind(props.itemHeight + 'px'); */
}
</style>
