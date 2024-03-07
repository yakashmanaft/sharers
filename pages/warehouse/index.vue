<script lang="ts" setup>
    import { Container } from '@/shared/container'

    useHead({
        title: "Склад",
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
</script>
<template>
    <Container>

        <h1>Склад</h1>

        <!-- <div @click="$router.push(`/projects/${projects._id}`)">Машзавод (РусРазитие)</div> -->
        <!-- <div>Машзавод (РусРазитие)</div>
        <div>Машзавод (Атом-строй)</div>
        <div>Горького, 14</div>
        <div>Утренняя, 11</div>
        <div>Клиника</div> -->

    </Container>
</template>


<style scoped>

</style>