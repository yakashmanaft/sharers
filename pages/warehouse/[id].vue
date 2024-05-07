<script lang="ts" setup>
import { onMounted } from "vue";
import { Container } from "@/shared/container";

useHead({
  title: `Склад | Соучастники`,
  meta: [
    {
      name: "description",
      content: "My Description",
    },
  ],
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

//
const route = useRoute();
//
const items = ref(null);
const item = ref(null);

onMounted(async () => {
  //
  items.value = await getItems();
  item.value = items.value.find((item: any) => item.id == route.params.id);
});

//
/**
 * @desc Get warehouse items from BD
 */
async function getItems() {
  return await $fetch("/api/warehouse/item");
}
</script>

<template>
  <Container>
    <p style="margin-top: 5rem">тмц #{{ $route.params.id }}</p>

    <div v-if="item">
      <div style="display: flex; flex-direction: column;">

        <h1>{{ item.title }}</h1>
          <!-- Материалы -->
          <div v-if="item.type === 'stuff'" style="display: flex; gap: 1rem;">
            <!-- Показать динамически места, в которых есть данный материал. Стили как в общем списке ТЦ. По клику переходим на ТМЦ по выбранному месту. Выделить текущее местоположение выбранного ТМЦ --> 
            <div>
              Всего (36 шт.)
            </div>
            <div>
              Офис на Хасана (12 шт)
            </div>
            <div>
              Монолит G14 THULE (12 шт)
            </div>
            <div>
              Клиника (12 шт)
            </div>
        </div>
      </div>

      <!-- из warehouse page - warehouseCategories - перенести в store, чтобы можно было дергать сразу переведенный текст -->
      <h2>{{ item.type }}</h2>

      <!-- Инструмент -->
      <div v-if="item.type === 'tools'">
        <ul>
          <li>Серийник (если есть)</li>
          <li>Описание?</li>
        </ul>
      </div>

      <!-- Материалы -->
      <div v-if="item.type === 'consumables'">
        РАСХОДНИКИ
      </div>
      <!-- Техника -->
      <div v-if="item.type === 'technic'">
        ТЕХНИКА
      </div>
      <br />
      {{ item }}
      <ul style="list-style: none; padding: 0">
        <li>
          <div>
            <h2>История</h2>

            <ul style="list-style: none; padding: 0">
              <li style="display: flex; align-items: center; gap: 1rem">
                <div>2024-03-23T13:54:12.000Z</div>
                <div>"Склад на Бригадирской" (Камини собственник)</div>
                <div>---></div>
                <div>"Склад на Бригадирской" (Камини собственник)</div>
                <div>Анфалов С.В.</div>
              </li>
              <li style="display: flex; align-items: center; gap: 1rem">
                <div>{{ item.created_at }}</div>
                <div>
                  Добавлен на "Склад на Бригадирской" (Камини собственник)
                </div>
                <div>Анфалов С.В.</div>
              </li>
            </ul>
          </div>
        </li>
        <br />
        <li>Стоимость закупа (руб.)</li>
        <li>Ценность (руб.)</li>
      </ul>
    </div>
  </Container>
</template>
