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
  responsible: null
});

const currentCategoryType = ref("all");

// Категории ТМЦ (пока хардкорно)
const warehouseCategories = ref([
  {
    type: "all",
    name: "Все",
  },
  {
    type: "tools",
    name: "Инструмент",
  },
  {
    type: "stuff",
    name: "Материалы",
  },
  {
    type: "consumables",
    name: "Расходники",
  },
]);

// Споты, где может находиться ТМЦ
// const itemsLocations = ref([
//   {
    
//   }
// ])
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
  // makes refetching
  refresh();
});

/**
 * @desc Get warehouse items from BD
 */
const {
  pending,
  error,
  refresh,
  data: items,
  status,
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
    } else if (object.location === "office") {
      alert(
        `В офисе №${object.positionID}. Адрес офиса (надо придумать как выдавать)`
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
    } else if (location === "office") {
      return `В офисе №${id}, ${typeof id}`;
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
  return `link_${location}`;
};

// ****** ДОБАЛЯЕМ ITEM на SKLAD to BD в newWarehouseItemModal *******
// флаг disabled для кнопки
const createNewItemBtnIsDisabled = ref(true);
// функция добавления в БД
async function addWarehouseItem(item) {
  let addedItem = null;

  if (
    item.title &&
    item.type &&
    item.qty > 0 &&
    item.measure &&
    item.location &&
    item.positionID &&
    item.owner &&
    item.responsible
  ) {
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
        responsible: item.responsible
      },
    });

    // clear all inputs in modal
    clearModalInputs(item);

    // refetching
    refresh();
  }
}

const clearModalInputs = (item: any) => {
  item.uuid = null;
  item.title = null;
  item.type = null;
  item.qty = 0;
  item.measure = null;
  item.location = null;
  item.positionID = null;
  item.owner = null;
  item.responsible = null
};

watch(currentCategoryType, () => {
  console.log(currentCategoryType.value);
});

// Проверка беред сабмитом
watch(item.value, () => {
  if (
    item.value.title &&
    item.value.type &&
    item.value.qty > 0 &&
    item.value.measure &&
    item.value.location &&
    item.value.positionID &&
    item.value.owner &&
    item.value.responsible
  ) {
    createNewItemBtnIsDisabled.value = false;
  } else {
    createNewItemBtnIsDisabled.value = true;
  }
});

