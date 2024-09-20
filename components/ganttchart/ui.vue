<template>
  <div class="gantt" ref="gantt_chart">
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
          :style="computedStyle(item, null)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="inner gantt-chart_inner" @scroll="onScrollX($event)" ref="innerRef">
      <!-- datelist -->
      <div class="date-list first-date-list">
        <div
          v-for="monthItem in rangeDate"
          :key="monthItem.year + '-' + monthItem.month"
          class="month-item"
        >
          <div class="month">
            <slot
              name="month"
              :data="{ year: monthItem[0].year, month: monthItem[0].month }"
              >{{ monthItem[0].year + "-" + monthItem[0].month }}</slot
            >
          </div>
          <div class="day-box">
            <div
              v-for="(dayItem, dayIndex) in monthItem"
              :key="dayItem.day + dayItem.week"
              :class="{
                'day-item': true,
                'first-day-item': dayIndex === 0,
                'date-active':
                  props.activeDate ===
                  dayItem.year + '-' + dayItem.month + '-' + dayItem.day,
              }"
              :id="dayItem.year + '-' + dayItem.month + '-' + dayItem.day"
            >
              <div class="day">
                <slot
                  name="day"
                  :data="{
                    ...dayItem,
                    active:
                      props.activeDate ===
                      dayItem.year + '-' + dayItem.month + '-' + dayItem.day,
                  }"
                  >{{ dayItem.day }}</slot
                >
              </div>
              <div class="week">
                <slot
                  name="week"
                  :data="{
                    ...dayItem,
                    active:
                      props.activeDate ===
                      dayItem.year + '-' + dayItem.month + '-' + dayItem.day,
                  }"
                  >{{ dayItem.week }}</slot
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- schedule -->
      <div class="schedule-box">
        <div
          v-for="(item, index) in data"
          :key="index"
          :class="{ 'date-box': true }"
        >
          <div
            v-for="(dateItem, dateIndex) in renderWorks(item)"
            :key="dateIndex"
            :class="{
              'date-item': true,
              'date-item-work': dateItem.type === 'works',
              'date-active': dateItem.date === props.activeDate,
            }"
            :style="computedStyle(item, dateItem)"
            :title="dateItem.type === `works` ? dateItem.desc : ``"
            @mousemove="(event) => dateItemMove(dateItem.type, event)"
            @mouseout="(event) => dateItemMoveOut(dateItem.type, event)"
            @click="(event) => scheduleClick({ ...dateItem, event })"
          >
            <slot
              v-if="dateItem.type === 'works'"
              name="tdWorks"
              :date="dateItem"
            >
              <span class="work-desc">
                {{
                  props.scheduleTitle
                    ? props.scheduleTitle(dateItem)
                    : dateItem.name
                }}
              </span>
            </slot>
            <slot v-else name="tdDefault" :date="dateItem"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import cloneDeep from "lodash/cloneDeep";
import {
  computedDaysRange,
  fethDaysRange,
  splitDaysForMonth,
  todayInRange,
  fetchToday,
  workListSplitForRepeat,
} from "@/utils/gantt/index";
//
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: [],
  },
  dateRangeList: {
    type: Array,
    required: true,
    default: [],
    validator(value) {
      return value[0] && value.at(-1);
    },
  },
  dateText: {
    type: String,
    required: true,
  },
  itemText: {
    type: String,
    required: true,
  },
  activeDate: {
    type: String,
    default: () => fetchToday(),
  },
  repeatMode: {
    // extract 将重叠部分抽取，单独生成独立的日程
    // cover 重叠部分按照征程日期排序覆盖
    type: Object,
    default: () => ({
      mode: "cover",
      backgroundColor: "#FFFFCC",
      textColor: "#336666",
      name: "Перекрывающиеся графики",
      desc: "Это несколько расписаний",
    }),
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
  scheduleTitle: {
    type: Function,
    default: null,
  },
  borderColor: {
    type: String,
    default: "#eee",
  },
});
// Диаграмма Ганта DOM
const gantt_chart = ref(null)
//
const emit = defineEmits(["scheduleClick", "scrollXEnd", "scrollYEnd"]);

let rangeDate = ref([]);
const data = ref([]);

//
const ganttMaxWidth = ref("2000px");
const ganttInnerHeight = ref("0px");

//
let timer: any = null
const innerRef = ref(null);
//
onMounted(() => {
  // const itemBox = gantt.value.querySelector(".item-name-list");
  // const innerBox = gantt.value.querySelector(".schedule-box");
});
//
watchEffect(() => {
  rangeDate.value = splitDaysForMonth(
    computedDaysRange(props.dateRangeList[0], props.dateRangeList.at(-1))
  );
  // console.log("rangeDate.value", rangeDate.value);
  ganttMaxWidth.value =
    props.itemWidth * rangeDate.value.flat(1).length + 122 + "px";
});

