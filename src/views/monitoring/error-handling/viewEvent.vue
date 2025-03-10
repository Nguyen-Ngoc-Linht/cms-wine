<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backErrorHandling()"
        >
          <img src="@/assets/imgs/weightStation/back.png" />
        </div>
        <div
          v-if="!isEdit && roleData.canCreate"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('monitoring.errorHandling.addEvent') }}
        </div>
        <div
          v-if="isEdit && roleData.canUpdate"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.editUser') }}
        </div>
      </h5>
      <div class="flex">
        <el-button
          type="default"
          @click="backErrorHandling()"
          class="bg-outline-secondary"
          >{{ $t('configUser.closed') }}
        </el-button>
        <el-button
          :loading="processing"
          v-if="!isEdit && roleData.canCreate"
          @click="handleAddEvent"
          class="el-button--main"
          >{{ $t('omsSetting.save') }}
        </el-button>
        <el-button
          :loading="processing"
          v-if="isEdit && roleData.canUpdate"
          @click="handleUpdateEvent()"
          class="el-button--main"
          >{{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
    <!--  Content  -->
    <div class="content-page px-6 mt-4">
      <div
        v-if="roleData.canCreate || roleData.canUpdate"
        class="bg-white px-5 pt-6 pb-4 mb-4"
      >
        <el-form
          ref="infoEventErrorHandling"
          :rules="ruleEdit"
          :model="infoEvent"
          class="custom-form"
        >
          <h4 class="text-black font-semibold text-2xl">
            {{ $t('monitoring.errorHandling.infoEvent') }}
          </h4>
          <div class="flex justify-between gap-5 mt-4">
            <div style="width: 50%">
              <el-form-item
                :label="t('monitoring.errorHandling.nameEvent')"
                prop="name"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoEvent.name"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.gland')"
                prop="route.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoEvent.route.id"
                  clearable
                  filterable
                  collapse-tags
                  @change="
                    value => {
                      setSelectStation(value)
                    }
                  "
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                >
                  <el-option
                    v-for="item in listRoute"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="t('monitoring.errorHandling.typeEvent')"
                prop="eventType"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoEvent.eventType"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                >
                  <el-option
                    v-for="item in listTypeEvent"
                    :key="item.key"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.station')"
                prop="station.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoEvent.station.id"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="
                    value => {
                      setListLane(value)
                    }
                  "
                  :placeholder="$t('configUser.pleaseSelect')"
                >
                  <el-option
                    v-for="item in listStation"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="t('report.time')"
                prop="time"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  v-model="infoEvent.time"
                  type="daterange"
                  :start-placeholder="t('el.datepicker.startTime')"
                  :range-separator="t('el.datepicker.to')"
                  :end-placeholder="t('el.datepicker.endTime')"
                  clearable
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="DD/MM/YYYY"
                  style="flex: 1"
                  :disabled-date="disabledDate"
                />
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.lane')"
                prop="laneIds"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoEvent.laneIds"
                  clearable
                  filterable
                  multiple
                  collapse-tags
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                >
                  <el-option
                    v-for="item in listLane"
                    :key="item.id"
                    :label="item.number + ' - ' + item.type"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="w-full">
            <el-form-item
              :label="t('monitoring.errorHandling.contentEvent')"
              prop="content"
              class="custom w-full"
              style="display: inline-block; width: 100%"
            >
              <el-input
                v-model="infoEvent.content"
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 10 }"
                maxlength="5000"
                style="width: 100%"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
          <div class="w-full mt-4">
            <h6 class="font-bold text-base custom">
              {{ t('monitoring.requestProcessingETC.attachedPhoto') }}
            </h6>
            <el-upload
              v-model:file-list="infoEvent.listImage"
              class="avatar-uploader mt-3 custom-upload-list w-full"
              drag
              :on-success="null"
              :on-preview="null"
              :on-remove="handleRemove"
              :on-change="
                (file, fileList) => {
                  handleChangeFile(file, fileList, 2)
                }
              "
              :before-remove="beforeRemove"
              :on-exceed="null"
              :auto-upload="false"
              list-type="picture-card"
              multiple
              accept=".jpg,.png"
            >
              <svg-icon
                icon-class="import-dialog"
                class="width-50 height-50"
              />
              <p
                class="drag-note my-2 font-semibold"
                style="color: #7c7e81"
              >
                {{ t('configUser.importImage') }}
              </p>
              <p
                class="file-note text-center"
                style="color: #a4a6a7"
              >
                ({{ $t('configUser.importLimitAndType', ['Jpg/Png', '10MB']) }})
              </p>
            </el-upload>
          </div>
          <div class="w-full mt-4">
            <h6 class="font-bold text-base custom">{{ t('monitoring.rating.fileRating') }}</h6>
            <el-upload
              v-model:file-list="infoEvent.listFile"
              class="avatar-uploader mt-3"
              drag
              :on-success="null"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-exceed="null"
              :auto-upload="false"
              :on-change="
                (file, fileList) => {
                  handleChangeFile(file, fileList, 1)
                }
              "
              multiple
              accept=".pdf"
            >
              <svg-icon
                icon-class="import-dialog"
                class="width-50 height-50"
              />
              <p
                class="drag-note my-2 font-semibold"
                style="color: #7c7e81"
              >
                {{ t('configUser.importDrag') }}
              </p>
              <p
                class="file-note"
                style="color: #a4a6a7"
              >
                ({{ $t('configUser.importLimitAndType', ['Pdf', '10MB']) }})
              </p>
            </el-upload>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { getListRoute, getListStation } from '@/api/expressway'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiCreateEvent, apiGetDetailEvent, apiUpdateEvent } from '@/api/errorHandling'
