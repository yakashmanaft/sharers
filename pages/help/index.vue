<template>
  <Container>
    <h1 style="margin-top: 5rem">Помощь</h1>

    <!--  -->
    <div>
      <h2>База знаний</h2>

      <div class="article_wrapper" v-for="article in articles">
        <h3>{{ article.title }}</h3>
        <p>{{  article.text  }}</p>
        <!-- {{ article }} -->
        <!--  -->
        <div v-for="element in article_elements.filter(element => element.parent_article_id === article.id)">
          <h4>{{ element.title }}</h4>
          <p>{{  element.text  }}</p>
          <!-- {{ element }} -->
          <!--  -->
          <div v-for="part in element_parts.filter(part => part.parent_element_id === element.id)">
            <h5>{{ part.title }}</h5>
            <!-- <img :src="part.img_code" alt=""> -->
             {{ part.img_code }}
            <ul>
              <!-- Как сделать сплит через переиспользуемую в дальнейшем функцию? п типу make_text_splt(part.text, '*|*') -->
              <li v-for="part_paragraph in part.text?.split('*|*')">
                {{ part_paragraph }}
              </li>
            </ul>

            <!-- {{part}} -->
          </div>
        </div>

      </div>
      <br>

      <!-- MODULE: SHARERS -->
      <div>
        <h3>Модуль: Соучастники</h3>

        <!-- БАНДЫ -->
        <div>
          <h4>Вкладка Банды</h4>
          <p>К показу представляется список банд</p>
        </div>

        <h5>Страница конкретной банды</h5>
        <ul>
          <li>
            <h6>Вкладка: Соучастники</h6>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>
                Всем. Показываем список соучастников (соуачстники, банды). В
                случае, если никог онет - В банде нет соучастников / В составе
                нет банд
              </li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: проекты</h6>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>
                Если сессионный пользователь состоит в данной банде или явялется
                её создателем
              </li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: ФОТ</h6>
            <p>
              Когда нет ни одной таблицы ФОТ - можно добавлять новый. Только
              после этого будет отображаться какая-либо информация, а именно
              таблица ФОТ по соучастникам
            </p>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Пользователь является создателем текущей банды</li>
              <li>Пользователь является участником текущей банды</li>
              <li>
                Пользователь является участником банды (альянса), в которую
                входит текущая банда
              </li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: Учет времени</h6>
            <p>
              Когда нет ни одной таблицы ФОТ - можно добавлять новый. Только
              после этого будет отображаться какая-либо информация, а именно
              таблица по учету времени соучастников.
            </p>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Пользователь является создателем текущей банды</li>
              <li>Пользователь является участником текущей банды</li>
              <li>
                Пользователь является участником банды (альянса), в которую
                входит текущая банда
              </li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: Выполнение</h6>
            <p>
              Когда нет ни одной таблицы ФОТ - можно добавлять новый. Только
              после этого будет отображаться какая-либо информация. Однако, если
              нет еще пока Выполнения - при наличии таблиц ФОТ, будет
              отображаться "Здесь нет выполненных задач."
            </p>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Пользователь является создателем текущей банды</li>
              <li>Пользователь является участником текущей банды</li>
              <li>
                Пользователь является участником банды (альянса), в которую
                входит текущая банда
              </li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: Фонды</h6>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Пользователь является создателем текущей банды</li>
              <li>Пользователь является участником текущей банды</li>
              <li>
                Пользователь является участником банды (альянса), в которую
                входит текущая банда
              </li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: ТМЦ</h6>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Пользователь является создателем текущей банды</li>
              <li>Пользователь является участником текущей банды</li>
              <li>
                Пользователь является участником банды (альянса), в которую
                входит текущая банда
              </li>
            </ul>
          </li>
        </ul>

        <!--  -->
        <div>
          <h4>Вкладка Соучастники</h4>
          <p>К показу представляется список соучасников</p>
        </div>

        <h5>Страница конкретного соучастника</h5>
        <p>Общая информация по соучастнику</p>
        <ul>
          <li>
            <h6>Вкладка: Заявки</h6>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Пользователь на своей странице</li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: Проекты</h6>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Всем</li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: Банды</h6>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Всем</li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: Фонды</h6>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Пользователь на своей странице</li>
            </ul>
          </li>
          <li>
            <h6>Вкладка: ТМЦ</h6>
            <ul>
              <p style="margin: 0">Условия показа:</p>
              <li>Пользователь на своей странице</li>
            </ul>
          </li>
        </ul>
      </div>
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
// const module_articles = ref([
//   {
//     module_name: 'Список проектов',
//     elements: [
//       {
//       }
//     ]
//   },
//   {
//     module_name: 'Конкретный проект',
//     elements: [
//       {
//         title: 'Вкладки',
//         paragraph: ''
//       }
//     ]
//   },
//   {
//     module_name: 'Склад'
//   },
//   {
//     module_name: 'Соучастники'
//   }
// ])

