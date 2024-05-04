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

const tempCreateItemLocation = ref({
  type: null,
  id: null,
});

const tempCreateItemOwner = ref({
  type: null,
  id: null
})

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
//
const categoriesCopy = (array) => {
  if (array) {
    let newArray = array.filter((item) => item.type !== "all");

    return newArray;
  }
};

// Единицы измерения (пока хардкорно)
const measureTypes = ref([
  {
    type: "шт.",
    name: "шт.",
  },
  {
    type: "пог. м.",
    name: "пог. м.",
  },
  {
    type: "рулон",
    name: "рулон",
  },
  {
    type: "пачка",
    name: "пачка",
  },
  {
    type: "кг.",
    name: "кг.",
  },
]);

// Для действий по редактированию предметов (добавление, вычитание, перемещение редактирование конкретного)
const currentItem = ref(null);
const editedActionType = ref(null);
const editedItem = ref({
  id: null,
  title: null,
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

  await loadData();

  // Скрытие модалки редактирования предмета
  const editItemModalEl = document.getElementById("editWarehouseItemModal");
  editItemModalEl.addEventListener("hidden.bs.modal", (event) => {
    currentItem.value = null;
    editedItem.value = {
      id: null,
      title: null,
      qty: null,
    };
    // Сбрасывает временную переменную количества к действию
    tempQty.value = 0;
    tempLocation.value = { title: "Все", type: "all", id: null };
    // tempCreateItemLocation.value = { type: null, id: null };
    // console.log("Закрыть модалку редактирования ТМЦ");
    // console.log(currentItem.value);
    // console.log(editedItem.value);
  });

  //
  const newItemModalEl = document.getElementById("newWarehouseItemModal");
  newItemModalEl.addEventListener("hidden.bs.modal", (event) => {
    item.value = {
      // uuid: null,
      title: null,
      type: null,
      qty: 0,
      measure: null,
      location: null,
      locationID: null,
      ownerID: null,
      ownerType: null,
      responsible: null,
    };
    // item.value.uuid = null;
    // item.value.title = null;
    // item.value.type = null;
    // item.value.qty = 0;
    // item.value.measure = null;
    // item.value.location = null;
    // item.value.locationID = null;
    // item.value.ownerID = null;
    // item.value.ownerType = null;
    // item.value.responsible = null;
    tempCreateItemLocation.value = { type: null, id: null };
    tempCreateItemOwner.value = { type: null, id: null };
  });
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
  transform: (items:any) => {
    // return items.map(item) => ({
    //   id: item.id,
    //   title: item.title,
    // })
    // return items.sort((x, y) => x.title.localeCompare(y.title));
    return items.sort((x, y) => {
      if (x.title < y.title) {
        return -1;
      }
  
      if (x.title > y.title) {
          return 1;
      }

      return x.locationID - y.locationID
    })
  }
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
      alert(`Архив. Складской адрес: ${object.locationID}`);
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
      return "Списание";
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
  }
};
// owners
const translateOwner = (ownerID, ownerType) => {
  if (ownerID && ownerType && users.value && organizations.value) {
    if (ownerType === "user") {
      // return `USER #${ownerID}`
      let userItem = users.value.find((item) => item.id === ownerID);
      return `${userItem?.surname} ${userItem?.name[0]}. ${userItem?.middleName[0]}.`;
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
// action type
const translateActionType = (actionType: string) => {
  if (itemActions.value) {
    let actionArray = itemActions.value.filter(
      (item) => item.type === actionType
    );
    if (actionArray.length) {
      return actionArray[0].title;
    }
  }
};

// не знал как назвать
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
    tempCreateItemLocation.value = {
      type: null,
      id: null,
    };
    tempCreateItemOwner.value = {
      type: null,
      id: null,
    }
    // clearModalInputs(item);

    // refetching
    filterItemsByCategoryType();
    filterItemsByLocationObj();
  }
}

// Ччисти инпуты модалки создания ТМЦ
// const clearModalInputs = (item: any) => {
//   item.uuid = null;
//   item.title = null;
//   item.type = null;
//   item.qty = 0;
//   item.measure = null;
//   item.location = null;
//   item.locationID = null;
//   item.ownerID = null;
//   item.ownerType = null;
//   item.responsible = null;
// };
// Чистка инпутов модалки редактирования ТМЦ
// const clearEditModalInputs = (item) => {
//   currentItem.value = null;
//   editedItem.value = {
//     id: null,
//     title: null,
//     qty: null,
//   };
//   // Сбрасывает временную переменную количества к действию
//   tempQty.value = 0;
//   console.log("Закрыть модалку редактирования ТМЦ");
//   console.log(currentItem.value);
//   console.log(editedItem.value);
// };

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
    : items.value.filter((item: any) =>
        item.title
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(searchInput.value.toLowerCase().replace(/\s+/g, ""))
      )
    // : filterItemsFunc(items.value)
);

