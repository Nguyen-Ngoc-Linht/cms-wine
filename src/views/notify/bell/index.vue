<template>
  <div class="bell-container">
    <el-dropdown
      :key="uuid"
      ref="notifyDropdown"
      class="alarm-container right-menu-item hover-effect"
      trigger="click"
      placement="bottom-start"
      @visible-change="showNotifyList"
    >
      <div class="alarm-wrapper">
        <svg-icon
          class-name="bell-icon"
          icon-class="bell"
        />
        <span v-show="numberNotify > 0">
          <template v-if="numberNotify < 100">{{ numberNotify }}</template>
          <template v-else>99+</template>
        </span>
      </div>
      <template #dropdown>
        <!--                <el-dropdown-menu class="notify-bell-dropdown">-->
        <!--                  <el-card-->
        <!--                    v-if="isShowNotify"-->
        <!--                    v-loading="listLoading"-->
        <!--                    shadow="never"-->
        <!--                    class="box-card-notify scroll-bar relative"-->
        <!--                    :body-style="{ padding: '15px' }"-->
        <!--                  >-->
        <!--                    <template v-if="list && list.length > 0">-->
        <!--                      <div-->
        <!--                        v-for="(item, key) in list"-->
        <!--                        :key="key"-->
        <!--                        class="notify"-->
        <!--                      >-->
        <!--                        <el-row-->
        <!--                          :gutter="10"-->
        <!--                          class="notify-item"-->
        <!--                          :class="{ 'not-viewed': !item.seen }"-->
        <!--                          @click="handleRowClick(item)"-->
        <!--                        >-->
        <!--                          <el-col-->
        <!--                            :span="24"-->
        <!--                            style="padding: 8px 16px"-->
        <!--                          >-->
        <!--                            <h6>{{ item.title || '' }}</h6>-->
        <!--                            <div class="noti-content d-flex">-->
        <!--                              <div-->
        <!--                                class="noti-content"-->
        <!--                                v-html="replaceContent(item.content)"-->
        <!--                              />-->
        <!--                            </div>-->
        <!--                            <div class="noti-date margin-right-16 text-right color-#76809b">-->
        <!--                              {{ formatDateTime(item.createTime) }}-->
        <!--                            </div>-->
        <!--                          </el-col>-->
        <!--                          <el-col-->
        <!--                            :span="24"-->
        <!--                            class="p-0 margin-left-5"-->
        <!--                          >-->
        <!--                            <el-divider-->
        <!--                              v-if="key < list.length - 1"-->
        <!--                              class="my-0 margin-top-8"-->
        <!--                            />-->
        <!--                          </el-col>-->
        <!--                        </el-row>-->
        <!--                      </div>-->
        <!--                    </template>-->
        <!--                    <template v-else>-->
        <!--                      <div class="empty-notify">Không có thông báo!</div>-->
        <!--                    </template>-->
        <!--                    <div class="clear-fix" />-->
        <!--                    <template #footer>-->
        <!--                      <div>-->
        <!--                        <el-button type="primary" @click="loadMoreNotify">Xem thêm</el-button>-->
        <!--                      </div>-->
        <!--                    </template>-->
        <!--                  </el-card>-->
        <!--                </el-dropdown-menu>-->
        <!--        menu new-->
        <div class="box-card-notify scroll-bar">
          <div class="sticky-title">
            <div class="flex justify-between items-center">
              <div class="heading">
                <h5>{{ t('notify.notifyBell') }}</h5>
              </div>
              <!--             <div>-->
              <!--               <router-link to="/notify/notify">-->
              <!--                 <el-link-->
              <!--                   type="primary"-->
              <!--                   style="border-bottom: 1px solid #0078d4"-->
              <!--                   class="mt-0 text-center font-weight-bold text-[#0078d4]"-->
              <!--                   >{{ t('notify.viewAll') }}-->
              <!--                 </el-link>-->
              <!--               </router-link>-->
              <!--             </div>-->
            </div>
          </div>
          <div v-if="list && list.length > 0">
            <el-dropdown-item
              v-for="(item, index) in list"
              :key="index"
              class="notify"
            >
              <el-row
                :gutter="10"
                class="notify-item"
                :class="{ 'not-viewed': !item.seen }"
                @click="handleRowClick(item)"
              >
                <el-col
                  :span="24"
                  style="padding: 8px 16px"
                >
                  <h6>{{ item.title || '' }}</h6>
                  <div class="noti-content d-flex">
                    <div
                      class="noti-content"
                      v-html="replaceContent(item.content)"
                    />
                  </div>
                  <div class="noti-date margin-right-16 text-right color-#76809b">
                    {{ formatDateTime(item.createTime) }}
                  </div>
                </el-col>
                <el-col
                  :span="24"
                  class="p-0 margin-left-5"
                >
                  <el-divider
                    v-if="index < list.length - 1"
                    class="my-0 margin-top-8"
                  />
                </el-col>
              </el-row>
            </el-dropdown-item>
            <!-- Nút "Xem thêm" cố định ở dưới cùng -->
            <div
              class="sticky-button"
              v-if="list.length < totalItem"
            >
              <el-button
                type="primary"
                @click="loadMoreNotify"
                >{{ t('configUser.seeMore') }}</el-button
              >
            </div>
          </div>
          <template v-else>
            <div class="empty-notify">{{ t('weightStation.noData') }}</div>
          </template>
          <div class="clear-fix" />
        </div>
      </template>
    </el-dropdown>
    <NotifyDialog
      @getCountNotify="getCountNotify"
      @receiveNotifySocket="receiveNotifySocket"
      :numberNoti="numberNotify"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { getNotifyList, readNotify, countNotify, getReceiveNotify } from '@/api/notify.js'