import { uploadFile } from '@/api/rating'
import { usePermissionStore, useRouteUser } from '@/store'
import { useConfig } from '@/config'

const { t } = useI18n()
const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const router = useRouter()
const route = useRoute()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const ruleEdit = ref({
  name: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  eventType: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  route: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  station: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  laneIds: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  time: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  content: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 5000, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
})
const listTypeEvent = ref([
  {
    key: 0,
    value: 0,
    name: t('monitoring.errorHandling.maintenancePlan'),
  },
  {
    key: 1,
    value: 1,
    name: t('monitoring.errorHandling.periodicInspectionAndAcceptancePlan'),
  },
  {
    key: 2,
    value: 2,
    name: t('monitoring.errorHandling.monitoringAndEvaluationPlan'),
  },
  {
    key: 3,
    value: 3,
    name: t('monitoring.errorHandling.reportProblem'),
  },
])
const listRoute = ref([])
const listStation = ref([])
const listLane = ref([])
const isEdit = ref(false)
const infoEventErrorHandling = ref(null)
const infoEvent = ref({
  route: {
    id: '',
  },
  station: {
    id: '',
  },
})
const processing = ref(false)

onMounted(() => {
  setDataDefault()
  initData()
})

const setDataDefault = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
}
const initData = async () => {
  const event_id = route.params.id
  if (event_id) {
    isEdit.value = true
    const rs = await apiGetDetailEvent(event_id)
    if (rs.status === 200) {
      infoEvent.value = rs.data
      await setDataList()
      await setListFileDefault()
    }
  }
}
const setDataList = async () => {
  const params = {
    page: 1,
    size: 20,
    keyword: '',
    routeIds: [infoEvent.value.route.id],
    unitIds: [],
  }
  const rs = await getListStation(params)
  if (rs.status === 200) {
    listStation.value = rs.data.dataRows
  } else {
    listStation.value = []
  }
  const station = infoEvent.value.station
  infoEvent.value.time = []
  infoEvent.value.time[0] = infoEvent.value.startTime
  infoEvent.value.time[1] = infoEvent.value.endTime
  // eslint-disable-next-line array-callback-return
  listStation.value.map(item => {
    if (item.id === station.id) {
      listLane.value = item.lanes
    }
  })
  infoEvent.value.laneIds = []
  const lanes = infoEvent.value.lanes
  const length = lanes.length
  for (let i = 0; i < length; i++) {
    infoEvent.value.laneIds.push(lanes[i].id)
  }
}
const setListFileDefault = async () => {
  const listFile = infoEvent.value.fileVaults
  infoEvent.value.fileVaultIds = []
  infoEvent.value.listFile = []
  infoEvent.value.listImage = []
  for (const file of listFile) {
    if (file.fileCategory === 2) {
      infoEvent.value.listImage.push({
        name: file.fileName,
        url: `${baseUrl.value}${file.filePath}`,
      })
    } else if (file.fileCategory === 1) {
      infoEvent.value.listFile.push({
        name: file.fileName,
        url: `${baseUrl.value}${file.filePath}`,
      })
    }
    infoEvent.value.fileVaultIds.push(file.id)
  }
}
const handleAddEvent = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    transformData()
    // console.log(infoEvent.value)
    const rs = await apiCreateEvent(infoEvent.value)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backErrorHandling()
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const handleUpdateEvent = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const event_id = route.params.id
    if (event_id) {
      const rs = await apiUpdateEvent(event_id, infoEvent.value)
      if (rs.status === 200) {
        ElMessage({
          message: t('configUser.message.updateSuccess'),
          type: 'success',
          duration: 3 * 1000,
        })
        backErrorHandling()
      }
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    infoEventErrorHandling.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const transformData = () => {
  infoEvent.value.stations = []
  infoEvent.value.lanes = []
  if (!Array.isArray(infoEvent.value.laneIds) || !infoEvent.value.laneIds) {
    infoEvent.value.laneIds = []
  }
  // eslint-disable-next-line array-callback-return
  infoEvent.value.laneIds.map(item => {
    infoEvent.value.lanes.push({
      id: item,
    })
  })
  infoEvent.value.startTime = infoEvent.value.time[0]
  infoEvent.value.endTime = infoEvent.value.time[1]
}
const setSelectStation = async id => {
  listStation.value = []
  infoEvent.value.station = {
    id: '',
  }
  const route_id = id
  if (route_id) {
    const params = {
      page: 1,
      size: 20,
      keyword: '',
      routeIds: [route_id],
      stationIds: [],
      unitIds: [],
    }
    const listStationUser = routeUser.GET_STATIONS(route_id)
    if (listStationUser.length > 0) {
      params.stationIds = listStationUser
    }
    const rs = await getListStation(params)
    if (rs.status === 200) {
      listStation.value = rs.data.dataRows
    } else {
      listStation.value = []
    }
  }
}
const setListLane = async data => {
  listLane.value = []
  infoEvent.value.laneIds = []
  // eslint-disable-next-line array-callback-return
  listStation.value.map(item => {
    if (item.id === data) {
      listLane.value = item.lanes
    }
  })
}
const backErrorHandling = () => {
  router.push(`/monitoring/error-handling`)
}
const disabledDate = time => {
  return time.getTime() < Date.now()
}
const handleChangeFile = async (file, fileList, type) => {
  const isAllowedSize = file.size / 1024 / 1024 < 10
  if (!isAllowedSize) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error(t('configUser.message.overflowMaxSize', ['10']))
    return false
  }
  if (type === 1) {
    const allowedTypes = ['application/pdf']
    if (!allowedTypes.includes(file.raw.type)) {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error('File không đúng định dạng pdf')
      return false
    }
  } else if (type === 2) {
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.raw.type)) {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error('File không đúng định dạng .jpg/.png')
      return false
    }
  }
  const fileToUpload = file.raw || file
  if (!fileToUpload || !(fileToUpload instanceof File)) {
    console.error('Invalid file provided:', file)
    return
  }
  const formData = new FormData()
  formData.append('file', fileToUpload)
  formData.append('keepFileName', true)
  formData.append('mainEntityName', 'requestProcessing')
  formData.append('fileCategory', type)

  const rs = await uploadFile(formData)
  if (rs.status === 200) {
    const idFile = rs.data.data[0].id
    if (!Array.isArray(infoEvent.value.fileVaultIds) || !infoEvent.value.fileVaultIds) {
      infoEvent.value.fileVaultIds = []
    }
    infoEvent.value.fileVaultIds.push(idFile)
    if (!Array.isArray(infoEvent.value.fileVaults) || !infoEvent.value.fileVaults) {
      infoEvent.value.fileVaults = []
    }
    infoEvent.value.fileVaults.push(rs.data.data[0])
  }
}
const handlePreview = file => {
  if (file.url) {
    window.open(file.url, '_blank')
  } else if (file.raw) {
    const fileUrl = URL.createObjectURL(file.raw)
    window.open(fileUrl, '_blank')
  } else {
    ElMessage.error('Không thể xem trước file này')
  }
}
const beforeRemove = () => {
  return ElMessageBox.confirm(t('administration.ip.confirmDeleteFile'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  }).then(
    () => true,
    () => false
  )
}
const handleRemove = file => {
  const item = infoEvent.value.fileVaults
  const length = item.length
  let id_file = ''
  for (let i = 0; i < length; i++) {
    if (file.name === item[i].fileName) {
      id_file = item[i].id
      break
    }
  }
  infoEvent.value.fileVaults = infoEvent.value.fileVaults.filter(item => item.id !== id_file)
  infoEvent.value.fileVaultIds = infoEvent.value.fileVaultIds.filter(item => item !== id_file)
}
</script>

<style lang="scss">
.custom {
  color: #525b73;

  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}

.custom-form {
  .el-form-item {
    //display: flex;
    --font-size: 14px;
    margin-bottom: 8px;
    margin-top: 8px;
  }

  .el-form-item--default {
    --font-size: 14px;
    --el-form-label-font-size: var(--font-size);
    margin-bottom: 8px;
    margin-top: 8px;
  }
}

.custom-upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .el-upload-list {
    margin: 10px 0 0;
    padding: 0;
    list-style: none;
    width: 100%;
    position: relative;
  }

  .el-upload-list__item {
    flex: 0 0 24%;
    height: 250px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-upload-list__item-thumbnail img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .el-upload--picture-card {
    height: 250px;
  }

  .el-upload {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    outline: 0;
    flex: 0 0 24%;
  }

  .el-upload-dragger {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    border-radius: 6px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}

.el-upload-list__item.is-success:focus:not(:hover) .el-icon--close-tip {
  display: none;
}
</style>
