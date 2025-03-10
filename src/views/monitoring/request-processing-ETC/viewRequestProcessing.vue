<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backRequestProcessingVEC()"
        >
          <img src="@/assets/imgs/weightStation/back.png" />
        </div>
        <div
          v-if="!isEdit"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.addNew') }}
        </div>
        <div
          v-else
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.editUser') }}
        </div>
      </h5>
      <div class="flex">
        <el-button
          type="default"
          @click="backRequestProcessingVEC"
          class="bg-outline-secondary"
          >{{ $t('configUser.closed') }}
        </el-button>
        <el-button
          v-if="!isEdit && roleData.canCreate"
          :loading="processing"
          @click="handleAddRequestProcessingVEC"
          class="el-button--main"
        >
          {{ $t('omsSetting.save') }}
        </el-button>
        <el-button
          v-if="isEdit && roleData.canUpdate"
          @click="handleUpdateRequestProcessingVEC"
          :loading="processing"
          class="el-button--main"
        >
          {{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
    <!--  Content  -->
    <div
      v-if="roleData.canCreate || roleData.canUpdate"
      class="content-page px-6 mt-4"
    >
      <div class="bg-white px-5 pt-6 pb-4 mb-6">
        <el-form
          ref="formInfoRequestVEC"
          :rules="ruleEdit"
          :model="infoRequestVEC"
          class="custom-form"
        >
          <h5 class="text-black font-semibold text-lg">
            {{ $t('monitoring.requestProcessingETC.requestInformation') }}
          </h5>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="t('monitoring.requestProcessingETC.requestName')"
                prop="name"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoRequestVEC.name"
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
                  v-model="infoRequestVEC.route.id"
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
                  :disabled="isEdit"
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
                :label="t('configUser.station')"
                prop="station.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoRequestVEC.station.id"
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
                  :disabled="isEdit"
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
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.lane')"
                prop="lane.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoRequestVEC.lane.id"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isEdit"
                >
                  <el-option
                    v-for="item in listLane"
                    :key="item.id"
                    :label="item.number"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="t('monitoring.requestProcessingETC.typeError')"
                prop="errorType"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoRequestVEC.errorType"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                >
                  <el-option
                    v-for="item in listError"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div style="width: 50%"></div>
          </div>
          <div class="w-full">
            <el-form-item
              :label="t('monitoring.requestProcessingETC.requestContent')"
              prop="content"
              class="custom w-full"
              style="display: inline-block; width: 100%"
            >
              <el-input
                v-model="infoRequestVEC.content"
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
              v-model:file-list="infoRequestVEC.listImage"
              class="avatar-uploader mt-3 custom-upload-list w-full"
              drag
              :on-success="null"
              :on-preview="handlePreview"
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
              accept=".jpg,.png,.jpeg"
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
              v-model:file-list="infoRequestVEC.listFileRequest"
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
import { onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { getListRoute, getListStation } from '@/api/expressway'
import { uploadFile } from '@/api/rating'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  apiCreateRequestProcessingVEC,
  apiGetDetailRequestProcessingVEC,
  apiUpdateRequestProcessingVEC,
} from '@/api/requestProcessingETC'
import { usePermissionStore, useRouteUser } from '@/store'
import { useConfig } from '@/config'

const { t } = useI18n()
const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const isEdit = ref(false)
const router = useRouter()
const route = useRoute()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()
const processing = ref(false)

const ruleEdit = ref({
  name: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  route: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  station: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  lane: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  // errorType: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  content: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const listRoute = ref([])
const listStation = ref([])
const listLane = ref([])
const listError = ref([
  {
    key: 1,
    name: t('monitoring.requestProcessingETC.outOfMoney'),
    value: 'OUT_OF_MONEY',
  },
  {
    key: 2,
    name: t('monitoring.requestProcessingETC.deviceFailure'),
    value: 'DEVICE_BROKEN',
  },
  {
    key: 3,
    name: t('monitoring.requestProcessingETC.suspectedEquipmentFailure'),
    value: 'SUSPECTED_DEVICE_BROKEN',
  },
])
const infoRequestVEC = ref({
  route: {
    id: '',
  },
  station: {
    id: '',
  },
  lane: {
    id: '',
  },
  listImage: [],
})
const formInfoRequestVEC = ref(null)

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
  const request_id = route.params.id
  if (request_id) {
    const rs = await apiGetDetailRequestProcessingVEC(request_id)
    if (rs.status === 200) {
      isEdit.value = true
      infoRequestVEC.value = rs.data
      infoRequestVEC.value.errorType =
        infoRequestVEC.value.errorType === 0 ? null : infoRequestVEC.value.errorType
      await setListDataEdit()
      await setListImage()
    }
  }
}
const setListDataEdit = async () => {
  const params = {
    page: 1,
    size: 20,
    keyword: '',
    routeIds: [infoRequestVEC.value.route.id],
    unitIds: [],
  }
  const rsr = await getListStation(params)
  if (rsr.status === 200) {
    listStation.value = rsr.data.dataRows
  } else {
    listStation.value = []
  }
  listLane.value = []
  // eslint-disable-next-line array-callback-return
  listStation.value.map(item => {
    if (item.id === infoRequestVEC.value.station.id) {
      listLane.value = item.lanes
    }
  })
}
const setListImage = async () => {
  const listFile = infoRequestVEC.value.fileVaults
  infoRequestVEC.value.fileVaultIds = []
  infoRequestVEC.value.listImage = []
  infoRequestVEC.value.listFileRequest = []
  for (const file of listFile) {
    if (file.fileCategory === 2) {
      infoRequestVEC.value.listImage.push({
        name: file.fileName,
        url: `${baseUrl.value}${file.filePath}`,
      })
    } else if (file.fileCategory === 1) {
      infoRequestVEC.value.listFileRequest.push({
        name: file.fileName,
        url: `${baseUrl.value}${file.filePath}`,
      })
    }
    infoRequestVEC.value.fileVaultIds.push(file.id)
  }
}
const handleAddRequestProcessingVEC = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    console.log(infoRequestVEC.value)
    const rs = await apiCreateRequestProcessingVEC(infoRequestVEC.value)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push('/monitoring/VEC-request-processing')
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const handleUpdateRequestProcessingVEC = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const request_id = route.params.id
    const rs = await apiUpdateRequestProcessingVEC(request_id, infoRequestVEC.value)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push('/monitoring/VEC-request-processing')
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formInfoRequestVEC.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const backRequestProcessingVEC = () => {
  router.push('/monitoring/VEC-request-processing')
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
    if (!Array.isArray(infoRequestVEC.value.fileVaultIds) || !infoRequestVEC.value.fileVaultIds) {
      infoRequestVEC.value.fileVaultIds = []
    }
    infoRequestVEC.value.fileVaultIds.push(idFile)
    if (!Array.isArray(infoRequestVEC.value.fileVaults) || !infoRequestVEC.value.fileVaults) {
      infoRequestVEC.value.fileVaults = []
    }
    infoRequestVEC.value.fileVaults.push(rs.data.data[0])
  } else {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
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
  const item = infoRequestVEC.value.fileVaults
  const length = item.length
  let id_file = ''
  for (let i = 0; i < length; i++) {
    if (file.name === item[i].fileName) {
      id_file = item[i].id
      break
    }
  }
  infoRequestVEC.value.fileVaults = infoRequestVEC.value.fileVaults.filter(
    item => item.id !== id_file
  )
  infoRequestVEC.value.fileVaultIds = infoRequestVEC.value.fileVaultIds.filter(
    item => item !== id_file
  )
}
const setSelectStation = async id => {
  listStation.value = []
  infoRequestVEC.value.station = {
    id: '',
  }
  infoRequestVEC.value.lane = {
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
  infoRequestVEC.value.lane = {
    id: '',
  }
  // eslint-disable-next-line array-callback-return
  listStation.value.map(item => {
    if (item.id === data) {
      listLane.value = item.lanes
    }
  })
}
const handlePreview = file => {
  if (file.name.endsWith('.pdf')) {
    if (file.url) {
      window.open(file.url, '_blank')
    } else if (file.raw) {
      const fileUrl = URL.createObjectURL(file.raw)
      window.open(fileUrl, '_blank')
    }
  } else {
    if (file.url) {
      window.open(file.url, '_blank')
    } else if (file.raw) {
      const fileUrl = URL.createObjectURL(file.raw)
      window.open(fileUrl, '_blank')
    }
  }
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
</style>
