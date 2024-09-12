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
              <!-- CONTENT -->
              <div v-if="calendarSelectedDates" class="content">
                <!-- demands content -->
                <div v-if="current_title_name === 'demands'">Заявочки</div>

                <!-- production content -->
                <div v-if="current_title_name === 'production'">
                  <div>
                    Фильтры: (запланировано / в процессе / выполнено) : (банда)
                    : (проект)
                  </div>
                  <div
                    v-for="el in computedProductionList"
                    style="margin-bottom: 1rem"
                  >
                    {{ el }}
                    <!-- {{ el.date }} | {{  el.title  }} | {{ el.desc }} | {{ el.price }} * {{ el.qty }} = {{ el.price * el.qty }} | project: {{  el.projectID  }} | band: {{  el.bandID  }} (В процессе / Выполнено) -->
                  </div>
                </div>

                <!-- production content -->
                <div v-if="current_title_name === 'working-hours'">
                  Отработанные часы соучастников
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
        <div class="calendar-btn_today" @click="setDateToday">Сегодня</div>
      </div>

      <!-- BTN open modal #showDateDetailsModal-->
      <div
        class="show-date-details_btn"
        :data-bs-toggle="calendarSelectedDates ? `modal` : ''"
        :data-bs-target="calendarSelectedDates ? `#showDateDetailsModal` : ''"
      >
        <div>
          <div class="btn_wrapper" v-if="calendarSelectedDates">
            <p style="margin: 0">
              <span v-if="calendarSelectedDates.length === 1">{{
                calendarSelectedDates[0]
              }}</span>
              <span v-else
                >{{ calendarSelectedDates[0] }} -
                {{
                  calendarSelectedDates[calendarSelectedDates.length - 1]
                }}</span
              >
            </p>
            <span>Смотреть</span>
          </div>
          <div
            v-else
            class="btn_wrapper"
            style="padding-top: 0.25rem; padding-bottom: 0.25rem"
          >
            Выберите дату в календаре
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
// Components
import { Container } from "@/shared/container";
import { Tabs } from "@/shared/tabs";

// Plugins
import VanillaCalendar from "vanilla-calendar-pro";
import { type IOptions } from "vanilla-calendar-pro/types";
// import "vanilla-calendar-pro/build/vanilla-calendar.min.css";

// variables

// = session user
const { user } = useUserSession();
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

// = date_today
const date = new Date();
// const date_today = ref((new Date()).toISOString().split('T')[0])
const date_today = ref(
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0]
);

// = Calendar
const calendarSelectedDates: any = ref([date_today.value]);
const options: IOptions = {
  jumpToSelectedDate: true,
  settings: {
    selection: {
      day: "multiple-ranged",
      // time: 24,
    },
    selected: {
      dates: [date_today.value],
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

// On Mounted
onMounted(async () => {
  // = Calendar
  setDateToday();
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
const setDateToday = () => {
  const calendar = new VanillaCalendar("#calendar", options);
  calendar.init();
  calendar.update({
    dates: true,
  });
  calendarSelectedDates.value = [date_today.value];
};

// COMPUTED
// = computed production
const computedProductionList = computed(() => {
  let result: any = [];
  if (salary.value) {
    [...salary.value].forEach((item) => {
      if (item.listProduction) {
        item.listProduction.forEach((element) => {
          result.push({
            // id: item.id,
            bandID: item.bandID,
            projectID: element.projectID,
            date: element.date,
            title: element.title,
            desc: element.desc,
            price: element.price,
            qty: element.qty,
          });
        });
      }
    });

    return result;
  }
});

// EMITS FUNC
// = title name
const emittedName = (name: string) => {
  current_title_name.value = name;
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
  height: 98vh;
  width: 100vw;
  display: flex;
}
.calendar_wrapper {
  flex-grow: 1;
  position: relative;
}
.vanilla-calendar {
  width: 100%;
  height: 85%;
  border-radius: unset;
}
.vanilla-calendar-day {
  height: 100% !important;
}
/* .vanilla-calendar-day__btn_selected {
} */
.calendar-btn_today {
  position: absolute;
  top: 0.25rem;
  left: 3rem;
  color: var(--bs-primary);
}
.calendar-btn_today:hover {
  cursor: pointer;
}

/* TITTLES */
/* .titles_container {
} */

/* MODAL SHOW DATE DETAILS */
.show-date-details_btn {
  position: absolute;
  bottom: 4rem;
  left: 0;
  width: 100%;
  background-color: var(--bs-primary);
  padding: 1rem 0;
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
  padding: 0 1rem;
}
/* .btn_wrapper p {
} */
.btn_wrapper p span {
  color: unset;
  background-color: unset;
}

.btn_wrapper span {
  color: var(--bs-primary);
  padding: 4px 12px;
  background-color: var(--bs-primary-bg-subtle);
  border-radius: 1rem;
}

.vanilla-calendar {
  padding: 0 !important;
}

/* MODAL SHOW DATE DETAILS */
#showDateDetailsModal {
  --bs-modal-width: 60%;
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

@media screen and (max-width: 575px) {
  /* .container {
  } */
  .calendar_container {
    margin-top: 4rem;
    padding: 0 !important;
  }
  .calendar-btn_today {
    top: 0.25rem;
    left: 2rem;
  }
  .show-date-details_btn {
    bottom: 3rem;
  }
  /* modal show date info */
  .btn_wrapper {
    padding: 0 0.5rem;
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
  .show-date-details_btn {
    bottom: 4rem;
  }
}

@media screen and (min-width: 769px) {
  .calendar_container {
    margin-top: 6rem;
  }
  .show-date-details_btn {
    bottom: 4.7rem;
  }
}
</style>