// const filterItemsFunc = (itemsArray: any) => {
//   return itemsArray.filter((item) => item.title
//           .toLowerCase()
//           .replace(/\s+/g, "")
//           .includes(searchInput.value.toLowerCase().replace(/\s+/g, "")))
// }

// const sortedItemsFunc = (itemsArray: any) => {
//   return itemsArray.sort((x, y) => x.title.localeCompare(y.title));
// }

// Изменения в предмете
// const changeEditedQty = () => {
//   if(editedActionType.value === 'add') {

//   }
// }
const tempQty = ref(0);
const tempLocation = ref({
  title: "Все",
  type: "all",
  id: null,
});
// title:
// type:
// id:
const editBtnIsDisabled = ref(true);
const submitEditCurrentItem = async () => {
  // console.log(`submitEditCurrentItem: ${editedActionType.value}`);
  // console.log(editedItem.value);
  // let item = items.value.find((item) => item.id === id);

  // if (action === "sub") {
  //   if (item.qty > 0) {
  //     item.qty--;
  //   }
  // } else if (action === "add") {
  //   item.qty++;
  // }
  // editedItem.value.id = item.id;
  // editedItem.value.qty = item.qty;
  if (editedActionType.value === "add") {
    editedItem.value.qty += tempQty.value;
    // await updateItem(editedItem.value);
  } else if (editedActionType.value === "sub") {
    editedItem.value.qty -= tempQty.value;
    // await updateItem(editedItem.value);
  } else if (editedActionType.value === "move") {
    console.log("checking position to move...");
    // Check is position available
  }

  await updateItem(editedItem.value);
  // Сбрасывает временную переменную количества к действию
  tempQty.value = 0;
  tempLocation.value = { title: "Все", type: "all", id: null };
};

async function updateItem(editedItem) {
  let item = null;

  if (editedActionType.value === "add") {
    if (editedItem.id) {
      item = await $fetch("api/warehouse/item", {
        method: "PUT",
        body: {
          id: editedItem.id,
          // title: editedItem.title,
          qty: editedItem.qty,
          // location: editedItem.location,
          // locationID: editedItem.locationID
        },
      });
    }
  } else if (editedActionType.value === "sub") {
    if (editedItem.id) {
      // Отправляем в архив, если в расход отправляем всё  доступное у предмета кол-во
      if (tempQty.value === currentItem.value.qty) {
        editedItem.location = "archive";
        // editedItem.locationID
      }

      item = await $fetch("api/warehouse/item", {
        method: "PUT",
        body: {
          id: editedItem.id,
          // title: editedItem.title,
          qty: editedItem.qty,
          location: editedItem.location,
          locationID: editedItem.locationID,
        },
      });
    }
  } else if (editedActionType.value === "move") {
    if (editedItem.id) {
      // 1
      // Если перемещаем всё кол-во в другое место
      if (tempQty.value === currentItem.value.qty) {
        editedItem.location = tempLocation.value.type;
        editedItem.locationID = tempLocation.value.id;
      }
      // 2
      // 3
      // 4
      item = await $fetch("api/warehouse/item", {
        method: "PUT",
        body: {
          id: editedItem.id,
          // title: editedItem.title,
          qty: editedItem.qty,
          location: editedItem.location,
          locationID: editedItem.locationID,
        },
      });
      // console.log(item)
      console.log('Moved')
    }
  }
  // console.log(editedItem);
  // await refresh();
  filterItemsByCategoryType();
  filterItemsByLocationObj();
}