import { useUserStore, useNotifyStore } from '@/store'
import { formatDateTime } from '@/utils/date'
import NotifyDialog from './notify-dialog'
import { useI18n } from '@/locale'

const { t } = useI18n()
const notifyStore = useNotifyStore()
const userStore = useUserStore()
const list = ref([])
const totalValue = ref(0)
const totalItem = ref(0)
const listLoading = ref(true)
let timeoutId
const flagLoadMore = ref(true)
const params = ref({
  limit: 10,
})

onMounted(() => {
  getList()
})
const getList = () => {
  listLoading.value = true
  const userId = userStore.uuid

  notifyStore
    .apiGetNotifyByUser(params.value, userId)
    .then(res => {
      if (res.status === 200) {
        list.value = res.data.content
        totalItem.value = res.data.totalElements
        getCountNotify()
        if (!isShowNotify.value) {
          timeoutId = setTimeout(getList, 60000)
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      listLoading.value = false
    })
}
const updateList = () => {
  listLoading.value = true
  const userId = userStore.uuid

  notifyStore
    .apiUpdateNotifyByUser(userId)
    .then(res => {
      if (res.status === 200) {
        // list.value = res.data.content
        // getCountNotify()
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      listLoading.value = false
    })
}

const numberNotify = computed(() => {
  return notifyStore.numberNotify ?? 0
})

const getCountNotify = async () => {
  // countNotify({
  //   app: 'OMS',
  // })
  //   .then(res => {
  //     if (res.status == 200) {
  //       const { data } = res
  //       totalValue.value = data ? data.countNotiNotRead : 0
  //       notifyStore.SET_NUMBER_NOTIFY(totalValue.value)
  //     }
  //   })
  //   .catch(_ => {})
  totalValue.value = list.value.length > 0 ? list.value.filter(item => !item.seen).length : 0
  notifyStore.SET_NUMBER_NOTIFY(totalValue.value)
}
const handleReadNotify = async row => {
  const param = {
    userId: userStore.uuid,
    notiId: row.id,
  }
  const { status } = await readNotify(param)
  if (status === 200) {
    setTimeout(() => {
      getList()
      getCountNotify()
    }, 2000)
  }
}

const handleRowClick = row => {
  // if (row.statusView === 0) {
  //   handleReadNotify(row)
  // }
  // // handleRedirect(row)
  // handleRedirectWeight({
  //   routerName: 'omsWeightSessionDetail',
  //   id: row.objectData.id,
  //   startTime: moment(new Date(row.objectData.startTime)).format('YYYY-MM-DD HH:mm:ss'),
  // })
}

const uuid = computed(() => {
  let dt = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
})

const replaceContent = content => {
  if (content) {
    if (typeof content === 'object') {
      return 'Vị trí: ' + content.site.site_name + '<br>' + 'Nguồn: ' + content.sourceName
    } else {
      return content.replace(/\n/g, '<br>')
    }
  }
  return ''
}

const notifyDropdown = ref()
const isShowNotify = ref(false)

const showNotifyList = isShow => {
  isShowNotify.value = isShow
  notifyDropdown.value.handleClose()
  if (isShow) {
    updateList()
    clearTimeout(timeoutId)
    notifyDropdown.value.handleOpen()
  } else {
    params.value.limit = 10
    getList()
  }
}

const getReceiveNotifyStatus = async () => {
  const { data } = await getReceiveNotify({
    userId: userStore.uuid,
    appName: 'OMS',
  })

  notifyStore.SET_IS_RECEIVE_NOTIFY(data)
}

// getReceiveNotifyStatus()

const receiveNotifySocket = () => {
  setTimeout(() => {
    getList()
  }, 2000)
}
const loadMoreNotify = () => {
  params.value.limit += 10
  getList()
}
onBeforeUnmount(() => {
  clearTimeout(timeoutId)
})
</script>
<style lang="scss" scoped>
.bell-icon {
  width: 24px !important;
  height: 24px !important;
}

.notify-title {
  padding: 12px 16px;
  height: 54px;

  .heading {
    h5 {
      font-weight: 500;
      font-size: 20px;
      margin-bottom: 0;
    }
  }
}

.box-card-notify {
  max-height: 85vh;
  overflow-y: auto !important;
  width: 340px;
  :deep(.el-dropdown-menu__item) {
    white-space: normal !important;
  }
  .empty-notify {
    padding: 12px 16px;
  }

  .sticky-title {
    position: sticky;
    height: 54px;
    top: 0;
    background-color: white;
    padding: 12px 16px;
    text-align: center;
    border-bottom: 1px solid #ddd; /* Đường viền dưới để phân cách */
    z-index: 1; /* Đảm bảo tiêu đề nằm trên các mục */
    .heading {
      h5 {
        font-weight: 500;
        font-size: 20px;
        margin-bottom: 0;
      }
    }
  }

  .sticky-button {
    position: sticky;
    bottom: 0;
    background-color: white;
    padding: 10px;
    text-align: center;
  }

  :deep(.el-card__footer) {
    position: fixed;
    bottom: 0;
  }

  .notify {
    padding-bottom: 0;
    background: #f1fbff;

    &-item {
      margin-top: 0;
      padding-bottom: 0;
      cursor: pointer;
      width: 100%;
      margin-right: 0;

      h6 {
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #212633 !important;
      }

      & .noti-date,
      & .noti-content {
        font-size: 14px;
        word-break: break-word;
        padding-right: 5px;
        color: #212633;

        p {
          display: inline !important;
        }
      }

      &.not-viewed::before {
        content: '';
        position: absolute;
        top: calc(50% - 10px);
        right: 5px;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background-color: #2e89ff;
      }

      &:not(.not-viewed) {
        background: #ffffff;

        &:hover {
          background: #dddce9;
        }

        img {
          filter: opacity(0.6);
        }
      }
    }

    &:hover {
      background-color: #dddce9;
    }
  }
}

.alarm-container {
  position: relative;

  .alarm-wrapper {
    font-weight: bold;

    span {
      background-color: #ff0000;
      position: absolute;
      top: 0px;
      right: 2px;
      height: 18px;
      width: 18px;
      padding-top: 4px;
      text-align: center;
      border-radius: 100%;
      font-size: 10px;
      line-height: 10px;
      overflow: hidden;
      color: #ffffff;
    }
  }
}

.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;

  &.hover-effect {
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}
</style>
