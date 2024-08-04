<template>
    <Container>
        <h1 style="margin-top: 5rem;">Помощь</h1>

        <!--  -->
        <div>
            <h2>База знаний</h2>

            <!--  -->
            <div>
                <h3>Модуль: Склад</h3>

                <!--  -->
                <div>
                    <h4>Фильтрация предметов</h4>
                    <p>При загрузке страницы <router-link to="/warehouse" class="link">ТМЦ</router-link> пользователю выводится список:</p>

                    <h5>Условия показа</h5>
                    <ul>
                        <li>Пользователь является собственником предмета</li>
                        <li>Пользовтатель является ответственным по предмету (в случае, если флаг "Показывать всем в банде" отключен)</li>
                        <li>Предметы банды, если пользователь является участников банды</li>
                        <li>Предметы яльянса, если банда, соучастником которой является пользователь</li>
                        <li>Предметы других пользователей, если они состоят в банде или альянсе, как и сам пользователь</li>
                    </ul>

                    <h5>Скрытие показа предмета на складе</h5>
                    <ul>
                        <li>Если пользователем является собственником предмета, он может скрыть предмет от показза другим участникам банды/альянса.</li>
                        <li>Скрытый предмет будет видеть только собствевннику и, если указан, ответственному по данному предмету.</li>
                    </ul>
                </div>
            </div>
        </div>
    </Container>
</template>

<script lang="ts" setup>
    useHead({
        title: "Помощь",
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
    import { Container } from '@/shared/container'
</script>

<style scoped>
    .link {
        text-decoration: none;
    }
    .link:hover {
        color: var(--bs-primary);
        cursor: pointer;
    }
</style>