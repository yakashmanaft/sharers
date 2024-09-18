<template>
  <Container>
    <!-- Modal show date details -->
    <div
      class="modal"
      id="showDateDetailsModal"
      tabindex="-1"
      aria-labelledby="showDateDetailsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h2 class="modal-title fs-5" id="showDateDetailsModalLabel">
              <div v-if="calendarSelectedDates">
                <span v-if="calendarSelectedDates.length === 1">{{
                  calendarSelectedDates[0]
                }}</span>
                <span v-else
                  >{{ calendarSelectedDates[0] }} -
                  {{
                    calendarSelectedDates[calendarSelectedDates.length - 1]
                  }}</span
                >
              </div>
            </h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div
            class="modal-header"
            style="padding-bottom: unset; border-bottom: unset"
          >
            <!-- TABS TITLE -->
            <Tabs
              :tabs="titles"
              :default="current_title_name"
              @name_changed="emittedName"
            ></Tabs>
          </div>

          <!-- MODAL BODY -->
          <div class="modal-body" style="scrollbar-width: none">
            <!-- Tabs -->
            <div v-if="calendarSelectedDates" class="title_tabs">
              <!--  -->
              <filter_radio_group
                :tabs="tabs_filter_by_project"
                :default="{
                  title: 'Все',
                  name: 'all',
                  id: null,
                }"
                :btn_all_exist="true"
                @changed="emittedProject"
              />
              <!--  -->
              <!-- <br />
              {{ curret_choosen_project }} -->

              <!-- CONTENT -->
              <div class="content" style="margin-top: 1rem">
                <!-- demands content -->
                <div v-if="current_title_name === 'demands'">Заявочки</div>

                <!-- production content -->
                <div v-if="current_title_name === 'production'">
                  <!--  -->
                  <div>
                    Фильтры: (запланировано / в процессе / выполнено) : (банда)
                    : (проект)
                  </div>
                  <div>
                    <div>
                      Задача 1 (Захватка 1)
                      ------------------------------------------------- deadline
                    </div>
                    <div>Подзадача 1 ------------- deadlineGantt</div>
                    <div>
                      Подзадача 2 ---------------------------------------
                      deadline
                    </div>
                    <div>
                      Заявка --------------------------------------- deadline
                    </div>
                  </div>
                  <!-- <div
                    v-for="el in computedProductionList"
                    style="margin-bottom: 1rem"
                  >
                    {{ el }}
                  </div> -->
                  <!-- {{ el.date }} | {{  el.title  }} | {{ el.desc }} | {{ el.price }} * {{ el.qty }} = {{ el.price * el.qty }} | project: {{  el.projectID  }} | band: {{  el.bandID  }} (В процессе / Выполнено) -->
                </div>

                <!-- production content -->
                <div v-if="current_title_name === 'working-hours'">
                  <!--  -->
                  <div class="projects-sharers_container">
                    <div
                      v-if="computedProjectSharerList.length"
                      class="project-sharer_wrapper"
                    >
                      <div class="projects-sharers-list">
                        <div
                          v-for="sharer in computedProjectSharerList"
                          class="sharers-list_item"
                        >
                          {{ sharer }}
                        </div>

                        <!-- GANTT -->
                        <Gantt
                          :data="data"
                          :activeDate="activeDate"
                          itemText="Sharers"
                          dateText="Date"
                          :dateRangeList="dateRangeList"
                          :itemWidth="width"
                          :itemHeight="height"
                        />
                      </div>
                    </div>
                    <div v-else class="project-sharer_wrapper">
                      В проекте нет соучастников
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- MODAL FOTER -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Отменить
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar container-->
    <div class="calendar_container">
      <!-- Calendar wrapper -->
      <div class="calendar_wrapper">
        <div id="calendar"></div>
        <div class="calendar-btn_today" @click="setDateToday(date_today)">
          Сегодня
        </div>
      </div>

      <!-- BTN open modal #showDateDetailsModal-->
      <div
        class="show-date-details_btn"
        :data-bs-toggle="calendarSelectedDates ? `modal` : ''"
        :data-bs-target="calendarSelectedDates ? `#showDateDetailsModal` : ''"
      >
        <div class="btn_wrapper" v-if="calendarSelectedDates">
          <!--  -->
          <p v-if="calendarSelectedDates.length === 1" style="margin: 0">
            <span v-if="calendarSelectedDates[0] === date_today">Сегодня</span>
            <span v-else>{{ calendarSelectedDates[0] }}</span>
          </p>
          <!--  -->
          <p v-else style="margin: 0">
            <span
              >{{ calendarSelectedDates[0] }} -
              {{
                calendarSelectedDates[calendarSelectedDates.length - 1]
              }}</span
            >
          </p>
          <span>Смотреть</span>
        </div>
        <!-- <div
        v-else
        class="btn_wrapper"
        style="padding-top: 0.25rem; padding-bottom: 0.25rem"
      >
        Выберите дату в календаре
      </div> -->
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
// Components
import { Container } from "@/shared/container";
import { Tabs } from "@/components/tabs";
import { filter_radio_group } from "~/components/filters_radio_btns";

