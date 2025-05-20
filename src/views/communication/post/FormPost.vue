<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3"

    >
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backPostManage()"
        >
          <img
            src="@/assets/imgs/weightStation/back.png"
            alt="..."
          />
        </div>
        <div
          v-if="isCreate"
          class="ms-2 text-2xl font-bold"
        >
          Thêm bài viết
        </div>
        <div
          v-if="isEdit"
          class="ms-2 text-2xl font-bold"
        >
          Sửa bài viết
        </div>
        <div
          v-if="isView"
          class="ms-2 text-2xl font-bold"
        >
          Thông tin bài viết
        </div>
      </h5>
      <div class="flex items-center">
        <el-button
          v-if="isCreate"
          :loading="processing"
          @click="handleCreate()"
          class="el-button--main"
          >{{ $t('omsSetting.save') }}
        </el-button>
        <el-button
          :loading="processing"
          v-if="isEdit"
          @click="handleUpdate()"
          class="el-button--main"
        >
          {{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>

    <div class="px-6 my-4 content-page">
      <div class="bg-white px-5 pt-6 pb-4">
        <el-form
          ref="formPost"
          :rules="ruleEdit"
          :model="infoPost"
        >
          <div class="flex items-center justify-between">
            <h5 class="text-black font-semibold text-lg">Thông tin bài viết</h5>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="Tiêu đề bài viết"
                prop="title"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoPost.title"
                  maxlength="250"
                  :placeholder="t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="type"
                label="Loại bài viết"
              >
                <el-select
                  v-model="infoPost.type"
                  clearable
                  collapse-tags
                  style="width: 100%"
                  :placeholder="t('configUser.pleaseSelect')"
                >
                  <el-option
                    v-for="(item, index) in listTypePost"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="imageTitle"
                label="Ảnh bìa"
              >
                <el-upload
                  v-model:file-list="infoPost.imageTitle"
                  class="avatar-uploader mt-0 custom-upload-list w-full"
                  drag
                  :on-success="null"
                  :on-preview="null"
                  :on-remove="handleRemove"
                  :on-exceed="null"
                  :auto-upload="false"
                  list-type="picture-card"
                  :limit="1"
                  accept=".jpg,.png"
                >
                  <svg-icon
                    icon-class="import-dialog"
                    class="width-50 height-50"
                  />
                  <p class="drag-note my-2 font-semibold" style="color: #7c7e81">
                    {{ t('configUser.importImage') }}
                  </p>
                  <p class="file-note text-center" style="color: #a4a6a7">
                    ({{ $t('configUser.importLimitAndType', ['Jpg/Png', '10MB']) }})
                  </p>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-row :gutter="10">
                <!-- Cột bên trái: nhập thông tin -->
                <el-col :span="12">
                  <div>
                    <div class="mt-3">
                      <el-card
                        v-for="(item, index) in arrDescription"
                        :key="index"
                        class="mt-2"
                      >
                        <div class="flex items-center justify-between mb-1">
                          <h6 class="text-base text--secondary">{{ item.nameType }}</h6>
                          <span
                            @click="deleteType(index)"
                            class="cursor-pointer bg-outline-danger text--danger rounded-sm px-2"
                            >Xóa</span
                          >
                        </div>

                        <template v-if="item.type === 'text' || item.type === 'tag'">
                          <el-input
                            v-model="item.valueType"
                            :type="item.type === 'text' ? 'textarea' : 'text'"
                            :autosize="item.type === 'text' ? { minRows: 2, maxRows: 4 } : false"
                          />
                        </template>

                        <template
                          v-else-if="
                            item.type === 'header' ||
                            item.type === 'title' ||
                            item.type === 'italicText'
                          "
                        >
                          <el-input
                            v-model="item.valueType"
                            type="text"
                            :autosize="item.type === 'text' ? { minRows: 2, maxRows: 4 } : false"
                          />
                        </template>

                        <template v-else-if="item.type === 'blockquote'">
                          <label>Tiêu đề</label>
                          <el-input v-model="item.title" />
                          <label>Nội dung chính</label>
                          <el-input
                            v-model="item.textMain"
                            type="textarea"
                            :autosize="{ minRows: 1, maxRows: 4 }"
                          />
                          <label>Tiêu đề phụ</label>
                          <el-input v-model="item.subTitle" />
                        </template>

                        <template v-else-if="item.type === 'image'">
                          <h6 class="font-bold text-base custom">
                            {{ t('monitoring.requestProcessingETC.attachedPhoto') }}
                          </h6>
                          <el-upload
                            v-model:file-list="item.listImage"
                            class="avatar-uploader mt-0 custom-upload-list w-full"
                            drag
                            :on-success="null"
                            :on-preview="null"
                            :on-remove="handleRemove"
                            :before-remove="(file, fileList) => beforeRemove(file, fileList, index)"
                            :on-change="(file, fileList) => handleChangeFile(file, fileList, index)"
                            :on-exceed="null"
                            :auto-upload="false"
                            list-type="picture-card"
                            :limit="1"
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
                        </template>
                      </el-card>
                    </div>
                    <div class="flex items-center justify-between mt-3">
                      <h5 class="text-black font-semibold text-base w-1/2">Trường thông tin</h5>
                      <el-select
                        v-model="typeId"
                        clearable
                        @change="handleAddType"
                        placeholder="Chọn thông tin hiển thị"
                      >
                        <el-option
                          v-for="type in lstTypeDescription"
                          :key="type.id"
                          :label="type.name"
                          :value="type.value"
                        />
                      </el-select>
                    </div>
                  </div>
                </el-col>

                <!-- Cột bên phải: xem trước -->
                <el-col
                  :span="12"
                  class="pb-7"
                >
                  <h5 class="text-black font-semibold text-base">Mẫu hiển thị</h5>
                  <el-card class="mt-1 h-full">
                    <div class="flex items-center justify-between mb-1">
                      <span class="tag-name paddingX-8">{{
                        infoPost.type ? setNameType(infoPost.type) : ''
                      }}</span>
                    </div>
                    <h5 class="text-xl text-black font-medium text-center">{{ infoPost.title }}</h5>

                    <div
                      v-for="(item, index) in arrDescription"
                      :key="index"
                      class="mt-2"
                    >
                      <p
                        v-if="item.type === 'text'"
                        class="text-custom text-justify"
                      >
                        {{ item.valueType }}
                      </p>

                      <h3
                        v-if="item.type === 'header'"
                        class="text-header-post text-justify"
                      >
                        {{ item.valueType }}
                      </h3>

                      <h4
                        v-if="item.type === 'title'"
                        class="text-lg text-justify font-semibold"
                      >
                        {{ item.valueType }}
                      </h4>

                      <p
                        v-if="item.type === 'italicText'"
                        class="text-base italic text-justify"
                      >
                        {{ item.valueType }}
                      </p>

                      <div
                        v-else-if="item.type === 'tag'"
                        class="my-6"
                      >
                        <span class="tag-custom">{{ item.valueType }}</span>
                      </div>

                      <div
                        v-else-if="item.type === 'blockquote'"
                        class="box-blockquote"
                      >
                        <p class="name-block">"{{ item.title }}"</p>
                        <p class="main-block">
                          {{ item.textMain }} -
                          <span style="font-style: italic">{{ item.subTitle }}</span>
                        </p>
                      </div>

                      <div
                        v-else-if="item.type === 'image'"
                        class="flex items-center justify-center mt-3 mb-3"
                      >
                        <img
                          v-if="item.imgLink.length > 0"
                          :src="
                            baseUrl +
                            'media-service/api/v1.0/images' +
                            item.imgLink[0].url.replace(/^\.\/uploads/, '/uploads')
                          "
                          alt=""
                          class="w-full"
                          style="aspect-ratio: 1.8/1; object-fit: contain"
                        />
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from '@/locale'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadFile } from '@/api/product'
import { useConfig } from '@/config'
import {apiCreatePost, apiGetById, apiUpdatePost} from '@/api/post'

const { t } = useI18n()
const router = useRouter()
const user = ref({})
const config = useConfig()
const baseUrl = ref(config.VITE_PROXY_DOMAIN)
const props = defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isCreate: {
    type: Boolean,
    default: false,
  },
})
const ruleEdit = ref({
  title: [{ required: true, message: 'Nhập tiêu đề', trigger: 'blur' }],
  type: [
    { required: true, message: 'Chọn loại', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (
          value === null ||
          value === undefined ||
          value === '' ||
          value === 0 ||
          value === '0'
        ) {
          callback(new Error('Chọn loại hợp lệ'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
})
const listTypePost = ref([
  {
    id: 1,
    label: 'Tin tức',
    value: 1,
  },
  {
    id: 2,
    label: 'Kiến thức',
    value: 2,
  },
  {
    id: 3,
    label: 'Thương hiệu',
    value: 3,
  },
  {
    id: 4,
    label: 'Tin tức nổi bật',
    value: 4,
  },
])
const lstTypeDescription = ref([
  { id: 1, name: 'Thẻ - tag', value: 'tag' },
  { id: 2, name: 'Đoạn văn bản', value: 'text' },
  { id: 3, name: 'Danh sách', value: 'list' },
  { id: 4, name: 'Ảnh', value: 'image' },
  { id: 5, name: 'Trích dẫn', value: 'blockquote' },
  { id: 6, name: 'Tiêu đề', value: 'header' },
  { id: 7, name: 'Danh mục', value: 'title' },
  { id: 7, name: 'Ghi chú', value: 'italicText' },
])

const processing = ref(false)
const route = useRoute()
const infoPost = ref({})
const formPost = ref(null)
const typeId = ref(null)
const arrDescription = ref([])

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('userInfo'))
  setDataDefault()
  if (props.isEdit) {
    initData()
  }
})

const setDataDefault = () => {}
const initData = async () => {
  try {
    const id_post = ref(route.params.id || null)
    const rs = await apiGetById(id_post.value)
    if (rs.code === 200) {
      infoPost.value = rs.data
      console.log(rs.data.content, 'aaa')
      if (rs.data.content) {
        arrDescription.value = JSON.parse(rs.data.content)
      }
    } else {
      ElMessage.error(rs.message)
    }
  } catch (e) {
    console.log(e)
  }
}

const handleCreate = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    processing.value = false
    console.log(infoPost.value)
    console.log(arrDescription.value)
    const params = {
      title: infoPost.value.title,
      content: JSON.stringify(arrDescription.value),
      type: infoPost.value.type,
    }
    const rs = await apiCreatePost(params)
    console.log('Giá trị type khi submit:', params.type)
    if (rs.code === 201) {
      console.log('Success')
      ElMessage.success('Thêm thành công')
      backPostManage()
    } else {
      ElMessage.error(rs.message)
    }
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const handleUpdate = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    processing.value = false
    const params = {
      title: infoPost.value.title,
      content: JSON.stringify(arrDescription.value),
      type: infoPost.value.type,
    }
    const rs = await apiUpdatePost(params, infoPost.value.id)
    console.log('Giá trị type khi submit:', params.type)
    if (rs.code === 200) {
      console.log('Success')
      ElMessage.success('Cập nhật thành công')
      backPostManage()
    } else {
      ElMessage.error(rs.message)
    }
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const convertData = () => {
  infoPost.value.description = JSON.stringify(arrDescription)
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formPost.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}

const handleAddType = value => {
  const type = lstTypeDescription.value.find(t => t.value === value)
  if (!type) return

  const base = { type: type.value, nameType: type.name }

  const typeDataMap = {
    text: { valueType: '' },
    tag: { valueType: '' },
    header: { valueType: '' },
    title: { valueType: '' },
    italicText: { valueType: '' },
    image: { imgLink: [], listImage: [] },
    blockquote: { title: '', textMain: '', subTitle: '' },
  }

  const extraData = typeDataMap[type.value]
  if (extraData) {
    arrDescription.value.push({ ...base, ...extraData })
  }

  typeId.value = null
}
const deleteType = index => {
  arrDescription.value.splice(index, 1)
}

const handleChangeFile = async (file, fileList, index) => {
  try {
    const isAllowedSize = file.size / 1024 / 1024 < 10
    if (!isAllowedSize) {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error(t('configUser.message.overflowMaxSize', ['10']))
      return false
    }
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.raw.type)) {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error('File không đúng định dạng .jpg/.png')
      return false
    }
    const fileToUpload = file.raw || file
    if (!fileToUpload || !(fileToUpload instanceof File)) {
      console.error('Invalid file provided:', file)
      return
    }
    const formData = new FormData()
    formData.append('file', fileToUpload)
    formData.append('user_id', user.value.userId)
    formData.append('server_name', 'wine')

    const rs = await uploadFile(formData)
    if (!Array.isArray(arrDescription.value[index].imgLink)) {
      arrDescription.value[index].imgLink = []
    }
    if (rs.code === 201) {
      arrDescription.value[index].imgLink.push({
        url: rs.data.filePath,
      })
    } else {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error('Tải file thất bại')
      return false
    }
  } catch (e) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    console.log(e)
    ElMessage.error('Tải file thất bại')
    return false
  }
}
const beforeRemove = (file, fileList, indexItem) => {
  return ElMessageBox.confirm(t('administration.ip.confirmDeleteFile'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  }).then(
    () => {
      const index = fileList.indexOf(file)
      if (index > -1) {
        indexDeleteFile.value = indexItem
      }
      return true
    },
    () => false
  )
}
const indexDeleteFile = ref(null)
const handleRemove = (file, fileList) => {
  console.log(indexDeleteFile.value, 'vị trí xóa')
  arrDescription.value[indexDeleteFile.value].imgLink.splice(0, 1)
  indexDeleteFile.value = null
}

const setNameType = type => {
  const item = listTypePost.value.find(item => item.id === type)
  if (item) {
    return item.label
  }
}

const backPostManage = () => {
  router.push('/communication/post')
}
</script>

<style lang="scss">
.tag-name {
  color: rgba(34, 197, 94);
  background-color: rgba(34, 197, 94, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}

.text-custom {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
  font-size: 15px;
  font-family: 'Font Awesome 6 Brands', serif;
}

.text-header-post {
  font-size: 24px;
  font-weight: 600;
}

.tag-custom {
  background-color: rgba(244, 246, 249);
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 15px;
  margin: 6px 0;
}

.box-blockquote {
  padding-left: 2.25rem;
  border-left: 1px solid #e2e7f1;
}

.name-block {
  font-size: 18px;
  font-style: italic;
}

.main-block {
  color: #95a0c5;
  font-size: 14px;
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
    flex: 0 0 49%;
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
    flex: 0 0 49%;
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
