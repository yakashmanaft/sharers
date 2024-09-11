<template>
    <Container>
        
        <!-- Calendar container-->
        <div class="calendar_container">

            <!-- Calendar wrapper -->
            <div class="calendar_wrapper">
                <div id="calendar"></div>
                <div class="calendar-btn_today" @click="setDateToday">Сегодня</div>
            </div>

            <!-- List of events -->
            <div v-if="calendarSelectedDates">{{ calendarSelectedDates }}</div>
            <div v-else>Выберите даты</div>

            <!-- Tabs -->
            <div v-if="calendarSelectedDates" class="title_tabs">
                <Tabs :tabs="titles" :default="'demands'" @name_changed="emittedName"></Tabs>
            </div>

            <!-- Content -->
            <div v-if="calendarSelectedDates">{{ current_title_name }}</div> 
        </div>

    </Container>
</template>

<script lang="ts" setup>
// Components
import { Container } from "@/shared/container";
import { Tabs } from "@/shared/tabs"

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
])
const current_title_name = ref('demands')

// = date_today
const date = new Date()
// const date_today = ref((new Date()).toISOString().split('T')[0])
const date_today = ref(new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0])

// = Calendar
const calendarSelectedDates:any = ref([date_today.value])
const options: IOptions = {
    jumpToSelectedDate: true,
    settings: {
        selection: {
            day: 'multiple-ranged',
            // time: 24,
        },
        selected: {
            dates: [date_today.value]
            // dates: ['2022-01-09:2022-01-13', '2022-01-22'],
        },
        lang: 'ru',
    },
    actions: {
        clickDay(e, self) {
            if(self) {
                if(self.selectedDates[0]) {
                    calendarSelectedDates.value = self.selectedDates
                } else {
                    calendarSelectedDates.value = null
                }
            }
        },
    }
}


// On Mounted
onMounted(async () => {
    // = Calendar
    setDateToday()
})

// FUNCs
// = set
const setDateToday = () => {

    const calendar = new VanillaCalendar("#calendar", options);
    calendar.init()
    calendar.update({
        dates: true
    })
    calendarSelectedDates.value = [date_today.value]
}

// EMITS FUNC
// = title name
const emittedName = (name: string) => {
    current_title_name.value = name
}

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
        margin-top: 4rem;
        background-color: var(--bs-tertiary-bg);
        position: fixed;
        left: 0;
        height: 100vh;
        width: 100vw;
    }
    .vanilla-calendar {
        width: 100%;
        border-radius: unset;
    }
    .calendar-btn_today:hover {
        cursor: pointer;
    }

    /* TITTLES */
    .titles_container {
        
    }


    @media screen and (max-width: 575px) {
        .container {
        }
        .calendar_container {
            padding: 0!important;
        }
        .vanilla-calendar {
            padding: 0!important;
        }
    }
</style>