// Plugins
import VanillaCalendar from "vanilla-calendar-pro";
import { type IOptions } from "vanilla-calendar-pro/types";
// import "vanilla-calendar-pro/build/vanilla-calendar.min.css";

import Gantt from "vue3-gantt";
import "vue3-gantt/dist/style.css";

// variables

// = session user
const { user } = useUserSession();
// = session user projects
const { loadProjectsData } = useProjectsStore();
const { projects } = storeToRefs(useProjectsStore());

// = titles
const titles = ref([
  {
    title: "Заявки",
    name: "demands",
    guard: false,
  },
  {
    title: "План-график",
    name: "production",
    guard: false,
  },
  {
    title: "Учет времени",
    name: "working-hours",
    guard: false,
  },
]);
const current_title_name = ref("demands");

// filter_radio_select
const tabs_filter_by_project = ref([]);

const curret_choosen_project = ref({
  title: "Все",
  name: "all",
  id: null,
});

// = date_today
const date = new Date();
const date_today = ref(
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0]
);

// = Calendar
const calendarSelectedDates: any = ref();
const options: IOptions = {
  type: "multiple",
  months: 3,
  jumpToSelectedDate: true,
  jumpMonths: 1,
  settings: {
    range: {
      disablePast: false,
    },
    selection: {
      day: "multiple-ranged",
      // time: 24,
    },
    visibility: {
      daysOutside: false,
    },
    selected: {
      dates: [],
      // dates: ['2022-01-09:2022-01-13', '2022-01-22'],
    },
    lang: "ru",
  },
  actions: {
    clickDay(e, self) {
      if (self) {
        if (self.selectedDates[0]) {
          calendarSelectedDates.value = self.selectedDates;
        } else {
          calendarSelectedDates.value = null;
        }
      }
    },
  },
  //   CSSClasses: {
  //     vanillaCalendarDay: 'vanilla-calendar-day_custom'
  //   }
};

// GANTT
const width = ref(60);
const height = ref(40);
const activeDate = ref(date_today.value);
const dateRangeList = ref(["2024-03-21", date_today.value]);
const data = ref([
  {
    type: "normal",
    color: "",
    name: "Иванов И.И.",
    schedule: [],
  },
]);

// On Mounted
onMounted(async () => {
  await loadProjectsData();
  console.log(projects.value);
  // = Calendar
  setDateToday(null);
  // computed project filter tabs

  tabs_filter_by_project.value = computedProjects.value?.map((el) => {
    return {
      title: el.title,
      name: `project_${el.id}`,
      id: el.id,
    };
  });
  //   close modal and reset data #showDateDetailsModal
  const showDateDetailsModalEl = document.getElementById(
    "showDateDetailsModal"
  );
  if (showDateDetailsModalEl) {
    showDateDetailsModalEl.addEventListener("hidden.bs.modal", (event) => {
      console.log("Модалка #showDateDetailsModal закрыта");
      //   current_title_name.value = "demands";
    });
  }
});

// FUNCs
// = set
const setDateToday = (today: any) => {
  const calendar = new VanillaCalendar("#calendar", options);
  calendar.init();
  if (today) {
    calendarSelectedDates.value = [date_today.value];
    calendar.update({
      dates: true,
    });
  } else {
    calendarSelectedDates.value = null;
  }
};

// COMPUTED
// = computed projects
const computedProjects = computed(() => {
  let result = [];
  if (projects.value) {
    result = [...projects.value];
    return result;
  }
});

const computedProjectSharerList = computed(() => {
  let result = [];
  if (projects.value) {
    if (curret_choosen_project.value.name === "all") {
      result.push({ a: "показываем соучастников по всем проектам" });
    } else {
      let current_project = [...projects.value].find(
        (el) => el.id === curret_choosen_project.value.id
      );
      if (current_project) {
        if (current_project.sharers) {
          result = [...current_project.sharers];
        }
      }
      // result.push({a: 'показываем соучатсников по выбранному проекту'}, { b: curret_choosen_project.value})
    }
    return result;
  }
});

// = computed production
// const computedProductionList = computed(() => {
//   let result: any = [];
//   if (salary.value) {
//     [...salary.value].forEach((item) => {
//       if (item.listProduction) {
//         item.listProduction.forEach((element) => {
//           result.push({
//             // id: item.id,
//             bandID: item.bandID,
//             projectID: element.projectID,
//             date: element.date,
//             title: element.title,
//             desc: element.desc,
//             price: element.price,
//             qty: element.qty,
//           });
//         });
//       }
//     });

//     return result;
//   }
// });