// Item ACTIONS Modal FUNC
const itemActions = ref([
  {
    type: "add",
    title: "Добавить",
  },
  {
    type: "sub",
    title: "Расход",
  },
  {
    type: "move",
    title: "Переместить",
  },
  // {
  //   type: "edit",
  //   title: "Редактировать",
  // },
]);
const currentExpendedItemBlock = ref(null);

const toggleExpendedItemBlock = (itemID: number) => {
  if (itemID) {
    currentExpendedItemBlock.value = `expended-item-${itemID}_block`;
    let block = document.querySelector(`#${currentExpendedItemBlock.value}`);
    // console.log(block);
    // console.log(currentExpendedItemBlock.value);
    if (block) {
      //   console.log(block)
      if (block.classList.contains("expended-item_opened")) {
        block.classList.remove("expended-item_opened");
      } else {
        block.classList.add("expended-item_opened");
      }
    }
  }
};

//
const onClickAction = (action: string, item: any) => {
  editedActionType.value = action;
  currentItem.value = item;
  if (action === "add" || action === "sub") {
    editedItem.value = {
      id: item.id,
      title: item.title,
      qty: item.qty,
    };
  } else if (action === "move") {
    editedItem.value = {
      id: item.id,
      title: item.title,
      qty: item.qty,
      location: item.location,
      locationID: item.locationID,
      position: item.position,
    };
  }
  // console.log(`onClickAction: ${action}, id: ${item.id}`);
};

// ******** WATCHERS ********

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

watch(tempQty, () => {
  // console.log(typeof tempQty.value);
  if (editedActionType.value === "add") {
    if (
      typeof tempQty.value == "string" ||
      tempQty.value === 0 ||
      tempQty.value < 0
    ) {
      editBtnIsDisabled.value = true;
    } else {
      editBtnIsDisabled.value = false;
    }
    // if (tempQty.value) {
    // }
  } else if (editedActionType.value === "sub") {
    if (
      typeof tempQty.value == "string" ||
      tempQty.value === 0 ||
      tempQty.value < 0
    ) {
      editBtnIsDisabled.value = true;
    } else if (tempQty.value > currentItem.value.qty) {
      editBtnIsDisabled.value = true;
    } else {
      // console.log(tempQty.value);
      editBtnIsDisabled.value = false;
    }
  } else if (editedActionType.value === "move") {
    if (
      typeof tempQty.value == "string" ||
      tempQty.value === 0 ||
      tempQty.value < 0 ||
      tempLocation.value.type === "all"
    ) {
      editBtnIsDisabled.value = true;
    } else {
      editBtnIsDisabled.value = false;
    }
  }
});

watch(tempLocation, () => {
  if (tempLocation.value) {
    if (tempLocation.value.type === "all") {
      editBtnIsDisabled.value = true;
    } else {
      if (
        typeof tempQty.value == "string" ||
        tempQty.value === 0 ||
        tempQty.value < 0
      ) {
        editBtnIsDisabled.value = true;
      } else {
        if (
          tempLocation.value.title === currentItem.value.location &&
          tempLocation.value.id === currentItem.value.locationID
        ) {
          editBtnIsDisabled.value = true;
        } else {
          editBtnIsDisabled.value = false;
        }
      }
    }
  }
});

watch(tempCreateItemLocation, () => {
  // console.log(tempCreateItemLocation.value)
  item.value.location = tempCreateItemLocation.value.type;
  item.value.locationID = tempCreateItemLocation.value.id;
});

watch(tempCreateItemOwner, () => {
  item.value.ownerType = tempCreateItemOwner.value.type;
  item.value.ownerID = tempCreateItemOwner.value.id
})

//
// watch(items, (prevValue, newValue) => {
//   console.log(newValue)
//   console.log(prevValue)

