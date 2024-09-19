<template>
  <Container style="padding-top: 5rem">
    GanttChart
    <br />

    <GanttChart
      ref="gantt"
      :data="data"
      :activeDate="activeDate"
      itemText="Project"
      dateText="Date"
      :dateRangeList="dateRangeList"
      :itemWidth="width"
      :itemHeight="height"
      @scheduleClick="onScheduleClick"
    />
    <br />

    <div>
      <div @click="today">
        <span style="cursor: pointer; color: var(--bs-primary)">Сегодня</span>
      </div>
      <Gantt
        :data="data"
        :activeDate="activeDate"
        itemText="Project"
        dateText="Date"
        :dateRangeList="dateRangeList"
        :itemWidth="width"
        :itemHeight="height"
        :repeatMode="{
          mode: 'cover',
        }"
        @scheduleClick="onScheduleClick"
      />
    </div>
  </Container>
</template>

<script lang="ts" setup>
// Components
import { Container } from "@/shared/container";
import { GanttChart } from "@/components/ganttchart";
//Utils
// https://www.npmjs.com/package/vue3-gantt
// https://blog.ddamy.com/assets/demo/gantt/https://blog.ddamy.com/assets/demo/gantt/
// https://github.com/ddmy/vue3-gantt/blob/master/src/App.vue

import {
  fethDaysRange,
  fetchThreeDays,
  fetchTodayMonthRange,
  fetchPrevMonthRange,
  fetchNextMonthRange,
} from "~/utils/gantt/index";

import Gantt from "vue3-gantt";
import "vue3-gantt/dist/style.css";

// Variables
const gantt = ref(null);
const activeDate = ref("2024-09-18");
const dateRangeList = ref(["2022-01-03", "2024-09-30"]);
const data = ref([
  {
    type: "normal",
    color: "",
    name: "М1.0",
    schedule: [
      {
        id: 1,
        name: "Подготовительные действия",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "rgb(253, 211, 172)",
        textColor: "rgb(245, 36, 9)",
        days: ["2022-01-15", "2022-01-19"],
      },
      {
        id: 2,
        name: "Откоппать котлован М1.0",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "rgb(253, 211, 172)",
        textColor: "rgb(245, 36, 9)",
        days: ["2022-01-19", "2022-01-23"],
      },
      {
        id: 3,
        name: "Высртраивание обпалубки М1.0",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "#28f",
        textColor: "#fff",
        days: ["2022-01-24", "2022-02-02"],
      },
      {
        id: 4,
        name: "Заливка бетона М1.0",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "#28f",
        textColor: "#fff",
        days: ["2022-02-02", "2022-02-08"],
      },
    ],
  },
  {
    type: "normal",
    color: "",
    name: "M13.8",
    schedule: [
      {
        id: 5,
        name: "Обустройство опулубки оси е05",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "#482",
        textColor: "#fff",
        days: ["2022-01-08", "2022-02-22"],
      },
    ],
  },
  {
    type: "normal",
    color: "",
    name: "Meteor Butterfly Sword Meteor",
    schedule: [
      {
        id: 6,
        name: "Подготовительные действия",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "rgb(253, 211, 172)",
        textColor: "rgb(245, 36, 9)",
        days: ["2022-01-12", "2022-01-15"],
      },
      {
        id: 7,
        name: "Chinese New Year Event",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "#482",
        textColor: "#fff",
        days: ["2022-02-25", "2022-03-10"],
      },
      {
        id: 8,
        name: "Chinese New Year Event",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "#482",
        textColor: "#fff",
        days: ["2023-02-26", "2023-03-07"],
      },
    ],
  },
]);

// CODE
const width = ref(60);
const height = ref(40);
onMounted(() => {
  // Horizontal scroll by mouse wheel
  // inner
  const scrollContainers = document.querySelectorAll(".inner");
  if (scrollContainers) {
    scrollContainers.forEach((item) => {
      item.addEventListener("wheel", function (event) {
        // останавливаем поведение по умолчанию, то есть прокрутку
        if (event) {
          // console.log(event);
          item.scrollLeft += event.deltaY;
        }
      });
    });
  }

  // gantt-chart_inner
  const scrollChartContainer = document.querySelector(".gantt-chart_inner");
  if (scrollChartContainer) {
    scrollChartContainer.addEventListener("wheel", function (event) {
      // останавливаем поведение по умолчанию, то есть прокрутку
      if (event) {
        // console.log(event);
        scrollChartContainer.scrollLeft += event.deltaY;
      }
    });
  }
});

const onScheduleClick = (item: any) => {
  console.log(item);
};

const today = () => {
  const now = new Date();
  const arr = fetchTodayMonthRange();
  activeDate.value = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  dateRangeList.value = [arr[0], arr.at(-1)];
};

useHead({
  title: "GantChart # ",
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

<style>
.gantt .guide {
  width: unset !important;
}
.gantt .guide .item-name-list {
  max-height: unset !important;
  overflow-y: hidden !important;
}
.gantt .guide .item-name-list::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
.gantt .guide .guide-name {
  width: 150px !important;
  word-break: normal !important;
  padding: 0 !important;
  text-align: center !important;
}
.gantt .guide .desc {
  width: unset !important;
}
.gantt .inner .schedule-box {
  max-height: unset !important;
  bottom: unset !important;
}
.date-item {
  opacity: 0.7;
}
.date-item:hover {
  opacity: 1;
}
.inner::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
.schedule-box::-webkit-scrollbar {
  width: 0 !important;
}
</style>
