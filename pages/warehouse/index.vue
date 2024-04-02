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
  locationID: null,
  ownerID: null,
  ownerType: null,
  responsible: null,
});

const currentCategoryByType = ref("all");
// const currentCategoryByLocation = ref("all");
const currentCategoryByLocationObj = ref({
  title: "all",
  type: "all",
  id: null,
});
const searchInput = ref("");

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
  {
    type: "technic",
    name: "Техника",
  },
]);

const editedItem = ref({
  id: null,
  qty: null,
});

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
//   locationID: null,
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
//     locationID: 2,
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
//     locationID: 1,
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
//     locationID: 12,
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
//     locationID: "sklad_main_r2-c27-f1-f1",
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
//     locationID: "sklad_main_r1-c1-f1-f1",
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
//     locationID: "sklad_main_r1-c1-f2-f2",
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
//     locationID: "sklad_main_r3-c6-f1-f3",
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
//     locationID: 1,
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
//     locationID: "sklad_archive-r1-c1-f1-f1",
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
//     locationID: "deleted",
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
//     locationID: 2,
//     owner: "В. Н. Клименко",
//   },
// ]);
// const items = ref(null);
onMounted(async () => {
  // makes refetching
  await refresh();
  items.value = items.value.filter(
    (item) => item.location !== "archive" && item.location !== "deleted"
  );
  refreshProjects();
  refreshLocations();
  refreshOrganizations();
  // refreshUsers()
  await loadData();
});

const refreshProjects = () => refreshNuxtData("projects");
const refreshLocations = () => refreshNuxtData("locations");
// const refreshUsers = () => refreshNuxtData("users");
const refreshOrganizations = () => refreshNuxtData("organizations");

/**
 * @desc Get warehouse items from BD
 */
const {
  pending,
  error,
  refresh,
  data: items,
  status,
} = await useFetch("api/warehouse/item", {
  lazy: false,
  // transform: (items) => {
  //   return items.map(item) => ({
  //     id: item.id,
  //     title: item.title,
  //   })
  // }
});
const { data: projects } = useLazyAsyncData("projects", () =>
  $fetch("api/projects/projects")
);
const { data: locations } = useLazyAsyncData("locations", () =>
  $fetch("api/locations/locations")
);
const { data: organizations } = useLazyAsyncData("organizations", () =>
  $fetch("/api/organizations/organizations")
);

const { users } = storeToRefs(useUsersStore());
const { loadData } = useUsersStore();
// const { data: users } = useLazyAsyncData("users", () => {
//   $fetch("api/usersList/users");
// });
// const { users, loadData } = useUsersStore();
// await loadData();
// console.log(users);

// const computedProjects = computed(() =>
//   projects.value
// )
// const { data: projects } = await useFetch("api/projects/projects", {
//   lazy: false,
//   transform: (projects) => {
//     return projects.map((project) => ({
//       id: project.id,
//       title: project.title,
//     }));
//   },
// });