// })
</script>
<template>
  <Container>
    <div class="mt-5rem">
      <h1 class="header-h1">ТМЦ</h1>
    </div>

    <!-- EDIT ITEM MODAL-->
    <!-- Button trigger modal -->
    <!-- Modal -->
    <div
      class="modal fade"
      id="editWarehouseItemModal"
      tabindex="-1"
      aria-labelledby="editWarehouseItemModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <!-- <h1 class="modal-title fs-5" id="editWarehouseItemModalLabel">
              Редактирование ТМЦ
            </h1> -->
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h1>{{ editedItem.title }}</h1>

            <div v-if="editedActionType && currentItem">
              <!-- add -->
              <div
                v-if="editedActionType === 'add'"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: space-between;
                  gap: 2rem;
                "
              >
                <!--  -->
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                  "
                >
                  <label for="qtyAdd" class="form-label" style="margin: 0"
                    >Добавляем:</label
                  >
                  <div style="display: flex; align-items: center; gap: 0.5rem">
                    <input
                      v-model="tempQty"
                      type="number"
                      id="qtyAdd"
                      class="form-control"
                      aria-describedby="nameHelp"
                    />
                    <span>{{ currentItem.measure }}</span>
                  </div>
                </div>
              </div>
              <!-- sub -->
              <div
                v-if="editedActionType === 'sub'"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: space-between;
                  gap: 2rem;
                "
              >
                <!--  -->
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                  "
                >
                  <label for="qtySub" class="form-label" style="margin: 0"
                    >Расход:</label
                  >
                  <div style="display: flex; align-items: center; gap: 0.5rem">
                    <input
                      v-model="tempQty"
                      type="number"
                      id="qtySub"
                      class="form-control"
                      aria-describedby="nameHelp"
                    />
                    <span>{{ currentItem.measure }}</span>
                  </div>
                  <div
                    @click="tempQty = currentItem.qty"
                    style="
                      background-color: var(--bs-primary);
                      color: #fff;
                      padding: 4px 10px;
                      border-radius: 1rem;
                      cursor: pointer;
                    "
                  >
                    <span
                      >Все {{ currentItem.qty }} {{ currentItem.measure }}</span
                    >
                  </div>
                </div>
              </div>
              <!-- move -->
              <div
                v-if="editedActionType === 'move'"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                "
              >
                Перемещаем
                <br />
                <br />
                <!-- {{ currentItem }} -->
                <!-- <br> -->
                <!-- <br> -->
                <!-- {{ tempLocation }} -->

                <!-- MOVE FROM  -->
                <div style="display: flex; align-items: center; gap: 1rem">
                  <span> Откуда: </span>
                  <span
                    class="link link-location"
                    :class="`${locationLinkColorized(currentItem.location)}`"
                  >
                    {{
                      translateLocation(
                        currentItem.locationID,
                        currentItem.location
                      )
                    }}
                  </span>
                </div>

                <!-- separator -->
                <span> >>> </span>

                <!-- MOVE TO -->
                <div style="display: flex; align-items: center; gap: 1rem">
                  <span>Куда:</span>
                  <select
                    class="form-select"
                    aria-label=".form-select-sm example"
                    v-model="tempLocation"
                  >
                    <!-- deafult -->
                    <option
                      :value="{ title: 'Все', type: 'all', id: null }"
                      selected
                    >
                      Выберите
                    </option>
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
                        {{ location.title }}
                      </option>
                    </optgroup>
                    <!-- projects -->
                    <optgroup label="Проекты">
                      <option
                        :value="{
                          title: 'project',
                          type: 'project',
                          id: project.id,
                        }"
                        v-for="(project, i) in projects"
                      >
                        {{ project.title }}
                        <!-- | {{ project.address }} -->
                      </option>
                    </optgroup>
                    <!-- Archive & deleted -->
                    <optgroup label="Прочее">
                      <option
                        :value="{
                          title: 'location',
                          type: 'archive',
                          id: null,
                        }"
                      >
                        Архив
                      </option>
                      <option
                        :value="{
                          title: 'location',
                          type: 'deleted',
                          id: null,
                        }"
                      >
                        Списание
                      </option>
                    </optgroup>
                  </select>
                </div>

                <br />
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                  "
                >
                  <label for="qtyMove" class="form-label" style="margin: 0"
                    >Количество:</label
                  >
                  <div style="display: flex; align-items: center; gap: 0.5rem">
                    <input
                      v-model="tempQty"
                      type="number"
                      id="qtySub"
                      class="form-control"
                      aria-describedby="nameHelp"
                    />
                    <span>{{ currentItem.measure }}</span>
                  </div>
                  <div
                    @click="tempQty = currentItem.qty"
                    style="
                      background-color: var(--bs-primary);
                      color: #fff;
                      padding: 4px 10px;
                      border-radius: 1rem;
                      cursor: pointer;
                    "
                  >
                    <span
                      >Все {{ currentItem.qty }} {{ currentItem.measure }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Отменить
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#editWarehouseItemModal"
              :disabled="editBtnIsDisabled"
              @click="submitEditCurrentItem"
            >
              {{ translateActionType(editedActionType) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ******** ADD NEW ITEM MODAL ******** -->
    <!-- Button trigger modal create item -->
    <button
      type="button"
      class="btn btn-primary btn-create-modal-open-767"
      data-bs-toggle="modal"
      data-bs-target="#newWarehouseItemModal"
    >
      <span> Создать </span>
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
          <!-- MODAL HEADER -->
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

          <!-- MODAL CONTENT -->
          <div class="modal-body">
            <div>
              {{ item }}
            </div>
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
              <label for="itemType" class="form-label">Тип </label>
              <select
                class="form-select"
                aria-label="Default select example"
                id="itemType"
                v-model="item.type"
              >
                <option value="null" selected>Выберите</option>
                <option
                  v-for="(type, index) in categoriesCopy(warehouseCategories)"
                  :value="type.type"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>

            <!-- MEASURE & QTY -->
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
              "
            >
              <!-- MEASURE -->
              <div class="mb-3" style="width: 100%">
                <label for="itemMeasure" class="form-label"
                  >Ед. измерения</label
                >
                <select
                  class="form-select"
                  aria-label="Default select example"
                  id="itemMeasure"
                  v-model="item.measure"
                >
                  <option value="null" selected>Выберите</option>
                  <option
                    v-for="(type, index) in measureTypes"
                    :value="type.type"
                  >
                    {{ type.name }}
                  </option>
                </select>
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
            </div>

            <!-- LOCATION -->
            <!-- <div class="mb-3">
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
            </div> -->

            <div class="mb-3">
              <label for="itemLocation" class="form-label"
                >Местонахождение</label
              >
              <select
                class="form-select"
                aria-label="Default select example"
                v-model="tempCreateItemLocation"
              >
                <option :value="{ type: null, id: null }" selected>
                  Выберите
                </option>
                <!-- Locations -->
                <optgroup label="Locations">
                  <option
                    :value="{
                      type: location.type,
                      id: location.id,
                    }"
                    v-for="(location, i) in locations"
                  >
                    {{ location.title }}
                  </option>
                </optgroup>
                <!-- projects -->
                <optgroup label="Проекты">
                  <option
                    :value="{
                      type: 'project',
                      id: project.id,
                    }"
                    v-for="(project, i) in projects"
                  >
                    {{ project.title }}
                    <!-- | {{ project.address }} -->
                  </option>
                </optgroup>
              </select>
            </div>

            <!-- POSITION ID -->
            <!-- <div class="mb-3">
              <label for="itemlocationID" class="form-label">locationID</label>
              <input
                v-model="item.locationID"
                type="number"
                id="itemlocationID"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div> -->

            <!-- OWNER -->
            <div class="mb-3">
              <label for="users" class="form-label"
                >Собственник</label
              >
              <select
                class="form-select"
                aria-label="Default select example"
                v-model="tempCreateItemOwner"
              >
                <option :value="{ type: null, id: null }" selected>
                  Выберите
                </option>
                <!-- Users -->
                <optgroup label="Соучастники">
                  <option
                    :value="{
                      type: 'user',
                      id: user.id,
                    }"
                    v-for="(user, i) in users"
                  >
                  <!-- return `${userItem?.surname} ${userItem?.name[0]}. ${userItem?.middleName[0]}.`; -->
                    {{ user.surname }} {{ user.name }} {{ user.middleName }}
                  </option>
                </optgroup>
                <!-- Companies -->
                <optgroup label="Организации">
                  <option 
                    :value="{
                      type: 'company',
                      id: company.id
                    }"
                    v-for="(company, i) in organizations"
                  >
                    {{ company.title }}
                  </option>
                </optgroup>
                </select>
            </div>

            <!-- OWNER ID-->
            <!-- <div class="mb-3">
              <label for="itemOwnerID" class="form-label">Owner ID</label>
              <input
                v-model="item.ownerID"
                type="number"
                id="itemOwnerID"
                class="form-control"
                aria-describedby="nameHelp"
              />
            </div> -->

            <!-- OWNER TYPE-->
            <!-- <div class="mb-3">
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
            </div> -->

            <!-- RESPONSIBLE -->
            <div class="mb-3">
              <label for="users" class="form-label"
                >Ответственный</label
              >
              <select
                class="form-select"
                aria-label="Default select example"
                v-model="item.responsible"
              >
                <option :value="null" selected>
                  Выберите
                </option>
                <!-- Users -->
                <!-- <optgroup label="Соучастники"> -->
                  <option
                    :value="user.id"
                    v-for="(user, i) in users"
                  >
                  <!-- return `${userItem?.surname} ${userItem?.name[0]}. ${userItem?.middleName[0]}.`; -->
                    {{ user.surname }} {{ user.name }} {{ user.middleName }}
                  </option>
                <!-- </optgroup> -->
              </select>
            </div>

            <!-- RESPONSIBLE -->
            <!-- <div class="mb-3">
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
            </div> -->
          </div>

          <!-- MODAL FOOTER -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
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
      <div style="max-width: 100%">
        <!-- set location & project -->
        <select
          class="form-select form-select-sm filter-location_select"
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
              <!-- {{ location.type }} |  -->
              {{ location.title }}
              <!-- | {{ location.address }} -->
            </option>
          </optgroup>

          <!-- projects -->
          <optgroup label="Проекты">
            <option
              :value="{ title: 'project', id: project.id }"
              v-for="(project, i) in projects"
            >
              {{ project.title }}
              <!-- | {{ project.address }} -->
            </option>
          </optgroup>

          <!-- Archive & deleted -->
          <optgroup label="Прочее">
            <option
              :value="{
                title: 'location',
                type: 'archive',
                id: null,
              }"
            >
              Архив
            </option>
            <option
              :value="{
                title: 'location',
                type: 'deleted',
                id: null,
              }"
            >
              Списание
            </option>
          </optgroup>
        </select>

        <!-- set category type -->
        <div class="set-categoty-type_wrapper">
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

      <div class="search-and-filter_container">
        <!-- SEARCH -->
        <div class="search-container">
          <input
            type="text"
            class="form-control search_input"
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
        <div class="filter-archive_container">
          <span @click="showItemsInArchive">Архив </span>
          <span>|</span>
          <span @click="showItemsInDeleted">Списание</span>
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
      <table class="table">
        <thead class="item-table_header">
          <tr>
            <th scope="col"></th>
            <th scope="col">Наименование</th>
            <th scope="col">Кол-во</th>
            <th scope="col">Местонахождение</th>
            <th scope="col">Собственник</th>
            <th scope="col">Ответственный</th>
          </tr>
        </thead>

        <tbody>
          <div v-if="computedItems">
            <div v-if="!searchInput && !computedItems.length">Ничего нет</div>
            <div v-if="searchInput && !computedItems.length">
              По запросу ничего не найдено
            </div>
          </div>

          <!-- СПИСОК ITEMS -->
          <tr class="table-row_wrapper" v-for="(item, index) in computedItems">
            <!-- 1 -->
            <td>
              <label>
                <input
                  type="checkbox"
                  id="expend-item"
                  :class="`expended-item-${item.id}_block`"
                />
                <Icon
                  @click="toggleExpendedItemBlock(item.id)"
                  class="expand-item_icon"
                  name="material-symbols-light:expand-more"
                  size="28px"
                />
              </label>
            </td>

            <!-- 2 -->
            <td class="span-3" scope="col">
              <span>{{ index + 1 }}. </span>
              <span class="link" @click="$router.push(`/warehouse/${item.id}`)">
                {{ item.title }}
              </span>
            </td>

            <!-- 3 -->
            <td class="item-qty" scope="col">
              <span>{{ item.qty }} {{ item.measure }}</span>
            </td>

            <!-- 4 -->
            <td class="span-5 hide-767" scope="col">
              <span
                class="link link-location"
                :class="`${locationLinkColorized(item.location)}`"
                @click="creatLocationLink(item)"
              >
                {{ translateLocation(item.locationID, item.location) }}
              </span>
            </td>

            <!-- 5 -->
            <td class="span-2 hide-767" scope="col">
              <span
                class="link"
                @click="onClickOwner(item.ownerID, item.ownerType)"
                >{{ translateOwner(item.ownerID, item.ownerType) }}
              </span>
            </td>

            <!-- 6 -->
            <td class="span-2 hide-767" scope="col">
              <span
                class="link"
                @click="$router.push(`/partners/${item.responsible}`)"
                >{{ translateResponsibles(item.responsible) }}</span
              >
            </td>

            <!-- 7 -->
            <!-- Item actions -->
            <td
              class="span-5 expended-item"
              :id="`expended-item-${item.id}_block`"
            >
              <div class="expended-item_container">
                <div class="expended-item_btns">
                  <button
                    v-for="(action, index) in itemActions"
                    type="button"
                    class="btn dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#editWarehouseItemModal"
                    @click="onClickAction(action.type, item)"
                    :disabled="
                      item.qty == 0 && action.type === 'sub' ? true : false
                    "
                  >
                    <span>{{ action.title }}</span>
                  </button>
                </div>

                <!--  -->
                <div class="show-767 expended-item_content">
                  <div class="expended-content_article">
                    <p>Где</p>
                    <span
                      class="link link-location"
                      :class="`${locationLinkColorized(item.location)}`"
                      @click="creatLocationLink(item)"
                    >
                      {{ translateLocation(item.locationID, item.location) }}
                    </span>
                  </div>
                  <div class="expended-content_article article_block">
                    <p>Собственник</p>
                    <span
                      class="link"
                      @click="onClickOwner(item.ownerID, item.ownerType)"
                      >{{ translateOwner(item.ownerID, item.ownerType) }}
                    </span>
                  </div>
                  <div class="expended-content_article article_block">
                    <p>Ответственный</p>
                    <span
                      class="link"
                      @click="$router.push(`/partners/${item.responsible}`)"
                      >{{ translateResponsibles(item.responsible) }}</span
                    >
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Container>
</template>