// Парсить несколько бд и мапить новый массив
// db список разделов
// id | article_name | article_paragraph
const articles = ref([
  {
    id: 1,
    name: 'projects-list',
    title: 'Список проектов',
    type: 'modules',
    text: ''
  },
  {
    id: 2,
    name: 'current-project',
    title: 'Конкретный проект',
    type: 'modules',
    text: ''
  },
  {
    id: 3,
    name: 'warehouse',
    title: 'Список тмц',
    type: 'modules',
    text: ''
  },
  {
    id: 4,
    name: 'warehouse-item',
    title: 'Конкретный тмц',
    type: 'modules',
    text: ''
  },
  {
    id: 5,
    name: 'list-sharers',
    title: 'Соучасники',
    type: 'modules',
    text: ''
  },
  {
    id: 6,
    name: 'current-sharer',
    title: 'Конкретный соучастник',
    type: 'modules',
    text: ''
  }
])

// db элементы разделов
// id | element_title | element_paragraph
const article_elements = ref([
  {
    id: 1,
    parent_article_id: 2,
    title: 'Вкладки',
    text: 'Доступны в зависимости от статуса пользователя: partner / creator / curator / else'
  },
  {
    id: 2,
    parent_article_id: 3,
    title: 'Фильтрация предметов',
    text: 'При загрузке страницы <router-link to="/warehouse" class="link">ТМЦ</router-link> пользователю выводится список:'
  }
])

// db подэлементы элементов
// text must be splited by sign *|*
const element_parts = ref([
  {
    id: 1,
    parent_element_id: 1,
    title: 'Условия доступа к вкладкам',
    img_code: '#img#id0234#',
    text: 'Если пользователь является partner / creator / curator видит все Вкладки *|* Если пользователь числится в соучастниках по проекту видит: "План-график", "Заявки", "Соучастники", "ТМЦ" *|* Если пользователь является else - только "Соучастники"'
  },
  {
    id: 2,
    parent_element_id: 1,
    title: 'План-график',
    img_code: '',
    text: null
  },
  {
    id: 3,
    parent_element_id: 1,
    title: 'Соучастники',
    img_code: '',
    text: null
  },
  {
    id: 4,
    parent_element_id: 2,
    title: 'Условия показа',
    img_code: '#img#id0234#',
    text: 'Пользователь является собственником предмета *|* Пользовтатель является ответственным по предмету (в случае, если флаг "Показывать всем в банде" отключен) *|* Предметы банды, если пользователь является участников банды *|* Предметы яльянса, если банда, соучастником которой является пользователь *|* Предметы других пользователей, если они состоят в банде или альянсе, как и сам пользователь'
  },
  {
    id: 5,
    parent_element_id: 2,
    title: 'Скрытие показа предмета на складе',
    img_code: '#img#id0234#',
    text: 'Если пользователем является собственником предмета, он может скрыть предмет от показза другим участникам банды/альянса. *|* Скрытый предмет будет видеть только собствевннику и, если указан,  ответственному по данному предмету.'
  }
])

// MAKE FUNCs
// ***********************
// make_string_split
const make_string_split = (string:string, sign:string) => {
  let result =  string.split('sign')
  return [
    result
  ]
}

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
