<template>
  <div class="gantt">
    <div class="guide">
      <div class="desc">
        <span class="date">{{ props.dateText }}</span>
        <span class="item">{{ props.itemText }}</span>
      </div>
      <div class="item-name-list">
        <div
          v-for="(item, index) in data"
          :key="index"
          :class="{
            'guide-name': true,
            'last-guide-name': index === data.length - 1,
          }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="inner">123</div>
  </div>
</template>

<script lang="ts" setup>
//
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: [],
  },
  dateText: {
    type: String,
    required: true,
  },
  itemText: {
    type: String,
    required: true,
  },
  itemWidth: {
    type: Number,
    default: 40,
    // validator(value) {
    //   return value >= 40
    // }
  },
  itemHeight: {
    type: Number,
    default: 40,
    // validator(value) {
    //   return value >= 40
    // }
  },
  borderColor: {
    type: String,
    default: "#eee",
  },
});

//
// const emit = defineEmits(['scheduleClick', 'scrollXEnd', 'scrollYEnd'])
// const data = ref([]);
//
let rangeDate = ref([]);
const ganttMaxWidth = ref("2000px");
const ganttInnerHeight = ref("0px");
</script>

<style scoped>
/* .gantt */
.gantt {
  --borderWidth: 1px;
  --borderColor: v-bind(props.borderColor);
  --border: 1px solid var(--borderColor);
  --fontSize: 14px;
  --fontColor: #333;
  --itemWidth: v-bind(props.itemWidth + "px");
  --itemHeight: v-bind(props.itemHeight + "px");
}
* {
  box-sizing: border-box;
}
.gantt {
  width: 100%;
  max-width: v-bind(ganttMaxWidth);
  margin: 0 auto;
  height: auto;
  user-select: none;
  box-sizing: border-box;
  border: var(--border);
  font-size: var(--fontSize);
  color: var(--fontColor);
  display: flex;
  position: relative;
}
.gantt::-webkit-scrollbar {
  /*Общий стиль полосы прокрутки*/
  width: 5px; /*Высота и ширина соответствуют размеру горизонтальной и вертикальной полос прокрутки*/
  height: 5px;
}
.gantt::-webkit-scrollbar-thumb {
  /*Маленький квадратик внутри полосы прокрутки*/
  border-radius: 2px;
  box-shadow: inset 0 0 2px rgba(10, 10, 10, 0.2);
  background: #818181;
}
.gantt::-webkit-scrollbar-track {
  /*Полоса прокрутки внутри трека*/
  box-shadow: inset 0 0 2px rgba(10, 10, 10, 0.2);
  border-radius: 2px;
  background: #ededed;
}
.guide {
  background-color: red;
  flex-shrink: 0;
  width: 120px;
  height: 100%;
  border-right: var(--border);
}
/* .desc */
.guide .desc {
  width: 120px;
  height: 120px;
  border-bottom: var(--border);
  position: relative;
}
.guide .desc:after {
  content: "";
  position: absolute;
  height: 1px;
  width: 169.7056274847714px;
  background-color: var(--borderColor);
  top: 0;
  left: 0;
  transform: rotate(45deg);
  transform-origin: 0 0;
}
.guide .desc .date {
  position: absolute;
  top: 20px;
  right: 20px;
}
.guide .desc .item {
  position: absolute;
  left: 5px;
  bottom: 20px;
}
.guide .desc .item-name-list {
  width: 100%;
  max-height: v-bind(ganttInnerHeight);
  overflow-y: auto;
}

.guide .guide-name {
  width: 100%;
  height: var(--itemHeight);
  border-bottom: var(--border);
  padding: 2px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide .last-guide-name {
  border-bottom: none;
}

/* inner */
.inner {
  width: 100%;
  overflow-x: auto;
  overflow-x: overlay;
  position: relative;
}
.inner::-webkit-scrollbar {
  /*Общий стиль полосы прокрутки*/
  width: 5px; /*Высота и ширина соответствуют размеру горизонтальной и вертикальной полос прокрутки*/
  height: 5px;
}
</style>