const filterItemsType = async (type) => {
  currentCategoryType.value = type;

  if (type === "all") {
    await refresh();
  } else {
    await refresh();
    items.value = items.value.filter((item) => item.type === type);
  }
};
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

    <!-- ADD NEW ITEM MODAL -->
    <!-- Button trigger modal -->
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#newWarehouseItemModal"
    >
      Создать
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="newWarehouseItemModal"
      tabindex="-1"
      aria-labelledby="newWarehouseItemLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <form class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="newWarehouseItemLabel">
              Создание ТМЦ
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- TITLE -->
            <div class="mb-3">
              <label for="exampleInputName1" class="form-label"
                >Наименование</label
              >
              <input
                v-model="item.title"
                type="text"
                id="exampleInputName1"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- TYPE -->
            <div class="mb-3">
              <label for="exampleInputName1" class="form-label">Тип</label>
              <input
                v-model="item.type"
                type="text"
                id="exampleInputName1"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- QTY -->
            <div class="mb-3">
              <label for="exampleInputName1" class="form-label">Кол-во</label>
              <input
                v-model="item.qty"
                type="number"
                id="exampleInputName1"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- MEASURE -->
            <div class="mb-3">
              <label for="exampleInputName1" class="form-label">Ед. Изм.</label>
              <input
                v-model="item.measure"
                type="text"
                id="exampleInputName1"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- LOCATION -->
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

            <!-- POSITION ID -->
            <div class="mb-3">
              <label for="exampleInputName1" class="form-label"
                >PositionID</label
              >
              <input
                v-model="item.positionID"
                type="text"
                id="exampleInputName1"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- OWNER -->
            <div class="mb-3">
              <label for="exampleInputName1" class="form-label">Owner</label>
              <input
                v-model="item.owner"
                type="number"
                id="exampleInputName1"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- RESPONSIBLE -->
            <div class="mb-3">
              <label for="exampleInputName1" class="form-label">Responsible</label>
              <input
                v-model="item.responsible"
                type="number"
                id="exampleInputName1"
                aria-describedby="nameHelp"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="clearModalInputs(item)"
            >
              Отменить
            </button>
            <button
              type="button"
              id="newItemCreateBtn"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              :disabled="createNewItemBtnIsDisabled"
              @click.prevent="addWarehouseItem(item)"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- fetch data is error -->
    <div v-if="error">
      <p>Error Code {{ error.statusCode }}</p>
      <p>Error Message {{ error.message }}</p>
    </div>

    <!-- ФИЛЬТРЫ -->
    <div>
      <ul style="display: flex; list-style: none; padding: 0">
        <li>Склад</li>
        <li>Офис</li>
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

    <!--  -->
    <div class="switch-type_container">
      <!-- SWITCH BTNs -->
      <div
        v-for="(category, index) in warehouseCategories"
        :key="index"
        class="switch-type_el"
        @click="filterItemsType(category.type)"
      >
        <input
          type="radio"
          :id="index"
          :value="category.type"
          v-model="currentCategoryType"
        />
        <label :for="index">{{ category.name }}</label>
      </div>

      <!-- SEARCH -->
      <input type="text" class="form-control" placeholder="Поиск" />
    </div>

    <!-- data is loading -->
    <div v-if="pending">
      <p>Loading...</p>
    </div>

    <!-- data is loaded -->
    <div v-else>
      <!-- СПИСОК ITEMS -->
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Наименование</th>
            <th scope="col">Кол-во</th>
            <th scope="col">Местонахождение</th>
            <th scope="col">Собственник</th>
            <th scope="col">Ответственный</th>
            <th scope="col">Тип</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items">
            <td scope="col">{{ index + 1 }}</td>
            <td scope="col">
              <span class="link" @click="$router.push(`/warehouse/${item.id}`)">
                {{ item.title }}
              </span>
            </td>
            <td scope="col">{{ item.qty }} {{ item.measure }}.</td>
            <td scope="col">
              <span
                class="link"
                :class="`${locationLinkColorized(item.location)}`"
                @click="creatLocationLink(item)"
              >
                {{ translateLocation(item.positionID, item.location) }}
              </span>
            </td>
            <td scope="col">
              <span class="link" @click="translateOwner(item.owner)">{{
                item.owner
              }}</span>
            </td>
            <td scope="col">
              <span class="link" @click="$router.push(`/partners/${item.responsible}`)">{{ item.responsible }}</span>
            </td>
            <td scope="col">{{ item.type }}</td>
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
}
td {
  margin: 2px;
}
.link {
  padding: 4px 10px;
  border-radius: 16px;
}
.link:hover {
  cursor: pointer;
  /* color: white; */
  /* background-color: var(--bs-info);    */
}
.link_project {
  color: var(--bs-success);
  border: 1px solid var(--bs-success-bg-subtle);
  background-color: var(--bs-success-bg-subtle);
}
.link_sklad {
  /* color: var(bs-primary-bg-subtle); */
  color: white;
  border: none;
  background-color: var(--bs-primary-bg-subtle);
}
.link_office {
  color: white;
  border: none;
  background-color: var(--bs-primary-bg-subtle);
}
.link_repair {
  color: var(--bs-warning);
  border: 1px solid var(--bs-warning-bg-subtle);
  background-color: var(--bs-warning-bg-subtle);
}
.link_archive {
  color: var(--bs-dark-bg-subtle);
  border: none;
}
.link_deleted {
  color: var(--bs-danger-bg-subtle);
  border: none;
}

/* switch category type */
.switch-type_container {
  display: flex;
  gap: 1rem;
}

.switch-type_el {
  display: flex;
  align-items: center;
}

.switch-type_el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}

.switch-type_el label {
  cursor: pointer;
  display: inline-block;
  /* background-color: #d1d1d1; */
  padding: 4px 10px;
  border-radius: 16px;
}
.switch-type_el label:hover {
  background-color: #b1e3c1;
  color: white;
  transition: all 0.15s ease-in;
}
.switch-type_el input[type="radio"]:checked + label {
  background-color: #b1e3c1;
  color: white;
}

.form-control {
  border-radius: 16px;
}
</style>
