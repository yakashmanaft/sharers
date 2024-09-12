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
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h2 class="modal-title fs-5" id="showDateDetailsModalLabel">
              Период дат
            </h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <!-- MODAL BODY -->
          <div class="modal-body"></div>

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
        v-if="calendarSelectedDates"
        class="show-date-details_btn"
        data-bs-toggle="modal"
        data-bs-target="#showDateDetailsModal"
      >
        <div class="btn_wrapper">
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
          <span>Развернуть</span>
        </div>
      </div>

      <!-- List of events -->
      <!-- <div v-if="calendarSelectedDates">{{ calendarSelectedDates }}</div>
      <div v-else>Выберите даты</div> -->

      <!-- Tabs -->
      <!-- <div v-if="calendarSelectedDates" class="title_tabs">
        <Tabs
          :tabs="titles"
          :default="'demands'"
          @name_changed="emittedName"
        ></Tabs>
      </div> -->

      <!-- Content -->
      <!-- <div v-if="calendarSelectedDates">{{ current_title_name }}</div> -->
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
import "vanilla-calendar-pro/build/vanilla-calendar.min.css";

// variables

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
};

// On Mounted
onMounted(async () => {
  // = Calendar
  setDateToday();
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

// EMITS FUNC
// = title name
const emittedName = (name: string) => {
  current_title_name.value = name;
};

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
.calendar-btn_today {
  position: absolute;
  top: 1.25rem;
  left: 3rem;
}
.calendar-btn_today:hover {
  cursor: pointer;
}

/* TITTLES */
.titles_container {
}

/* MODAL SHOW DATE DETAILS */
.show-date-details_btn {
  position: absolute;
  bottom: 4rem;
  left: 0;
  width: 100%;
  background-color: var(--bs-primary);
  padding: 1rem 0;
}
.show-date-details_btn:hover {
  cursor: pointer;
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
  background-color: var(--bs-primary-bg-subtle);
  padding: 4px 8px;
  border-radius: 1rem;
  color: var(--bs-primary);
}

@media screen and (max-width: 575px) {
  .container {
  }
  .calendar_container {
    padding: 0 !important;
  }
  .vanilla-calendar {
    padding: 0 !important;
  }
  .calendar-btn_today {
    top: 0.25rem;
    left: 2rem;
  }
}
@media screen and (min-width: 576px) and (max-width: 768px) {
  .calendar_container {
    margin-top: 3rem;
    height: 100vh;
  }
  .show-date-details_btn {
    bottom: 3rem;
  }
}
</style>
