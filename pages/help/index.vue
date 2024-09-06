<template>
  <Container>
    <h1 style="margin-top: 5rem">Помощь</h1>

    <!--  -->
    <div>
      <h2>База знаний</h2>

      <div
        class="article_wrapper"
        v-for="article in articles.sort((x, y) => {
          if (x.title < y.title) {
            return -1;
          }
          if (x.title > y.title) {
            return 1;
          }
        })"
      >
        <h3>{{ article.title }}</h3>
        <p>{{ article.text }}</p>
        <!--  -->
        <div
          v-for="element in article_elements.filter(
            (element) => element.parent_article_id === article.id
          )"
        >
          <h4>{{ element.title }}</h4>
          <p>{{ element.text }}</p>
          <!--  -->
          <div
            v-for="part in element_parts.filter(
              (part) => part.parent_element_id === element.id
            )"
          >
            <h5>{{ part.title }}</h5>
            <!-- <img :src="part.img_code" alt=""> -->
            {{ part.img_code }}
            <p>{{ part.desc }}</p>
            <ul>
              <!-- Как сделать сплит через переиспользуемую в дальнейшем функцию? п типу make_text_splt(part.text, '*|*') -->
              <li v-for="part_paragraph in part.text?.split('*|*')">
                {{ part_paragraph }}
              </li>
            </ul>
            <!--  -->
            <div
              v-for="segment in part_segments.filter(
                (segment) => segment.parent_part_id === part.id
              )"
            >
              <h6>{{ segment.title }}</h6>
              <ul>
                <li v-for="segment_paragraph in segment.text?.split('*|*')">
                  {{ segment_paragraph }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
    <br />
    <br />
  </Container>
</template>

<script lang="ts" setup>
useHead({
  title: "Помощь",
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
import { Container } from "@/shared/container";

// ПЕРЕМЕННЫЕ

// Парсить несколько бд и мапить новый массив
// db список разделов
// id | article_name | article_paragraph
const articles = ref([
  {
    id: 1,
    name: "projects-list",
    title: "Список проектов",
    type: "modules",
    text: "",
  },
  {
    id: 2,
    name: "current-project",
    title: "Конкретный проект",
    type: "modules",
    text: "",
  },
  {
    id: 3,
    name: "warehouse",
    title: "Список тмц",
    type: "modules",
    text: "",
  },
  {
    id: 4,
    name: "warehouse-item",
    title: "Конкретный тмц",
    type: "modules",
    text: "",
  },
  {
    id: 5,
    name: "list-sharers",
    title: "Соучастники",
    type: "modules",
    text: "",
  },
  {
    id: 6,
    name: "current-sharer",
    title: "Конкретный соучастник",
    type: "modules",
    text: "Общая информация по соучастнику",
  },
  {
    id: 7,
    name: "current-band",
    title: "Конкретная банда",
    type: "modules",
    text: "",
  },
  {
    id: 8,
    name: "dasboard",
    title: "Доска",
    type: "modules",
    text: "",
  },
]);

// db элементы разделов
// id | element_title | element_paragraph
const article_elements = ref([
  {
    id: 1,
    parent_article_id: 2,
    title: "Вкладки",
    text: "Доступны в зависимости от статуса пользователя: partner / creator / curator / else",
  },
  {
    id: 2,
    parent_article_id: 3,
    title: "Фильтрация предметов",
    text: 'При загрузке страницы <router-link to="/warehouse" class="link">ТМЦ</router-link> пользователю выводится список предметов',
  },
  {
    id: 3,
    parent_article_id: 5,
    title: "Банды",
    text: "К показу представляется список банд",
  },
  {
    id: 4,
    parent_article_id: 5,
    title: "Соучастники",
    text: "К показу представляется список соучастников",
  },
  {
    id: 5,
    parent_article_id: 6,
    title: "Вкладки",
    text: "Доступны в зависимости от статуса пользователя: partner / creator / curator / else",
  },
  {
    id: 6,
    parent_article_id: 7,
    title: "Вкладки",
    text: "Доступны в зависимости от статуса пользователя: partner / creator / curator / else",
  },
  {
    id: 7,
    parent_article_id: 8,
    title: "Проекты",
    text: 'Модуль называется "Текущие", так как отображаются текущие преокты, которые на данный момент в процессе. Показыаем просто количество, при клике на модуль - попадаем в раздел проектов.',
  },
]);

// db подэлементы элементов
// text must be splited by sign *|*
const element_parts = ref([
  {
    id: 1,
    parent_element_id: 1,
    title: "Условия доступа к вкладкам",
    img_code: "#img#id0234#",
    text: 'Если пользователь является partner / creator / curator видит все Вкладки *|* Если пользователь числится в соучастниках по проекту видит: "План-график", "Заявки", "Соучастники", "ТМЦ" *|* Если пользователь является else - только "Соучастники"',
  },
  {
    id: 2,
    parent_element_id: 1,
    title: "План-график",
    img_code: "",
    text: null,
  },
  {
    id: 3,
    parent_element_id: 1,
    title: "Соучастники",
    img_code: "",
    text: null,
  },
  {
    id: 4,
    parent_element_id: 2,
    title: "Условия показа",
    img_code: "#img#id0234#",
    text: 'Пользователь является собственником предмета *|* Пользователь является ответственным по предмету (в случае, если флаг "Показывать всем в банде" отключен) *|* Предметы банды, если пользователь является участников банды *|* Предметы яльянса, если банда, соучастником которой является пользователь *|* Предметы других пользователей, если они состоят в банде или альянсе, как и сам пользователь',
  },
  {
    id: 5,
    parent_element_id: 2,
    title: "Скрытие показа предмета на складе",
    img_code: "#img#id0234#",
    text: "Если пользователем является собственником предмета, он может скрыть предмет от показза другим участникам банды/альянса. *|* Скрытый предмет будет видеть только собствевннику и, если указан,  ответственному по данному предмету.",
  },
  {
    id: 6,
    parent_element_id: 5,
    title: "Заявки",
    text: "Доступна, если пользователь находится на своей странице соучастника",
  },
  {
    id: 7,
    parent_element_id: 5,
    title: "Проекты",
    text: "Доступна всем",
  },
  {
    id: 8,
    parent_element_id: 5,
    title: "Банды",
    text: "Доступна всем",
  },
  {
    id: 9,
    parent_element_id: 5,
    title: "Фонды",
    text: "Доступна, если пользователь находится на своей странице соучастника",
  },
  {
    id: 10,
    parent_element_id: 5,
    title: "ТМЦ",
    text: "Доступна, если пользователь находится на своей странице соучастника",
  },
  {
    id: 11,
    parent_element_id: 6,
    title: "Соучастники",
    text: "Всем. Показываем список соучастников (соучастники, банды). В случае, если никог онет - В банде нет соучастников / В составе нет банд",
  },
  {
    id: 12,
    parent_element_id: 6,
    title: "Проекты",
    text: "Если сессионный пользователь состоит в данной банде или явялется её создателем",
  },
  {
    id: 13,
    parent_element_id: 6,
    title: "ФОТ",
    desc: null,
    text: "Когда нет ни одной таблицы ФОТ - можно добавлять новый. Только после этого будет отображаться какая-либо информация, а именно таблица ФОТ по соучастникам",
  },
  {
    id: 14,
    parent_element_id: 6,
    title: "Учет времени",
    desc: null,
    text: "Когда нет ни одной таблицы ФОТ - можно добавлять новый. Только после этого будет отображаться какая-либо информация, а именно таблица по учету соучастников.",
  },
  {
    id: 15,
    parent_element_id: 6,
    title: "Выполнение",
    desc: null,
    text: 'Когда нет ни одной таблицы ФОТ - можно добавлять новый. Только после этого будет отображаться какая-либо информация. Однако, если нет еще пока Выполнения - при наличии таблиц ФОТ, будет отображаться "Здесь нет выполненных задач."',
  },
  {
    id: 16,
    parent_element_id: 6,
    title: "Фонды",
    desc: null,
    text: null,
  },
  {
    id: 17,
    parent_element_id: 6,
    title: "ТМЦ",
    desc: null,
    text: null,
  },
  {
    id: 18,
    parent_element_id: 7,
    title:
      "Какие проекты учитываются в расчете количества проектов к показу для пользователя:",
    text: "Когда пользователь - создатель проекта *|* Когда пользвоатель является партнером по проекту (просто партнер или заказчик например) *|* Когда пользваотель является участником проекта *|* Когда пользваотель является участником банды, которая участвует в проекте",
  },
]);

// db сегментов part
// text must be splited by sign *|*
const part_segments = ref([
  {
    id: 1,
    parent_part_id: 14,
    desc: null,
    title: "Условия показа",
    text: "Пользователь является создателем текущей банды *|* Пользователь является участником текущей банды *|* Пользователь является участником банды (альянса), в которую входит текущая банда",
  },
  {
    id: 2,
    parent_part_id: 15,
    desc: null,
    title: "Условия показа",
    text: "Пользователь является создателем текущей банды *|* Пользователь является участником текущей банды *|* Пользователь является участником банды (альянса), в которую входит текущая банда",
  },
  {
    id: 3,
    parent_part_id: 16,
    desc: null,
    title: "Условия показа",
    text: "Пользователь является создателем текущей банды *|* Пользователь является участником текущей банды *|* Пользователь является участником банды (альянса), в которую входит текущая банда",
  },
  {
    id: 4,
    parent_part_id: 17,
    desc: null,
    title: "Условия показа",
    text: "Пользователь является создателем текущей банды *|* Пользователь является участником текущей банды *|* Пользователь является участником банды (альянса), в которую входит текущая банда",
  },
]);

// MAKE FUNCs
// ***********************
// make_string_split
const make_string_split = (string: string, sign: string) => {
  let result = string.split("sign");
  return [result];
};
</script>

<style scoped>
.link {
  text-decoration: none;
}
.link:hover {
  color: var(--bs-primary);
  cursor: pointer;
}

/* ARTICLE */
.article_wrapper {
  border-bottom: 1px solid var(--bs-border-color);
  padding: 1rem 0;
}

/* ARTICLE ELEMENT */
</style>
