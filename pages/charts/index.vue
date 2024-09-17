<template>
  <Container style="padding-top: 5rem">
    GanttChart
    <br />

    <GanttChart />
    <br />

    <div>
      <Gantt
        :data="data"
        :activeDate="activeDate"
        itemText="Project"
        dateText="Date"
        :dateRangeList="dateRangeList"
        :itemWidth="width"
        :itemHeight="height"
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

import Gantt from "vue3-gantt";
import "vue3-gantt/dist/style.css";

// Variables
const activeDate = ref("2022-02-14");
const dateRangeList = ref(["2022-01-03", "2022-07-05"]);
const data = ref([
  {
    type: "normal",
    color: "",
    name: "М1.0",
    schedule: [
      {
        id: 333331,
        name: "Подготовительные действия",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "rgb(253, 211, 172)",
        textColor: "rgb(245, 36, 9)",
        days: ["2022-01-12", "2022-01-15"],
      },
      {
        id: 333330,
        name: "Откоппать котлован М1.0",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "rgb(253, 211, 172)",
        textColor: "rgb(245, 36, 9)",
        days: ["2022-01-15", "2022-01-24"],
      },
      {
        id: 555550,
        name: "Высртраивание обпалубки М1.0",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "#28f",
        textColor: "#fff",
        days: ["2022-01-24", "2022-02-02"],
      },
      {
        id: 555551,
        name: "Заливка бетона М1.0",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "#28f",
        textColor: "#fff",
        days: ["2022-02-02", "2022-02-07"],
      },
    ],
  },
  {
    type: "normal",
    color: "",
    name: "M13.8",
    schedule: [
      {
        id: 222221,
        name: "Обустройство опулубки оси е05",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "#482",
        textColor: "#fff",
        days: ["2022-02-08", "2022-02-22"],
      },
    ],
  },
  {
    type: "normal",
    color: "",
    name: "Meteor Butterfly Sword",
    schedule: [
      {
        id: 222223,
        name: "Chinese New Year Event",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "#482",
        textColor: "#fff",
        days: ["2022-02-25", "2022-03-10"],
      },
      {
        id: 222224,
        name: "Подготовительные действия",
        desc: "This event is very important, generating millions of revenue. It is a cross-departmental collaboration and a major project with the CEO personally present to command. Everyone must work together!",
        backgroundColor: "rgb(253, 211, 172)",
        textColor: "rgb(245, 36, 9)",
        days: ["2022-01-12", "2022-01-15"],
      },
    ],
  },
]);

// CODE
const width = ref(80);
const height = ref(50);
onMounted(() => {
  // Horizontal scroll by mouse wheel
  const scrollContainer = document.querySelector(".inner");
  if (scrollContainer) {
    scrollContainer.addEventListener("wheel", function (event) {
      // останавливаем поведение по умолчанию, то есть прокрутку
      if (event) {
        // console.log(event);
        scrollContainer.scrollLeft += event.deltaY;
      }
    });
  }
});

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
}
.gantt .guide .guide-name {
  text-wrap: nowrap;
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
