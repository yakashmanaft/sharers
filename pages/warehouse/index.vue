<script lang="ts" setup>
import { Container } from "@/shared/container";
import { v4 as uuidv4 } from "uuid";

useHead({
  title: "Склад",
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

const router = useRouter();

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

const item = ref({
  uuid: null,
  title: null,
  type: null,
  qty: 0,
  measure: null,
  location: null,
  positionID: null,
  owner: null,
});
// const item = ref({
//   uuid: uuidv4(),
//   title: null,
//   type: null,
//   qty: 0,
//   measure: null,
//   location: null,
//   positionID: null,
//   owner: null,
// });
// uuid во фронте не показываем, но надо иметь в принятой из бд объекте наверно в случае удаления
// const items = ref([
//   {
//     id: 1,
//     uuid: uuidv4(),
//     type: "tools",
//     title: "УШМ ELITECH 2623Э 230мм.",
//     qty: 1,
//     measure: "шт",
//     location: "project",
//     positionID: 2,
//     owner: 'ООО "Камини"',
//   },
//   {
//     id: 2,
//     uuid: uuidv4(),
//     type: "tools",
//     title: "Клипсы",
//     qty: 100,
//     measure: "шт",
//     location: "project",
//     positionID: 1,
//     owner: 'ООО "РусРазвтие"',
//   },
//   {
//     id: 3,
//     uuid: uuidv4(),
//     type: "tools",
//     title: "Удлинитель на катушке 30м KLAUS Bull Cabel Reel",
//     qty: 1,
//     measure: "шт",
//     location: "repair",
//     positionID: 12,
//     owner: 'ООО "Камини"',
//   },
//   {
//     id: 4,
//     uuid: uuidv4(),
//     type: "tools",
//     title: "Уровень KAPRO 60cm 781-40P",
//     qty: 1,
//     measure: "шт",
//     location: "sklad",
//     positionID: "sklad_main_r2-c27-f1-f1",
//     owner: "Папа Карло",
//   },
//   {
//     id: 5,
//     uuid: uuidv4(),
//     type: "stuff",
//     title: "Труба Сэндвич 220 / 280 320 / Оц",
//     qty: 1,
//     measure: "шт",
//     location: "sklad",
//     positionID: "sklad_main_r1-c1-f1-f1",
//     owner: 'ООО "Камини"',
//   },
//   {
//     id: 6,
//     uuid: uuidv4(),
//     type: "consumables",
//     title: "Кровельный саморез Tech-Krep КР ZP сверло 4,8х51",
//     qty: 200,
//     measure: "кг",
//     location: "sklad",
//     positionID: "sklad_main_r1-c1-f2-f2",
//     owner: 'ООО "Камини"',
//   },
//   {
//     id: 7,
//     uuid: uuidv4(),
//     type: "equipment",
//     title: "Ботинки кирзачи с мехом внутри",
//     qty: 10,
//     measure: "пар",
//     location: "sklad",
//     positionID: "sklad_main_r3-c6-f1-f3",
//     owner: 'ООО "Камини"',
//   },
//   {
//     id: 8,
//     uuid: uuidv4(),
//     type: "tools",
//     title: "Болгарка 230 Metabo",
//     qty: 1,
//     measure: "шт",
//     location: "project",
//     positionID: 1,
//     owner: 'ООО "Камини"',
//   },
//   {
//     id: 9,
//     uuid: uuidv4(),
//     type: "tools",
//     title: "Шуруповерт Калибр TOP0289900/2302",
//     qty: 1,
//     measure: "шт",
//     location: "archive",
//     positionID: "sklad_archive-r1-c1-f1-f1",
//     owner: "В. Н. Клименко",
//   },
//   {
//     id: 10,
//     uuid: uuidv4(),
//     type: "tools",
//     title: "Электро-обогреватель 30НС - 2,0/1,5 - 41 5968",
//     qty: 1,
//     measure: "шт",
//     location: "deleted",
//     positionID: "deleted",
//     owner: "В. Н. Клименко",
//   },
//   {
//     id: 11,
//     uuid: uuidv4(),
//     type: "tools",
//     title: "Комплект сварочника Wega 251 modelSTICK ",
//     qty: 1,
//     measure: "шт",
//     location: "project",
//     positionID: 2,
//     owner: "В. Н. Клименко",
//   },
// ]);
// const items = ref(null);
onMounted(async () => {
  // items.value = await getWarehouseItems();
});
/**
 * @desc Get warehouse items from BD
 */
// async function getWarehouseItems() {
//   return await $fetch("api/warehouse/item");
// }

//   const getWarehouseItems = async () => {
//   return await $fetch("api/warehouse/item");
// };

/**
 * @desc Get warehouse items from BD
 */
const {
  pending,
  error,
  refresh,
  data: items,
} = useFetch("api/warehouse/item", {
  lazy: false,
  // transform: (items) => {
  //   return items.map(item) => ({
  //     id: item.id,
  //     title: item.title,
  //   })
  // }
});

// Генерируем ссылки местонахождения
const creatLocationLink = (object: any) => {
  if (object) {
    if (object.location === "project") {
      router.push(`/projects/${object.positionID}`);
    } else if (object.location === "sklad") {
      alert(`Складской адрес: ${object.positionID}`);
    } else if (object.location === "repair") {
      alert(
        "В ремонте: как и где поселить сервисный центр? Относится ли он к проектам? Или же это другие сущности? "
      );
    } else if (object.location === "archive") {
      alert(`В архиве. Складской адрес: ${object.positionID}`);
    } else if (object.location === "deleted") {
      alert(`У вас нет прав, чтобы окончательно удалить предмет`);
    } else {
      alert(
        "warehouse inidex.vue error - strange object.location in creatLocationLink function"
      );
    }
  } else {
    alert("warehouse inidex.vue creatLocationLink function error");
  }
};
const translateLocation = (id: any, location: string) => {
  if (location && id) {
    if (location === "project") {
      return `projectID in db: (${id}, ${typeof id})`;
    } else if (location === "sklad") {
      return `На складе`;
    } else if (location === "repair") {
      return "В ремонте";
    } else if (location === "archive") {
      return `Архив`;
    } else if (location === "deleted") {
      return "Удалено";
    } else {
      return alert(
        "warehouse inidex.vue error - strange object.location in translateLocation function"
      );
    }
  } else {
    alert("warehouse inidex.vue translateLocation function error");
  }
  return location;
};
const translateOwner = (owner: string) => {
  alert(
    `${owner}. Относится ли Owner, если он являтееся коллективом, user'ом... И каким обрзаом в объекте item указывать (id:number or id:string)`
  );
};
const locationLinkColorized = (location: string) => {
  return `location_link_${location}`;
};

// ДОБАЛЯЕМ ITEM на SKLAD to BD
async function addWarehouseItem(item) {
  let addedItem = null;

  if (item)
    addedItem = await $fetch("api/warehouse/item", {
      method: "POST",
      body: {
        uuid: uuidv4(),
        title: item.title,
        type: item.type,
        qty: item.qty,
        measure: item.measure,
        location: item.location,
        positionID: item.positionID,
        owner: item.owner,
      },
    });

  // refetching
  refresh();
}
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

    <form>
      <div class="mb-3">
        <label for="exampleInputName1" class="form-label">Наименование</label>
        <input
          v-model="item.title"
          type="text"
          id="exampleInputName1"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputName1" class="form-label">Тип</label>
        <input
          v-model="item.type"
          type="text"
          id="exampleInputName1"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputName1" class="form-label">Кол-во</label>
        <input
          v-model="item.qty"
          type="number"
          id="exampleInputName1"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputName1" class="form-label">Ед. Изм.</label>
        <input
          v-model="item.measure"
          type="text"
          id="exampleInputName1"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputName1" class="form-label"
          >Местонахождение</label
        >
        <input
          v-model="item.location"
          type="text"
          id="exampleInputName1"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputName1" class="form-label">PositionID</label>
        <input
          v-model="item.positionID"
          type="text"
          id="exampleInputName1"
          aria-describedby="nameHelp"
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputName1" class="form-label">Owner</label>
        <input
          v-model="item.owner"
          type="number"
          id="exampleInputName1"
          aria-describedby="nameHelp"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        @click.prevent="addWarehouseItem(item)"
      >
        Add item to SKLAD
      </button>
    </form>

    <!-- fetch data is error -->
    <div v-if="error">
      <p>Error Code {{ error.statusCode }}</p>
      <p>Error Message {{ error.message }}</p>
    </div>

    <!-- ФИЛЬТРЫ -->
    <div>
      <ul style="display: flex; list-style: none; padding: 0">
        <li>Склад</li>
        <li>Ремонт</li>
        <li>
          <select name="" id="">
            <option selected value="0">Фильтр по проектам</option>
            <option value="1">Горького, 14</option>
            <option value="2">Утренняя, 11</option>
          </select>
        </li>
      </ul>
    </div>

    <!-- ПОИСК -->
    <input type="text" class="form-control" placeholder="Поиск" />

    <!-- data is loading -->
    <div v-if="pending">
      <p>Loading...</p>
    </div>

    <!-- data is loaded -->
    <div v-else>
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

      <!-- СПИСОК ITEMS -->
      <table class="container text-center">
        <thead>
          <tr class="th row align-items-start">
            <td class="col" style="text-align: start">Наименование</td>
            <td class="col-1">Кол-во</td>
            <td class="col-3">Местонахождение</td>
            <td class="col-2" style="text-align: end">Собственник</td>
            <td class="col-1">Тип</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="index"
            class="row align-items-center"
          >
            <td class="col" style="text-align: start">
              <span
                class="location_link"
                @click="$router.push(`/warehouse/${item.id}`)"
              >
                {{ item.title }}
              </span>
            </td>
            <td class="col-1">{{ item.qty }} {{ item.measure }}.</td>
            <td class="col-3">
              <span
                class="location_link"
                :class="`${locationLinkColorized(item.location)}`"
                @click="creatLocationLink(item)"
                >{{ translateLocation(item.positionID, item.location) }}</span
              >
            </td>
            <td class="col-2" style="text-align: end">
              <span class="location_link" @click="translateOwner(item.owner)">
                {{ item.owner }}
              </span>
            </td>
            <td class="col-1">{{ item.type }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Container>
</template>

<style scoped>
table {
  margin-top: 1rem;
}
.th {
  font-weight: bold;
}
tr {
  padding: 1rem 0;
  border-top: 1px solid gray;
}
td {
  margin: 2px;
}
.location_link {
  padding: 5px 10px;
  border-radius: 16px;
  border: 1px solid var(--bs-info);
  transition: all 0.15s ease-out;
}
.location_link:hover {
  cursor: pointer;
  /* color: white; */
  /* background-color: var(--bs-info);    */
}
.location_link_project {
  color: var(--bs-success);
  border: 1px solid var(--bs-success-bg-subtle);
  background-color: var(--bs-success-bg-subtle);
}
.location_link_sklad {
  /* color: var(bs-primary-bg-subtle); */
  color: white;
  border: none;
  background-color: var(--bs-primary-bg-subtle);
}
.location_link_repair {
  color: var(--bs-warning);
  border: 1px solid var(--bs-warning-bg-subtle);
  background-color: var(--bs-warning-bg-subtle);
}
.location_link_archive {
  color: var(--bs-dark-bg-subtle);
  border: none;
}
.location_link_deleted {
  color: var(--bs-danger-bg-subtle);
  border: none;
}
</style>
