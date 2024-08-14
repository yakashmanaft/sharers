<script lang="ts" setup>
import { Container } from "@/shared/container";
import { H3Error } from "h3";
import { v4 as uuidv4 } from "uuid";
import html2pdf from "html2pdf.js";

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
  // if type === 'tools'
  serial: null,
  productionDate: null,
  showToAll: true,
});

const tempCreateItemLocation = ref({
  type: null,
  id: null,
});

const tempCreateItemOwner = ref({
  type: null,
  id: null,
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
    name: "Все типы",
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
  {
    type: "office equipment",
    name: "Оргтехника",
  },
  {
    type: "equipment",
    name: "Экипировка",
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
    type: "кв. м.",
    name: "кв. м.",
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

// Фильтры принадлежности предметов
const whoIsOwnerFilterTypes = ref([
  {
    id: 0,
    type: "myOwn",
    title: "Личные",
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
const { user } = useUserSession();

const { data: organizations } = useLazyAsyncData("organizations", () =>
  $fetch("/api/organizations/organizations")
);
onMounted(async () => {
  // makes refetching
  await refresh();

  if (items.value) {
    items.value = items.value.filter(
      (item: any) => item.location !== "archive" && item.location !== "deleted"
    );
  }

  window.addEventListener("scroll", () => {
    let searchFilterContainer = document.getElementById(
      "searchFilterContainer"
    );
    const scrollPosition = window.scrollY;
    console.log(window.screen.width);
    if (
      searchFilterContainer &&
      window.screen.width >= 768 &&
      window.screen.width <= 991
    ) {
      if (scrollPosition > 1) {
        searchFilterContainer.style.display = "none";
      } else {
        searchFilterContainer.style.display = "block";
      }
    }
  });

  refreshProjects();
  refreshLocations();
  refreshOrganizations();

  await loadData();

  // Скрытие модалки редактирования предмета
  const editItemModalEl = document.getElementById("editWarehouseItemModal");
  if (editItemModalEl) {
    editItemModalEl.addEventListener("hidden.bs.modal", (event) => {
      // currentItem.value = null;
      editedItem.value = {
        id: null,
        title: null,
        qty: null,
      };
      // Сбрасывает временную переменную количества к действию
      tempQty.value = 0;
      tempLocation.value = { title: "Все места", type: "all", id: null };
      // tempCreateItemLocation.value = { type: null, id: null };
      // console.log("Закрыть модалку редактирования ТМЦ");
      // console.log(currentItem.value);
      // console.log(editedItem.value);
    });
  }

  //
  const newItemModalEl = document.getElementById("newWarehouseItemModal");
  if (newItemModalEl) {
    newItemModalEl.addEventListener("hidden.bs.modal", (event) => {
      // item.value = {
      //   // uuid: null,
      //   title: null,
      //   type: null,
      //   qty: 0,
      //   measure: null,
      //   location: null,
      //   locationID: null,
      //   ownerID: null,
      //   ownerType: null,
      //   responsible: null,
      // };
      item.value.title = null;
      item.value.type = null;
      item.value.qty = null;
      item.value.measure = null;
      item.value.location = null;
      item.value.locationID = null;
      item.value.ownerID = null;
      item.value.ownerType = null;
      item.value.responsible = null;
      item.value.serial = null;
      item.value.productionDate = null;
      item.value.showToAll = true;

      tempCreateItemLocation.value = { type: null, id: null };
      tempCreateItemOwner.value = { type: null, id: null };
    });
  }
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
  transform: (items: any) => {
    // return items.map(item) => ({
    //   id: item.id,
    //   title: item.title,
    // })
    // return items.sort((x, y) => x.title.localeCompare(y.title));
    return items
      .filter((item) => {
        // USER
        if (item.ownerType === "user") {
          // if user is a owner of item
          if (user.value.id === item.ownerID) {
            return item;
          } else if (user.value.id === item.responsible) {
            return item;
          }
          // ищем пользовательские предметы из банды или альянса
          else {
            if (organizations.value) {
              // if user is a sharer in band which is an owner of item
              let sessionUserIsASharerOfBands = [...organizations.value].filter(
                (org) => {
                  let userInBands = org.sharers.filter(
                    (sharer) => sharer.userID === user.value.id
                  );

                  if (userInBands.length) {
                    return org;
                  }
                }
              );
              if (sessionUserIsASharerOfBands.length) {
                // console.log(sessionUserIsASharerOfBands);
                for (
                  let i = 0;
                  i <= sessionUserIsASharerOfBands.length - 1;
                  i++
                ) {
                  // показываем предметы альянса, в которых состоит банда, соучастником которой является сессионый пользователь
                  let bandsArray = [...organizations.value].filter((org) => {
                    if (org.sharers.length) {
                      org.sharers.filter(
                        (sharer) =>
                          sharer.userID === sessionUserIsASharerOfBands[i].id &&
                          sharer.userType === "company"
                      );

                      return org;
                    }
                  });

                  if (bandsArray.length) {
                    for (let i = 0; i <= bandsArray.length - 1; i++) {
                      // if (
                      //   item.ownerID === bandsArray[i].id &&
                      //   item.ownerType === "company"
                      // ) {
                      //   return item;
                      // }
                      if (
                        item.ownerID !== bandsArray[i].id &&
                        item.ownerType === "user" &&
                        item.showToAll
                      ) {
                        return item;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // COMPANY
        else if (item.ownerType === "company" && organizations.value) {
          // if user is a leader of a band which is an owner of item
          let sessionUserIsALeaderOfBands = [...organizations.value].filter(
            (org) => {
              return org.ownerID === user.value.id;
            }
          );
          if (sessionUserIsALeaderOfBands.length) {
            for (let i = 0; i <= sessionUserIsALeaderOfBands.length - 1; i++) {
              if (item.ownerID === sessionUserIsALeaderOfBands[i].id) {
                return item;
              }
            }
          }

          // if user is a sharer in band which is an owner of item
          let sessionUserIsASharerOfBands = [...organizations.value].filter(
            (org) => {
              let userInBands = org.sharers.filter(
                (sharer) => sharer.userID === user.value.id
              );

              if (userInBands.length) {
                return org;
              }
            }
          );
          if (sessionUserIsASharerOfBands.length) {
            // console.log(sessionUserIsASharerOfBands);
            for (let i = 0; i <= sessionUserIsASharerOfBands.length - 1; i++) {
              // показываем предметы альянса, в которых состоит банда соучастником которой является сессионый пользователь
              let bandsArray = [...organizations.value].filter((org) => {
                if (org.sharers.length) {
                  org.sharers.filter(
                    (sharer) =>
                      sharer.userID === sessionUserIsASharerOfBands[i].id &&
                      sharer.userType === "company"
                  );

                  return org;
                }
              });

              if (bandsArray.length) {
                for (let i = 0; i <= bandsArray.length - 1; i++) {
                  if (
                    item.ownerID === bandsArray[i].id &&
                    item.ownerType === "company" &&
                    item.showToAll
                  ) {
                    return item;
                  }
                  // if (
                  //   item.ownerID !== bandsArray[i].id &&
                  //   item.ownerType === "user"
                  // ) {
                  //   console.log(123);
                  //   return item;
                  // }
                }
              }
            }
          }

          //
          if (user.value.id === item.responsible) {
            return item;
          }
        }

        //
        else {
          return;
        }

        // user is responsible of item
        // if (user.value.id === item.responsible) {
        //   return item;
        // }
        // user is owner of item
        // user in the same band where owner of an item
        // if (user.value.id !== item.ownerID && item.ownerType === "user") {
        //   // same band
        //   let sameBandSharerUser;
        //   // same aliance
        //   let sameAlianceBandSharerUser;
        //   [...organizations.value].find((org) => {
        //     org.sharers.forEach((sharer) => {
        //       // same band
        //       if (
        //         sharer.userType === "user" &&
        //         sharer.userID === user.value.id
        //       ) {
        //         org.sharers.forEach((sharerUser) => {
        //           if (sharerUser.userID === item.ownerID) {
        //             sameBandSharerUser = item.ownerID;
        //           }
        //         });
        //       }

        //       // same aliance
        //       else if (sharer.userType === "company") {
        //         // console.log(sharer)
        //       }
        //     });
        //   });
        //   if (sameBandSharerUser && item.ownerID === sameBandSharerUser) {
        //     return item;
        //   }
        //   // band in the aliance
        // }
        // user in the same aliance which has a band where owner of an item is

        // user && band
        // else if (item.ownerType === "company") {
        // // user is a the leader of the band
        // let sessionUserIsALeaderBand = [...organizations.value].filter(
        //   (org) => org.ownerID === user.value.id
        // );
        // console.log(sessionUserIsALeaderBand);

        // user is a sharer at the band
        // let sessionUserSharerBand;
        // [...organizations.value].filter((org) => {
        //   org.sharers.forEach((sharer) => {
        //     if (
        //       sharer.userType === "user" &&
        //       sharer.userID === user.value.id
        //     ) {
        //       sessionUserSharerBand = org;
        //     }
        //   });
        // });

        // user in the band which is a part of aliance
        // let sessionUserSharerBandAliance;
        // if (sessionUserSharerBand) {
        //   [...organizations.value].find((org) => {
        //     org.sharers.forEach((sharer) => {
        //       if (
        //         sharer.userType === "company" &&
        //         sharer.userID === sessionUserSharerBand.id
        //       ) {
        //         sessionUserSharerBandAliance = org;
        //         // console.log(sessionUserSharerBandAliance)
        //       }
        //     });
        //   });
        // }

        // return item where user is a leader in the band
        // if (sessionUserIsALeaderBand) {
        //   sessionUserIsALeaderBand.forEach((band) => {
        //     console.log(band);
        //     // if (band.id === item.ownerID && item.ownerType === 'company') {
        //     //   return item;
        //     // }
        //     return item
        //   });
        // }
        // return item where user is a sharer in the band
        // else if (
        //   sessionUserSharerBand &&
        //   item.ownerID === sessionUserSharerBand.id
        // ) {
        //   return item;
        // }
        // // user in the band which a part of aliance
        // else if (
        //   sessionUserSharerBandAliance &&
        //   item.ownerID === sessionUserSharerBandAliance.id
        // ) {
        //   return item;
        // }
        // }
        // else
        // else {
        //   return;
        // }
      })
      .sort((x, y) => {
        if (x.title < y.title) {
          return -1;
        }

        if (x.title > y.title) {
          return 1;
        }

        return x.locationID - y.locationID;
      });
  },
});
const { data: projects } = useLazyAsyncData("projects", () =>
  $fetch("api/projects/projects")
);
const { data: locations } = useLazyAsyncData("locations", () =>
  $fetch("api/locations/locations")
);

//
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
    }

    // ARCHIVE
    else if (location === "archive") {
      return `Архив`;
    }

    // DELETED
    else if (location === "deleted") {
      return "Списание";
    }

    // ELSE location
    else {
      return alert(
        "warehouse page index.vue error - strange object.location in translateLocation function"
      );
    }
  } else {
    alert("warehouse page index.vue translateLocation function error");
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

// Раскраски
const locationLinkColorized = (location: string) => {
  if (location) {
    return `link_${location}`;
  }
};

const locationMarkColorized = (location: string) => {
  if (location) {
    return `mark_${location}`;
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
        // position это про точный адрес полки на складе
        serial: item.serial,
        productionDate: item.productionDate,
        ownerID: item.ownerID,
        ownerType: item.ownerType,
        responsible: item.responsible,
        showToAll: item.showToAll,
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
    };
    // createNewItemBtnIsDisabled.value = true
    // clearModalInputs(item);

    // refetching
    filterItemsByCategoryType();
    filterItemsByLocationObj();
  }
}

async function addWarehouseTransaction(item, type) {
  let addedTransaction = null;
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
    // CREATED
    if (type === "created") {
      addedTransaction = await $fetch("api/warehouse/ledger", {
        method: "POST",
        body: {
          transactionType: type,
          // itemID: addedItem.id,
          itemTitle: item.title,
          // {user} = useUserSession
          authorID: user.value.id,
          locationFrom: item.location,
          locationFromID: item.locationID,
          locationTo: item.location,
          locationToID: item.locationID,
          prevOwnerID: item.ownerID,
          prevOwnerType: item.ownerType,
          currentOwnerID: item.ownerID,
          currentOwnerType: item.ownerType,
          prevResponsibleID: item.responsible,
          currentResponsibleID: item.responsible,
          itemType: item.type,
          qty: item.qty,
          measure: item.measure,
        },
      });
    }
    // ADD
    else if (type === "add") {
      addedTransaction = await $fetch("api/warehouse/ledger", {
        method: "POST",
        body: {
          transactionType: type,
          // itemID: addedItem.id,
          itemTitle: item.title,
          // {user} = useUserSession
          authorID: user.value.id,
          locationFrom: item.location,
          locationFromID: item.locationID,
          locationTo: item.location,
          locationToID: item.locationID,
          prevOwnerID: item.ownerID,
          prevOwnerType: item.ownerType,
          currentOwnerID: item.ownerID,
          currentOwnerType: item.ownerType,
          prevResponsibleID: item.responsible,
          currentResponsibleID: item.responsible,
          itemType: item.type,
          // tempQty
          qty: tempQty.value,
          measure: item.measure,
        },
      });
    }
    // SUB
    else if (type === "sub") {
      addedTransaction = await $fetch("api/warehouse/ledger", {
        method: "POST",
        body: {
          transactionType: type,
          // itemID: addedItem.id,
          itemTitle: item.title,
          // {user} = useUserSession
          authorID: user.value.id,
          locationFrom: item.location,
          locationFromID: item.locationID,
          locationTo: item.location,
          locationToID: item.locationID,
          prevOwnerID: item.ownerID,
          prevOwnerType: item.ownerType,
          currentOwnerID: item.ownerID,
          currentOwnerType: item.ownerType,
          prevResponsibleID: item.responsible,
          currentResponsibleID: item.responsible,
          itemType: item.type,
          // tempQty
          qty: tempQty.value,
          measure: item.measure,
        },
      });
    }
    // MOVE
    else if (type === "move") {
      addedTransaction = await $fetch("api/warehouse/ledger", {
        method: "POST",
        body: {
          transactionType: type,
          // itemID: addedItem.id,
          itemTitle: currentItem.value.title,
          // {user} = useUserSession
          authorID: user.value.id,
          locationFrom: currentItem.value.location,
          locationFromID: currentItem.value.locationID,
          locationTo: tempLocation.value.type,
          locationToID: tempLocation.value.id,
          // locationTo: item.location,
          // locationToID: item.locationID,
          prevOwnerID: currentItem.value.ownerID,
          prevOwnerType: currentItem.value.ownerType,
          currentOwnerID: currentItem.value.ownerID,
          currentOwnerType: currentItem.value.ownerType,
          prevResponsibleID: currentItem.value.responsible,
          currentResponsibleID: currentItem.value.responsible,
          itemType: currentItem.value.type,
          // tempQty
          qty: tempQty.value,
          measure: currentItem.value.measure,
        },
      });
      // console.log(item);
      // console.log(tempLocation.value)
      // console.log(tempQty.value)
    } else if (type === "changeOwner") {
    } else if (type === "changeResponsible") {
    }
  }
}

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
);

const tempQty = ref(0);
const tempLocation = ref({
  title: "Все места",
  type: "all",
  id: null,
});

const editBtnIsDisabled = ref(true);
const submitEditCurrentItem = async () => {
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

  // Если делать await, то почему-то не вычитаем qty из начального предмета. А если ставлю после updateItem - не находит будущую локцацию к перемещению
  addWarehouseTransaction(currentItem.value, editedActionType.value);
  await updateItem(editedItem.value);

  // Сбрасывает временную переменную количества и местонахождения
  tempQty.value = 0;
  tempLocation.value = { title: "Все меса", type: "all", id: null };
};

async function updateItem(editedItem) {
  let item = null;

  // ADD
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
  }
  // SUB
  else if (editedActionType.value === "sub") {
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
  }
  // MOVE
  else if (editedActionType.value === "move") {
    if (editedItem.id) {
      // Ищем предметы в местах, куда хотим переместить
      let findItems = items.value.filter(
        (item) =>
          item.id !== currentItem.value.id &&
          item.title === currentItem.value.title &&
          item.type === currentItem.value.type &&
          item.measure === currentItem.value.measure &&
          item.location === tempLocation.value.type &&
          item.locationID === tempLocation.value.id &&
          item.ownerType === currentItem.value.ownerType &&
          item.ownerID === currentItem.value.ownerID &&
          item.responsible === currentItem.value.responsible
      );

      // 1
      // Если перемещаем ВСЁ кол-во в другое место

      // 1.1. где еще нет подобного предмета
      if (tempQty.value === currentItem.value.qty && !findItems[0]) {
        editedItem.location = tempLocation.value.type;
        editedItem.locationID = tempLocation.value.id;

        // Обновляем предмет в БД
        await $fetch("api/warehouse/item", {
          method: "PUT",
          body: {
            id: editedItem.id,
            // title: editedItem.title,
            qty: editedItem.qty,
            location: editedItem.location,
            locationID: editedItem.locationID,
          },
        });
        console.log("Переместили туда, где не было подобного предмета");
      }

      // 1.2. в уже имеющийся предмет в другом месте(добавляем ко второму (findItems[0].id) и удаляем первый(currentItem.value.id))
      else if (tempQty.value === currentItem.value.qty && findItems[0]) {
        editedItem.location = tempLocation.value.type;
        editedItem.locationID = tempLocation.value.id;
        editedItem.qty = currentItem.value.qty + +findItems[0].qty;

        // Обновляем предмет в БД
        // 1.2.1. Удаляем из БД перемещаемый
        let deletedItemOrError = null;
        if (currentItem.value.id) {
          deletedItemOrError = await $fetch("api/warehouse/item", {
            method: "DELETE",
            body: {
              id: currentItem.value.id,
            },
          });
        }
        if (deletedItemOrError instanceof H3Error) {
          error.value = deletedItemOrError;
          console.log("error: ", error);
          return;
        }

        // 1.2.2. Обновляем в БД итоговый
        await $fetch("api/warehouse/item", {
          method: "PUT",
          body: {
            id: findItems[0].id,
            // title: editedItem.title,
            qty: editedItem.qty,
            location: editedItem.location,
            locationID: editedItem.locationID,
          },
        });
        console.log("Переместили туда, где уже есть подобные предметы");
      }

      // 2
      // Перемещаем часть

      // 2.1. в уже имеющийся предмет в другом месте (вычитаем из первого, добавляем ко второму)
      else if (tempQty.value < currentItem.value.qty && findItems[0]) {
        // if (
        //   tempLocation.value.type === currentItem.value.location &&
        //   tempLocation.value.id === currentItem.value.locationID &&
        //   findItems[0].ownerType === currentItem.value.ownerType &&
        //   findItems[0].ownerID === currentItem.value.ownerID &&
        //   findItems[0].responsible === currentItem.value.responsible
        // ) {
        //   alert("Косяк. findItems[0] Разделяем предмет");
        // } else {

        // }
        editedItem.location = tempLocation.value.type;
        editedItem.locationID = tempLocation.value.id;
        editedItem.qty = findItems[0].qty + tempQty.value;

        await $fetch("api/warehouse/item", {
          method: "PUT",
          body: {
            id: currentItem.value.id,
            // title: editedItem.title,
            qty: currentItem.value.qty - tempQty.value,
            location: currentItem.value.location,
            locationID: currentItem.value.locationID,
          },
        });

        await $fetch("api/warehouse/item", {
          method: "PUT",
          body: {
            id: findItems[0].id,
            // title: editedItem.title,
            qty: editedItem.qty,
            location: editedItem.location,
            locationID: editedItem.locationID,
          },
        });

        console.log("Переместили часть туда, где уже есть подобные предметы");
      }

      // 2.2. в новое место (вычитаем из первого, создаем второй и добавляем к нему)
      else if (tempQty.value < currentItem.value.qty && !findItems.length) {
        // if (
        //   tempLocation.value.type === currentItem.value.location &&
        //   tempLocation.value.id === currentItem.value.locationID
        //   // findItems[0].ownerType === currentItem.value.ownerType &&
        //   // findItems[0].ownerID === currentItem.value.ownerID &&
        //   // findItems[0].responsible === currentItem.value.responsible
        // ) {
        //   alert("Косяк. !findItems.length. Разделяем предмет");
        // } else {

        // }
        editedItem.location = tempLocation.value.type;
        editedItem.locationID = tempLocation.value.id;
        editedItem.qty = tempQty.value;

        await $fetch("api/warehouse/item", {
          method: "PUT",
          body: {
            id: currentItem.value.id,
            // title: editedItem.title,
            qty: currentItem.value.qty - tempQty.value,
            location: currentItem.value.location,
            locationID: currentItem.value.locationID,
          },
        });

        await $fetch("api/warehouse/item", {
          method: "POST",
          body: {
            uuid: uuidv4(),
            title: currentItem.value.title,
            type: currentItem.value.type,
            qty: editedItem.qty,
            measure: currentItem.value.measure,
            location: editedItem.location,
            locationID: editedItem.locationID,
            ownerID: currentItem.value.ownerID,
            ownerType: currentItem.value.ownerType,
            responsible: currentItem.value.responsible,
          },
        });
        console.log("Переместили часть туда, где еще нет подобных предметы");
      }

      // console.log(item)
      console.log("Moved");
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
  // console.log(currentItem.value)
};

const checkAndCreate = async (item) => {
  let compareItem = items.value.find(
    (e) =>
      e.title === item.title &&
      e.type === item.type &&
      e.measure === item.measure &&
      e.location === item.location &&
      e.locationID === item.locationID &&
      e.ownerType === item.ownerType &&
      e.ownerID === item.ownerID &&
      e.responsible === item.responsible
  );
  if (compareItem) {
    tempQty.value = item.qty;
    addWarehouseTransaction(item, "add"),
      // console.log(compareItem.id)
      await $fetch("api/warehouse/item", {
        method: "PUT",
        body: {
          id: compareItem.id,
          qty: compareItem.qty + +item.qty,
        },
      });

    // refetching
    filterItemsByCategoryType();
    filterItemsByLocationObj();
  } else {
    addWarehouseTransaction(item, "created"), addWarehouseItem(item);
  }
};

// CONVERT TO PDF
const convertListToPDF = () => {
  if (computedItems.length) {
    const element = document.getElementById("element-to-print");
    const options = {
      margin: 0.3,
      filename: "my-document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };
    html2pdf(element, options);
    // html2pdf().set(options).from(element).save();
  } else {
    alert("Список пустой... распечатывать нечего..");
  }
};

// HIDE
const toggleShowToAll = () => {
  alert("Скрытие в разработке");
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
  // console.log(item.value)
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
    // serial & production date are not compare
  ) {
    createNewItemBtnIsDisabled.value = false;
  } else {
    createNewItemBtnIsDisabled.value = true;
  }
});

// watch(createNewItemBtnIsDisabled, () => {
//   console.log(createNewItemBtnIsDisabled.value);
// });

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
  item.value.ownerID = tempCreateItemOwner.value.id;
});

//
// watch(items, (prevValue, newValue) => {
//   console.log(newValue)
//   console.log(prevValue)

// })
</script>
<template>
  <Container>
    <div class="header_container" style="display: flex">
      <h1 class="header_title">ТМЦ</h1>
      <!-- Button trigger modal create item -->
      <button
        type="button"
        class="btn btn-primary btn-create-modal-open-767"
        data-bs-toggle="modal"
        data-bs-target="#newWarehouseItemModal"
      >
        <span> Создать </span>
      </button>
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
                    <span style="white-space: nowrap">{{
                      currentItem.measure
                    }}</span>
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
                    <span style="white-space: nowrap">{{
                      currentItem.measure
                    }}</span>
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
                      >Все{{ currentItem.qty }} {{ currentItem.measure }}</span
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
                  <!-- {{ tempLocation }} -->
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
                        v-for="(location, i) in locations.filter((item) => {
                          if (
                            currentItem.location === 'sklad' ||
                            currentItem.location === 'office' ||
                            currentItem.location === 'repair'
                          ) {
                            return item.id !== currentItem.locationID;
                          } else {
                            return item;
                          }
                        })"
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
                        v-for="(project, i) in projects.filter((item) => {
                          if (currentItem.location === 'project') {
                            return item.id !== currentItem.locationID;
                          } else {
                            return item;
                          }
                        })"
                      >
                        {{ project.title }}
                        <!-- | {{ project.address }} -->
                      </option>
                    </optgroup>
                    <!-- Archive & deleted -->
                    <!-- <optgroup label="Прочее">
                      <option
                        :value="{
                          title: 'location',
                          type: 'archive',
                          id: null, поэтому не 500 ошибка, так как надо для перемещения id
                        }"
                      >
                        Архив
                      </option>
                      <option
                        :value="{
                          title: 'location',
                          type: 'deleted',
                          id: null, поэтому не 500 ошибка, так как надо для перемещения id
                        }"
                      >
                        Списание
                      </option>
                    </optgroup> -->
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
                    <span style="white-space: nowrap">{{
                      currentItem.measure
                    }}</span>
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

    <!-- ******** ADD NEW ITEM MODAL ******** --><!-- ******** ADD NEW ITEM MODAL ******** -->
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
              <label for="itemTitle" class="form-label">Наименование*</label>
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
              <label for="itemType" class="form-label">Тип* </label>
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

            <!--  -->
            <div
              class="mb-3"
              v-if="
                (item && item.type === 'tools') ||
                item.type === 'office equipment'
              "
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
                width: 100%;
              "
            >
              <!-- Серийник -->
              <div style="width: 100%">
                <label for="itemSerial" class="form-label"
                  >Серийный номер</label
                >
                <input
                  v-model="item.serial"
                  type="text"
                  id="itemSerial"
                  class="form-control"
                  aria-describedby="nameHelp"
                />
              </div>

              <!-- Дата производства -->
              <div style="flex: 3 2 100%">
                <label for="itemProductionDate" class="form-label"
                  >Дата изготовления</label
                >
                <!-- type="month" -->
                <input
                  type="date"
                  v-model="item.productionDate"
                  id="itemProductionDate"
                  class="form-control"
                  aria-describedby="nameHelp"
                />
              </div>
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
                  >Ед. измерения*</label
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
                <label for="itemQty" class="form-label">Кол-во*</label>
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
                >Местонахождение*</label
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
              <label for="users" class="form-label">Собственник*</label>
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
                      id: company.id,
                    }"
                    v-for="(company, i) in organizations"
                  >
                    {{ company.title }}
                  </option>
                </optgroup>
              </select>
            </div>

            <!-- RESPONSIBLE -->
            <div class="mb-3">
              <label for="users" class="form-label">Ответственный*</label>
              <select
                class="form-select"
                aria-label="Default select example"
                v-model="item.responsible"
              >
                <option :value="null" selected>Выберите</option>
                <!-- Users -->
                <!-- <optgroup label="Соучастники"> -->
                <option :value="user.id" v-for="(user, i) in users">
                  <!-- return `${userItem?.surname} ${userItem?.name[0]}. ${userItem?.middleName[0]}.`; -->
                  {{ user.surname }} {{ user.name }} {{ user.middleName }}
                </option>
                <!-- </optgroup> -->
              </select>
            </div>

            <!-- SHOW TO ALL TOGGLE -->
            <div style="display: flex; align-items: center">
              <input id="showToAll" type="checkbox" v-model="item.showToAll" />
              <label for="showToAll" class="form-label"
                >Премет виден участникам банды</label
              >
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
              @click.prevent="checkAndCreate(item)"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>

    <!--  -->
    <!-- ********************* ФИЛЬТРЫ ********************** -->

    <!-- FILTERS RADIO BTN -->
    <div class="switch-type_container">
      <div>
        <!--  -->
        <div style="display: flex; align-items: center">
          <!-- set location & project -->
          <select
            style="width: 15rem"
            class="form-select form-select-sm filter-location_select"
            aria-label=".form-select-sm example"
            v-model="currentCategoryByLocationObj"
          >
            <!-- all locations & projects -->
            <option :value="{ title: 'all', type: 'all', id: null }">
              Все места
            </option>

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
        </div>

        <!-- set category type of items-->
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

        <!-- my, myBand -->
        <!-- <div style="margin-top: 1rem; margin-left: 0.5rem">
          <ul style="list-style: none; padding: 0; display: flex; gap: 2rem">
            <li>
              <input id="radio-item_my" type="checkbox" />
              <label style="margin-left: 0.5rem" for="radio-item_my"
                >Личные</label
              >
            </li>
            <li>
              <input id="radio-item_myBand1" type="checkbox" />
              <label style="margin-left: 0.5rem" for="radio-item_myBand1"
                >Моя банда 1</label
              >
            </li>
            <li>
              <input id="radio-item_sharersBand1" type="checkbox" />
              <label style="margin-left: 0.5rem" for="radio-item_sharersBand1"
                >Я в банде 1</label
              >
            </li>
            <li v-for="(el, idx) in whoIsOwnerFilterTypes">
              <p>{{ el.title }}</p>
            </li>
          </ul>
        </div> -->
      </div>

      <div id="searchFilterContainer" class="search-and-filter_container">
        <!-- SEARCH -->
        <div class="search-wrapper">
          <!-- <div class="search_input"> -->

          <input
            id="search-input_icon"
            type="text"
            class="form-control"
            placeholder="Поиск"
            v-model="searchInput"
          />
          <label for="search-input_icon">
            <Icon name="ic:baseline-search" size="24px" />
          </label>
          <!-- </div> -->
        </div>

        <!-- FILTER BY ARCHIVE & DELETED -->
        <div class="filter-archive_container">
          <span @click="showItemsInArchive">Архив </span>
          <span>|</span>
          <span @click="showItemsInDeleted">Списание</span>
        </div>
      </div>
    </div>

    <!-- ********************** DATA ******************************* -->

    <!-- fetch data is error -->
    <div v-if="error">
      <p>Error Code {{ error.statusCode }}</p>
      <p>Error Message {{ error.message }}</p>
    </div>

    <!-- data is loading -->
    <div v-if="pending">
      <p style="margin-top: 1rem">Loading...</p>
    </div>

    <!-- data is loaded -->
    <div v-else class="table_container">
      <table class="table">
        <thead class="item-table_header">
          <tr>
            <th scope="col">
              <div
                class="convert_btn"
                style="display: flex; justify-content: center"
                @click="convertListToPDF()"
              >
                <Icon
                  name="ic:sharp-picture-as-pdf"
                  size="24px"
                  color="var(--bs-body-color)"
                />
              </div>
            </th>
            <th scope="col">Наименование</th>
            <th scope="col">Кол-во</th>
            <th scope="col">Местонахождение</th>
            <th scope="col" class="hide-991">Собственник</th>
            <th scope="col" class="hide-991">Ответственный</th>
          </tr>
        </thead>

        <tbody id="element-to-print">
          <div v-if="computedItems">
            <div v-if="!searchInput && !computedItems.length">Ничего нет</div>
            <div v-if="searchInput && !computedItems.length">
              По запросу ничего не найдено
            </div>
          </div>

          <!-- СПИСОК ITEMS -->
          <tr class="table-row_wrapper" v-for="(item, index) in computedItems">
            <!-- 1 -->
            <!-- Кнопка развернуть expended-item -->
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
            <!-- Заголовок -->
            <td class="span-3" scope="col">
              <span>{{ index + 1 }}. </span>
              <span class="link" @click="$router.push(`/warehouse/${item.id}`)">
                {{ item.title }}
              </span>
              <span
                v-if="!item.showToAll"
                style="margin-left: 0.5rem"
                @click="toggleShowToAll()"
              >
                <Icon
                  name="ic:twotone-disabled-visible"
                  size="16px"
                  color="var(--bs-danger)"
                />
              </span>
            </td>

            <!-- 3 -->
            <!-- Кол-во, мера -->
            <td class="item-qty" scope="col">
              <div
                class="location-mark"
                :class="locationMarkColorized(item.location)"
              ></div>
              <span>{{ item.qty }} {{ item.measure }}</span>
            </td>

            <!-- 4 -->
            <!-- loaction -->
            <td class="span-5 hide-767" scope="col">
              <span
                class="link-location"
                :class="`${locationLinkColorized(item.location)}`"
                @click="creatLocationLink(item)"
              >
                {{ translateLocation(item.locationID, item.location) }}
              </span>
            </td>

            <!-- 5 -->
            <td class="span-2 hide-767 hide-991" scope="col">
              <span
                class="link"
                @click="onClickOwner(item.ownerID, item.ownerType)"
                >{{ translateOwner(item.ownerID, item.ownerType) }}
              </span>
            </td>

            <!-- 6 -->
            <td class="span-2 hide-767 hide-991" scope="col">
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
                <div class="show-767 show-768-991 expended-item_content">
                  <div class="expended-content_article hide-768-991">
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
/* .mt-5rem {
  margin-top: 5rem;
} */
.header_container {
  margin-top: 6rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.header_container .header_title {
  margin: unset;
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
  padding: 0.1rem 0.3rem;
  /* border-radius: 16px; */
  font-size: 0.8rem;
}
.link:hover {
  cursor: pointer;
  color: var(--bs-primary);
}
.link_project {
  color: var(--bs-success);
  border: none;
  /* border: 1px solid var(--bs-success-bg-subtle); */
  background-color: var(--bs-success-bg-subtle);
}
.link_sklad,
.link_office {
  color: var(--bs-dark);
  border: none;
  background-color: var(--bs-primary-bg-subtle);
}
/* .link_office {
  color: white;
  border: none;
  background-color: var(--bs-primary-bg-subtle);
} */
.link_repair {
  color: var(--bs-warning);
  border: none;
  /* border: 1px solid var(--bs-warning-bg-subtle); */
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
  /* position: fixed!important; */
  align-self: flex-start;
  display: flex;
  flex-direction: column;

  justify-content: space-between !important;
}

/* convert to PDF */
.convert_btn:hover {
  cursor: pointer;
}
.convert_btn:hover svg {
  color: var(--bs-primary) !important;
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
  white-space: nowrap;
  cursor: pointer;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  /* border: 1px solid var(--bs-border-color); */
}
.switch-type_el label:hover {
  background-color: #b1e3c1;
  /* border: 1px solid var(--bs-border-color); */
  color: white;
  transition: all 0.15s ease-in;
}
.switch-type_el input[type="radio"]:checked + label {
  /* background-color: #b1e3c1; */
  background-color: var(--bs-border-color);
  /* color: white; */
}
.item-table_header tr,
.table-row_wrapper {
  display: inline-grid;
  padding: 0;
  width: 100%;
  grid-template-columns: 50px 1fr 100px 1fr 200px 200px;
}
.table-row_wrapper td {
  height: 100%;
  border: none;
  margin: 0 !important;
}
.table-row_wrapper {
  border-bottom: 1px solid var(--bs-border-color);
}
.table-row_wrapper:hover {
  cursor: pointer;
}
.table-row_wrapper:hover td {
  background-color: rgba(0, 0, 0, 0.05);
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
  margin-left: 4rem;
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

.search-wrapper {
  /* position: relative;
  align-self: flex-start; */
}

.search-wrapper input:focus + .search-wrapper {
  /* width: 100%; */
}

.search-wrapper .icon {
  /* position: absolute; */
  /* top: 50%;
  right: 4px;
  transform: translateY(-50%); */
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
.search-wrapper {
  display: flex;
  /* position: relative; */
  align-items: center;
}
#search-input_icon {
  border-radius: unset;
  border: unset;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  margin-right: 1rem;
  padding-left: 0;
}
#search-input_icon:focus {
  border-radius: unset;
  border: unset;
  outline-width: 0 !important;
  outline: none !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
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
  /* .search-and-filter_container .search_input {
    max-width: 120px;
  } */
  .expended-item_opened {
    margin: unset;
  }
}

/* @media screen and (min-width: 576px) and (max-width: 767px) {

} */

@media screen and (max-width: 767px) {
  .header_title {
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
  .search-and-filter_container {
    /* position: absolute; */
    position: fixed;
    right: 0.5rem;
  }
  .filter-location_select {
    width: 60%;
    font-size: 1rem;
    display: block;
    /* padding: 0.75rem 2.5rem 0.75rem 1rem; */
    border: 1px solid var(--bs-primary-bg-subtle);
    border-radius: 1rem;
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
    scrollbar-width: none;
    margin-top: 2rem;
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
    white-space: nowrap;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
  }
  .table-row_wrapper td .location-mark {
    width: 10px;
    height: 10px;
    border-radius: 100%;
  }
  .mark_project {
    /* color: var(--bs-success); */
    /* border: 1px solid var(--bs-success-bg-subtle); */
    background-color: var(--bs-success-bg-subtle);
  }
  .mark_sklad {
    /* color: white; */
    /* border: none; */
    background-color: var(--bs-primary-bg-subtle);
  }
  .mark_office {
    /* color: white; */
    /* border: none; */
    background-color: var(--bs-primary-bg-subtle);
  }
  .mark_repair {
    /* color: var(--bs-warning); */
    /* border: 1px solid var(--bs-warning-bg-subtle); */
    background-color: var(--bs-warning-bg-subtle);
  }
  .mark_archive {
    /* color: var(--bs-dark-bg-subtle); */
    /* border: none; */
    background-color: var(--bs-danger-bg-subtle);
  }
  .mark_deleted {
    /* color: var(--bs-danger-bg-subtle); */
    /* border: none; */
    background-color: var(--bs-secondary-bg);
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
    /* background-color: blue; */
  }
  .expended-item_btns {
    width: 100%;
    /* background-color: green; */
    flex-direction: row !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
  }
  .expended-item_btns .dropdown-item {
    width: max-content;
    /* background-color: red; */
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
    font-weight: bold;
    /* border-radius: 16px; */
    /* padding: 4px 10px; */
    /* background-color: var(--bs-danger-bg-subtle); */
  }
  /* #search-input_icon[type="text"]:focus .search_input{
    display: block!important;
  } */
  /* #search-input_icon {
    color: red;
  } */
  /* #search-input_icon {
    
  } */
  .search-wrapper {
    width: 100%;
  }
  .search_input {
    width: 100%;
    display: flex;
    align-items: center;
  }
  #search-input_icon {
    opacity: 0;
    width: 0;
    /* outline-width: 0 !important;
    outline: none !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none; */
    /* transition: all 0.3s ease-in-out;  */
  }
  #search-input_icon + label {
    background-color: var(--bs-body-bg);
    padding: 1rem;
    z-index: 1;
    border-radius: 100%;
    border: 1px solid var(--bs-border-color);
    margin-top: -1rem;
    margin-right: 1rem;
    box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
  #search-input_icon + label:hover {
    cursor: pointer;
  }
  #search-input_icon:focus {
    z-index: 3;
    /* border: 1px solid red; */
    /* width: 300px; */
    position: fixed;
    left: 0;
    top: 3rem;
    width: 100%;
    opacity: 1;
    padding: 3rem 2rem;
    border: unset;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */
    border-radius: unset;
    /* background-color: red; */
    /* outline-width: 0 !important;
    outline: none !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none; */
  }
  /* #search-input_icon:focus + label { */
  /* display: absolute;
    background-color: blue;
    display: none; */
  /* } */
}

