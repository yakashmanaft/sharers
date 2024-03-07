<script setup>
import {Container} from '@/shared/container'

useHead({
        title: "Проект - ",
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

    const currentDemand = {
        id: 1,
        title: 'заявка #111 от 21.02.2024',
        itemsList: [
            {
                id: 1,
                title: 'Бетон B25F150W4 п4',
                itemType: 'куб.м.',
                qty: 22
            },
            {
                id: 2,
                title: 'Круг на циркулярку D190 по деревув с мелкии зубьями',
                itemType: 'шт.',
                qty: 10
            },
            {
                id: 3,
                title: 'УШМ 230',
                itemType: 'шт.',
                qty: 2
            }
        ]
    }
</script>


<template>
    <Container>

        <h1>Заявка #{{ $route.params.id  }}</h1> 

        <div v-for="(item, index) in currentDemand.itemsList">
                {{ item }}
        </div>
    </Container>
</template>