<style scoped>
.mt-5rem {
  margin-top: 5rem;
}
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
}
.link_project {
  color: var(--bs-success);
  border: 1px solid var(--bs-success-bg-subtle);
  background-color: var(--bs-success-bg-subtle);
}
.link_sklad {
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
.search-and-filter_container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between !important;
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
.item-table_header tr,
.table-row_wrapper {
  display: inline-grid;
  padding: 0;
  width: 100%;
  grid-template-columns: 50px 1fr 100px 1fr 200px 200px;
}
.table-row_wrapper td {
  border: none;
}
.table-row_wrapper {
  border-bottom: 1px solid var(--bs-border-color);
}
.expand-item_icon {
  cursor: pointer;
}
label #expend-item {
  display: none;
}
label #expend-item:checked + .expand-item_icon {
  transform: rotate(180deg);
}
.expended-item {
  display: none;
}
.expended-item_opened {
  display: block;
  border: none;
}
.expended-item_btns button span:hover {
  color: var(--bs-primary);
}
.filter-archive_container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.filter-archive_container span {
  color: var(--bs-blue);
}

.filter-archive_container span:not(:nth-child(2)) {
  cursor: pointer;
}

.hide-767 {
  display: block;
}
.show-767 {
  display: none;
}
@media screen and (max-width: 575px) {
  .set-categoty-type_wrapper {
    flex-direction: column;
  }
  .set-categoty-type_wrapper {
    padding: 0 0.5rem;
  }
  .filter-location_select {
    margin: 0 0.5rem;
  }
  .search-and-filter_container {
    position: absolute;
    right: 0.5rem;
  }
  .search-and-filter_container .search_input {
    max-width: 120px;
  }
}