//
// Создайте список расписаний для текущего игрового проекта в текущем диапазоне дат.
const renderWorks = (game: any) => {
  const dateRange = _flatDateRange(rangeDate.value);
  // Если для текущего игрового проекта расписание отсутствует, данные по умолчанию будут возвращены напрямую.
  if (!game.schedule || !game.schedule.length) return dateRange;
  let res: any[] = [];
  game.schedule.forEach((scheduleItem: any) => {
    dateRange.forEach((dayItem: any) => {
      // Является ли текущая дата расписанием
      const isWork = _checkTodayIsWork(dayItem.date, scheduleItem);
      // Была ли текущая дата добавлена ​​к окончательному результату
      const todayInResult = _checkTodayInResult(dayItem.date, res);
      // Находится ли текущая дата в добавленном диапазоне расписания
      const todayInAllWorkList = _checkTodayInAllWorkList(dayItem.date, res);
      // Это расписание
      if (isWork) {
        // Текущая дата не была добавлена ​​&& Текущая дата не входит в добавленный диапазон расписания
        if (!todayInResult && !todayInAllWorkList) {
          // Первый
          res.push({
            type: "works",
            date: dayItem.date,
            width: computeWordWidth(scheduleItem.days, dateRange),
            left: 0,
            ...scheduleItem,
          });
        } else if (!todayInResult && todayInAllWorkList) {
          //Текущая дата не добавлена ​​&& Текущая дата находится в добавленном диапазоне расписания
          // Получаем информацию о расписании
          const inWorkInfo = _findTodayForWork(dayItem.date, res);
          if (scheduleItem.id !== inWorkInfo.id) {
            // Получить перекрывающийся диапазон
            const repeatList = _checkWorkRepeatRange(inWorkInfo, scheduleItem);
            res = _updateScheduleItem(scheduleItem, res);
          } else {
            //Информация о расписании соответствует текущей информации о расписании цикла
            // Обработка не требуется
          }
        } else if (todayInResult && !todayInAllWorkList) {
          // Текущая дата добавлена ​​&& Текущее расписание находится за пределами добавленного диапазона расписания (новое расписание)
          // Получаем местоположение добавленной даты и обновляем текущий график дат
          console.warn(
            "Текущая дата была добавлена ​​&& текущее расписание находится за пределами добавленного диапазона расписания (новое расписание)"
          );
          res = _updateScheduleItem(scheduleItem, res);
        } else {
          //Текущая дата добавлена ​​&& Текущая дата находится в добавленном диапазоне расписания
          // Обработка не требуется
          // console.log('Текущая дата была добавлена ​​&& текущая дата находится в пределах добавленного диапазона расписания')
        }
      } else {
        // Не расписание
        // Текущая дата не добавлена ​​и не находится в добавленном диапазоне расписания
        if (!todayInResult && !todayInAllWorkList) {
          res.push(dayItem);
        } else if (!todayInResult && todayInAllWorkList) {
          // Текущая дата не добавлена ​​&& Текущая дата находится в добавленном диапазоне расписания
          // console.log('екущая дата не добавлена ​​&& Текущая дата находится в добавленном диапазоне расписания')
        } else {
          // Текущая дата добавлена
          // console.log('Текущая дата добавлена', dayItem)
        }
      }
    });
  });
  return res;
};

const dateItemMove = (type, event) => {
  if (type !== "works") return;
  if (event.target.tagName === "SPAN") {
    event.target.parentElement.style.zIndex = 2;
    event.target.parentElement.style.boxShadow =
      "0 0 5px 0px rgba(0, 0, 0, 0.2)";
  } else {
    event.target.style.zIndex = 2;
    event.target.style.boxShadow = "0 0 5px 0px rgba(0, 0, 0, 0.2)";
  }
};
const dateItemMoveOut = (type, event) => {
  if (type !== "works") return;
  if (event.target.tagName === "SPAN") {
    event.target.parentElement.style.zIndex = 1;
    event.target.parentElement.style.boxShadow = "none";
  } else {
    event.target.style.zIndex = 1;
    event.target.style.boxShadow = "none";
  }
};
const splitSchedule = (data) => {
  return data.map((item) => {
    if (
      item.type === "normal" &&
      Array.isArray(item.schedule) &&
      item.schedule.length
    ) {
      item.schedule = item.schedule.filter((v) => {
        const check = rangeDate.value[0][0];
        const checkTime = `${check.year}-${check.month}-${check.day}`;
        return (
          new Date(v.days.at(-1)).getTime() >= new Date(checkTime).getTime()
        );
      });
    }
    return item;
  });
};

