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
    const items = ref([
        {
            id: 1,
            uuid: uuidv4(),
            type: 'tools',
            title: 'УШМ ELITECH 2623Э 230мм.',
            qty: 1,
            location: 'Горького, 14',
            owner: 'ООО "Камини"'
        },
        {
            id: 2,
            uuid: uuidv4(),
            type: 'tools',
            title: 'Клипсы',
            qty: 100,
            location: 'Ленина, 36/1',
            owner: 'ООО "РусРазвтие"'
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


        <table>
            <thead>
                <th>
                    <td>#</td>
                </th>
                <th>
                    <td>Uuid</td>
                </th>
                <th>
                    <td>Тип</td>
                </th>
                <th>
                    <td>Title</td>
                </th>
                <th>
                    <td>Qty</td>
                </th>
                <th>
                    <td>Location</td>
                </th>
                <th>
                    <td>Собстввенник</td>
                </th>
            </thead>
            <tbody>
                <!-- Удаляем выбранный элемент по его item.id -->
                <tr v-for="(item, index) in items" :key="index">
                     <td>
                        {{ index }}
                    </td>
                    <td>
                         {{ item.uuid }}
                     </td>
                     <td>
                        {{ item.type }}
                     </td>
                     <td>
                        <span @click="$router.push(`/warehouse/${item.id}`)">
                            {{ item.title }}
                        </span>
                     </td>
                     <td>
                        {{ item.qty }}
                     </td>
                     <td>
                        {{ item.location }}
                     </td>
                     <td>
                        {{ item.owner }}
                     </td>
                </tr>

            </tbody>
        </table>

    </Container>
</template>


<style scoped>

</style>