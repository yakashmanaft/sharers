<script lang="ts" setup>
    import { Container } from '@/shared/container'
    import { v4 as uuidv4 } from 'uuid'

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

    // В данном объекте owner - это user id из БД Users, далее функция переводчик
    // В данном объекте location - это project id из БД Projects, далее функция переводчик
    // const items_table_head = ref([
    //     // {
    //     //     id: 1,
    //     //     title: '#',
    //     // },
    //     // {
    //     //     id: 1,
    //     //     title: 'Uuid',
    //     // },
    //     {
    //         id: 1,
    //         title: 'Тип',
    //     },
    //     {
    //         id: 2,
    //         title: 'Наименование',
    //     },
    //     {
    //         id: 3,
    //         title: 'Кол-во',
    //     },
    //     {
    //         id: 4,
    //         title: 'Location',
    //     },
    //     {
    //         id: 5,
    //         title: 'Собственник',
    //     }
    // ])

    // uuid во фронте не показываем, но надо иметь в принятой из бд объекте наверно в случае удаления
    const items = ref([
        {
            id: 1,
            uuid: uuidv4(),
            type: 'tools',
            title: 'УШМ ELITECH 2623Э 230мм.',
            qty: 1,
            measure: 'шт',
            location: 'Горького, 14',
            owner: 'ООО "Камини"'
        },
        {
            id: 2,
            uuid: uuidv4(),
            type: 'tools',
            title: 'Клипсы',
            qty: 100,
            measure: 'шт',
            location: 'Ленина, 36/1',
            owner: 'ООО "РусРазвтие"'
        },
        {
            id: 3,
            uuid: uuidv4(),
            type: 'tools',
            title: 'Удлинитель на катушке 30м KLAUS Bull Cabel Reel',
            qty: 1,
            measure: 'шт',
            location: 'Ремонт',
            owner: 'ООО "Камини"'
        },
        {
            id: 4,
            uuid: uuidv4(),
            type: 'tools',
            title: 'Уровень KAPRO 60cm 781-40P',
            qty: 1,
            measure: 'шт',
            location: 'Склад',
            owner: 'Папа Карло'
        },
        {
            id: 5,
            uuid: uuidv4(),
            type: 'stuff',
            title: 'Труба Сэндвич 220 / 280 320 / Оц',
            qty: 1,
            measure: 'шт',
            location: 'Склад',
            owner: 'Камини'
        },
        {
            id: 6,
            uuid: uuidv4(),
            type: 'consumables',
            title: 'Кровельный саморез Tech-Krep КР ZP сверло 4,8х51',
            qty: 200,
            measure: 'кг',
            location: 'Склад',
            owner: 'Камини'
        }
    ])
</script>
<template>
    <Container>

        <h1>ТМЦ</h1>

        <!-- <div @click="$router.push(`/projects/${projects._id}`)">Машзавод (РусРазитие)</div> -->
        <!-- <div>Машзавод (РусРазитие)</div>
        <div>Машзавод (Атом-строй)</div>
        <div>Горького, 14</div>
        <div>Утренняя, 11</div>
        <div>Клиника</div> -->

        <div>
            <ul style="display: flex; list-style: none; padding: 0; ">
                <li>
                    Склад
                </li>
                <li>
                    Ремонт
                </li>
                <li>
                    <select name="" id="">
                        <option selected value="0">Фильтр по проектам</option>
                        <option value="1">Горького, 14</option>
                        <option value="2">Утренняя, 11</option>
                    </select>
                </li>
            </ul>
        </div>

        <input type="text" class="form-control" placeholder="Поиск">

        <!-- <div style="display: flex;">
            <select class="form-select" aria-label="Default select example">
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            <select class="form-select" aria-label="Default select example">
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
        </div> -->

        <table class="container text-center">
            <thead>
                <th class="row align-items-start">
                    <td class="col-1">Тип</td>
                    <td class="col">Наименование</td>
                    <td class="col-1">Кол-во</td>
                    <td class="col-3">Местонахождение</td>
                    <td class="col-2">Собственник</td>
                </th>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items" :key="index" class="row align-items-center">
                    <td class="col-1">{{ item.type }}</td>
                    <td @click="$router.push(`/warehouse/${item.id}`)" class="col">{{ item.title }}</td>
                    <td class="col-1">{{ item.qty}} {{ item.measure }}.</td>
                    <td @click="$router.push(`/projects/1`)" class="col-3">{{ item.location }}</td>
                    <td class="col-2">{{ item.owner }}</td>
                </tr>
            </tbody>
        </table>

    </Container>
</template>


<style scoped>
    table {
        margin-top: 1rem;
    }
    th {
        padding: 1rem 0;
        border-top: 1px solid gray;
    }
    tr {
        padding: 1rem 0;    
        border-top: 1px solid gray;
    }
    td {
        margin: 2px;
    }
</style>