@media screen and (max-width: 767px) {
  .header-h1 {
    display: none;
  }
  .btn-create-modal-open-767 {
    z-index: 100;
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 64px;
    height: 64px;
    border-radius: 100%;
    text-align: center;
    color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
  .btn-create-modal-open-767:active {
    color: transparent;
  }
  .btn-create-modal-open-767:after,
  .btn-create-modal-open-767:before {
    content: "";
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    width: 3px;
    border-radius: 16px;
    height: 32px;
  }
  .btn-create-modal-open-767:after {
    transform: rotate(90deg);
  }
  .switch-type_container {
    align-items: flex-start;
  }
  .filter-location_select {
    width: 60%;
    font-size: 1rem;
    display: block;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 1px solid var(--bs-primary-bg-subtle);
    border-radius: 3px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font-family: inherit;
    font-size: 1rem;
    color: var(--bs-blue);
  }
  .filter-archive_container {
    display: none;
  }
  .set-categoty-type_wrapper {
    width: 100%;
    gap: 0 !important;
    overflow-x: scroll;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .set-categoty-type_wrapper::-webkit-scrollbar {
    display: none;
  }
  .item-table_header {
    display: none;
  }
  .table {
    margin-bottom: 6rem;
  }
  .table-row_wrapper {
    padding: 0;
    padding-top: 0.5rem;
    width: 100%;
    display: inline-grid;
    align-items: center;
    grid-template-columns: 50px 1fr 1fr 1fr 1fr;
    border-bottom: 1px solid var(--bs-border-color);
  }
  .table-row_wrapper td {
    margin: 0;
    border: none;
  }
  .table-row_wrapper td label svg {
    color: var(--bs-primary);
    margin: auto;
  }
  .table-row_wrapper td.item-qty {
    text-wrap: nowrap;
    text-align: right;
  }
  .table-row_wrapper td.span-3 {
    grid-column: span 3;
  }
  .table-row_wrapper td.span-2 {
    grid-column: span 2;
  }
  .table-row_wrapper td.span-5 {
    grid-column: span 5;
  }
  .hide-767 {
    display: none;
  }
  .show-767 {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .expended-item_container {
    justify-content: space-between;
  }
  .expended-item_btns {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .expended-item_btns button {
    color: var(--bs-primary);
    border: 1px solid var(--bs-primary);
    border-radius: 16px;
    padding: 6px 12px;
  }
  .expended-item_btns button:active {
    background-color: var(--bs-primary);
    color: #fff;
  }
  .expended-item_content {
    margin-top: 1rem;
    display: flex;
  }
  .expended-content_article {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .expended-content_article p {
    margin: 0;
    margin-left: 0.5rem;
  }
  .article_block {
    margin-top: 1rem;
  }
  .article_block span {
    border-radius: 16px;
    padding: 4px 10px;
    background-color: var(--bs-danger-bg-subtle);
  }
}

.search-container {
  position: relative;
  align-self: flex-start;
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
}
.isNotEmpty {
  color: var(--bs-blue);
}
.item-action-modal div {
  cursor: pointer;
}
.item-action-modal button:hover {
  color: var(--bs-primary);
}
.item-action-modal_opened {
  pointer-events: all;
  opacity: 1;
  z-index: 1;
}

.set-categoty-type_wrapper {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
