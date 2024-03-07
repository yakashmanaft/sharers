<script lang="ts" setup>
    import { Container } from '@/shared/container'

    const projects = [
        {
            id: 1,
            title: 'Машзавод',
            address: 'г. Пермь, ул. Новозвягинская, д. 57',
            partner: 'ООО "РусРазвитие"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Бетонные работы',
            completion: 0.15
        },
        {
            id: 2,
            title: 'Машзавод',
            address: 'г. Пермь, ул. Новозвягинская, д. 57',
            partner: 'ООО "Атом Строй"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Бетонные работы',
            completion: 0.78
        },
        {
            id: 3,
            title: 'Горького, 14',
            address: 'г. Пермь, ул. Горького, д. 14',
            partner: 'ООО "СупеПупер"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Бетонные работы',
            completion: 0.10
        },
        {
            id: 4,
            title: 'Вилла',
            address: 'г. Пермь, ул. Утренняя, д. 11',
            partner: 'ООО "СупеПупер"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Реализация дизайн проекта',
            completion: 0.55
        },
        {
            id: 5,
            title: 'Клиника',
            address: 'г. Пермь, ул. Мильчакова, д. 18',
            partner: 'ООО "СупеПупер"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Реализация дизайн проекта',
            completion: 0.32
        },
        {
            id: 6,
            title: 'Машзавод',
            address: 'г. Пермь, ул. Новозвягинская, д. 57',
            partner: 'ООО "РусРазвитие"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Бетонные работы',
            completion: 0.66
        },
        {
            id: 7,
            title: 'Машзавод',
            address: 'г. Пермь, ул. Новозвягинская, д. 57',
            partner: 'ООО "Атом Строй"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Бетонные работы',
            completion: 0.13
        },
        {
            id: 8,
            title: 'Горького, 14',
            address: 'г. Пермь, ул. Горького, д. 14',
            partner: 'ООО "СупеПупер"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Бетонные работы',
            completion: 0.85
        },
        {
            id: 9,
            title: 'Вилла',
            address: 'г. Пермь, ул. Утренняя, д. 11',
            partner: 'ООО "СупеПупер"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Реализация дизайн проекта',
            completion: 1
        },
        {
            id: 10,
            title: 'Клиника',
            address: 'г. Пермь, ул. Мильчакова, д. 18',
            partner: 'ООО "СупеПупер"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Реализация дизайн проекта',
            completion: 1
        },
        {
            id: 11,
            title: 'Горького, 14',
            address: 'г. Пермь, ул. Горького, д. 14',
            partner: 'ООО "СупеПупер"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Бетонные работы',
            completion: 0.15
        },
        {
            id: 12,
            title: 'Вилла',
            address: 'г. Пермь, ул. Утренняя, д. 11',
            partner: 'ООО "СупеПупер"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Реализация дизайн проекта',
            completion: 0.45
        },
        {
            id: 13,
            title: 'Офис',
            address: 'г. Пермь, ул. Героев Хасана, д. 48 корп. 1, офис 201',
            partner: 'ООО "Камини"',
            creator: 'Игорь Александрович Смирнягин',
            workType: 'Офис',
            completion: 0.37
        }
    ]

    useHead({
        title: "Мои проекты",
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

        <h1>Проекты</h1><span>{{ projects.length }}</span>

        <div class="projects-container">

            <div class="projects-item" v-for="(project, index) in projects" :key="index" @click="$router.push(`/projects/${project.id}`)">
                <h2>{{ project.title }}</h2>
                <p>{{ project.address }}</p>
                <p>{{ project.workType }}</p>
                <p>{{ project.partner }}</p>
                <div class="completion-container">
                    <span>{{ (project.completion * 100).toFixed(0) }}%</span>
                </div>
            </div>
        </div>


    </Container>
</template>


<style scoped>
    .projects-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 1rem;
    }
    .projects-item {
        box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: 1rem;   
        transition: all 0.3s;
        position: relative;
    }
    .projects-item:hover {
        cursor: pointer;
        box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.3);
    }

    .completion-container {
        width: 2rem;
        height: 2rem;
        background-color: gray;
        border-radius: 100%;    
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 1rem;
        bottom: 1rem;
    }
    .completion-container span {
        font-size: 12px;
    }
</style>