@media screen and (min-width: 768px) {
  .header_container .btn {
    position: relative;
    /* background-color: red; */
    border: unset;
    /* background-color: unset */
    border-radius: 2rem;
  }
  /* .header_container .btn::after,
  .header_container .btn::before {
    content: '';
    position: absolute;
    background-color: var(--bs-primary);
  }
  .header_container .btn::after {
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 2px;
    width: 100%;
  }
  .header_container .btn::before {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    width: 2px;
  } */
}

@media screen and (min-width: 768px) and (max-width: 991px) {
  .hide-991 {
    display: none;
  }
  .hide-768-991 {
    display: none;
  }
  .item-table_header tr,
  .table-row_wrapper {
    grid-template-columns: 50px 1fr 100px 1fr;
  }
  .switch-type_container {
    /* z-index: -2; */
    background-color: var(--bs-body-bg);
    /* background-color: red; */
  }
  .search-and-filter_container {
    position: fixed;
    right: 0;
    margin-right: 1rem;
    /* z-index: -1; */
  }
  /* .table_container {
    z-index: 999;
  } */
  /* .expended-item_content {
    margin-top: 1rem;
    display: flex;
    width: 100%;
  }   */
  .expended-item {
    grid-column: span 5;
    /* background-color: red; */
    margin-left: 4rem;
  }
  .expended-item_btns {
    /* display: flex; */
  }
  .expended-item_content {
    /* border-top: 1px solid black; */
    /* box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.2); */
    border-top: 1px solid var(--bs-border-color);
    padding-top: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .article_block {
    display: flex;
    gap: 1rem;
    /* background-color: blue; */
  }
  .article_block p {
    margin: 0;
  }
  .show-768-991 {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  /*  */
  .filter-archive_container {
    display: none;
  }
  .search-wrapper {
    /* background-color: red; */
  }
  #search-input_icon {
    position: relative;
    padding: 0;
    width: 0;
    border: unset;
  }
  /* #search-input_icon + label:hover #search-input-icon + label:before {
    content: '123';
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    background-color: blue;
  } */
  #search-input_icon + label:hover {
    cursor: pointer;
  }
  #search-input_icon + label:hover svg path {
    color: var(--bs-primary);
  }
  /* #search-input_icon + label:hover #search-input_icon + label:after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: blue;
  } */
  #search-input_icon:focus {
    /* position: fixed;
    left: 0;
    top: 5rem; */
    width: 350px;
    border-radius: unset;
    outline-width: 0 !important;
    outline: none !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    margin-right: 1rem;
  }
}
</style>