// Генерируем ссылки местонахождения
const creatLocationLink = (object: any) => {
  if (object) {
    if (object.location === "project") {
      router.push(`/projects/${object.locationID}`);
    } else if (object.location === "sklad") {
      alert(
        `Складской адрес: ${object.locationID}. Поидее, следует показывать точный адрес полку, где лежит. Из БД warehouseItems - position`
      );
    } else if (object.location === "repair") {
      alert(
        "В ремонте: сервисный центр поселили в БД locations. Что здесь при клике показывать?"
      );
    } else if (object.location === "office") {
      alert(
        `В офисе №${object.locationID}. Адрес офиса (надо придумать как выдавать)`
      );
    } else if (object.location === "archive") {
      alert(`В архиве. Складской адрес: ${object.locationID}`);
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

// Функции переводчики
// locations
const translateLocation = (id: any, location: string) => {
  if (location && id) {
    // PROJECT
    if (location === "project") {
      if (projects.value) {
        let project = projects.value.find((project) => project.id == id);
        return project.title;
      }
    }

    // SKLAD (locations)
    else if (location === "sklad") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return `${locationItem.title}`;
      }
    }

    // OFFICE (locations)
    else if (location === "office") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return `${locationItem.title}`;
      }
    }

    // REPAIR (locations)
    else if (location === "repair") {
      if (locations.value) {
        let locationItem = locations.value.find(
          (locationItem) => locationItem.id == id
        );
        return `Ремонт: ${locationItem.title}`;
      }
      // return `В ремонте #${id}, ${typeof id}`;
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
// responsibles
const translateResponsibles = (id: any) => {
  // console.log(users);
  if (id) {
    let responsible = users.value.find((user) => user.id === id);
    return `${responsible?.surname} ${responsible?.name[0]}. ${responsible?.middleName[0]}.`;
    // if (users.value.length) {
    //   let responsible = users.value.find((user) => user.id === id);
    //   // return `${responsible.surname} ${responsible.name[0]}. ${responsible.middleName[0]}.`;
    //   if (responsible) {
    //   }
    // }
    // return 123
  }
};
// owners
const translateOwner = (ownerID, ownerType) => {
  if (ownerID && ownerType && users.value && organizations.value) {
    if (ownerType === "user") {
      // return `USER #${ownerID}`
      let userItem = users.value.find((item) => item.id === ownerID);
      return `${userItem?.surname} ${userItem?.name[0]}. ${userItem?.middleName[0]}`;
    } else if (ownerType === "company") {
      // return `Компания #${ownerID}`
      let organizationItem = organizations.value.find(
        (item) => item.id === ownerID
      );
      return organizationItem.title;
    }
  } else if (ownerID === 0 && !ownerType) {
    return `Не соучастник`;
  }
};

const onClickOwner = (ownerID: number, ownerType: string) => {
  if (ownerID && ownerType) {
    if (ownerType === "user") {
      router.push(`/partners/${ownerID}`);
    } else if (ownerType === "company") {
      router.push(`/organizations/${ownerID}`);
    }
  }
};
const locationLinkColorized = (location: string) => {
  if (location) {
    return `link_${location}`;
  }
};

// ****** ДОБАЛЯЕМ ITEM на SKLAD to BD в newWarehouseItemModal *******
// флаг disabled для кнопки submit
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
    item.locationID &&
    item.ownerID &&
    item.ownerType &&
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
        locationID: item.locationID,
        ownerID: item.ownerID,
        ownerType: item.ownerType,
        responsible: item.responsible,
      },
    });

    // clear all inputs in modal
    clearModalInputs(item);

    // refetching
    // await refresh();
    filterItemsByCategoryType();
    filterItemsByLocationObj();
  }
}

// Ччисти инпуты модалки создания ТМЦ
const clearModalInputs = (item: any) => {
  item.uuid = null;
  item.title = null;
  item.type = null;
  item.qty = 0;
  item.measure = null;
  item.location = null;
  item.locationID = null;
  item.ownerID = null;
  item.ownerType = null;
  item.responsible = null;
};