const sortFilterData = () => {
  checkValidator();
  data.value = cloneDeep(props.data).map((item) => {
    if (item.type === "normal" && Array.isArray(item.schedule)) {
      item.schedule = item.schedule.sort(
        (a, b) => new Date(a.days[0]).getTime() - new Date(b.days[0]).getTime()
      );
      item.schedule = item.schedule.map((schedule) => {
        if (schedule.days.length === 2) {
          schedule.days = fethDaysRange(...schedule.days);
        }
        return schedule;
      });
      // console.log('@@@@@@@@', JSON.parse(JSON.stringify(item)))
      return item;
    }
    return item;
  });
  data.value = splitSchedule(data.value);
};

const checkValidator = () => {
  const keys = ["type", "name", "schedule"];
  const scheduleKeys = [
    "id",
    "name",
    "desc",
    "backgroundColor",
    "textColor",
    "days",
  ];
  props.data.forEach((item) => {
    if (item.type === "normal") {
      const arr = Object.keys(item);
      const res = keys.find((v) => !arr.includes(v));
      if (res) {
        throw new Error(`项目缺少${res}项`);
      }
      item.schedule.forEach((v) => {
        if (!v.list) {
          const arrs = Object.keys(v);
          const ress = scheduleKeys.find((val) => !arrs.includes(val));
          if (ress) {
            throw new Error(`日程缺少${ress}项`);
          }
        }
      });
    }
  });
};

// Вычислить текущий стиль окна
const computedStyle = (parent, item) => {
  let res = {};
  if (parent.type === "alike") {
    // Весь единый стиль
    res = {
      ...res,
      backgroundColor: parent.color,
    };
  }
  if (item && item.type === "works") {
    res = {
      ...res,
      backgroundColor: item.backgroundColor,
      color: item.textColor,
      width: item.width + "px",
      marginLeft: -item.left + "px",
    };
  }
  return res;
};

// *******************************
// Вычислить ширину, которую текущий диапазон расписания должен отображать в указанном диапазоне дат (при условии, что все диапазоны расписания допустимы).
const computeWordWidth = (schedule, days) => {
  const hasFirst = todayInRange(schedule[0], [
    days[0].date,
    days[days.length - 1].date,
  ]);
  const hasLast = todayInRange(schedule[schedule.length - 1], [
    days[0].date,
    days[days.length - 1].date,
  ]);
  if (hasFirst && hasLast) {
    return schedule.length * props.itemWidth;
  }
  if (!hasFirst && hasLast) {
    // Без головы и без хвоста
    return (
      fethDaysRange(days[0].date, schedule[schedule.length - 1]).length *
      props.itemWidth
    );
  } else if (hasFirst && !hasLast) {
    // Начало без хвоста
    return (
      fethDaysRange(schedule[0], days[days.length - 1].date).length *
      props.itemWidth
    );
  } else if (!hasFirst && !hasLast) {
    // Нет ни головы, ни хвоста. Текущее расписание напрямую охватывает текущий диапазон графика отображения.
    return (
      fethDaysRange(days[0].date, days.at(-1).date).length * props.itemWidth
    );
  }
  throw new Error("computeWordwidth Исключение из расчета ширины！");
};

// Была ли текущая дата добавлена ​​к окончательным результатам. Проверьте, есть ли текущая дата в списке окончательных результатов.
const _checkTodayInResult = (today, result) => {
  return !!result.find((item) => item.date === today);
};

// Проверяет, присутствует ли текущая дата в расписании указанного проекта.
const _checkTodayIsWork = (today, schedule) => {
  return schedule.days.includes(today);
};

// Проверяем, есть ли текущая дата в списке расписаний, добавленном в конечный результат
const _checkTodayInAllWorkList = (today, result) => {
  const res = result.filter((item) => item.type === "works");
  return !!_checkTodayInWorkList(today, res);
};

// Проверяет, находится ли текущая дата в указанном списке расписаний.
const _checkTodayInWorkList = (today, workList) => {
  return !!workList.find((item) => item.days.includes(today));
};

// Обработка двумерного массива диапазона дат в одномерный массив, подходящий для визуализации расписания.
const _flatDateRange = (dateRange) => {
  return dateRange.flat(1).map((item) => {
    return {
      type: "normal",
      date:
        String(item.year).padStart(4, "0") +
        "-" +
        String(item.month).padStart(2, "0") +
        "-" +
        String(item.day).padStart(2, "0"),
    };
  });
};

// Проверьте перекрывающийся диапазон двух графиков
const _checkWorkRepeatRange = (workA, workB) => {
  return workA.days.filter((item) => workB.days.includes(item));
};

