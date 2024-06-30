<script setup>
import {Container} from '@/shared/container'

// 
const route = useRoute()

useHead({
        title: "Банк",
        link: [
            { 
                rel: 'stylesheet', 
                href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
                integrity: "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
                crossorigin: "anonymous",
                type: "text/css"
            }
        ],
        script: [
            {
                src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
                integrity: "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
                crossorigin: "anonymous",
            }
        ]
    })

    // const listItemType = ref([])

    // Инструмент
    // tools

    // Расходники
    // consumables

    // Техника
    // technic

    // Материалы
    // stuff

    const computedBank = computed(() => banks.value[0])

    const { pending, error, refresh, data: banks, status } = await useFetch("/api/banks/bank", {
        lazy: false,
        transform: (banks) => {
            return banks.filter(bank => bank.id === +route.params.id)
        }
    })

</script>


<template>
    <Container style="margin-top: 5rem;">

        <h1 class="show-max-767">Банк {{ computedBank.title }}</h1> 


        <div>
            {{ computedBank }}
        </div>

        <br>
        
        <div>

            <p>Дата создания</p>
            <p>Creator</p>
        </div>

        <h2>Подзаголовок</h2>
    </Container>
</template>

<style scoped>

@media screen and (max-width: 767px) {
    /* h1 {
        margin-top: 4rem;
    } */
         .show-max-767 {
      display: none;
    }
}
@media screen and (min-width: 768px) {
  /* h1 {
    margin-top: 6rem;
  } */
}
</style>