// Фильтрация по locations
const filterItemsByLocationObj = async () => {
  await refresh();

  if (currentCategoryByLocationObj.value.id === null) {
    if (currentCategoryByType.value === "all") {
      if (currentCategoryByLocationObj.value.type === "all") {
        if (currentCategoryByLocationObj.value.title === "project") {
          items.value = items.value.filter(
            (item) => item.location === currentCategoryByLocationObj.value.title
          );
        } else {
          await refresh();
          items.value = items.value.filter(
            (item) => item.location !== "archive" && item.location !== "deleted"
          );
        }
      } else {
        items.value = items.value.filter(
          (item) => item.location === currentCategoryByLocationObj.value.type
        );
      }
    } else {
      items.value = items.value.filter(
        (item) => item.location !== "archive" && item.location !== "deleted"
      );
      if (currentCategoryByLocationObj.value.type === "all") {
        if (currentCategoryByLocationObj.value.title === "project") {
          items.value = items.value.filter(
            (item) =>
              item.type === currentCategoryByType.value &&
              item.location === "project"
          );
        } else {
          items.value = items.value.filter(
            (item) => item.type === currentCategoryByType.value
          );
        }
      } else {
        items.value = items.value.filter(
          (item) =>
            item.type === currentCategoryByType.value &&
            item.location === currentCategoryByLocationObj.value.type
        );
      }
    }
  } else {
    if (currentCategoryByType.value === "all") {
      if (currentCategoryByLocationObj.value.id === null) {
        items.value = items.value.filter(
          (item) =>
            item.location === currentCategoryByLocationObj.value.type &&
            item.locationID === currentCategoryByLocationObj.value.id
        );
      } else {
        if (currentCategoryByLocationObj.value.title === "location") {
          items.value = items.value.filter(
            (item) =>
              item.location === currentCategoryByLocationObj.value.type &&
              item.locationID === currentCategoryByLocationObj.value.id
          );
        } else {
          items.value = items.value.filter(
            (item) =>
              item.location === "project" &&
              item.locationID === currentCategoryByLocationObj.value.id
          );
        }
      }
    } else {
      if (currentCategoryByLocationObj.value.title === "project") {
        items.value = items.value.filter(
          (item) =>
            item.type === currentCategoryByType.value &&
            item.location === "project" &&
            item.locationID === currentCategoryByLocationObj.value.id
        );
      } else {
        items.value = items.value.filter(
          (item) =>
            item.type === currentCategoryByType.value &&
            item.location === currentCategoryByLocationObj.value.type &&
            item.locationID === currentCategoryByLocationObj.value.id
        );
      }
    }
  }
};
// фильтрация по products
const filterItemsByCategoryType = async () => {
  await refresh();
  if (currentCategoryByLocationObj.value.type === "all") {
    if (currentCategoryByType.value === "all") {
      if (currentCategoryByLocationObj.value.title === "project") {
        items.value = items.value.filter((item) => item.location === "project");
      } else {
        await refresh();
        items.value = items.value.filter(
          (item) => item.location !== "archive" && item.location !== "deleted"
        );
      }
    } else {
      await refresh();
      items.value = items.value.filter(
        (item) => item.location !== "archive" && item.location !== "deleted"
      );
      if (currentCategoryByLocationObj.value.title === "project") {
        items.value = items.value.filter(
          (item) =>
            item.type === currentCategoryByType.value &&
            item.location === "project"
        );
      } else {
        items.value = items.value.filter(
          (item) => item.type === currentCategoryByType.value
        );
      }
    }
  } else if (currentCategoryByType.value === "all") {
    if (currentCategoryByLocationObj.value.type === "all") {
      await refresh();
    } else {
      if (currentCategoryByLocationObj.value.id) {
        if (currentCategoryByLocationObj.value.title === "project") {
          items.value = items.value.filter(
            (item) =>
              item.location === "project" &&
              item.locationID === currentCategoryByLocationObj.value.id
          );
        } else {
          items.value = items.value.filter(
            (item) =>
              item.location === currentCategoryByLocationObj.value.type &&
              item.locationID === currentCategoryByLocationObj.value.id
          );
        }
      } else {
        items.value = items.value.filter(
          (item) => item.location === currentCategoryByLocationObj.value.type
        );
      }
    }
  } else {
    if (currentCategoryByType.value !== "all") {
      if (currentCategoryByLocationObj.value.id) {
        if (currentCategoryByLocationObj.value.title === "project") {
          items.value = items.value.filter(
            (item) =>
              item.type === currentCategoryByType.value &&
              item.location === "project" &&
              item.locationID === currentCategoryByLocationObj.value.id
          );
        } else {
          items.value = items.value.filter(
            (item) =>
              item.type === currentCategoryByType.value &&
              item.location === currentCategoryByLocationObj.value.type &&
              item.locationID === currentCategoryByLocationObj.value.id
          );
        }
      } else {
        items.value = items.value.filter(
          (item) =>
            item.type === currentCategoryByType.value &&
            item.location === currentCategoryByLocationObj.value.type
        );
      }
    } else {
    }
    // await refresh()
  }
};
// Фильтрация по архиву
const showItemsInArchive = () => {
  items.value = items.value.filter((item) => item.location === "archive");
  currentCategoryByLocationObj.value = {
    title: "location",
    type: "archive",
    id: null,
  };
  currentCategoryByType.value = "all";
};
// Фильтрация по удаленным
const showItemsInDeleted = () => {
  items.value = items.value.filter((item) => item.location === "deleted");
  currentCategoryByLocationObj.value = {
    title: "location",
    type: "deleted",
    id: null,
  };
  currentCategoryByType.value = "all";
};
// фильтрация по search input
const computedItems = computed(() =>
  searchInput.value === ""
    ? items.value
    : items.value.filter((item) =>
        item.title
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(searchInput.value.toLowerCase().replace(/\s+/g, ""))
      )
);

// Изменения в количестве
const changeQty = (action, id) => {
  let item = items.value.find((item) => item.id === id);

  if (action === "sub") {
    if (item.qty > 0) {
      item.qty--;
    }
  } else if (action === "add") {
    item.qty++;
  }
  editedItem.value.id = item.id;
  editedItem.value.qty = item.qty;

  updateItem(editedItem.value);
};

async function updateItem(editedItem) {
  let item = null;

  if (editedItem.id) {
    item = await $fetch("api/warehouse/item", {
      method: "PUT",
      body: {
        id: editedItem.id,
        qty: editedItem.qty,
      },
    });
  }
  console.log(editedItem);
}

// ******** WATCHERS ********