// Найдите информацию о расписании на указанную дату из окончательных результатов.
const _findTodayForWork = (today, res) => {
  return res.find((item) => item.type === "works" && item.days.includes(today));
};

// Обновить существующее расписание
const _updateScheduleItem = (scheduleItem, result) => {
  // Проверьте, нет ли совпадений в текущем расписании, которое необходимо обновить.
  const inWorkInfo = _findTodayForWork(scheduleItem.days[0], result);
  if (inWorkInfo && scheduleItem.id !== inWorkInfo.id) {
    // Получить перекрывающийся диапазон
    const repeatList = _checkWorkRepeatRange(inWorkInfo, scheduleItem);
    const start = scheduleItem.days.slice(repeatList.length)[0];
    const index = result.findIndex((item) => item.date === start);
    result[index] = {
      type: "works",
      date: scheduleItem.days[0],
      width: computeWordWidth(scheduleItem.days, result),
      // width: 240 + 'px',
      left: repeatList.length * props.itemWidth,
      ...scheduleItem,
    };
  } else {
    // Обычное обновление (от начала до конца)
    const index = result.findIndex(
      (item) => item.date === scheduleItem.days[0]
    );
    result[index] = {
      type: "works",
      date: scheduleItem.days[0],
      width: computeWordWidth(scheduleItem.days, result),
      left: 0,
      ...scheduleItem,
    };
  }
  // Чтобы добавить новое расписание, вам необходимо одновременно удалить и обновить список расписаний, а также удалить некоторые расписания, которые изначально были пустыми.
  result = result.filter((item) => {
    return !(item.type === "normal" && scheduleItem.days.includes(item.date));
  });
  return result;
};

//  *****************************************

watchEffect(() => {
  sortFilterData();
  if (props.repeatMode.mode === "extract") {
    data.value = workListSplitForRepeat(data.value, props.repeatMode);
    data.value = splitSchedule(data.value);
  }
  // console.log('最新data', data.value)
  // nextTick(() => {
  //   contentScroll();
  // });
});

// EMITS
// = Эмитим наверх клик
const scheduleClick = (item: any) => {
  emit("scheduleClick", item);
};
// = Считаем что дошли до конца по x и эмитим
const onScrollX = event => {
  if(timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    const target = event.target
    const width = Math.ceil(Math.max(target.clientWidth, target.scrollWidth))
    if((target.scrollLeft + target.clientWidth) >= width) {
      emit('scrollXEnd', event)
    }
  }, 200)
}
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
  background-color: #eab3c9;
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
/* date list */
.date-list {
  width: 100%;
  height: 120px;
  display: flex;
}
.first-date-list {
  border-left: none;
}
.month-item {
  background-color: #c9accd;
  width: auto;
  height: 100%;
  border-bottom: var(--border);
  display: flex;
  flex-direction: column;
}
.month {
  flex: 1;
  border-left: var(--border);
  border-bottom: var(--border);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.month-item:first-child .month {
  border-left: none;
}
.day-box {
  flex: 2;
  display: flex;
}
.day-item {
  width: var(--itemWidth);
}
.day {
  width: var(--itemWidth);
  height: 50%;
  border-left: var(--border);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.first-day-item .day:first-child {
  border-left: none;
}
.week {
  width: var(--itemWidth);
  height: 50%;
  flex-shrink: 0;
  border-left: var(--border);
  border-top: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}
.day-item:first-child .week {
  border-left: none;
}
/* schedule */
.schedule-box {
  max-height: v-bind(ganttInnerHeight);
  overflow-y: auto;
  position: absolute;
  left: 0;
  bottom: 0;
}
.schedule-box::-webkit-scrollbar {
  /*Общий стиль полосы прокрутки*/
  width: 0; /*Высота и ширина соответствуют размеру горизонтальной и вертикальной полос прокрутки*/
  height: 0;
}
.date-box {
  height: var(--itemHeight);
  display: flex;
}
.date-box .date-item:first-child {
  border-left: none;
}
.date-item {
  flex-shrink: 0;
  width: var(--itemWidth);
  height: var(--itemHeight);
  border-left: var(--border);
  border-bottom: var(--border);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.date-item:first-child {
  /* border-bottom: none; */
}
.work-desc {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  line-height: calc(var(--itemHeight) / 2);
  text-align: center;
  font-size: 12px;
  overflow: hidden;
  box-sizing: border-box;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.work-desc:first-child {
  border-left: none;
}
.date-item-work {
  cursor: pointer;
  position: relative;
  z-index: 1;
}
.date-active {
  background-color: #caf2ff;
}
</style>
