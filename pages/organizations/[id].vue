<template>
  <Container style="padding-top: 5rem">
    <!-- 
      Status in Group (foreman - бригадир, sectionForeman - начальник
      участка, worker - рабочий, leader - лидер), projectManager -
      менеджер проекта (снабжение), hrOfficer (Кадровик), accountant -
      бухгалтер, marketolog - маркетолог 
    -->

    <!-- MODAL ADD NEW FUND -->
    <div
      class="modal fade"
      id="addNewFundModal"
      tabindex="-1"
      aria-labelledby="addNewFundModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h2 class="modal-title fs-5" id="addNewFundModalLabel">
              Добавляем новый ФОТ
            </h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- MODAL BODY -->
          <div class="modal-body">
            bandID: {{ $route.params.id }}
            <br />
            tempNewFund: {{ tempNewFund }}
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
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              <!-- @click="setSharerHourAtDayDB()" -->
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL ADD SHARER TO SELECTED FUND LIST -->
    <div
      class="modal fade"
      id="addSharerToFundModal"
      tabindex="-1"
      aria-labelledby="addSharerToFundModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h2 class="modal-title fs-5" id="addSharerToFundModalLabel">
              Добавляем соучастника в ФОТ
            </h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- MODAL BODY -->
          <div class="modal-body">
            <!-- search block -->
            <div class="partners-search_wrapper">
              <input
                type="text"
                class="form-control"
                placeholder="Поиск по фамилии"
                v-model="searchAddSharerInput"
              />
              <Icon
                name="ic:baseline-search"
                size="24px"
                color="var(--bs-body-color)"
              />
            </div>

            <!-- TEMP -->
            <br>
            <!-- <div>{{ currentFundID }}</div> -->
            <!-- <div>{{ tempSharersToFund }} | {{ tempSharersToFund.length }}</div> -->
            <br />
            <!-- LIST -->
            <div class="partners-search_list">
              <div
                class="search-item_wrapper"
                v-for="(sharer, sharer_index) in computedSharersToAddToFund"
              >
                <input class="search-add-sharer_checkbox" type="checkbox" :id="`${sharer_index}`" />
                <label :for="`${sharer_index}`" @click="toggleAddingSharerToFund(sharer.id)">{{sharer.surname}} {{sharer.name}} {{sharer.middleName}}</label>
              </div>
            </div>
          </div>
          <!-- MODAL FOTER -->
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
              data-bs-dismiss="modal"
              :disabled="!tempSharersToFund.length"
              @click="addSharerToFundFunc()"
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL SET HOUR TO SHARER -->
    <div
      class="modal fade"
      id="setSharerHourModal"
      tabindex="-1"
      aria-labelledby="setSharerHourModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h2 class="modal-title fs-5" id="setSharerHourModalLabel">
              Отработано часов
            </h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- MODAL BODY -->
          <div class="modal-body">
            <!-- {{ tempSetSharerHour }} -->
            <div class="temp-sharer-hour_container">
              <button
                :disabled="tempSetSharerHour.hour === 0"
                @click="tempSetSharerHour.hour--"
              >
                <span>-</span>
              </button>

              <div>{{ tempSetSharerHour.hour }}</div>

              <button @click="tempSetSharerHour.hour++"><span>+</span></button>
            </div>
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
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="setSharerHourAtDayDB()"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL SET STAKE INDEX -->
    <div
      class="modal fade"
      id="setStakeIndexModal"
      tabindex="-1"
      aria-labelledby="setStakeIndexModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h2 class="modal-title fs-5" id="setStakeIndexModalLabel">
              Значение КТУ
            </h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- MODAL BODY -->
          <div class="modal-body">
            <!-- {{tempSetStakeIndex}}
            {{currentFundID}} -->
            <div class="temp-sharer-stake-index_container">
              <button
                :disabled="tempSetStakeIndex.stake === 0"
                @click="
                  tempSetStakeIndex.stake = +(
                    tempSetStakeIndex.stake - 0.1
                  ).toFixed(2)
                "
              >
                <span>-</span>
              </button>
              <div>{{ tempSetStakeIndex.stake }}</div>
              <button
                @click="
                  tempSetStakeIndex.stake = +(
                    tempSetStakeIndex.stake + 0.1
                  ).toFixed(2)
                "
              >
                <span>+</span>
              </button>
            </div>
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
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="setRecievedStakeIndexDB()"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL SET WAGE RATE -->
    <div
      class="modal fade"
      id="setWageRateModal"
      tabindex="-1"
      aria-labelledby="setWageRateModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h2 class="modal-title fs-5" id="setWageRateModalLabel">
              Ставка в час
            </h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- MODAL BODY -->
          <div class="modal-body">
            <!-- {{ tempSetWageRate }} -->
            <!-- INPUT TEMP WAGE RATE -->
            <div class="mb-3">
              <label for="editedWageRate" class="form-label"
                >Укажите стоимость ставки в час в рублях</label
              >
              <input
                v-model="tempSetWageRate.rate"
                type="number"
                class="form-control"
                id="editedWageRate"
                aria-describedby="nameHelp"
              />
            </div>
            <!-- <input type="number" v-model="tempSetWageRate.rate"> -->
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
              class="btn btn-primary"
              data-bs-dismiss="modal"
              :disabled="tempSetWageRate.rate ? false : true"
              @click="setWageRateDB()"
            >
              <!-- @click="setSharerHourAtDayDB()" -->
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DELETE SHARE FROM FUND -->
    <div
      class="modal fade"
      id="delSharerFromFundModal"
      tabindex="-1"
      aria-labelledby="delSharerFromFundModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h2 class="modal-title fs-5" id="delSharerFromFundModalLabel">
              Удалить соучастника из ФОТ?
            </h2>
            <!-- <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button> -->
          </div>
          <!-- MODAL BODY -->
          <!-- <div class="modal-body">
            Фонд: {{ tempDelSharerFromFund.fundID }}
            <br />
            Список: {{ tempDelSharerFromFund.list }}
            <br />
            Соучастник: {{ tempDelSharerFromFund.userID }}
          </div> -->
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
              class="btn btn-danger"
              data-bs-dismiss="modal"
              @click="delSharerFromCurrentFundFunc"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- BTN ADD -->
    <!-- IF currentTitle === SHARERS -->
    <div
      v-if="
        organization &&
        organization.ownerID === user.id &&
        currentTitle === 'sharers'
      "
      class="add-btn_wrapper"
      @click="addMenuIsOpened = !addMenuIsOpened"
    >
      <Icon
        name="material-symbols:add-rounded"
        size="32px"
        color="var(--bs-primary)"
      />
    </div>
    <!-- BTN ADD MENU -->
    <div v-if="addMenuIsOpened" class="add-btn_menu">
      <div class="add-btn_menu-content">
        <!-- Кнопка add band to aliance -->
        <div class="add-btn_menu-item" @click.prevent="inviteBandToBand()">
          <p style="margin: 0">
            <span style="font-weight: bold">Пригласить</span><br />банду
          </p>
          <Icon
            name="material-symbols:add-rounded"
            size="32px"
            color="var(--bs-primary)"
          />
        </div>

        <!-- Кнопка add sharer to current band -->
        <div class="add-btn_menu-item" @click.prevent="inviteUserToBand()">
          <p style="margin: 0">
            <span style="font-weight: bold">Пригласить</span>
            <br />соучастника
          </p>
          <Icon
            name="material-symbols:add-rounded"
            size="32px"
            color="var(--bs-primary)"
          />
        </div>
      </div>
    </div>

    <!-- BTN ADD -->
    <!-- IF currentTitle === ??? -->

    <!-- PAGE TITLE -->
    <h1 class="show-max-767">Банда #{{ $route.params.id }}</h1>

    <div v-if="organization" class="band-info_wrapper">
      <p>{{ organization.title }}</p>
      <p>Дата создания: {{ organization.created_at }}</p>
      <!-- <div>
        <p>{{ organization }}</p>
      </div> -->
    </div>

    <!-- Заголовок - Переключатель -->
    <!-- TOGGLE TITLE -->
    <!-- таблица ФОТ / Табель учета рабочего времени -->
    <div class="toggle-title">
      <div
        v-for="(title, index) in titles.filter((el) => {
          if (organization) {
            if (
              el.guard &&
              (organization.ownerID === user.id ||
                sessionUserIsInTheBand() ||
                sessionUserAliancePartMainSharer())
            ) {
              return el;
            } else if (
              !el.guard ||
              (el.name === 'warehouse-items' && sessionUserAliancePart())
            ) {
              return el;
            }
          }
        })"
        class="switch-title_el"
      >
        <input
          type="radio"
          :id="`${index}_fund_hours`"
          :value="title.name"
          v-model="currentTitle"
        />
        <label :for="`${index}_fund_hours`"
          ><h2>{{ title.title }}</h2></label
        >
      </div>
    </div>

    <!-- Изменения может вносить только пахан -->
    <!-- v-if="user.role === 'MASTER' -->

    <!-- USERS IN BAND -->
    <div style="margin-top: 1rem" v-if="currentTitle === 'sharers'">
      <!-- <h2>Соучастники</h2> -->

      <!--  -->
      <div v-if="computedUsersInBand || computedOragnizationsInBand">
        <!-- {{ organization.sharers }} -->
        <!-- Список участников -->
        <div class="sharers-list_container">
          <!-- LIST -->

          <!-- Соучастники в банде сессионного пользователя -->
          <div>
            <!-- title -->
            <div
              v-if="
                !computedUsersInBand.length && organization.ownerID !== user.id
              "
              style="margin-top: 1rem"
            >
              <p>В банде нет соучастников</p>
            </div>

            <div class="sharers-list_wrapper">
              <div
                v-for="(sharer, index) in computedUsersInBand"
                class="sharers-list_item"
              >
                <!-- NAME -->
                <div class="list-item_name">
                  <p
                    style="margin: 0"
                    class="link"
                    @click="$router.push(`/partners/${sharer.id}`)"
                  >
                    <span style="font-weight: bold; display: block">{{
                      sharer.surname
                    }}</span>
                    <span>{{ sharer.name }} {{ sharer.middleName }}</span>
                  </p>

                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    "
                  >
                    <!-- ICON -->

                    <!-- Status -->
                    <div
                      v-if="organization.ownerID === user.id"
                      style="font-size: 0.8rem; color: var(--bs-tertiary-color)"
                    >
                      {{ sharer.groupStatus }}
                    </div>
                  </div>
                </div>

                <!-- PHONE -->
                <div class="item_phone">
                  <!-- style="pointer-events: none;" -->
                  <nuxt-link :to="`tel:${sharer.phone}`">{{
                    sharer.phone
                  }}</nuxt-link>
                </div>
              </div>

              <!-- Добавить -->
              <button
                v-if="organization.ownerID === user.id"
                type="button"
                class="btn btn-primary sharers-list_item-button"
                @click.prevent="inviteUserToBand()"
              >
                <p style="margin: 0">
                  <span style="font-weight: bold">Пригласить</span>
                  <br />соучастника
                </p>
                <Icon
                  name="material-symbols:add-rounded"
                  size="32px"
                  color="var(--bs-primary)"
                />
              </button>
            </div>
          </div>
          <!-- Банды в альянсе сессионного пользователя -->
          <div>
            <!-- title -->
            <div
              v-if="
                !computedOragnizationsInBand.length &&
                organization.ownerID !== user.id
              "
              style="margin-top: 1rem"
            >
              <p>В составе нет банд</p>
            </div>
            <!-- <div v-else style="margin-top: 1rem">
                <p>Банды-соучастники</p>
              </div> -->
            <!-- Банды-соучастники -->
            <div class="sharers-list_wrapper">
              <div
                v-for="company in computedOragnizationsInBand"
                class="sharers-list_item"
              >
                <!-- TITLE -->
                <div
                  class="link"
                  style="display: flex; align-items: space-between"
                  @click="$router.push(`/organizations/${company.id}`)"
                >
                  <p style="margin: 0">
                    <span style="font-weight: bold">{{ company.title }}</span>
                  </p>
                </div>
                <!-- INFO -->
                <div class="list-item_info">
                  <Icon
                    name="material-symbols-light:group"
                    size="32px"
                    color="var(--bs-border-color)"
                  />
                  <p style="margin: 0">x</p>
                  <p style="margin: 0">
                    {{ company.sharers.length }}
                  </p>
                </div>
                <!-- ICON -->
                <div class="list-item_icon" v-if="company.ownerID === user.id">
                  <Icon
                    name="mdi:crown"
                    size="24px"
                    color="var(--bs-warning)"
                  />
                </div>
              </div>
              <!-- Добавить -->
              <button
                v-if="organization.ownerID === user.id"
                type="button"
                class="btn btn-primary sharers-list_item-button"
                style="text-align: start; padding: 1rem"
                @click.prevent="inviteBandToBand()"
              >
                <p style="margin: 0">
                  <span style="font-weight: bold">Пригласить</span><br />банду
                </p>
                <Icon
                  name="material-symbols:add-rounded"
                  size="32px"
                  color="var(--bs-primary)"
                />
              </button>
            </div>
          </div>
          <!-- Если вобще никорго -->
          <div
            class="no-sharers_wrapper"
            v-if="
              !computedUsersInBand.length && !computedOragnizationsInBand.length
            "
          >
            Нет соучастников
          </div>
        </div>
      </div>
    </div>

    <!-- BAND PROJECTS -->
    <div v-if="currentTitle === 'projects'">
      <!-- container -->
      <div class="projects_container">
        <!--  -->
        <div v-if="projects.length">
          <div
            v-for="project in projects"
            class="project_wrapper"
            @click="$router.push(`/projects/${project.id}`)"
          >
            {{ project.title }} <br />
            {{ project.address }} <br />
            {{ project.sharers }}
          </div>
        </div>
        <div v-else>Ничего нет</div>
      </div>
    </div>

    <!-- ТАБЕЛЬ И ФОТ -->
    <div v-if="computedUsersInBand" class="fund-hours_container">
      <div v-if="computedSalaryFund.length !== 0">
        <!-- Фильтры просмотра ФОТ -->
        <div
          v-if="
            currentTitle !== 'sharers' &&
            currentTitle !== 'projects' &&
            currentTitle !== 'warehouse-items' &&
            currentTitle !== 'funds'
          "
          class="filter-fund_wrapper"
          style="display: flex; align-items: center; gap: 1rem"
        >
          <!-- Выбор года -->
          <select
            name=""
            id=""
            v-model="currentYear"
            class="filter-fund_select"
          >
            <option v-for="year in computedYearsList" :value="year">
              {{ year }}
            </option>
            <!-- <option :value="2024">2024</option> -->
          </select>

          <!-- выбор по месяцам-->
          <div class="filter-fund_period">
            <div
              class="filter-fund_period-el"
              v-for="(period, i) in computedPeriodList"
              :key="i"
            >
              <input
                type="radio"
                :id="`${i}`"
                name="fund-period"
                :value="{
                  periodStart: period.periodStart,
                  periodEnd: period.periodEnd,
                }"
                v-model="choosenFundPeriod"
              />
              <label :for="`${i}`">{{
                translateFundPeriod(period.periodStart, period.periodEnd)
              }}</label>
            </div>
            <!-- data-bs-toggle="modal"
            data-bs-target="#newWarehouseItemModal" -->
            <button
              v-if="organization.ownerID === user.id && currentTitle === 'fund'"
              :data-bs-toggle="organization.ownerID === user.id ? `modal` : ''"
              :data-bs-target="
                organization.ownerID === user.id ? `#addNewFundModal` : ''
              "
              style="border-radius: 16px; padding: 4px 10px"
              type="button"
              class="btn btn-primary btn-create-modal-open-767"
              @click="checkAndAddFund(organization.ownerID)"
            >
              <span>Добавить</span>
            </button>
          </div>

          <!-- <div>Today: {{ new Date() }}</div> -->
          <!-- <div>{{computedPeriodList}}</div> -->
        </div>

        <!-- ABOUT FUND -->
        <div class="table-fund_container">
          <div
            v-for="fund in salaryFundArray.filter(
              (item) =>
                item.bandID === +route.params.id &&
                item.periodStart === choosenFundPeriod.periodStart &&
                item.periodEnd === choosenFundPeriod.periodEnd
            )"
            :key="fund.id"
          >
            <div v-if="fund.list.length">

              <!-- СТАВКА, СТАТУС -->
              <div
                class="fund-options_container"
                style="display: flex; align-items: center; gap: 1rem"
              >
                <!-- Ставка -->
                <div v-if="currentTitle === 'fund'" class="wage-rate_container">
                  <p>
                    <span style="color: var(--bs-tertiary-color)"
                      >Ставка:
                    </span>
                    <span
                      @click="
                        setWageRate(
                          organization.ownerID,
                          fund.id,
                          fund.wageRate
                        )
                      "
                      :data-bs-toggle="
                        organization.ownerID === user.id ? `modal` : ''
                      "
                      :data-bs-target="
                        organization.ownerID === user.id
                          ? `#setWageRateModal`
                          : ''
                      "
                      >{{ fund.wageRate }} руб./час</span
                    >
                  </p>
                  <span>{{
                    calcDynamicWageRate(fund.list, fund.listProduction)
                  }}</span>
                </div>

                <!-- Статус -->
                <div
                  v-if="fund.status && currentTitle === 'fund'"
                  class="table-fund_status"
                >
                  <!-- <p style="margin: 0">Статус:</p> -->
                  <!-- <div v-if="fund.status.status === 'paid out'">Выплачено</div>
                <div v-else>Ожидает оплаты</div> -->
                  <!-- {{ fund.status.status }} -->
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: start;
                      gap: 0.5rem;
                    "
                  >
                    <p style="margin: 0; color: var(--bs-tertiary-color)">
                      Статус:
                    </p>
                    <div style="display: flex; flex-direction: column">
                      <span
                        :class="
                          fund.status.status === 'paid out'
                            ? 'status_paid-out'
                            : 'status_awaiting-payment'
                        "
                        >{{ transformShowFundStatus(fund.status) }}</span
                      >
                      <span
                        v-if="fund.status.status === 'paid out'"
                        style="
                          color: var(--bs-tertiary-color);
                          font-size: 0.8rem;
                        "
                        >{{ transformFundStatusDate(fund.status.date) }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- УЧЕТ ЧАСОВ -->
              <div class="table_hours">
                <table
                  v-if="currentTitle === 'working-hours'"
                  class="working-hours_wrapper"
                >
                  <!-- Заголовки -->
                  <thead>
                    <th scope="col"><span>п/п</span></th>
                    <th scope="col">
                      <div
                        style="
                          display: flex;
                          flex-direction: row;
                          justify-content: flex-start;
                        "
                      >
                        <p style="margin: 0">
                          <span>Соучастник</span>
                        </p>
                        <div
                          @click="
                            addSharerToFund(
                              fund.id,
                              fund.list,
                              organization.ownerID
                            )
                          "
                          class="working-hours_add-sharer_btn"
                          v-if="
                            organization.ownerID === user.id &&
                            fund.status.status !== 'paid out'
                          "
                          :data-bs-toggle="
                            organization.ownerID === user.id ? `modal` : ''
                          "
                          :data-bs-target="
                            organization.ownerID === user.id
                              ? `#addSharerToFundModal`
                              : ''
                          "
                        >
                          <Icon
                            name="material-symbols:add-rounded"
                            size="32px"
                            color="var(--bs-primary)"
                          />
                        </div>
                      </div>
                    </th>
                    <th class="working-hours_sum">Сумма<br />часов</th>
                    <th
                      v-for="day in countedDays(
                        fund.periodStart,
                        fund.periodEnd
                      )"
                    >
                      <div>
                        <span>{{ day.date.slice(-2) }}</span>
                        <span style="font-weight: normal; font-size: 0.8rem">{{
                          translateDayOfWeek(day.dayOfWeek)
                        }}</span>
                      </div>
                    </th>
                  </thead>
                  <tbody>
                    <!-- Строки -->
                    <tr v-for="(el, i) in sortFundSharer(fund.list)">
                      <!-- {{el}} -->
                      <!-- № п/п -->
                      <td>{{ i + 1 }}.</td>
                      <!-- Соучастник -->
                      <td class="working-hours_sharer_wrapper">
                        <!-- Соучастник -->
                        <div
                          class="working-hours_sharer link"
                          @click="$router.push(`/partners/${el.userID}`)"
                        >
                          {{ el.surname }} {{ el.name[0] }}.
                          {{ el.middleName[0] }}
                        </div>
                        <!-- Кпнока удалить соучастника из фонда -->
                        <div
                          v-if="
                            organization.ownerID === user.id &&
                            fund.status.status !== 'paid out'
                          "
                          class="working-hours_sharer_btn"
                          @click="
                            delSharerFromCurrentFund(
                              fund.id,
                              fund.list,
                              el.userID,
                              organization.ownerID
                            )
                          "
                          :data-bs-toggle="
                            organization.ownerID === user.id ? `modal` : ''
                          "
                          :data-bs-target="
                            organization.ownerID === user.id
                              ? `#delSharerFromFundModal`
                              : ''
                          "
                        >
                          <Icon
                            name="ic:baseline-close"
                            size="24px"
                            color="var(--bs-danger)"
                          />
                        </div>
                      </td>
                      <td style="text-align: center; font-weight: bold">
                        {{ sumSharerHours(el.hours) }}
                      </td>
                      <td
                        class="hour-per-day_cell"
                        v-for="day in countedDays(
                          fund.periodStart,
                          fund.periodEnd
                        )"
                        @click="
                          setSharerHourAtDay(
                            organization.ownerID,
                            fund.id,
                            el.userID,
                            day.date,
                            el.hours
                          )
                        "
                        :data-bs-toggle="
                          organization.ownerID === user.id ? `modal` : ''
                        "
                        :data-bs-target="
                          organization.ownerID === user.id
                            ? `#setSharerHourModal`
                            : ''
                        "
                      >
                        <span> {{ setWorkHourInDay(day.date, el.hours) }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td style="text-align: center">
                        <span style="font-weight: bold">{{
                          sumTotalShareHours(fund.list)
                        }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- ФОТ -->
              <div class="table_fund">
                <table class="table" v-if="currentTitle === 'fund'">
                  <thead class="item-table_header">
                    <tr>
                      <th style="padding: unset; padding: 1rem 0" scope="col">
                        п/п
                      </th>
                      <th scope="col" style="padding: unset">
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                          "
                        >
                          <p style="margin: 0">
                            <span>Соучастник</span>
                          </p>
                          <div
                            @click="
                              addSharerToFund(
                                fund.id,
                                fund.list,
                                organization.ownerID
                              )
                            "
                            class="working-hours_add-sharer_btn"
                            v-if="
                              organization.ownerID === user.id &&
                              fund.status.status !== 'paid out'
                            "
                            :data-bs-toggle="
                              organization.ownerID === user.id ? `modal` : ''
                            "
                            :data-bs-target="
                              organization.ownerID === user.id
                                ? `#addSharerToFundModal`
                                : ''
                            "
                          >
                            <Icon
                              name="material-symbols:add-rounded"
                              size="32px"
                              color="var(--bs-primary)"
                            />
                          </div>
                        </div>
                      </th>
                      <th scope="col">Часы всего</th>
                      <th scope="col">КТУ</th>
                      <th scope="col">Часы * КТУ</th>
                      <th scope="col">ЗП (static wr)</th>
                      <th scope="col">ЗП (dynamic wr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(el, i) in sortFundSharer(fund.list)"
                      class="table-row_wrapper"
                    >
                      <!-- № п/п -->
                      <td style="padding: unset; padding: 1rem 0">
                        {{ i + 1 }}.
                      </td>
                      <!-- Соучастник -->
                      <td
                        style="width: 100%"
                        class="working-hours_sharer_wrapper"
                      >
                        <span
                          style="text-align: start"
                          class="link"
                          @click="$router.push(`/partners/${el.userID}`)"
                        >
                          <!-- {{ translateFundListUser(el.userID) }} -->
                          {{ el.surname }} {{ el.name[0] }}.
                          {{ el.middleName[0] }}
                        </span>

                        <!-- Кпнока удалить соучастника из фонда -->
                        <div
                          v-if="
                            organization.ownerID === user.id &&
                            fund.status.status !== 'paid out'
                          "
                          class="working-hours_sharer_btn"
                          @click="
                            delSharerFromCurrentFund(
                              fund.id,
                              fund.list,
                              el.userID,
                              organization.ownerID
                            )
                          "
                          :data-bs-toggle="
                            organization.ownerID === user.id ? `modal` : ''
                          "
                          :data-bs-target="
                            organization.ownerID === user.id
                              ? `#delSharerFromFundModal`
                              : ''
                          "
                        >
                          <Icon
                            name="ic:baseline-close"
                            size="24px"
                            color="var(--bs-danger)"
                          />
                        </div>
                      </td>
                      <!-- Отработано часов -->
                      <!-- @click="setRecievedHours(fund.id, el.userID, fund.list)" -->
                      <td>
                        <span>{{ sumSharerHours(el.hours) }}</span>
                      </td>
                      <!-- КТУ -->
                      <td
                        @click="
                          setRecievedStakeIndex(
                            organization.ownerID,
                            fund.id,
                            el.userID,
                            el.stakeIndex
                          )
                        "
                        :data-bs-toggle="
                          organization.ownerID === user.id ? 'modal' : ''
                        "
                        :data-bs-target="
                          organization.ownerID === user.id
                            ? '#setStakeIndexModal'
                            : ''
                        "
                        class="recieved-data-to-change"
                      >
                        <span v-if="el.stakeIndex">{{ el.stakeIndex }}</span>
                        <span v-else>-</span>
                      </td>
                      <!-- Час * КТУ -->
                      <td>
                        <span v-if="el.stakeIndex !== '' && fund.list.length">
                          <!-- {{ (el.hours * el.stakeIndex).toFixed(2) }} -->
                          {{
                            calcHourMultiplyStakeIndex(
                              fund.list,
                              el.hours,
                              el.stakeIndex,
                              el.userID
                            )
                          }}
                        </span>
                        <span v-else>-</span>
                      </td>
                      <!-- ЗП (static wr)-->
                      <td>
                        <span v-if="el.stakeIndex !== ''">
                          {{
                            calcProductionSalary(
                              el.hours,
                              el.stakeIndex,
                              fund.wageRate
                            )
                          }}
                        </span>
                        <span v-else>-</span>
                      </td>
                      <!-- ЗП (dynamic wr) -->
                      <td class="recieved-data-to-change">
                        <span>{{
                          setRecievedSalary(
                            fund.list,
                            fund.listProduction,
                            el.hours,
                            el.stakeIndex,
                            el.userID
                          )
                        }}</span>
                      </td>
                    </tr>

                    <!-- Итого -->
                    <tr class="table-row_wrapper">
                      <td></td>
                      <td></td>
                      <td style="font-weight: bold">
                        {{ sumTotalShareHours(fund.list) }}
                      </td>
                      <td></td>
                      <td style="font-weight: bold">
                        {{ sumStakeIndexHour(fund.list) }}
                      </td>
                      <td style="font-weight: bold">
                        {{ sumAllProductionSalary(fund.wageRate, fund.list) }}
                      </td>
                      <td style="font-weight: bold">
                        {{
                          calDynamicTotalSalaryFund(
                            fund.list,
                            fund.listProduction
                          )
                        }}
                      </td>
                    </tr>
                    <tr class="table-row_wrapper">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Остаток:</td>
                      <td>
                        {{
                          countTrifleByWageRate(
                            fund.listProduction,
                            fund.wageRate,
                            fund.list
                          )
                        }}
                      </td>
                      <td>
                        {{
                          countTrifleByBandProduction(
                            fund.listProduction,
                            fund.list
                          )
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- УЧЕТ ПРОИЗВОДСТВА -->
              <div v-if="fund.listProduction" class="table_production">
                <table class="table" v-if="currentTitle === 'band_production'">
                  <thead class="production-header_wrapper">
                    <tr>
                      <th class="production-header_date">
                        <p>Дата</p>
                      </th>
                      <th scope="col" class="production-header_desc">
                        <div>
                          <p><span>Выполнение</span></p>
                          <div
                            class="add_production_btn"
                            @click="addProduction()"
                          >
                            <Icon
                              name="material-symbols:add-rounded"
                              size="32px"
                              color="var(--bs-primary)"
                            />
                          </div>
                        </div>
                      </th>
                      <th class="production-header_value">
                        <div>
                          <p>Объем</p>
                          <p>
                            {{ countProductionSalary(fund.listProduction) }}
                          </p>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="production-body_wrapper">
                    <tr
                      v-for="(item, index) in fund.listProduction.sort(
                        (a, b) => {
                          let adate = new Date(a.date);
                          let bdate = new Date(b.date);
                          return bdate - adate;
                        }
                      )"
                    >
                      <!-- data -->
                      <td class="production-body_date">
                        <p>{{ item.date }}</p>
                      </td>
                      <td class="production-body_desc">
                        <p>
                          <span>{{ item.title }}</span
                          ><span class="production-body_desc-project">{{
                            translateProject(item.projectID)
                          }}</span>
                        </p>
                        <p class="production-body_desc-desc">
                          {{ item.desc }}
                        </p>
                      </td>
                      <td class="production-body_qty">
                        <p>{{ item.qty }}</p>
                        <p class="production-body_qty-qty">
                          x{{ transformProductionPrice(item.price) }} =
                          {{ transformProductionPrice(item.price * item.qty) }}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                class="production-none_wrapper"
                v-if="
                  currentTitle === 'band_production' && !fund.listProduction
                "
              >
                <p>
                  Здесь нет выполненных задач.
                  <span class="link" @click="addProduction()">Добавить</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="
          !computedSalaryFund.length &&
          (currentTitle === 'fund' ||
            currentTitle === 'working-hours' ||
            currentTitle === 'band_production')
        "
      >
        Ни одной таблицы ФОТ...
        <span
          v-if="organization.ownerID === user.id"
          style="color: var(--bs-primary)"
          class="link"
          @click="checkAndAddFund(organization.ownerID)"
          :data-bs-toggle="organization.ownerID === user.id ? `modal` : ''"
          :data-bs-target="
            organization.ownerID === user.id ? `#addNewFundModal` : ''
          "
          >Добавить</span
        >
      </div>
    </div>

    <!-- ФОНДЫ организации -->
    <div v-if="currentTitle === 'funds'">
      <div class="fund_container">
        <div>
          <nuxt-link to="/fundbands/1">к Фондам</nuxt-link>
          <br />
          <ul>
            фонды:
            <li>балансовая стоимость ТМЦ</li>
            <li>банки соучастников, где банда в доле</li>
            <li>
              банда афилирована к конкретному фонду другой банды по статусу
            </li>
            <li>свои кошельки</li>
          </ul>
          <br />
        </div>
        <div>Нет фондов...</div>
      </div>
    </div>

    <!-- ТМЦ организации -->
    <div v-if="currentTitle === 'warehouse-items'">
      <div class="warehouse-items_container">
        <div v-if="items.length">
          <!-- Заголовок -->
          <!-- <h2>ТМЦ</h2> -->
          <!--  -->
          <!-- <div v-if="pending">Loading...</div> -->
          <div>
            <div v-if="items.length">
              <div
                v-for="(item, index) in items.filter((el) => {
                  if (organization) {
                    if (
                      organization.ownerID === user.id ||
                      sessionUserIsInTheBand() ||
                      sessionUserAliancePart()
                    ) {
                      return el;
                    }
                  }
                })"
                :key="index"
                style="display: flex"
              >
                <div>{{ item.title }}</div>
                <div style="background-color: var(--bs-primary-bg-subtle)">
                  {{ item.qty }} {{ item.measure }} * {{ item.price }} RUB =
                  {{ item.qty * item.price }} RUB
                </div>
                <div>-{{ item.location }}_{{ item.ownerID }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>Нет ценностей...</div>
      </div>
    </div>

    <br />
    <br />
    <br />
  </Container>
</template>

<script lang="ts" setup>
import { Container } from "@/shared/container";
import { onBeforeMount } from "vue";

useHead({
  title: "Банда # ",
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

const router = useRoute();

const { user } = useUserSession();

const route = useRoute();

const organizations = ref(null);
const organization = ref(null);

const users = ref(null);
const usersInBand = ref([]);

// SHARERS LIST
const sharersListIsOpened = ref(false);

// toggle title data
const titles = ref([
  {
    title: "Соучастники",
    name: "sharers",
    guard: false,
  },
  {
    title: "Проекты",
    name: "projects",
    guard: true,
  },
  {
    title: "ФОТ",
    name: "fund",
    guard: true,
  },
  {
    title: "Учет времени",
    name: "working-hours",
    guard: true,
  },
  {
    title: "Выполнение",
    name: "band_production",
    guard: true,
  },
  {
    title: "Фонды",
    name: "funds",
    guard: true,
  },
  {
    title: "ТМЦ",
    name: "warehouse-items",
    guard: true,
  },
]);
const currentTitle = ref("sharers");

// ФОТ
const currentYear = ref();
const yearsList = ref([]);
const periodList = ref([]);
const fundPeriodArray = ref([]);
const choosenFundPeriod = ref({
  periodStart: "",
  periodEnd: "",
});

// Модалка созданя нового ФОТ
const choosenStartDate = ref();
const choosenEndDate = ref();
// Массив salary funds
const salaryFundArray = ref([]);
// pseudo object of Fund Salary
// LONGBLOB or BLOB

// warehouse items
const items = ref([]);

// add sharer to selected fund list
const tempSelectedFund = ref([]);
// const computedTempListOfSharers = computed(() => {
//   let result = [];
//   // if (computedOragnizationsInBand.value) {
//   //   // [...computedOragnizationsInBand.value].forEach(company =>
//   //   //   result = [...company.sharers]
//   //   // )
//   //   // result = [...computedOragnizationsInBand.value]
//   // } else if (computedUsersInBand.value) {
//   //   [...computedUsersInBand.value].forEach((sharer) =>
//   //     result.push({ sharerID: sharer.id })
//   //   );
//   // }
//   return result;
// });
// set hours obj
const tempSetSharerHour = ref({
  userID: null,
  date: "",
  hour: null,
});
// set stake index
const tempSetStakeIndex = ref({
  userID: null,
  stake: null,
});
// set wage rate
const tempSetWageRate = ref({
  fundID: null,
  rate: null,
});
// currentFundList
const currentFundID = ref();
// new fund
const tempNewFund = ref({
  // id: auto increment
  bandID: 0,
  periodStart: "2024-07-16",
  periodEnd: "2024-07-31",
  wageRate: 0,
  list: [
    {
      hours: [
        {
          date: "2023-02-01",
          hours: "",
        },
        {
          date: "2023-02-02",
          hours: "",
        },
      ],
      userID: 1,
      stakeIndex: 1.1,
    },
  ],
  listProduction: [
    {
      qty: 0,
      date: new Date(),
      title: "",
      desc: "",
      projectID: 0,
      price: 0,
    },
  ],
  status: {
    date: "",
    status: "working",
  },
});

//
const tempSharersToFund = ref([]);

//
const searchAddSharerInput = ref("");

// delete sharer from current fund
const tempDelSharerFromFund = ref({
  fundID: null,
  list: [],
  userID: null,
});

// ADD MENU
const addMenuIsOpened = ref(false);
window.addEventListener("click", (e) => {
  if (e.target.classList && addMenuIsOpened.value) {
    if (e.target.classList.contains("add-btn_menu")) {
      addMenuIsOpened.value = !addMenuIsOpened.value;
      // console.log(e.target);
    }
  }
});

// COMPUTED
const computedSalaryFund = computed(() => {
  // current ФОТ
  if (salaryFundArray.value) {
    salaryFundArray.value.forEach((element) => {
      try {
        // const result = element.list;
        // console.log(result);
      } catch (err) {
        // 👇️ This runs
        console.log("Error: ", err.message);
      }
    });
    return salaryFundArray.value;
  }
});

const computedYearsList = computed(() => {
  if (computedSalaryFund.value) {
    let yearsSet = new Set(
      computedSalaryFund.value.map((num) => num.periodEnd.slice(0, 4))
    );
    yearsList.value = [...yearsSet];

    // Задаем текущий год к показу
    currentYear.value = yearsList.value[yearsList.value.length - 1];

    return yearsList.value;
  }
});

const computedPeriodList = computed(() => {
  if (computedSalaryFund.value) {
    let monthPeriod = new Set(
      computedSalaryFund.value.map((el) => {
        let obj = {
          periodStart: el.periodStart,
          periodEnd: el.periodEnd,
        };
        return obj;
      })
    );
    periodList.value = [...monthPeriod];

    return periodList.value
      .filter((period) => period.periodEnd.slice(0, 4) === currentYear.value)
      .sort((a, b) => {
        let adate = new Date(a.periodStart);
        let bdate = new Date(b.periodStart);
        return adate - bdate;
      });
  }
});

// Пользователи в банде
const computedUsersInBand = computed(() => {
  if (organization.value) {
    let indexArray = organization.value.sharers.filter(
      (sharer) => sharer.userType === "user"
    );
    let usersInBand = [];

    if (indexArray.length) {
      indexArray.forEach((sharer) => {
        if (users.value) {
          let part1 = [...users.value].find(
            (user) => user.id === sharer.userID
          );

          let part2 = sharer;

          let userObj = {
            id: part1.id,
            name: part1.name,
            middleName: part1.middleName,
            surname: part1.surname,
            phone: part1.phone,
            groupStatus: part2.groupStatus,
          };

          usersInBand.push(userObj);
        }
      });
    }
    return usersInBand.sort((x, y) => {
      if (x.surname < y.surname) {
        return -1;
      }

      if (x.surname > y.surname) {
        return 1;
      }
    });
  }
});
// Банды
const computedOragnizationsInBand = computed(() => {
  if (organization.value) {
    let indexArray = organization.value.sharers.filter(
      (sharer) => sharer.userType === "company"
    );
    let companiesInBand = [];

    if (indexArray.length) {
      indexArray.forEach((company) => {
        if (organizations.value.length) {
          let companyObj = [...organizations.value].find(
            (el) => el.id === company.userID
          );

          companiesInBand.push(companyObj);
        }
      });
    }
    return companiesInBand;
  }
});

// Список sharers для добавления в фонд
const computedSharersToAddToFund = computed(() => {
  if (
    computedUsersInBand.value &&
    tempSelectedFund.value &&
    currentFundID.value
  ) {
    //
    let sharersInFund = tempSelectedFund.value.map((sharer) => +sharer.userID);
    let sharersInFundSet = new Set(sharersInFund);
    //
    let notInFund = computedUsersInBand.value.filter(
      (sharer) => !sharersInFundSet.has(sharer.id)
    );

    if (notInFund.length) {
      if (searchAddSharerInput.value === "") {
        return notInFund;
      } else {
        return notInFund.filter((el) => {
          return el.surname
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(
              searchAddSharerInput.value.toLowerCase().replace(/\s+/g, "")
            );
        });
      }
    }
  }
});
// TOGGLE SHARER TO FUND BY CLICK
const toggleAddingSharerToFund = (sharerID) => {
  if (sharerID && tempSharersToFund.value) {
    console.log(sharerID)
    if (tempSharersToFund.value.find((el) => +el.userID === +sharerID)) {
      let result = [...tempSharersToFund.value].filter(
        (el) => +el.userID !== +sharerID
      )
      if(result) {
        // console.log(result)
        tempSharersToFund.value = result;
      }
      // let result_array = [...tempSharersToFund.value].filter(
      //   (el) => el.userID !== +sharerID
      // );
      // console.log()
    } else {
      tempSharersToFund.value.push({
        hours: [],
        userID: `${sharerID}`,
        stakeIndex: '1.0',
      });
    }
  }
};
// ADD SHARER TO FUND FUNC
const addSharerToFundFunc = async () => {
  // console.log('Добавляем:')
  // console.log(tempSharersToFund.value)
  // console.log('в фонд:')
  // console.log(currentFundID.value)
  // console.log(tempSelectedFund.value)

  let result_array = [...tempSharersToFund.value, ...tempSelectedFund.value];
  // console.log('Получилось:')
  // console.log(result_array)

  return salaryFundArray.value.map(async (fund) => {
    if(fund.list) {

      fund.list = result_array;
      await setUserFundList(currentFundID.value, result_array);
      await refreshSalaryFundArray()
    }
  });
};

// check session user in current band
const sessionUserIsInTheBand = () => {
  if (computedUsersInBand.value) {
    let userInBand = [...computedUsersInBand.value].find(
      (el) => el.id === user.value.id
    );
    //
    if (userInBand) {
      return true;
    } else {
      return false;
    }
  }
};

// check session user is a part of aliance
const sessionUserAliancePart = () => {
  if (computedOragnizationsInBand.value || organizations.value) {
    // какие банды входят в current band
    if (computedOragnizationsInBand.value.length) {
      // Ищем в участниках session user
      for (let i = 0; i <= computedOragnizationsInBand.value.length; i++) {
        if (
          computedOragnizationsInBand.value[i].sharers.find(
            (el) => el.userType === "user" && el.userID === user.value.id
          )
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
    // От обратного, найти куда входит current band
    else if (organizations.value.length) {
      // Пробегаемся по всем бандам на сервисе
      for (let i = 0; i <= organizations.value.length; i++) {
        // и смотрим где в sharers есть текущая банда в качестве участника
        let array = organizations.value[i].sharers.filter(
          (el) =>
            el.userType === "company" && el.userID === organization.value.id
        );
        if (array.length) {
          // Убдимся что session user является участников головной банды в альянсе
          if (
            organizations.value[i].sharers.find(
              (el) => el.userType === "user" && el.userID === user.value.id
            )
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    // Ну и прочее
    else {
      return false;
    }
  }
};
//
const sessionUserAliancePartMainSharer = () => {
  if (organizations.value.length) {
    // Пробегаемся по всем бандам на сервисе
    for (let i = 0; i <= organizations.value.length; i++) {
      // и смотрим где в sharers есть текущая банда в качестве участника
      let array = organizations.value[i].sharers.filter(
        (el) => el.userType === "company" && el.userID === organization.value.id
      );
      if (array.length) {
        // Убдимся что session user является участников головной банды в альянсе
        if (
          organizations.value[i].sharers.find(
            (el) => el.userType === "user" && el.userID === user.value.id
          )
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
};

// ========================= SORT =========================

// sort fund sharer by surname
const sortFundSharer = (fundList) => {
  if (fundList.length) {
    //
    let result_array = [];
    //
    fundList.forEach((el) => {
      //
      let sharerInFund = [...computedUsersInBand.value].find(
        (user) => user.id === +el.userID
      );

      //
      let result_sharer_obj = {
        userID: sharerInFund.id,
        name: sharerInFund.name,
        middleName: sharerInFund.middleName,
        surname: sharerInFund.surname,
        hours: el.hours,
        stakeIndex: el.stakeIndex,
      };
      // console.log(sharerInFund)
      result_array.push(result_sharer_obj);
    });

    return result_array.sort((x, y) => {
      if (x.surname < y.surname) {
        return -1;
      }

      if (x.surname > y.surname) {
        return 1;
      }
    });
  }
};
//
onBeforeMount(async () => {
  // warehouse items
  items.value = await getWarehouseItems();
  if (items.value) {
    items.value = items.value.filter(
      (item) => item.ownerID === +route.params.id
    );
    items.value = items.value.sort((x, y) => {
      if (x.title < y.title) {
        return -1;
      }

      if (x.title > y.title) {
        return 1;
      }

      return x.locationID - y.locationID;
    });
  }

  // salary funds
  salaryFundArray.value = await getSalaryFunds();
  if (salaryFundArray.value) {
    salaryFundArray.value = salaryFundArray.value.filter(
      (item) => item.bandID === +route.params.id
    );
  }
  // организации
  organizations.value = await getOrganizations();
  if (organizations.value) {
    organization.value = organizations.value.find(
      (company) => company.id == +route.params.id
    );
  }

  // тмц организации
  items.value = items.value.filter(
    (item) =>
      item.ownerType === "company" && item.ownerID === organization.value.id
  );

  users.value = await getAllUsers();
});
//
async function getSalaryFunds() {
  return await $fetch("/api/funds/salary");
}
// const { data: salaryFundArray } = useLazyAsyncData("salary", () => {
//   $fetch('api/funds/salary')
// })

//
async function getWarehouseItems() {
  return await $fetch("/api/warehouse/item");
}

//
async function getOrganizations() {
  return await $fetch("/api/organizations/organizations");
}

const { data: projects } = await useFetch("/api/projects/projects", {
  lazy: false,
  transform: (projects) => {
    return projects.filter((el) => {
      //
      if (el.bandID === +route.params.id) {
        return el;
      }
      //
      else if (
        el.sharers &&
        el.sharers.find(
          (el) =>
            el.sharerType === "company" && el.sharerID === +route.params.id
        )
      ) {
        return el;
      }
    });
  },
});

async function getAllUsers() {
  return await $fetch("/api/usersList/users");
}

onMounted(async () => {
  // close and reseе data #addNewFundModal
  const addNewFundEl = document.getElementById("addNewFundModal");
  if (addNewFundEl) {
    addNewFundEl.addEventListener("hidden.bs.modal", (event) => {
      console.log("Модалка #addNewFundModal закрыта");
      // console.log(tempSetSharerHour.value);
    });
  }
  // close modal and reset data #addSharerToFundModal
  const addSharerToFundEl = document.getElementById("addSharerToFundModal");
  if (addSharerToFundEl) {
    addSharerToFundEl.addEventListener("hidden.bs.modal", (event) => {
      console.log("Модалка #addSharerToFundModal закрыта");
      searchAddSharerInput.value = "";
      tempSharersToFund.value = [];
      currentFundID.value = null
      // tempSelectedFund.value = [];
      // Также, сбрасываем checked в листе к добавлению на false
      let checkboxes = document.querySelectorAll(".search-add-sharer_checkbox");
      if (checkboxes.length) {
        checkboxes.forEach(el => {
          el.checked = false
        })
      }
    });
  }
  // close modal and reset data #setSharerHourModal
  const sharerHourModalEl = document.getElementById("setSharerHourModal");
  if (sharerHourModalEl) {
    sharerHourModalEl.addEventListener("hidden.bs.modal", (event) => {
      console.log("Модалка #setSharerHourModal закрыта");
      // console.log(tempSetSharerHour.value);
    });
  }
  // close modal and reset data #setStakeIndexModal
  const setStakeIndexModalEl = document.getElementById("setStakeIndexModal");
  if (setStakeIndexModalEl) {
    setStakeIndexModalEl.addEventListener("hidden.bs.modal", (event) => {
      console.log("Модалка #setStakeIndexModal закрыта");
    });
  }
  // close modal and reset data #setWageRateModal
  const setWageRateModalEl = document.getElementById("setWageRateModal");
  if (setWageRateModalEl) {
    setWageRateModalEl.addEventListener("hidden.bs.modal", (event) => {
      console.log("Модалка #setWageRateModal закрыта");
      tempSetWageRate.value.rate = null;
    });
  }
  // close modal and reset data #delSharerFromFundModal
  const delSharerFromFundModalEl = document.getElementById(
    "delSharerFromFundModal"
  );
  if (delSharerFromFundModalEl) {
    delSharerFromFundModalEl.addEventListener("hidden.bs.modal", (event) => {
      console.log("Модалка #delSharerFromFundModal закрыта");
      tempDelSharerFromFund.value = {
        fundID: null,
        list: [],
        userID: null,
      };
    });
  }

  // При монтирвоаниии всегда показываем самую свежу таблицу ФОТ
  if (computedSalaryFund.value.length) {
    // Сортируем да дате окончания отчетного периода. Может имеет смысл добавить строку created_at и по ней сортировать???
    computedSalaryFund.value.sort(
      (a, b) => new Date(a.periodStart) - new Date(b.periodEnd)
    );

    let lastFundInArray =
      computedSalaryFund.value[computedSalaryFund.value.length - 1];
    //
    choosenFundPeriod.value = {
      periodStart: lastFundInArray.periodStart,
      periodEnd: lastFundInArray.periodEnd,
    };
  }
});

const countedDataArray = computed((start, end) => {
  return `${start}-${end}`;
});

const dayListArray = ref([]);
const countedDays = (start, end) => {
  if (start && end) {
    // Вынести в вспомогательные...
    const getDaysArray = function (s, e) {
      const a = [];
      for (
        const d = new Date(s);
        d <= new Date(e);
        d.setDate(d.getDate() + 1)
      ) {
        a.push(new Date(d));
      }
      return a.map((day) => {
        return {
          date: day.toISOString().slice(0, 10),
          dayOfWeek: day.getDay(),
        };
      });
    };

    let daylist = getDaysArray(new Date(start), new Date(end));
    // daylist.map((v) => v.toISOString().slice(0, 10)).join("");
    dayListArray.value = daylist;
    return daylist;
  }
};

const countProductionSalary = (listProduction) => {
  if (listProduction.length) {
    let result = listProduction.reduce((acc, current) => {
      return (acc += current.qty * current.price);
    }, 0);

    if (result) {
      let transformedResult = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        // currencyDisplay: "code",
      }).format(result);

      return transformedResult;
    }
  }
};
// Считаем остаток: сумма выполнения - сумма выработки
const countTrifleByBandProduction = (productionList: any, fundList: any) => {
  if (productionList && fundList.length) {
    // band production
    let bandProduction = productionList.reduce((acc, current) => {
      return (acc += current.qty * current.price);
    }, 0);

    // by hourly
    let bandHourly = 0;
    let wageRate = calcDynamicWageRate(fundList, productionList);
    fundList.forEach((item) => {
      let hours = item.hours.reduce((acc, current) => {
        return (acc += +current.hours);
      }, 0);

      if (wageRate) {
        bandHourly += hours * item.stakeIndex * wageRate;
      }
    });

    let result = bandProduction - bandHourly;
    let transformResult = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(result);

    return transformResult;
  }
};
// Считаем остаток: сумма выработки - сумма почасовой
const countTrifleByWageRate = (
  productionList: any,
  wageRate: any,
  fundList: any
) => {
  if (productionList && wageRate) {
    // band production
    let bandProduction = productionList.reduce((acc, current) => {
      return (acc += current.qty * current.price);
    }, 0);

    // by wagehourly
    let productionSalaryArray = [];

    fundList.forEach((item) => {
      // console.log(item);

      let sumHoursArray = [];

      item.hours.forEach((el) => {
        sumHoursArray.push(+el.hours);
      });

      let sum = sumHoursArray.reduce(
        (acc, current) => (acc += current * item.stakeIndex * wageRate),
        0
      );

      productionSalaryArray.push(sum);
    });
    let calc = productionSalaryArray.reduce(
      (acc, current) => (acc += current),
      0
    );

    let result = bandProduction - calc;
    let resultFormatted = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      // currencyDisplay: "code",
    }).format(result);

    return resultFormatted;
  } else {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      // currencyDisplay: "code",
    }).format(0);
  }
};

const setWorkHourInDay = (dayDate, sharerHours) => {
  let hour = "-";

  sharerHours.forEach((item) => {
    if (dayDate === item.date) {
      +item.hours === 0 ? (hour = "-") : (hour = item.hours);
    }
  });
  return hour;
};

const setWorkHourInToDay = (dayDate, fundList, userID) => {
  // console.log(dayDate);
  let hour = "-";
  // console.log(fundList);

  fundList.forEach((item) => {
    if (userID === item.userID) {
      item.hours.forEach((item) => {
        // console.log(`dayDate: ${dayDate}`);
        // console.log(`date: ${item.date}`);
        if (dayDate === item.date) {
          // hour = item.hours;

          +item.hours === 0 ? (hour = "-") : (hour = item.hours);
        }
      });
    }
  });

  return hour;
  // return '-'
};

// ФУНКЦИИ СУММИРОВАНИЯ (SUM, CALC, etc...)
// часы конкретного пользователя за период
const sumSharerHours = (hours) => {
  if (hours.length) {
    let array = [];
    hours.forEach((item) => {
      array.push(+item.hours);
    });

    let sum = array.reduce((acc, current) => (acc += current), 0);

    return sum === 0 ? "-" : sum;
  }
};
// Сумма всех наработанных часов за период
const sumTotalShareHours = (fundList) => {
  let num = 0;

  if (fundList.length) {
    fundList.forEach((item) => {
      if (item.hours.length) {
        item.hours.forEach((item) => {
          num += +item.hours;
        });
      }
    });
  }

  return num;
};
// ЧАСЫ * КТУ по конкретному пользователю за период
const calcHourMultiplyStakeIndex = (fundList, hours, stakeIndex, userID) => {
  // let userFund = fundList.filter((list) => list.userID === userID);

  if (hours.length) {
    let sum = sumSharerHours(hours);

    if (sum !== "-") {
      return (sum * stakeIndex).toFixed(2);
    } else {
      return "-";
    }
  } else {
    return "-";
  }
};
// Выработка зп по конкретному пользвоателю за период
const calcProductionSalary = (hours, stakeIndex, wageRate) => {
  if (hours.length && stakeIndex !== "" && wageRate !== "") {
    let sumHours = sumSharerHours(hours);

    if (sumHours !== "-") {
      // return (sumHours * stakeIndex * wageRate).toFixed(2);
      let calc = (sumHours * stakeIndex * wageRate).toFixed(2);
      let calcTransform = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(calc);
      return calcTransform;
    } else {
      return "-";
    }
  } else {
    return "-";
  }
};
// Сумма всех выработок по зп за конкретный период
const sumAllProductionSalary = (wageRate, fundList) => {
  let productionSalaryArray = [];

  fundList.forEach((item) => {
    // console.log(item);

    let sumHoursArray = [];

    item.hours.forEach((el) => {
      sumHoursArray.push(+el.hours);
    });

    let sum = sumHoursArray.reduce(
      (acc, current) => (acc += current * item.stakeIndex * wageRate),
      0
    );

    productionSalaryArray.push(sum);
  });

  let calc = productionSalaryArray
    .reduce((acc, current) => (acc += current), 0)
    .toFixed(2);
  let calcFormatted = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    // currencyDisplay: "code",
  }).format(calc);
  return calcFormatted;
};
// Сумма кту часов
const sumStakeIndexHour = (fundList) => {
  let num = 0;

  if (fundList.length) {
    fundList.forEach((item) => {
      let sumHours = 0;
      if (item.hours.length) {
        item.hours.forEach((item) => {
          sumHours += +item.hours;
        });
      }

      num += sumHours * item.stakeIndex;
    });

    return num.toFixed(2);
  }

  //   const sumTotalShareHours = (fundList) => {

  //   if (fundList.length) {
  //     fundList.forEach((item) => {
  //       if (item.hours.length) {
  //         item.hours.forEach((item) => {
  //           num += +item.hours;
  //         });
  //       }
  //     });
  //   }

  //   return num;
  // };
};

// Расчет wage rate исходя из обьема production
const calcDynamicWageRate = (fundList, listProduction) => {
  if (fundList.length && listProduction) {
    // let stakeIndexHours = sumStakeIndexHour(fundList)
    let num = 0;
    let salary = 0;

    if (fundList.length && listProduction.length) {
      fundList.forEach((item) => {
        let sumHours = 0;
        if (item.hours.length) {
          item.hours.forEach((item) => {
            sumHours += +item.hours;
          });
        }

        num += sumHours * item.stakeIndex;
      });

      // let productionSalary = countProductionSalary(productionList)
      salary = listProduction.reduce((acc, current) => {
        return (acc += current.qty * current.price);
      }, 0);

      // return num, salary
    }

    return +(salary / num).toFixed(2);
  }
};
// Расче total sum salaary by weight production
const calDynamicTotalSalaryFund = (fundList, productionList) => {
  let result = 0;
  let wageRate = calcDynamicWageRate(fundList, productionList);
  // let stakeIndexHour = sumStakeIndexHour(fundList)
  // let stakeIndexHour;
  fundList.forEach((item) => {
    let hours = item.hours.reduce((acc, current) => {
      return (acc += +current.hours);
    }, 0);

    // stakeIndexHour += item.stakeIndex   * hours
    // console.log(+hours)
    // console.log(+item.stakeIndex)
    result += hours * item.stakeIndex * wageRate;
  });

  let transformResult = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(result);

  return transformResult;
};

// TRANSLATERS
const translateFundPeriod = (periodStart, periodEnd) => {
  if (periodStart && periodEnd) {
    const oneDay = 1000 * 60 * 60 * 24;

    const date1 = new Date(periodStart);
    const date2 = new Date(periodEnd);

    let options = {
      month: "long",
    };

    const monthText = date1.toLocaleDateString("ru-Ru", options);
    let monthTextUpper = `${monthText[0].toUpperCase()}${monthText.slice(1)}`;

    let diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.round(diffInTime / oneDay) + 1;

    if (diffInDays <= 15 && date1.getDate() >= 1 && date1.getDate() <= 15) {
      return `${monthTextUpper} 1ая`;
    } else if (date1.getDate() > 15) {
      return `${monthTextUpper} 2ая`;
    } else {
      return `${monthTextUpper}`;
    }
  }
};
//
const translateProject = (projectID) => {
  if (projects.value.length) {
    let project = projects.value.find((item) => item.id === +projectID);
    return project.title;
  }
};
//
const translateDayOfWeek = (dayNumber) => {
  if (dayNumber === 0) {
    return "Вс";
  } else if (dayNumber === 1) {
    return "Пн";
  } else if (dayNumber === 2) {
    return "Вт";
  } else if (dayNumber === 3) {
    return "Ср";
  } else if (dayNumber === 4) {
    return "Чт";
  } else if (dayNumber === 5) {
    return "Пт";
  } else if (dayNumber === 6) {
    return "Сб";
  } else {
    return dayNumber;
  }
};

// TRANSFORMERS
const transformEndingTheWord = (length: number, string: string) => {
  if (string === "соучастник") {
    if (length) {
      if (length % 10 === 4 || length % 10 === 3 || length % 10 === 2) {
        return "соучастника";
      } else if (
        length % 10 === 5 ||
        length % 10 === 6 ||
        length % 10 === 7 ||
        length % 10 === 8 ||
        length % 10 === 9
      ) {
        return "соучастников";
      } else if (length % 10 === 0) {
        return "соучастник";
      } else {
        return string;
      }
    } else {
      return "соучастников";
    }
  }
};
const transformShowFundStatus = (statusObj) => {
  if (statusObj.status === "paid out") {
    return "Выплачено";
  } else if (statusObj.status === "awaiting payment") {
    return "Ожидает оплаты";
  } else if (statusObj.status === "working") {
    return "Трудимся";
  }
};
const transformFundStatusDate = (statusDate) => {
  if (statusDate === "") {
    return;
  } else {
    return statusDate;
  }
};
const transformProductionPrice = (price) => {
  if (price) {
    let transformedPrice = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
    return transformedPrice;
  }
};

// CHECK AND CREATE OR ADD
const addSharerToFund = (fundID, fundList, ownerID) => {
  // Защитку так на всякий слуай, хотя м в рендере скрываем кнопку еще...
  if (+ownerID === user.value.id) {
    // alert("add sharer to fund... В разработке...");
    currentFundID.value = fundID;
    tempSelectedFund.value = fundList;
    // console.log(funList);
  } else {
    alert("Только организатор банды может добавить соучастника к ФОТ");
  }
  // console.log(ownerID);
  // console.log(user.value.id);
};
const inviteUserToBand = () => {
  addMenuIsOpened.value = false;
  alert("Приглашение соучастник... В разработке...");
};
const inviteBandToBand = () => {
  addMenuIsOpened.value = false;
  alert("Приглашениее банды в банду... В разработке...");
};
const checkAndAddFund = (ownerID) => {
  // ownerID
  if (ownerID === user.value.id) {
    if (organization.value) {
      tempNewFund.value.bandID = +route.params.id;
      console.log(tempNewFund.value);
    }
  } else {
    alert("Только основатель банды может добавлять ФОТ");
  }

  //   const addSharerToFund = (fundID, fundList, ownerID) => {
  //   // Защитку так на всякий слуай, хотя м в рендере скрываем кнопку еще...
  //   if (+ownerID === user.value.id) {
  //     // alert("add sharer to fund... В разработке...");
  //     currentFundID.value = fundID;
  //     tempSelectedFund.value = fundList;
  //     // console.log(funList);
  //   } else {
  //     alert("Только орагнизатор банды может добавить соучастника к ФОТ");
  //   }
  //   // console.log(ownerID);
  //   // console.log(user.value.id);
  // };
};
const addProduction = () => {
  alert("В разработке...");
};

// REFRESH
const refreshSalaryFundArray = async () => {
  salaryFundArray.value = await getSalaryFunds();
  if (salaryFundArray.value) {
    salaryFundArray.value = salaryFundArray.value.filter(
      (item) => item.bandID === +route.params.id
    );
  }
};

// Установка значений Ставка, Часы, КТУ, ЗП к получению

// =================== SET WAGE RATE ====================
const setWageRate = async (ownerID, fundID, wageRate) => {
  if (ownerID !== user.value.id) {
    alert("Менять ставку может только основатель банды...");
  } else {
    console.log("доделать... setWageRate func");

    tempSetWageRate.value.rate = +wageRate;
    tempSetWageRate.value.fundID = fundID;
  }
  // alert(`Установка значения Ставки... фонд id: ${fundID}`);

  // let newWageRate = 1350;

  // обновляем в бд и обновляем переменные
  // await setWageRate(fundID, newWageRate);
};
const setWageRateDB = async () => {
  await setFundWageRate(
    tempSetWageRate.value.fundID,
    tempSetWageRate.value.rate
  );
  refreshSalaryFundArray();
  // console.log('отправляем данные в бД')
  // setFundWageRate(tempSetWageRate.value.fundID, tempSetWageRate.value.rate)
};

// SET SALARY
const setRecievedSalary = (
  fundList,
  productionList,
  hours,
  stakeIndex,
  userID
) => {
  let totalSalary = 0;
  let wageRate = 0;
  let stakeHoursIndex = 0;

  if (fundList && productionList) {
    wageRate = calcDynamicWageRate(fundList, productionList);
    // el.hours,
    // el.stakeIndex,
    // el.userID
    stakeHoursIndex = calcHourMultiplyStakeIndex(
      fundList,
      hours,
      stakeIndex,
      userID
    );
  }
  totalSalary = +wageRate * +stakeHoursIndex;

  let totalSalaryTransform = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(totalSalary);

  if (totalSalary) {
    return totalSalaryTransform;
  } else {
    return "-";
  }
};

// SET HOURS
// const setRecievedHours = async (fundID, userID, fundList) => {
//   alert(
//     `Установка значения Часов... в ФОТ id: ${fundID} для fund list user: ${userID}`
//   );
//   const result_array = JSON.parse(JSON.stringify(fundList));
//   const obj = result_array.find((el) => el.userID == userID);

//   let newHours = 61;

//   obj.hours = newHours.toString();

//   // обновляем в бд и обновляем переменные
//   await setUserFundList(fundID, result_array);
//   refreshSalaryFundArray();
// };

// ================= DELETE SHARER FROM CURRENT FUND =================
const delSharerFromCurrentFund = (fundID, fundList, userID, orgOwnerID) => {
  // Защитку так на всякий слуай, хотя м в рендере скрываем кнопку еще...
  if (+orgOwnerID === user.value.id) {
    tempDelSharerFromFund.value.fundID = +fundID;
    tempDelSharerFromFund.value.list = fundList;
    tempDelSharerFromFund.value.userID = +userID;
    // setUserFundList
  } else {
    alert("Только основатель банды может удалить соучастника из ФОТ");
  }
};
const delSharerFromCurrentFundFunc = async () => {
  let result_array = tempDelSharerFromFund.value.list.filter(
    (el) => +el.userID !== tempDelSharerFromFund.value.userID
  );

  // console.log(result_array)
  return salaryFundArray.value.map(async (fund) => {
    if (fund.id === tempDelSharerFromFund.value.fundID) {
      await setUserFundList(tempDelSharerFromFund.value.fundID, result_array);
      fund.list = result_array;
    }
  });
};

// =============== set Sharer Hour At Day ======================
const setSharerHourAtDay = (ownerID, fundID, userID, dayDate, sharerHours) => {
  if (ownerID !== user.value.id) {
    alert("Менять значение часов может только основатель банды...");
  } else {
    // console.log(ownerID);
    // console.log(fundID);
    // console.log(userID);
    // console.log(dayDate);
    // console.log(sharerHours);

    let obj = {
      id: null,
      date: "",
      hours: 0,
    };
    // let hour = 0;

    // [...sharerHours].forEach((item) => {
    //   if (userID === item.userID) {

    //     }
    // });
    obj.id = userID;
    obj.date = dayDate;
    sharerHours.forEach((el) => {
      if (dayDate === el.date) {
        obj.hours = +el.hours;
      }
    });

    // Передаем значения в переменную, используемую в модалке
    tempSetSharerHour.value.userID = obj.id;
    tempSetSharerHour.value.date = obj.date;
    tempSetSharerHour.value.hour = obj.hours;
    // Передаем значение currentFundList
    currentFundID.value = fundID;

    // console.log(obj);
  }
};
const setSharerHourAtDayDB = async () => {
  // Получаем текущую строчку из БД salary
  let fund = [...computedSalaryFund.value].find(
    (item) => item.id === currentFundID.value
  );
  // Получаем фонд зарплаты конкретного соучастника (ну где кликнули)
  const result_array = JSON.parse(JSON.stringify(fund.list));
  const sharer_hours_array = result_array.find(
    (el) => el.userID == tempSetSharerHour.value.userID
  );
  // Находим у него часы по выбранной дате (клетка которую ткнули в таблице)
  let obj = sharer_hours_array.hours.find(
    (el) => el.date === tempSetSharerHour.value.date
  );

  // Если есть значения уже - меняем их
  if (obj) {
    obj.hours = String(tempSetSharerHour.value.hour);
  }
  // Если нету - создаем и добавляем в массив дат
  else {
    sharer_hours_array.hours.push({
      date: tempSetSharerHour.value.date,
      hours: String(tempSetSharerHour.value.hour),
    });
  }

  // обновляем в бд и обновляем переменные
  await setUserFundList(currentFundID.value, result_array);
  refreshSalaryFundArray();
};

// =============== set Recieved Stake Index ====================
const setRecievedStakeIndex = async (ownerID, fundID, userID, stakeIndex) => {
  if (ownerID !== user.value.id) {
    alert("Менять значение КТУ может только основатель банды...");
  } else {
    // const obj = JSON.parse(JSON.stringify(sharerHours));
    // const obj = result_array.find((el) => el.userID == userID);

    // console.log(ownerID)
    // console.log(fundID)
    // console.log(userID)
    // console.log(stakeIndex)
    // let newStakeIndex = 0.7;

    // obj.stakeIndex = String(newStakeIndex);

    tempSetStakeIndex.value.userID = userID;
    if (stakeIndex !== "") {
      tempSetStakeIndex.value.stake = +stakeIndex;
    } else {
      tempSetStakeIndex.value.stake = 0;
    }
    // Передаем значение currentFundList
    currentFundID.value = fundID;

    // // обновляем в бд и обновляем переменные
    // await setUserFundList(fundID, result_array);
    // refreshSalaryFundArray();
  }
};
const setRecievedStakeIndexDB = async () => {
  // Получаем текущую строчку из БД salary
  let fund = [...computedSalaryFund.value].find(
    (item) => item.id === currentFundID.value
  );
  // Получаем фонд зарплаты конкретного соучастника (ну где кликнули)
  const result_array = JSON.parse(JSON.stringify(fund.list));
  const sharer_hours_obj = result_array.find(
    (el) => el.userID == tempSetStakeIndex.value.userID
  );

  if (tempSetStakeIndex.value.stake !== 0) {
    sharer_hours_obj.stakeIndex = String(tempSetStakeIndex.value.stake);
  } else {
    sharer_hours_obj.stakeIndex = "";
  }
  // обновляем в бд и обновляем переменные
  await setUserFundList(currentFundID.value, result_array);
  refreshSalaryFundArray();
  // console.log(currentFundID.value);
  console.log(tempSetStakeIndex.value);
  console.log(sharer_hours_obj);
};

// BD

// FUND LIST
// Добавляем соучастников в ФОТ SALARY BD
async function setUserFundList(salaryID, fundList) {
  let salaryFund;

  if (salaryID && fundList) {
    salaryFund = await $fetch("/api/funds/salary", {
      method: "PUT",
      body: {
        id: salaryID,
        fundList: fundList,
      },
    });
  }
}

// WAGE RATE
async function setFundWageRate(salaryID, wageRate) {
  let salaryFund;
  if (salaryID && wageRate) {
    salaryFund = await $fetch("/api/funds/salary", {
      method: "PUT",
      body: {
        id: salaryID,
        wageRate: wageRate,
      },
    });
  }
}

// Wathers
watch(choosenFundPeriod, () => {
  // console.log(choosenFundPeriod.value);
  // console.log(computedSalaryFund.value);
});
watch(currentYear, () => {
  // console.log(choosenFundPeriod.value);
  // console.log(computedSalaryFund.value);
  // При изменении года всегда показываем самую последнюю таблицу ФОТ выбранного года
  if (computedSalaryFund.value) {
    let fundByYearSet = new Set(
      computedSalaryFund.value.filter(
        (el) => el.periodEnd.slice(0, 4) === currentYear.value
      )
    );
    //
    let fundByYearArray = [...fundByYearSet];
    let lastFundInArray = fundByYearArray[fundByYearArray.length - 1];
    //
    choosenFundPeriod.value = {
      periodStart: lastFundInArray.periodStart,
      periodEnd: lastFundInArray.periodEnd,
    };
    //
  }
});
watch(periodList, () => {
  // console.log(choosenFundPeriod.value);
});
// watch(tempSetStakeIndex, () => {
//   tempSetStakeIndex.value = Math.floor(tempSetStakeIndex.value, 2)
// })
</script>

<style scoped>
/* list of sharers */
/* label #sharers-list {
  display: none;
} */
/* label #sharers-list + .sharers-list_icon {
  transform: rotate(270deg)
} */
/* label #sharers-list:checked + .sharers-list_icon {
  transform: rotate(180deg);
} */
/* .sharers-list_icon_wrapper {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}
.sharers-list_icon_wrapper p {
  margin: 0;
} */
/* .sharers-list_icon,
.sharers-list_count {
  cursor: pointer;
} */
.add-btn_wrapper,
.add-btn_menu {
  display: none;
}

.sharers-list_wrapper {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
/* .sharers-list_title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
} */
.sharers-list_item {
  position: relative;
  padding: 1rem;
  border: 1px solid var(--bs-border-color);
  border-radius: 1rem;
}
.list-item_name {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.list-item_info {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
.list-item_info p {
  margin: 0;
}
.list-item_icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.sharers-list_item:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}

.sharers-list_item-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: start;
  padding: 1rem;
  background-color: var(--bs-primary-bg-subtle);
  color: unset;
  border: unset;
  border-radius: 16px;
}

.sharers-list_item-button:hover {
  background-color: var(--bs-primary-bg-subtle);
}
.sharers-list_item-button:focus {
  color: unset;
  border: unset !important;
}

.temp-sharer-stake-index_container,
.temp-sharer-hour_container {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  gap: 1rem;
}

.temp-sharer-hour_container button,
.temp-sharer-stake-index_container button {
  border: unset;
  background-color: var(--bs-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  /* border-raaius: 100%; */
}
.temp-sharer-hour_container div,
.temp-sharer-stake-index_container div {
  width: 3rem;
  font-size: 2rem;
  text-align: center;
}

.temp-sharer-hour_container button:disabled,
.temp-sharer-stake-index_container button:disabled {
  background-color: var(--bs-tertiary-bg);
}

.temp-sharer-hour_container button:disabled span,
.temp-sharer-stake-index_container button:disabled span {
  color: var(--bs-secondary-bg);
}

.temp-sharer-hour_container button span,
.temp-sharer-stake-index_container button span {
  color: var(--bs-body-bg);
}
/* TOGGLE TITLE */
.toggle-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: scroll;
  scrollbar-width: none;
  border-bottom: 1px solid var(--bs-border-color);
  padding-bottom: 1rem;
}
.toggle-title::-webkit-scrollbar {
  display: none;
}

.switch-title_el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}
.switch-title_el label h2 {
  color: var(--bs-tertiary-color);
  white-space: nowrap;
}
.switch-title_el label h2:hover {
  cursor: pointer;
}

.switch-title_el input[type="radio"]:checked + label h2 {
  color: unset;
}

/* WAGE RATE */
.wage-rate_container {
  margin-top: 1rem;
}
.wage-rate_container span {
  /* background-color: var(--bs-border-color); */
  /* padding: 4px 10px; */
  /* border-radius: 16px; */
}
.wage-rate_container span:hover {
  cursor: pointer;
  /* background-color: var(--bs-primary-bg-subtle); */
  color: var(--bs-primary);
}

.item_phone {
  margin-top: 1rem;
}
.item_phone a {
  text-decoration: none;
}
.item_phone a:active,
.item_phone a:focus {
  border: none;
}

/* .item_phone_pointer-events_none {
  pointer-events: none;
} */

.link:hover {
  cursor: pointer;
  color: var(--bs-primary);
}
.fund-hours_container {
  margin-top: 1rem;
}
.filter-fund_wrapper {
  overflow-x: scroll;
  scrollbar-width: none;
}
.filter-fund_wrapper::-webkit-scrollbar {
  display: none;
}
.filter-fund_select {
  padding: 4px 10px;
  border-radius: 16px;
  background-color: var(--bs-primary-bg-subtle);
  border: unset;
  outline: unset;
  cursor: pointer;
  appearance: none;
}
.filter-fund_period {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.filter-fund_period-el input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}
.filter-fund_period-el label {
  cursor: pointer;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  background-color: var(--bs-border-color);
  white-space: nowrap;
}
.filter-fund_period-el input[type="radio"]:checked + label {
  background-color: var(--bs-body-color);
  color: var(--bs-body-bg);
}
.table-fund_container {
  margin-top: 2rem;
  /* padding-top: 1rem; */
  /* border-top: 1px solid var(--bs-border-color); */
}
.table-fund_status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.status_awaiting-payment,
.status_paid-out {
  /* padding: 4px 10px; */
  /* border-radius: 16px; */
}
.status_awaiting-payment {
  color: var(--bs-warning);
  /* background-color: var(--bs-warning-bg-subtle); */
}
.status_paid-out {
  color: var(--bs-success);
  /* background-color: var(--bs-success-bg-subtle); */
}
.list-el_wrapper {
  /* display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem; */
}
.list-el_wrapper > p {
  margin: 0;
}

/* PROJECTS */
.projects_container {
  margin-top: 1rem;
}
.project_wrapper {
  padding: 1rem;
}
/* .project_wrapper:not(:first-child) {
  margin-top: 1rem;
} */
.project_wrapper:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}

/* Таблица ФОТ */
/* График учета часов работы */
.table_hours,
.table_fund {
  overflow-x: scroll;
  scrollbar-width: none;
}
.table_hours::-webkit-scrollbar,
.table_fund::-webkit-scrollbar {
  display: none;
}
.working-hours_wrapper {
  width: 100%;
}

.working-hours_wrapper thead {
  border-bottom: 1px solid var(--bs-primary);
}
.working-hours_wrapper thead th {
  padding-bottom: 1rem;
}
.working-hours_wrapper thead th div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.working-hours_wrapper tbody tr:not(:last-child) {
  border-bottom: 1px solid var(--bs-border-color);
}

.working-hours_wrapper tbody tr td {
  padding: 1rem;
}

.working-hours_wrapper tbody tr:not(:last-child):hover {
  background-color: var(--bs-border-color) !important;
  cursor: pointer;
}

/* .working-hours_wrapper tbody tr:hover .working-hours_sharer {
  background-color: var(--bs-border-color);
} */

.working-hours_sum {
  text-align: center;
  width: max-content;
}
.working-hours_sharer_wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.working-hours_sharer {
  width: max-content;
  white-space: nowrap;
  padding-left: unset !important;
  /* Для скролла */
  /* position: fixed; */
  /* background-color: var(--bs-body-bg); */
}
.working-hours_sharer_btn-del {
  color: red;
}
.working-hours_add-sharer_btn {
  margin: 0 1rem;
}
.add_production_btn:hover {
  cursor: pointer;
}
.working-hours_add-sharer_btn:hover {
  cursor: pointer;
}

.hour-per-day_cell {
  cursor: pointer;
  text-align: center;
  /* transition: all 0.1s ease-in; */
}
.hour-per-day_cell:hover {
  color: var(--bs-primary);
  background-color: var(--bs-primary-bg-subtle);
}
.table {
  /* margin-top: 1rem; */
  width: 100%;
}
.item-table_header tr,
.table-row_wrapper {
  padding: 0;
  /* width: 100%; */
  /* display: flex; */
  /* display: inline-grid; */
  /* grid-template-columns: 60px 1fr 50px 50px 1fr 1fr 1fr; */
  /* border: unset!important */
}
.item-table_header tr {
  border-bottom: 1px solid var(--bs-primary);
}
.table-row_wrapper:not(:last-child) {
  border-bottom: 1px solid var(--bs-border-color);
}
/* .item-table_header tr th {
  
} */
.item-table_header tr th,
.table-row_wrapper td {
  padding: 1rem;
  /* padding-left: 1rem;
  padding-right: 1rem; */
  /* display: flex;
  align-items: center;
  justify-content: center; */
  text-align: center;
  vertical-align: middle;
  border: unset;
  width: max-content;
}

.table-row_wrapper:not(:last-child):hover td {
  background-color: var(--bs-border-color) !important;
  cursor: pointer;
}

/* .table-row_wrapper:hover .recieved-data-to-change:hover {
  background-color: var(--bs-primary-bg-subtle) !important;
  color: var(--bs-primary);
} */

.production-header_wrapper tr,
.production-body_wrapper tr {
  display: grid !important;
  grid-template-columns: 100px 1fr 1fr;
  /* gap: 1rem; */
  /* position: relative; */
}
.production-body_wrapper tr {
  border-bottom: 1px solid var(--bs-border-color);
}
.production-body_wrapper tr:hover td {
  cursor: pointer;
  background-color: var(--bs-border-color) !important;
}
.production-header_wrapper {
  border-bottom: 1px solid var(--bs-primary);
}

.production-header_wrapper tr th {
  border: unset;
}
.production-header_date {
  display: flex;
  align-items: center;
}
.production-header_date p {
  margin: 0;
}
.production-header_desc {
  display: flex;
}

.production-header_desc div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.production-header_desc div p {
  margin: 0;
}

.production-header_value {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.production-header_value div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.production-header_value div p {
  margin: 0;
}

.production-body_wrapper tr:last-child {
  border: unset;
}
.production-body_wrapper tr td {
  border: unset;
}

.production-body_date {
  white-space: nowrap;
  display: flex;
  align-items: center;
}
.production-body_date p {
  margin: 0;
}

.production-body_desc p {
  margin: 0;
}
.production-body_desc-project {
  font-size: 0.8rem;
  margin-left: 0.5rem;
  padding: 0.1rem 0.3rem;
  color: var(--bs-success);
  background-color: var(--bs-success-bg-subtle);
}
.production-body_desc-desc {
  margin: 0;
  font-size: 0.8rem;
  color: var(--bs-tertiary-color);
}

.production-body_qty {
  text-align: end;
}
.production-body_qty p {
  margin: 0;
}
.production-body_qty-qty {
  margin: 0;
  font-size: 0.8rem;
  color: var(--bs-tertiary-color);
}

/* SEARCH ADDING SHARER TO FUND */
.partners-search_wrapper {
  position: fixed;
  /* top: 0;
  left: 0; */
  width: 80%;
  overflow: scroll;
  margin-top: -1rem;
  margin-left: -1rem;
}
.partners-search_wrapper input {
  background-color: var(--bs-light);
  padding: 1rem;
  padding-left: 2.2rem;
}
.partners-search_wrapper input {
  border-radius: unset !important;
  border: unset;
}
.partners-search_wrapper input:focus {
  border: unset;
  outline-width: 0 !important;
  outline: none !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
.partners-search_wrapper input,
.partners-search_wrapper input:focus {
  border-bottom: 1px solid var(--bs-border-color);
}
.partners-search_wrapper svg {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0.5rem;
}

.partners-search_list {
  display: flex;
  flex-direction: column;
  /* gap: 1rem; */
}
.search-item_wrapper {
  position: relative;
  width: 100%;
  display: flex;
  border-bottom: 1px solid var(--bs-border-color);
}
.search-item_wrapper:last-child {
  border-bottom: none;
}
.search-item_wrapper label {
  /* background-color: gray; */
  /* position: relative; */
  width: 100%;
  cursor: pointer;
  padding: 1rem 0;
}
/* .search-item_wrapper label:before {
  content: '';
  position: absolute;
  right: 1rem;
  width: 7px;
  height: 2rem;
  background-color: red;
  transform: rotate(45deg)
} */
.search-item_wrapper input[type="checkbox"] {
  /* position: absolute;
  top: 1rem;
  left: 0; */
  opacity: 0;
  z-index: -1;
  width: 0;
}
.search-item_wrapper input[type="checkbox"] + label {
  padding-left: 1rem;
}
.search-item_wrapper input[type="checkbox"]:checked + label {
  background-color: var(--bs-success-bg-subtle);
  width: 100%;
}
.search-item_wrapper input[type="checkbox"]:checked + label:after,
.search-item_wrapper input[type="checkbox"]:checked + label:before {
  content: '';
  position: absolute;
  width: 7px;
  background-color: var(--bs-success);
  margin-right: 1rem;
}

.search-item_wrapper input[type="checkbox"]:checked + label:after {
  /* \ */
  /* content: ''; */
  /* position: absolute; */
  top: 1.5rem;
  right: 2rem;
  /* width: 7px; */
  height: 1.2rem;
  transform: rotate(-45deg);
  /* background-color: var(--bs-success); */
}
.search-item_wrapper input[type="checkbox"]:checked + label:before {
  /* / */
  /* content: ''; */
  top: 10px;
  /* position: absolute; */
  right: 1rem;
  /* width: 7px; */
  height: 2rem;
  transform: rotate(45deg);
  /* background-color: var(--bs-success); */
}

@media screen and (max-width: 575px) {
  .band-info_wrapper {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .sharers-list_container {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .filter-fund_wrapper,
  .toggle-title,
  .fund-options_container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .sharers-list_wrapper {
    grid-template-columns: 1fr;
    /* margin: 0 1rem; */
  }
  .fund_container,
  .production-none_wrapper,
  .warehouse-items_container {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .production-none_wrapper p {
    margin: 0;
  }
  .production-none_wrapper p span {
    color: var(--bs-primary);
  }
}

@media screen and (min-width: 576px) {
  .sharers-list_wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 767px) {
  .show-max-767 {
    display: none;
  }
  .toggle-title {
    border: unset;
    padding-bottom: unset;
  }
  .sharers-list_wrapper {
    margin-top: 1rem;
  }
  .sharers-list_item-button {
    display: none;
  }
  .add-btn_wrapper {
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    background-color: var(--bs-primary) !important;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 64px;
    height: 64px;
    border-radius: 100%;
    box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
  .add-btn_wrapper svg {
    color: var(--bs-body-bg) !important;
  }
  .add-btn_menu {
    z-index: 100;
    display: flex;
    align-items: flex-end;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .add-btn_menu-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    /* height: 25%; */
    padding: 1rem;
    padding-top: 2rem;
    background-color: var(--bs-body-bg);
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }
  .add-btn_menu-item {
    background-color: var(--bs-primary-bg-subtle);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 1rem;
    padding: 1rem;
  }
}

@media screen and (min-width: 768px) {
  .sharers-list_wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
  /* .fund-hours_container {
    margin-top: 1rem;
  } */
  .no-sharers_wrapper {
    display: none;
  }
}

@media screen and (min-width: 992px) {
  .sharers-list_wrapper {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (min-width: 992px) {
}

@media screen and (min-width: 1200px) {
}

@media screen and (max-width: 1399px) {
  .table_hours {
    /* position: relative; */
    overflow: auto;
  }
  .working-hours_wrapper thead {
    position: sticky;
    top: 0;
    /* table-layout: fixed; */
  }
  .working-hours_wrapper tbody tr {
    /* position: relative; */
    /* position: absolute;
    top: 0;
    left: 0; */
  }
  .working-hours_wrapper tbody tr .working-hours_sharer {
    /* color: red; */
    /* position: sticky; */
  }
}

@media screen and (min-width: 1400px) {
}

/* working-hours_wrapper tbody tr working-hours_sharer*/
/* working-hours_sharer */
</style>