// Следим за изменением поиска
// watch(searchInput, async () => {
//   console.log(searchInput.value);
//   if (searchInput.value === "") {
//     filterItemsByLocationObj();
//     filterItemsByCategoryType();
//   } else {
//     items.value = items.value.filter((item) => {
//       return (
//         item.title.toLowerCase().indexOf(searchInput.value.toLowerCase()) !== -1
//       );
//     });
//   }
// });
// Следим за изменением фильтров и обновляем данные
watch(currentCategoryByType, async () => {
  filterItemsByCategoryType();
});
watch(currentCategoryByLocationObj, async () => {
  filterItemsByLocationObj();
});

// Проверка перед сабмитом
watch(item.value, () => {
  if (
    item.value.title &&
    item.value.type &&
    item.value.qty > 0 &&
    item.value.measure &&
    item.value.location &&
    item.value.locationID &&
    item.value.ownerID &&
    item.value.ownerType &&
    item.value.responsible
  ) {
    createNewItemBtnIsDisabled.value = false;
  } else {
    createNewItemBtnIsDisabled.value = true;
  }
});

//
</script>
<template>
  <Container>
    <h1>ТМЦ</h1>

    <!-- ******** ADD NEW ITEM MODAL ******** -->

    <!-- Button trigger modal -->
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#newWarehouseItemModal"
    >
      Создать
    </button>

    <!-- Modal create item-->
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
              <label for="itemTitle" class="form-label">Наименование</label>
              <input
                v-model="item.title"
                type="text"
                id="itemTitle"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- TYPE -->
            <div class="mb-3">
              <label for="itemType" class="form-label"
                >Тип (tools | stuff | consumables | technic
                (warehouseCategories))</label
              >
              <input
                v-model="item.type"
                type="text"
                id="itemType"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- QTY -->
            <div class="mb-3">
              <label for="itemQty" class="form-label">Кол-во</label>
              <input
                v-model="item.qty"
                type="number"
                id="itemQty"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- MEASURE -->
            <div class="mb-3">
              <label for="itemMeasure" class="form-label"
                >Ед. Изм. (шт. | погм.м. | рулон | кг. | т.?)</label
              >
              <input
                v-model="item.measure"
                type="text"
                id="itemMeasure"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- LOCATION -->
            <div class="mb-3">
              <label for="itemLocation" class="form-label"
                >Местонахождение (office | sklad | repair | project | archive |
                deleted)</label
              >
              <input
                v-model="item.location"
                type="text"
                id="itemLocation"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- POSITION ID -->
            <div class="mb-3">
              <label for="itemlocationID" class="form-label">locationID</label>
              <input
                v-model="item.locationID"
                type="number"
                id="itemlocationID"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- OWNER ID-->
            <div class="mb-3">
              <label for="itemOwnerID" class="form-label">Owner ID</label>
              <input
                v-model="item.ownerID"
                type="number"
                id="itemOwnerID"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- OWNER TYPE-->
            <div class="mb-3">
              <label for="itemOwnerType" class="form-label"
                >Owner TYPE (user | company)</label
              >
              <input
                v-model="item.ownerType"
                type="text"
                id="itemOwnerType"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div>

            <!-- RESPONSIBLE -->
            <div class="mb-3">
              <label for="itemResponsible" class="form-label"
                >ResponsibleID</label
              >
              <input
                v-model="item.responsible"
                type="number"
                id="itemResponsible"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div>
          </div>

          <!-- MODAL FOOTER -->
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

    <!-- ********************* ФИЛЬТРЫ ********************** -->

    <!-- FILTERS RADIO BTN -->
    <div class="switch-type_container">
      <div>
        <!-- set location & project -->
        <select
          class="form-select form-select-sm"
          aria-label=".form-select-sm example"
          v-model="currentCategoryByLocationObj"
        >
          <!-- all locations & projects -->
          <option :value="{ title: 'all', type: 'all', id: null }">Все</option>

          <!-- All locations -->
          <optgroup label="All locations">
            <option :value="{ title: 'location', type: 'sklad', id: null }">
              Все склады
            </option>
            <option :value="{ title: 'location', type: 'repair', id: null }">
              Все repair
            </option>
            <option :value="{ title: 'location', type: 'office', id: null }">
              Все офисы
            </option>
            <option :value="{ title: 'project', type: 'all', id: null }">
              Все проекты
            </option>
          </optgroup>

          <!-- Locations -->
          <optgroup label="Locations">
            <option
              :value="{
                title: 'location',
                type: location.type,
                id: location.id,
              }"
              v-for="(location, i) in locations"
            >
              {{ location.type }} | {{ location.title }} |
              {{ location.address }}
            </option>
          </optgroup>

          <!-- projects -->
          <optgroup label="Проекты">
            <option
              :value="{ title: 'project', id: project.id }"
              v-for="(project, i) in projects"
            >
              {{ project.title }} | {{ project.address }}
            </option>
          </optgroup>
        </select>

        <!-- set category type -->
        <div style="display: flex; gap: 1rem; margin-top: 1rem">
          <!-- SWITCH BTNs -->
          <div
            v-for="(category, index) in warehouseCategories"
            :key="index"
            class="switch-type_el"
          >
            <input
              type="radio"
              :id="index"
              :value="category.type"
              v-model="currentCategoryByType"
            />
            <label :for="index">{{ category.name }}</label>
          </div>
        </div>
      </div>

      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.3rem;
        "
      >
        <!-- SEARCH -->
        <div class="search-container">
          <input
            type="text"
            class="form-control"
            placeholder="Поиск"
            v-model="searchInput"
          />
          <Icon
            name="ic:baseline-search"
            size="24px"
            color="var(--bs-body-color)"
          />
        </div>

        <!-- FILTER BY ARCHIVE & DELETED -->
        <div
          style="
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            margin-right: 0.5rem;
          "
        >
          <span
            style="cursor: pointer; color: var(--bs-blue)"
            @click="showItemsInArchive"
            >Архив
          </span>
          <span style="color: var(--bs-blue)">|</span>
          <span
            style="cursor: pointer; color: var(--bs-blue)"
            @click="showItemsInDeleted"
            >Удаленные
          </span>
        </div>
      </div>
    </div>

    <!-- fetch data is error -->
    <div v-if="error">
      <p>Error Code {{ error.statusCode }}</p>
      <p>Error Message {{ error.message }}</p>
    </div>

    <!-- data is loading -->
    <div v-if="pending">
      <p>Loading...</p>
    </div>

    <!-- data is loaded -->
    <div v-else>
      <!-- <div>{{ itemInfo.projects }}</div> -->
      <br />
      <!-- <div>{{ itemInfo.locations }}</div> -->
      <!-- СПИСОК ITEMS -->
      <!-- <div>{{ computedItems.length }}</div> -->
      <table class="table">
        <!-- <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Наименование</th>
            <th scope="col">Кол-во</th>
            <th scope="col">Местонахождение</th>
            <th scope="col">Собственник</th>
            <th scope="col">Ответственный</th>
          </tr>
        </thead> -->

        <tbody>
          <div v-if="computedItems">
            <div v-if="!searchInput && !computedItems.length">Ничего нет</div>
            <div v-if="searchInput && !computedItems.length">
              По запросу ничего не найдено
            </div>
          </div>

          <tr v-for="(item, index) in computedItems">
            <td>
              <Icon
                class="link"
                :class="{ isEmpty: !item.qty, isNotEmpty: item.qty }"
                name="material-symbols-light:question-exchange-rounded"
                size="24px"
              />
            </td>
            <td scope="col">
              <span>{{ index + 1 }}. </span>
              <span class="link" @click="$router.push(`/warehouse/${item.id}`)">
                {{ item.title }}
              </span>
            </td>
            <td scope="col">
              <div>{{ item.qty }} {{ item.measure }}.</div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 1rem;
                  justify-content: flex-start;
                "
              >
                <!-- <Icon
                  class="link"
                  :class="{ isEmpty: !item.qty }"
                  name="material-symbols-light:remove-rounded"
                  @click="changeQty('sub', item.id)"
                /> -->
                <!-- <Icon
                  class="link"
                  name="material-symbols-light:add"
                  @click="changeQty('add', item.id)"
                /> -->
              </div>
            </td>
            <td scope="col">
              <span
                class="link link-location"
                :class="`${locationLinkColorized(item.location)}`"
                @click="creatLocationLink(item)"
              >
                {{ translateLocation(item.locationID, item.location) }}
              </span>
            </td>
            <td scope="col">
              <span
                class="link"
                @click="onClickOwner(item.ownerID, item.ownerType)"
                >{{ translateOwner(item.ownerID, item.ownerType) }}
              </span>
            </td>
            <td scope="col">
              <span
                class="link"
                @click="$router.push(`/partners/${item.responsible}`)"
                >{{ translateResponsibles(item.responsible) }}</span
              >
            </td>
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
.link-location {
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
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
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

.search-container {
  position: relative;
  align-self: flex-start;
}

.search-container input:focus {
  /* background-color: black; */
}

.search-container input:focus + .search-container {
  width: 100%;
}

.search-container .icon {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
}

.form-control,
.form-select {
  border-radius: 16px;
  padding: 4px 10px;
}

.isEmpty {
  background-color: white;
  color: var(--bs-border-color);
  cursor: unset !important;
  /* width: 10px;
  heigth: 10px; */
}
.isNotEmpty {
  color: var(--bs-blue);
}
</style>