// EMITS FUNC
// = title name
const emittedName = (name: string) => {
  current_title_name.value = name;
};
//
const emittedProject = (project: string) => {
  curret_choosen_project.value = project;
};

// DB
// = salary
const { data: salary } = await useFetch("/api/funds/salary", {
  lazy: false,
  transform: (salary) => {
    return salary;
  },
});
// = organizations
const { data: organizations } = await useFetch(
  "/api/organizations/organizations",
  {
    lazy: false,
  }
);
// = projects
// const { data: projects } = await useFetch("/api/projects/projects", {
//   lazy: false,
// });
// users
const { data: users } = await useFetch("/api/usersList/users", {
  lazy: false,
});

// WATCH
// = следим за выобором дат в календаре
// watch(calendarSelectedDates, () => {

//   if (calendarSelectedDates.value === null) {

//   }
// });

// page head
useHead({
  title: "Календарь",
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
  style: ["~/assets/css/vanilla-calendar.min.css"],
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
/* CALENDAR */
.calendar_container {
  margin-top: 5rem;
  position: fixed;
  left: 0;
  width: 100vw;
  display: flex;
}
.calendar_wrapper {
  flex-grow: 1;
  position: relative;
  max-width: 1399px;
  margin: 0 auto;
}
.vanilla-calendar {
  width: 100%;
  height: 100vh;
  border-radius: unset;
  margin-bottom: 10rem;
  /* overflow-x: scroll!important; */
  /* scrollbar-width: none!important; */
}
/* .vanilla-calendar::-webkit-scrollbar {
  display: none;
} */
.vanilla-calendar-day {
  /* height: 100% !important; */
}
/* .vanilla-calendar-day__btn_selected {
} */
.calendar-btn_today {
  position: absolute;
  top: 0.25rem;
  left: 3rem;
  color: var(--bs-primary);
  background-color: var(--bs-body-bg);
  padding: 2px 8px;
  border-radius: 1rem;
}
.calendar-btn_today:hover {
  cursor: pointer;
}

/* TITTLES */
/* .titles_container {
} */

/* MODAL SHOW DATE DETAILS */
.show-date-details_btn {
  position: fixed;
  bottom: 3rem;
  left: 0;
  width: 100%;
  background-color: var(--bs-primary);
  /* padding: 1rem 0; */
  transition: all 0.2s ease-in;
}
.show-date-details_btn:hover {
  cursor: pointer;
  filter: brightness(90%);
}
.btn_wrapper {
  max-width: 1399px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--bs-body-bg);
  padding: 1rem 0.5rem;
}
/* .btn_wrapper p {
} */
.btn_wrapper p span {
  color: unset;
  background-color: unset;
}

.btn_wrapper span {
  color: var(--bs-primary);
  padding: 2px 8px;
  background-color: var(--bs-primary-bg-subtle);
  border-radius: 1rem;
}

.vanilla-calendar {
  padding: 0 !important;
}

/* MODAL SHOW DATE DETAILS */
#showDateDetailsModal {
  --bs-modal-width: 80%;
}
#showDateDetailsModal .modal-dialog {
  margin-top: 0;
  margin-right: 0;
  margin-bottom: 0 !important;
}
#showDateDetailsModal .modal-dialog-centered {
  align-items: unset;
  min-height: 100%;
}
#showDateDetailsModal .modal-content {
  border-top: none;
  border-bottom: none;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* Projects sharer list */
.projects-sharers_container {
}
.project-sharer_wrapper {
}
.projects-sharers-list {
}
.sharers-list_item {
}

/* GANTT */
/* .gantt .guide {
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
} */

@media screen and (max-width: 575px) {
  /* .container {
  } */
  .calendar_container {
    margin-top: 4rem;
    padding: 0 !important;
  }
  .calendar-btn_today {
    top: 0.2rem;
    left: 1.2rem;
  }
  /* .show-date-details_btn {
    bottom: 3rem;
  } */
  /* modal show date info */
  .btn_wrapper {
    padding: 1rem 0.5rem;
  }
  #showDateDetailsModal .modal-body {
    padding: 1rem 0;
    /* overflow-y: hidden!important; */
    /* scrollbar-width: none; */
  }
  /* #showDateDetailsModal .modal-body::-webkit-scrollbar {
    width: 0!important;;
  } */
  #showDateDetailsModal .modal-body .content {
    padding: 0 1rem;
  }
}
@media screen and (min-width: 576px) and (max-width: 768px) {
  .calendar_container {
    margin-top: 4rem;
    height: 100vh;
  }
  .calendar-btn_today {
    top: 0.15rem;
  }
  /* .show-date-details_btn {
    bottom: 4rem;
  } */
}

@media screen and (min-width: 769px) {
  .calendar_container {
    margin-top: 6rem;
  }
  .show-date-details_btn {
    bottom: 0;
  }
  /* .show-date-details_btn {
    bottom: 4.7rem;
  } */
}
</style>
