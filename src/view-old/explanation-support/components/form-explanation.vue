<script setup>
import { computed, onMounted, reactive, ref, inject } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { useRoute, useRouter } from 'vue-router'
import http from '@/utils/request'

import { useI18n } from '@/locale'
import lang from '@/locale/getMessage'
import { useAppStore, useExplanationSupportStore, usePermissionStore, useUserStore } from '@/store'
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import SendNotifyExplanation from '@/views/explanation-support/components/sendNotifyExplanation.vue'
import DeleteNotifyExplanation from '@/views/explanation-support/components/deleteNotifyExplanation.vue'
import { downloadFileCustom, FILE_CATEGORY } from '@/utils/files'
import ImportExcel from '@/components/ImportExcel/index.vue'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { getListStation } from '@/api/expressway'
import { useConfig } from '@/config'

defineOptions({
  name: 'explanation-form',
})

const props = defineProps({
  isCreateQuick: {
    type: Boolean,
    default: false,
  },
  isCreateReport: {
    type: Boolean,
    default: false,
  },
  isEditQuick: {
    type: Boolean,
    default: false,
  },
  isDetail: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const explanationSupportStore = useExplanationSupportStore()
const permissionStore = usePermissionStore()
const userStore = useUserStore()
const locale = computed(() => lang[appStore.lang])

const roleAction = ref(null)
const actionUpdate = ref(false)

const config = useConfig()
const urlDeleteUpload = ref(config.VITE_APP_UPLOAD_URL)
const urlUpload = ref(config.VITE_APP_UPLOAD_URL + '/upload')

onMounted(() => {
  idExplanationDetail.value = route.params.id
  typeDetail.value = route.query.type || null
})
const typeDetail = ref(null)
const idExplanationDetail = ref(null)
const showDialogSendNotify = ref(false)
const showDialogDeleteNotify = ref(false)
const showDialogConfirmExplanation = ref(false)
const showDialogNotConfirmExplanation = ref(false)
const showDialogExplanationTransaction = ref(false)
const showDialogUpdateTransaction = ref(false)
const isSubmitted = ref(false)
const isSubmittedFile = ref(false)

const ruleFormUpdate = ref()
const rulesUpdate = reactive({
  title: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  content: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  created_at: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})
const ruleFormRefNotApprove = ref()
const rulesNotApprove = reactive({
  reason: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
})
const ruleFormRefUpdateTransaction = ref()
const ruleUpdateTransaction = reactive({
  vehicle_type_id: [{required: true, message: t('configUser.validateMessage.required'), trigger: 'blur'}],
  // price: [{required: true, message: t('configUser.validateMessage.required'), trigger: 'blur'}],
  station_in: [{required: true, message: t('configUser.validateMessage.required'), trigger: 'blur'}],
  // station_out: [{required: true, message: t('configUser.validateMessage.required'), trigger: 'blur'}],
})
const formUpdateTransaction = ref({
  vehicle_type_id: '',
  price: '',
  station_in: '',
  station_out: '',
  ticket_type: '',
  trans_type: '',
  explanation_detail_id: -1
})
const ruleFormRefExplanationTransaction = ref()
const ruleExplanationTransaction = reactive({
  quick_explanation: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})
const formExplanationTransaction = ref({
  quick_explanation: '',
  explanation_detail_id: -1,
})
const isUpdateExplanationTransaction = ref(false)
const isShowDetailExplanationTransaction = ref(false)
const listTypeVehicle = ref([
  {
    id: 1,
    name: 'Loại 1',
  },
  {
    id: 2,
    name: 'Loại 2',
  },
  {
    id: 3,
    name: 'Loại 3',
  },
  {
    id: 4,
    name: 'Loại 4',
  },
  {
    id: 5,
    name: 'Loại 5',
  },
])
const listPrice = ref([])
const listStationIn = ref([])
const listStationOut = ref([])

const Font = Quill.import('formats/font')
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'times-new-roman']
Quill.register(Font, true)
const quillOptions = {
  theme: 'snow',
  placeholder: t('configUser.pleaseEnter'),
  modules: {
    toolbar: [[{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': 'left'}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
      [{ font: Font.whitelist }]
    ],
    keyboard: {
      bindings: {
        'list autofill': {
          key: ' ',
          collapsed: true,
          prefix: /^\d+\.$|^[-*+]$/,
          handler: () => {
            return true
          },
        },
        list: null,
      },
    },
  },
}

let dataDetail = null
const formDataDetail = ref({
  title: '',
  content: '',
  created_at: '',
})
const formCreateExplanationQuick = ref({
  explanation_id: '',
  quick_explanation: '',
})
const formImportFileExplanation = ref({
  explanation_id: '',
  file_id: [],
})
const formNotApprove = ref({
  explanation_id: '',
  status: '',
  reason: null,
})
const MAX_LENGTH = ref(3000)
const characterCount = ref(0)
const fileVaultsDetail = ref([])
const stationId = ref('')
const stationList = ref([])
const isActionNotify = ref('')
const listOpinionVec = ref([])
const listOpinionLeader = ref([])
const listTypeTicket = ref([
  {
    id: 1,
    name: 'Vé lượt',
  },
  {
    id: 0,
    name: 'Vé tháng',
  },
  {
    id: 2,
    name: 'Vé quý',
  },
  {
    id: 4,
    name: 'Miễn phí',
  },
])
const listTransaction = ref([
  {
    id: 1,
    name: 'ETC',
  },
  {
    id: 2,
    name: 'MTC',
  },
])
const objFilePdf = ref(null)
const objFileXlsx = ref(null)
const routeId = ref(null)

onMounted(() => {
  isActionNotify.value = route.query.type
})

const handleGetDetailExplanation = () => {
  const idE = route.params.id
  explanationSupportStore
    .apiGetDetailExplanation(idE)
    .then(res => {
      if (res.status === 200) {
        dataDetail = res.data
        formDataDetail.value = reactive(cloneDeep(dataDetail))
        formCreateExplanationQuick.value.quick_explanation = dataDetail?.quick_explanation
        if (props.isEditQuick || props.isDetail) {
          actionUpdate.value = true
        }
        listOpinionLeader.value = formDataDetail.value.explanationHistoryList.filter(
          item => item.position === 2
        )
        listOpinionVec.value = formDataDetail.value.explanationHistoryList.filter(
          item => item.position === 3
        )
        roleAction.value = permissionStore.roleData
        handleGetAllStation()
        if (dataDetail.file_report) {
          dataDetail.file_report.forEach(item => {
            if (item.file_name.endsWith('xlsx')) {
              objFileXlsx.value = item
            } else {
              objFilePdf.value = item
            }
          })
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
}
handleGetDetailExplanation()
const listLoading = ref(false)
const maxHeight = computed(() => {
  const viewportHeight = window.innerHeight
  return viewportHeight - 500
})
const indexMethod = index => {
  // return (currentPage.value - 1) * filter.size + index + 1
}
const onChangeTiny = value => {
  characterCount.value = formCreateExplanationQuick.value.quick_explanation.replace(
    /<[^>]*>/g,
    ''
  ).length
}
const getClassStatus = status => {
  let className = ''
  switch (status) {
    case 'Chờ giải trình':
      className = 'bg-outline-warning text--warning status-class'
      break
    case 'Đã giải trình':
      className = 'bg-outline-info text--info status-class'
      break
    case 'Bị từ chối':
      className = 'bg-outline-danger text--danger status-class'
      break
    case 'Đã duyệt':
      className = 'bg-outline-success text--success status-class'
      break
    case 'Đã xác nhận':
      className = 'bg-outline-dark-purple text--dark-purple status-class'
      break
    case 'Mới tạo':
      className = 'bg-outline-light-blue text--light-blue status-class'
      break
    default:
      className = 'bg-outline-secondary text--secondary status-class'
  }
  return className
}
const getStatusName = status => {
  let statusMessage = ''
  switch (status) {
    case 'Chờ giải trình':
      statusMessage = t('explanationSupport.waitingForExplanation')
      break
    case 'Đã giải trình':
      statusMessage = t('explanationSupport.Explained')
      break
    case 'Bị từ chối':
      statusMessage = t('explanationSupport.Rejected')
      break
    case 'Đã duyệt':
      statusMessage = t('explanationSupport.Approved')
      break
    case 'Đã xác nhận':
      statusMessage = t('explanationSupport.Confirmed')
      break
    case 'Mới tạo':
      statusMessage = t('explanationSupport.newCreate')
      break
    default:
      statusMessage = t('explanationSupport.notConfirmed')
  }
  return statusMessage
}
const isShowClassQuickExplanation = status => {
  if (status === 'Mới tạo' && !(dataDetail?.quick_explanation && dataDetail?.file_report)) {
    return false
  } else if (status !== 'Mới tạo' && dataDetail?.quick_explanation && dataDetail?.file_report) {
    return false
  } else if (
    status === 'Mới tạo' ||
    (status !== 'Mới tạo' && (dataDetail?.quick_explanation || dataDetail?.file_report))
  ) {
    return true
  } else if (
    status !== 'Mới tạo' &&
    !(dataDetail?.quick_explanation && dataDetail?.file_report) &&
    roleAction.value?.canExplain === 1
  ) {
    return true
  } else if (status !== 'Mới tạo' && !(dataDetail?.quick_explanation && dataDetail?.file_report)) {
    return false
  }
}
const isShowQuickExplanation = status => {
  return status !== 'Mới tạo'
}
const handleUpdateExplanation = () => {
  const params = {
    id: formDataDetail.value.id,
    title: formDataDetail.value.title,
    content: formDataDetail.value.content,
    created_at: formDataDetail.value.created_at,
  }
  ruleFormUpdate.value.validate(valid => {
    if (valid) {
      explanationSupportStore
        .apiUpdateExplanation(params)
        .then(res => {
          if (res.status === 200) {
            ElMessage({
              message: t('configUser.message.updateSuccess'),
              type: 'success',
            })
            router.push('/explanation-support')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}
const handleSendNotifyExplanation = () => {
  stationId.value = dataDetail.station.id
  routeId.value = dataDetail.route.id
  showDialogSendNotify.value = true
}
const handleCloseDialogSendNotify = () => {
  showDialogSendNotify.value = false
}
const handleDeleteExplanation = () => {
  showDialogDeleteNotify.value = true
}
const handleCloseDialogDelete = () => {
  showDialogDeleteNotify.value = false
}
const handleCreateExplanationQuick = () => {
  if (props.isCreateQuick) {
    formCreateExplanationQuick.value.explanation_id = idExplanationDetail.value
    if (formCreateExplanationQuick.value.quick_explanation === '') {
      isSubmitted.value = true
      return
    }
    if (characterCount.value < MAX_LENGTH.value) {
      explanationSupportStore
        .apiCreateQuickExplanation(formCreateExplanationQuick.value)
        .then(res => {
          if (res.status === 200) {
            ElMessage({
              message: t('explanationSupport.textActionSuccess', [
                t('explanationSupport.quickExplanation'),
              ]),
              type: 'success',
            })
            isSubmitted.value = false
            router.push('/explanation-support')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  } else if (!actionUpdate.value && props.isEditQuick) {
    handleUpdateExplanationQuick()
  } else {
    handleImportFileExplanationQuick()
  }
}
const handleUpdateExplanationQuick = () => {
  formCreateExplanationQuick.value.explanation_id = idExplanationDetail.value
  if (formCreateExplanationQuick.value.quick_explanation === '') {
    isSubmitted.value = true
    return
  }
  if (characterCount.value < MAX_LENGTH.value) {
    explanationSupportStore
      .apiUpdateQuickExplanation(formCreateExplanationQuick.value)
      .then(res => {
        if (res.status === 200) {
          ElMessage({
            message: t('configUser.message.updateSuccess'),
            type: 'success',
          })
          isSubmitted.value = false
          router.push('/explanation-support')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
const handleChangeAction = () => {
  // formCreateExplanationQuick.value.quick_explanation = dataDetail?.quick_explanation
  actionUpdate.value = false
}
const handleImportFileExplanationQuick = () => {
  formImportFileExplanation.value.explanation_id = idExplanationDetail.value
  if (formImportFileExplanation.value.file_id.length === 0) {
    isSubmittedFile.value = true
    return
  }
  explanationSupportStore
    .apiImportFileExplanation(formImportFileExplanation.value)
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          message: t('explanationSupport.textActionSuccess', [
            t('explanationSupport.explanationReport'),
          ]),
          type: 'success',
        })
        isSubmittedFile.value = false
        router.push('/explanation-support')
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const handleSuccessFile = data => {
  formImportFileExplanation.value.file_id = []
  formImportFileExplanation.value.file_id = formImportFileExplanation.value.file_id.concat(data.map(item => item.id))
  isSubmittedFile.value = false
}
const handleRemoveFile = data => {
  formImportFileExplanation.value.file_id = []
}
const handleBack = () => {
  router.push('/explanation-support')
}
const requestDeleteFile = data => {
  return http.request({
    url: urlDeleteUpload.value + `/${data}`,
    method: 'delete',
  })
}
const handleShowRemoveFileDetail = () => {
  showDialogConfirmExplanation.value = true
  formNotApprove.value.explanation_id = dataDetail.file_report.id
  formNotApprove.value.status = 'FILE'
}
const handleRemoveFileDetail = () => {
  if (objFilePdf.value && objFileXlsx.value) {
    requestDeleteFile(objFilePdf.value.id)
      .then(response => {
        if (response.status === 200) {
          requestDeleteFile(objFileXlsx.value.id)
            .then(response => {
              if (response.status === 200) {
                formNotApprove.value.status = ''
                formNotApprove.value.explanation_id = ''
                router.push('/explanation-support')
              } else {
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
        }
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    requestDeleteFile(dataDetail?.file_report[0].id)
      .then(response => {
        if (response.status === 200) {
          formNotApprove.value.status = ''
          formNotApprove.value.explanation_id = ''
          router.push('/explanation-support')
        } else {
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
const handleDownloadFileDetail = () => {
  try {
    if (objFilePdf.value) {
      const url = objFilePdf.value.file_path.replace('/upload', '')
      downloadFileCustom(url, objFilePdf.value.file_name)
    }
  } catch (error) {
    console.log('handleExport ~ error:', error)
  }
}
const handleShowConfirmExplanation = status => {
  formNotApprove.value.explanation_id = dataDetail.id
  formNotApprove.value.status = status
  showDialogConfirmExplanation.value = true
}
const handleShowNotConfirmExplanation = status => {
  formNotApprove.value.explanation_id = dataDetail.id
  formNotApprove.value.status = status
  formNotApprove.value.reason = null
  showDialogNotConfirmExplanation.value = true
}
const handleCloseDialogConfirmExplanation = () => {
  showDialogConfirmExplanation.value = false
}
const handleCloseDialogNotConfirmExplanation = () => {
  showDialogNotConfirmExplanation.value = false
}
const handleConfirmExplanation = () => {
  if (formNotApprove.value.status === 'FILE') {
    handleRemoveFileDetail()
  } else {
    ruleFormRefNotApprove.value.validate(valid => {
      if (valid) {
        explanationSupportStore.apiUpdateStatusExplanation(formNotApprove.value).then(res => {
          if (res.status === 200) {
            ElMessage({
              message: t('configUser.message.updateSuccess'),
              type: 'success',
            })
            router.push('/explanation-support')
            showDialogConfirmExplanation.value = false
          }
        })
      }
    })
  }
}
const handleNotConfirmExplanation = () => {
  ruleFormRefNotApprove.value.validate(valid => {
    if (valid) {
      explanationSupportStore.apiUpdateStatusExplanation(formNotApprove.value).then(res => {
        if (res.status === 200) {
          ElMessage({
            message: t('configUser.message.updateSuccess'),
            type: 'success',
          })
          router.push('/explanation-support')
          showDialogNotConfirmExplanation.value = false
        }
      })
    }
  })
}
const handleExportCustom = () => {
  const url = urlUpload.value + objFileXlsx.value?.file_path.replace('/upload', '')
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.href = url
      link.download = objFileXlsx.value?.file_name || url.split('/').pop()
      link.click()
      URL.revokeObjectURL(url) // Giải phóng bộ nhớ
    })
    .catch(err => {
      console.log('Có lỗi xảy ra khi tải file:', err)
    })
}
const handleUpdateTransaction = () => {
  console.log('handleUpdateTransaction: ', formUpdateTransaction.value)
  ruleFormRefUpdateTransaction.value.validate(valid => {
    if (valid) {
      explanationSupportStore
        .apiExplanationUpdateDetail(formUpdateTransaction.value)
        .then(res => {
          if (res.status === 200) {
            ElMessage({
              message: t('configUser.message.updateSuccess'),
              type: 'success',
            })
            showDialogUpdateTransaction.value = false
            refreshUpdateTransaction()
            handleGetDetailExplanation()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}
const handleOpenDialogUpdateTransaction = row => {
  showDialogUpdateTransaction.value = true
  formUpdateTransaction.value.explanation_detail_id = row.id
  formUpdateTransaction.value.price = row.consolidateTransResponse.price
  formUpdateTransaction.value.vehicle_type_id = row.consolidateTransResponse.vehicleTypeOutId
  formUpdateTransaction.value.station_in = row.consolidateTransResponse.stationInId
  formUpdateTransaction.value.station_out = row.consolidateTransResponse.stationOutId
  formUpdateTransaction.value.trans_type = row.consolidateTransResponse.transType
  formUpdateTransaction.value.ticket_type = row.consolidateTransResponse.ticketType
}
const handleCloseDialogTransaction = () => {
  showDialogUpdateTransaction.value = false
  refreshUpdateTransaction()
}
const refreshUpdateTransaction = () => {
  formUpdateTransaction.value.price = ''
  formUpdateTransaction.value.station_in = ''
  formUpdateTransaction.value.station_out = ''
  formUpdateTransaction.value.vehicle_type_id = ''
  formUpdateTransaction.value.trans_type = ''
  formUpdateTransaction.value.ticket_type = ''
  formUpdateTransaction.value.explanation_detail_id = -1
}
const handleExplanationTransaction = () => {
  ruleFormRefExplanationTransaction.value.validate(valid => {
    if (valid) {
      explanationSupportStore
        .apiExplanationQuickDetail(formExplanationTransaction.value)
        .then(res => {
          if (res.status === 200) {
            ElMessage({
              message: t('explanationSupport.textActionSuccess', [
                t('explanationSupport.quickExplanation'),
              ]),
              type: 'success',
            })
            showDialogExplanationTransaction.value = false
            formExplanationTransaction.value.quick_explanation = ''
            handleGetDetailExplanation()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}
const handleOpenDialogExplanationTransaction = row => {
  showDialogExplanationTransaction.value = true
  formExplanationTransaction.value.explanation_detail_id = row.id
  if (row.quickExplanation) {
    isUpdateExplanationTransaction.value = true
    isShowDetailExplanationTransaction.value = true
    formExplanationTransaction.value.quick_explanation = row.quickExplanation
  }
}
const handleCloseDialogExplanationTransaction = () => {
  showDialogExplanationTransaction.value = false
  formExplanationTransaction.value.quick_explanation = ''
  isUpdateExplanationTransaction.value = false
}
const onEditorChange = field => {
  console.log(field)
  ruleFormRefExplanationTransaction.value.validateField(field)
}
const handleGetAllStation = () => {
  const params = {
    keyword: '',
    routeIds: [formDataDetail.value?.route?.id],
  }
  getListStation(params)
    .then(res => {
      stationList.value = res.data.dataRows
    })
    .catch(_ => {})
}
</script>

<template>
  <div class="explanation-detail">
    <div class="form-back bg-white padding-16">
      <div class="flex items-center justify-between">
        <div
          class="pointer flex items-center"
          @click="router.push('/explanation-support')"
        >
          <svg-icon
            icon-class="arrow-left"
            class="width-24 height-24 margin-right-4"
          />
          <span class="fs-20 color-[#212633]">{{ t('el.pageHeader.title') }}</span>
        </div>
        <div
          class="flex items-center"
          v-if="roleAction?.canNotify === 1"
        >
          <el-button
            v-if="formDataDetail?.status === 'Mới tạo'"
            style="border: none"
            class="border-1 bg--warning paddingX-20 mr-2"
            @click="handleSendNotifyExplanation"
            type="info"
            >{{ $t('explanationSupport.sendNotify') }}
          </el-button>
          <el-button
            v-if="
              formDataDetail?.status === 'Mới tạo' || formDataDetail?.status === 'Chờ giải trình'
            "
            style="border: none"
            class="border-1 bg--danger paddingX-20"
            @click="handleDeleteExplanation"
            type="info"
            >{{ $t('explanationSupport.deleteNotify') }}
          </el-button>
        </div>
        <div
          class="flex items-center"
          v-if="roleAction?.canConfirm === 1 && formDataDetail?.status === 'Đã duyệt'"
        >
          <el-button
            style="border: none"
            class="border-1 bg--dark-purple paddingX-20 mr-2"
            @click="handleShowConfirmExplanation('CONFIRMED')"
            type="info"
            >{{ $t('explanationSupport.confirmExplanation') }}
          </el-button>
          <el-button
            style="border: none"
            class="border-1 bg--info paddingX-20"
            @click="handleShowNotConfirmExplanation('UNCONFIRMED')"
            type="info"
            >{{ $t('explanationSupport.notConfirmed') }}
          </el-button>
        </div>
        <div
          class="flex items-center"
          v-if="roleAction?.canApprove === 1 && formDataDetail?.status === 'Đã giải trình'"
        >
          <el-button
            style="border: none"
            class="border-1 bg--success paddingX-20 mr-2"
            @click="handleShowConfirmExplanation('APPROVED')"
            type="info"
            >{{ $t('explanationSupport.Approve') }}
          </el-button>
          <el-button
            style="border: none"
            class="border-1 bg--danger paddingX-20"
            @click="handleShowNotConfirmExplanation('REJECTED')"
            type="info"
            >{{ $t('explanationSupport.Reject') }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="form-detail paddingX-20 pb-6 pt-3">
      <div class="flex justify-between gap-3 mb-3">
        <div class="flex items-center flex-column gap-3 w-1/3">
          <div class="form-status w-full h-1/2">
            <div class="bg-white padding-16 h-full">
              <p class="fs-18 font-[500]">{{ t('monitoring.errorHandling.result') }}</p>
              <div class="mb-2">
                <span class="mr-5">{{ t('configUser.status') }}:</span>
                <span
                  class="text-center paddingX-10"
                  :class="getClassStatus(formDataDetail?.status)"
                >
                  {{ getStatusName(formDataDetail?.status) }}
                </span>
              </div>
              <!--              <div v-if="getStatusName(formDataDetail?.status) === t('explanationSupport.Rejected')" class="mb-2">-->
              <!--                <span class="mr-4">{{ t('explanationSupport.reasonReject') }}:</span>-->
              <!--                <span class="">-->
              <!--                  {{ dataDetail?.reason_rejected }}-->
              <!--                </span>-->
              <!--              </div>-->
              <!--              <div v-if="getStatusName(formDataDetail?.status) === t('explanationSupport.notConfirmed')" class="mb-2">-->
              <!--                <span class="mr-4">{{ t('explanationSupport.reasonNotConfirm') }}:</span>-->
              <!--                <span class="">-->
              <!--                  {{ dataDetail?.reason_unconfirmed }}-->
              <!--                </span>-->
              <!--              </div>-->
              <div
                class="group-opinion overflow-y-auto h-2/3"
                v-if="
                  getStatusName(formDataDetail?.status) !==
                  (t('explanationSupport.waitingForExplanation') ||
                    t('explanationSupport.newCreate'))
                "
              >
                <div
                  class="mb-2"
                  v-if="listOpinionLeader.length > 0"
                >
                  <span class="">{{ t('explanationSupport.opinionLeader') }}:</span>
                  <div class="list-opinion">
                    <div
                      class="item-opinion text-[#525B73] pl-4"
                      v-for="item in listOpinionLeader"
                      :key="item.id"
                    >
                      <span>- </span>
                      <span>{{ item.approver }}_</span>
                      <span class="inline-block mr-3">{{ item.createTime }}:</span>
                      <span>{{ item.reason }}</span>
                    </div>
                  </div>
                </div>
                <div
                  class=""
                  v-if="listOpinionVec.length > 0"
                >
                  <span class="">{{ t('explanationSupport.opinionVec') }}:</span>
                  <div
                    class="item-opinion text-[#525B73] pl-4"
                    v-for="item in listOpinionVec"
                    :key="item.id"
                  >
                    <span>- </span>
                    <span>{{ item.approver }}_</span>
                    <span class="inline-block mr-3">{{ item.createTime }}:</span>
                    <span>{{ item.reason }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="form-report padding-16 bg-white w-full"
            v-if="isCreateReport || (isDetail && dataDetail?.file_report)"
            :class="dataDetail?.quick_explanation && dataDetail?.file_report ? 'h-1/2' : ''"
          >
            <div class="mb-2 flex justify-between">
              <span class="fs-18 font-[500]">
                {{ t('explanationSupport.explanationReport') }}
              </span>
              <div>
                <el-button
                  v-if="isCreateReport"
                  type="info"
                  style="border: none"
                  class="border-1 paddingX-10 text-white bg--dark-purple"
                  @click="handleCreateExplanationQuick"
                  >{{ $t('omsSetting.save') }}
                </el-button>
              </div>
            </div>
            <div class="form-create-file">
              <ImportExcel
                v-if="isCreateReport"
                limit="1"
                main-entity-name="explanation"
                :file-category="FILE_CATEGORY.VECM_EXPLANATION"
                :keep-file-name="true"
                :files="fileVaultsDetail"
                file-type=".xlsx"
                @upload-success="handleSuccessFile"
                @remove-success="handleRemoveFile"
              />
              <p
                class="text--danger"
                v-if="isSubmittedFile"
              >
                {{ t('explanationSupport.validFile') }}
              </p>
            </div>
            <div
              v-if="isDetail && dataDetail?.file_report.length > 0"
              class="flex items-center justify-between"
            >
              <p style="text-decoration: underline; color: #0078d4" class="text-file">
                {{ objFileXlsx.file_name }}
              </p>
              <div>
                <svg-icon
                  icon-class="eye"
                  class="width-20 height-20 margin-right-4 text--info pointer"
                  @click="handleDownloadFileDetail"
                ></svg-icon>
                <svg-icon
                  v-if="roleAction.canExport === 1"
                  icon-class="export-file"
                  class="width-20 height-20 margin-right-4 text--info pointer"
                  @click="handleExportCustom"
                ></svg-icon>
                <svg-icon
                  v-if="
                    userStore.positionUnitId === '1' &&
                    (dataDetail?.status === 'Đã giải trình' ||
                      dataDetail?.status === 'Bị từ chối' ||
                      (dataDetail?.is_first_unconfirmed === 1 &&
                        dataDetail?.status === 'Không được xác nhận'))
                  "
                  icon-class="delete-info"
                  class="width-20 height-20 pointer"
                  @click="handleShowRemoveFileDetail"
                ></svg-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="w-2/3">
          <!--          <div class="form-quick padding-16 bg-white"-->
          <!--               v-if="isCreateQuick || isEditQuick || (isDetail && dataDetail?.quick_explanation)"-->
          <!--               :class="dataDetail?.quick_explanation && dataDetail?.file_report && isDetail ? 'mr-4 w-1/2' : 'w-full h-full'"-->
          <!--          >-->
          <!--            <div class="mb-2 flex justify-between">-->
          <!--              <span class="fs-18 font-[500]">-->
          <!--                <span class="text&#45;&#45;danger">*</span>-->
          <!--                {{ t('explanationSupport.quickExplanation') }}-->
          <!--              </span>-->
          <!--              <div>-->
          <!--                <el-button-->
          <!--                  v-if="isCreateQuick || !actionUpdate"-->
          <!--                  type="info"-->
          <!--                  style="border: none"-->
          <!--                  class="border-1 paddingX-10 text-white bg&#45;&#45;dark-purple"-->
          <!--                  @click="handleCreateExplanationQuick"-->
          <!--                >{{ $t('omsSetting.save') }}-->
          <!--                </el-button>-->
          <!--                <el-button-->
          <!--                  v-if="isEditQuick && actionUpdate"-->
          <!--                  type="info"-->
          <!--                  style="border: none"-->
          <!--                  class="border-1 paddingX-10 text-white bg&#45;&#45;info"-->
          <!--                  @click="handleChangeAction"-->
          <!--                >{{ $t('explanationSupport.editExplanation') }}-->
          <!--                </el-button>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--            <div v-if="isCreateQuick || !actionUpdate">-->
          <!--              &lt;!&ndash;              <yu-tinymce @input="onChangeTiny" :value="dataDetail?.quick_explanation"/>&ndash;&gt;-->
          <!--              <QuillEditor-->
          <!--                v-model:content="formCreateExplanationQuick.quick_explanation"-->
          <!--                :options="quillOptions"-->
          <!--                content-type="html"-->
          <!--                @textChange="onChangeTiny"-->
          <!--              />-->
          <!--              <p class="text&#45;&#45;danger" v-if="isSubmitted">-->
          <!--                {{ t('omsSetting.ruleEnter') }}-->
          <!--              </p>-->
          <!--              <p class="text&#45;&#45;danger" v-if="characterCount > MAX_LENGTH">-->
          <!--                {{-->
          <!--                  t('configUser.validateMessage.aLessThanB', [t('configUser.passwordPolicy.maxChar'), `${MAX_LENGTH}`])-->
          <!--                }}-->
          <!--              </p>-->
          <!--            </div>-->
          <!--            <div v-if="(isEditQuick && actionUpdate) || (isDetail && dataDetail?.quick_explanation)">-->
          <!--              <div class="view-explanation-quick" v-html="dataDetail?.quick_explanation"></div>-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="form-info padding-16 bg-white">
            <div class="flex items-center justify-between mb-2">
              <p class="fs-18 font-[500] text--primary">
                {{ t('monitoring.toll.explanationNotice') }}
              </p>
              <!-- v-if  && isActionNotify === 'editNotify'-->
              <el-button
                v-if="formDataDetail?.status === 'Mới tạo'"
                style="border: none"
                class="border-1 bg--dark-purple paddingX-20"
                @click="handleUpdateExplanation"
                type="info"
                >{{ $t('omsSetting.update') }}
              </el-button>
            </div>
            <el-form
              :model="formDataDetail"
              label-position="top"
              class="form-custom"
              :rules="rulesUpdate"
              ref="ruleFormUpdate"
            >
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-row :gutter="16">
                    <el-col :span="24">
                      <el-form-item
                        :label="$t('monitoring.toll.nameExplanationNotice')"
                        prop="title"
                        :required="!isShowQuickExplanation(formDataDetail?.status)"
                      >
                        <!-- disable:   || (isDetail && isActionNotify !== 'editNotify')-->
                        <el-input
                          :placeholder="t('configUser.pleaseEnter')"
                          :disabled="isShowQuickExplanation(formDataDetail?.status)"
                          type="text"
                          v-model="formDataDetail.title"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item :label="$t('explanationSupport.typeExplanation')">
                        <el-input
                          :placeholder="t('configUser.pleaseEnter')"
                          disabled
                          type="text"
                          v-model="formDataDetail.type"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item
                        :label="$t('configUser.time')"
                        :required="!isShowQuickExplanation(formDataDetail?.status)"
                        prop="created_at"
                      >
                        <!-- disable:   || (isDetail && isActionNotify !== 'editNotify')-->
                        <el-config-provider :locale="locale">
                          <el-date-picker
                            style="width: 100%"
                            v-model="formDataDetail.created_at"
                            type="datetime"
                            :disabled="isShowQuickExplanation(formDataDetail?.status)"
                            clearable
                            value-format="DD/MM/YYYY HH:mm:ss"
                            format="DD/MM/YYYY HH:mm:ss"
                          />
                        </el-config-provider>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('monitoring.toll.contentExplanationNotice')"
                    prop="content"
                    :required="!isShowQuickExplanation(formDataDetail?.status)"
                  >
                    <!-- disable:   || (isDetail && isActionNotify !== 'editNotify')-->
                    <el-input
                      class="h-full"
                      :placeholder="t('configUser.pleaseEnter')"
                      type="textarea"
                      maxlength="3000"
                      show-word-limit
                      :disabled="isShowQuickExplanation(formDataDetail?.status)"
                      :autosize="{ minRows: 9, maxRows: 9 }"
                      v-model="formDataDetail.content"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('configUser.gland')">
                    <el-input
                      :placeholder="t('configUser.pleaseEnter')"
                      disabled
                      type="text"
                      :value="formDataDetail.route?.name"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('configUser.userManagement.station')">
                    <el-input
                      :placeholder="t('configUser.pleaseEnter')"
                      disabled
                      type="text"
                      :value="formDataDetail.station?.name"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div class="form-table bg-white p-4">
        <p class="fs-18 font-[500]">{{ t('explanationSupport.dataList') }}</p>
        <el-config-provider :locale="locale">
          <el-table
            v-loading="listLoading"
            :data="formDataDetail?.data"
            fit
            highlight-current-row
            style="width: 100%"
            class="cell-main-3"
            :max-height="maxHeight"
          >
            <el-table-column
              type="index"
              width="50"
              label="STT"
            />
            <el-table-column
              :label="$t('explanationSupport.typeDifferent')"
              width="120"
            >
              <template #default="{ row }">
                <span v-if="formDataDetail?.type === 'Sai GD xe MP'">{{
                  row?.consolidateTransResponse?.transFreeType
                }}</span>
                <span v-else>{{ row?.consolidateTransResponse?.transDeviationType }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('configUser.userManagement.route')"
              width="120"
            >
              <template #default>
                <span>{{ formDataDetail?.route?.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Etag">
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.etagOut }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('reconciliation.timeIn')"
              width="120"
            >
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.checkinDateIn }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('reconciliation.stationIn')">
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.stationIn }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('reconciliation.laneIn')">
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.laneIn }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('reconciliation.timeOut')"
              width="120"
            >
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.checkinDateOut }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('reconciliation.stationOut')">
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.stationOut }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('reconciliation.laneOut')">
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.laneOut }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('reconciliation.plateRec')">
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.identificationPlate }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('reconciliation.vehicleType')">
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.vehicleTypeOut }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('reconciliation.plateReg')">
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.registrationPlate }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('reconciliation.amount')">
              <template #default="{ row }">
                <span>{{ row?.consolidateTransResponse?.price }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('configUser.action')">
              <template #default="{ row }">
                <div class="flex items-center flex-wrap gap-1">
                  <div
                    v-if="
                      (formDataDetail.is_first_unconfirmed === 1 &&
                        formDataDetail.status === 'Không được xác nhận') ||
                      formDataDetail?.status === 'Bị từ chối' ||
                      formDataDetail?.status === 'Chờ giải trình' ||
                      formDataDetail?.status === 'Đã giải trình'
                    "
                    class="flex items-center flex-wrap mr-2"
                  >
                    <div title="Giải trình nhanh">
                      <svg-icon
                        icon-class="explanation"
                        class="width-18 height-18 text--info mr-2 pointer"
                        @click="handleOpenDialogExplanationTransaction(row)"
                        v-if="!row.quickExplanation && roleAction.canExplain === 1"
                      />
                    </div>
                    <div title="Sửa giao dịch">
                      <svg-icon
                        icon-class="edit-administrative"
                        v-if="
                          roleAction.canExplain === 1 &&
                          (formDataDetail.type === 'Sai GD xe MP' ||
                            formDataDetail.type === 'Sai thông tin giữa GSTP và Báo cáo đv thu phí')
                        "
                        class="width-18 height-18 pointer"
                        @click="handleOpenDialogUpdateTransaction(row)"
                      />
                    </div>
                  </div>
                  <div title="Xem giải trình">
                    <svg-icon
                      v-if="row.quickExplanation"
                      icon-class="eye"
                      class="width-18 height-18 mr-2 pointer"
                      @click="handleOpenDialogExplanationTransaction(row)"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-config-provider>
      </div>
    </div>
    <Dialog
      :show="showDialogSendNotify"
      :appendToBody="true"
      :width="'720'"
      :title="t('explanationSupport.sendNotify')"
      @closeDialog="handleCloseDialogSendNotify"
    >
      <template v-slot:content>
        <SendNotifyExplanation
          :explanation-id="dataDetail?.id"
          :station-id="stationId"
          :route-id="routeId"
          @close-send-notify="handleCloseDialogSendNotify"
          @load-data="handleBack"
        />
      </template>
    </Dialog>
    <Dialog
      :show="showDialogDeleteNotify"
      :appendToBody="true"
      width="500"
      :title="$t('explanationSupport.deleteNotify')"
      @closeDialog="handleCloseDialogDelete"
    >
      <template v-slot:content>
        <DeleteNotifyExplanation
          :explanation-id="dataDetail?.id"
          @close-delete-notify="handleCloseDialogDelete"
          @load-data="handleBack"
        />
      </template>
    </Dialog>
    <Dialog
      :show="showDialogConfirmExplanation"
      :appendToBody="true"
      width="500"
      :title="$t('omsSetting.confirm')"
      @closeDialog="handleCloseDialogConfirmExplanation"
    >
      <template v-slot:content>
        <div class="bg-white">
          <div class="content mb-3">
            <!--            <span>-->
            <!--              {{-->
            <!--                formNotApprove.status === 'CONFIRMED'-->
            <!--                  ? $t('explanationSupport.confirmDialogExplanation')-->
            <!--                  : formNotApprove.status === 'APPROVED'-->
            <!--                    ? $t('explanationSupport.approveExplanation')-->
            <!--                    : $t('explanationSupport.confirmDialogFile')-->
            <!--              }}-->
            <!--            </span>-->
            <el-form
              :model="formNotApprove"
              :rules="rulesNotApprove"
              ref="ruleFormRefNotApprove"
              label-position="top"
              class="form-custom"
            >
              <el-row :gutter="16" v-if="formNotApprove.status !== 'FILE'">
                <el-col :span="24">
                  <el-form-item
                    :label="
                      formNotApprove.status === 'APPROVED'
                        ? $t('explanationSupport.opinion')
                        : $t('explanationSupport.opinion')
                    "
                    prop="reason"
                    required
                  >
                    <el-input
                      :placeholder="t('configUser.pleaseEnter')"
                      type="textarea"
                      v-model="formNotApprove.reason"
                      show-word-limit
                      maxlength="3000"
                      rows="4"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="form-accept" v-else>
                <div class="content mb-3">{{ $t('administration.ip.confirmDeleteFile') }}</div>
              </div>
              <hr class="margin-bottom-12" />
              <div class="foot flex justify-end">
                <el-button
                  style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
                  class="border-1 paddingX-10"
                  @click="handleCloseDialogConfirmExplanation"
                  type="info"
                  >{{ $t('configUser.cancel') }}
                </el-button>
                <el-button
                  style="background-color: #059efb; border: none"
                  class="border-1 paddingX-30"
                  @click="handleConfirmExplanation"
                  type="success"
                  >{{ $t('omsSetting.confirm') }}
                </el-button>
              </div>
            </el-form>
          </div>
          <!--          <hr class="margin-bottom-24"/>-->
          <!--          <div-->
          <!--            class="action"-->
          <!--          >-->
          <!--            <div class="flex justify-end">-->
          <!--              <el-button-->
          <!--                type="info"-->
          <!--                @click="handleCloseDialogConfirmExplanation"-->
          <!--                class="bg&#45;&#45;secondary"-->
          <!--              >{{ $t('configUser.cancel') }}-->
          <!--              </el-button-->
          <!--              >-->
          <!--              <el-button-->
          <!--                @click="handleConfirmExplanation"-->
          <!--                type="primary"-->
          <!--                class="bg&#45;&#45;dark-purple"-->
          <!--                style="border: transparent"-->
          <!--              >{{ $t('omsSetting.confirm') }}-->
          <!--              </el-button>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </template>
    </Dialog>
    <Dialog
      :show="showDialogNotConfirmExplanation"
      :appendToBody="true"
      width="500"
      :title="$t('omsSetting.confirm')"
      @closeDialog="handleCloseDialogNotConfirmExplanation"
    >
      <template v-slot:content>
        <div class="bg-white">
          <div class="content mb-3">
            <el-form
              :model="formNotApprove"
              :rules="rulesNotApprove"
              ref="ruleFormRefNotApprove"
              label-position="top"
              class="form-custom"
            >
              <el-row :gutter="16">
                <el-col :span="24">
                  <el-form-item
                    :label="
                      formNotApprove.status === 'UNCONFIRMED'
                        ? $t('explanationSupport.reasonNotConfirm')
                        : $t('explanationSupport.reasonReject')
                    "
                    prop="reason"
                    required
                  >
                    <el-input
                      :placeholder="t('configUser.pleaseEnter')"
                      type="textarea"
                      v-model="formNotApprove.reason"
                      show-word-limit
                      maxlength="3000"
                      rows="4"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="foot flex justify-end">
                <el-button
                  style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
                  class="border-1 paddingX-10"
                  @click="handleCloseDialogNotConfirmExplanation"
                  type="info"
                  >{{ $t('configUser.cancel') }}
                </el-button>
                <el-button
                  style="background-color: #059efb; border: none"
                  class="border-1 paddingX-30"
                  @click="handleNotConfirmExplanation"
                  type="success"
                  >{{ $t('omsSetting.confirm') }}
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </template>
    </Dialog>
    <Dialog
      :show="showDialogUpdateTransaction"
      :appendToBody="true"
      width="500"
      :title="$t('explanationSupport.editTransaction')"
      @closeDialog="handleCloseDialogTransaction"
    >
      <template v-slot:content>
        <div class="bg-white">
          <div class="content mb-3">
            <el-form
              :model="formUpdateTransaction"
              :rules="ruleUpdateTransaction"
              ref="ruleFormRefUpdateTransaction"
              label-position="top"
              class="form-custom"
            >
              <el-row :gutter="16">
                <el-col :span="24">
                  <el-form-item
                    :label="$t('reconciliation.vehicleType')"
                    prop="vehicle_type_id"
                  >
                    <el-select
                      v-model="formUpdateTransaction.vehicle_type_id"
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      :max-collapse-tags="1"
                      :placeholder="t('configUser.pleaseSelect')"
                    >
                      <el-option
                        v-for="item in listTypeVehicle"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('reconciliation.amount')"
                  >
                    <el-input
                      :placeholder="t('configUser.pleaseEnter')"
                      type="text"
                      v-model="formUpdateTransaction.price"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('reconciliation.stationIn')"
                    prop="station_in"
                  >
                    <el-select
                      v-model="formUpdateTransaction.station_in"
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      :max-collapse-tags="1"
                      :placeholder="t('configUser.pleaseSelect')"
                    >
                      <el-option
                        v-for="item in stationList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('reconciliation.stationOut')"
                  >
                    <el-select
                      v-model="formUpdateTransaction.station_out"
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      :max-collapse-tags="1"
                      :placeholder="t('configUser.pleaseSelect')"
                    >
                      <el-option
                        v-for="item in stationList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('reconciliation.transactionType')"
                  >
                    <el-select
                      v-model="formUpdateTransaction.trans_type"
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      :max-collapse-tags="1"
                      :placeholder="t('configUser.pleaseSelect')"
                    >
                      <el-option
                        v-for="item in listTransaction"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('monitoring.toll.typeTicket')"
                  >
                    <el-select
                      v-model="formUpdateTransaction.ticket_type"
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      :max-collapse-tags="1"
                      :placeholder="t('configUser.pleaseSelect')"
                    >
                      <el-option
                        v-for="item in listTypeTicket"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="foot flex justify-end">
                <el-button
                  style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
                  class="border-1 paddingX-10"
                  @click="handleCloseDialogTransaction"
                  type="info"
                  >{{ $t('configUser.cancel') }}
                </el-button>
                <el-button
                  style="background-color: #059efb; border: none"
                  class="border-1 paddingX-30"
                  @click="handleUpdateTransaction"
                  type="success"
                  >{{ $t('omsSetting.confirm') }}
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </template>
    </Dialog>
    <Dialog
      :show="showDialogExplanationTransaction"
      :appendToBody="true"
      width="700"
      @closeDialog="handleCloseDialogExplanationTransaction"
    >
      <template v-slot:custom-header>
        <div>
          <span class="fs-20 font-[500]">{{ $t('explanationSupport.quickExplanation') }}</span>
          <svg-icon
            icon-class="edit-administrative"
            v-if="
              isShowDetailExplanationTransaction &&
              roleAction.canExplain === 1 &&
              ((formDataDetail.is_first_unconfirmed === 1 &&
                formDataDetail.status === 'Không được xác nhận') ||
                formDataDetail?.status === 'Bị từ chối' ||
                formDataDetail?.status === 'Chờ giải trình' ||
                formDataDetail?.status === 'Đã giải trình')
            "
            class="width-18 height-18 pointer ml-4"
            @click="isShowDetailExplanationTransaction = !isShowClassQuickExplanation"
          />
        </div>
      </template>
      <template v-slot:content>
        <div class="bg-white">
          <div class="content mb-3">
            <el-form
              :model="formExplanationTransaction"
              :rules="ruleExplanationTransaction"
              ref="ruleFormRefExplanationTransaction"
              label-position="top"
              class="form-custom"
              v-if="!isShowDetailExplanationTransaction"
            >
              <el-row :gutter="16">
                <el-col :span="24">
                  <el-form-item
                    prop="quick_explanation"
                    class="input-custom"
                    required
                  >
                    <QuillEditor
                      v-model:content="formExplanationTransaction.quick_explanation"
                      :options="quillOptions"
                      content-type="html"
                      @blur="onEditorChange('quick_explanation')"
                      theme="snow"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div
              v-if="isShowDetailExplanationTransaction"
              v-html="formExplanationTransaction.quick_explanation"
            ></div>
            <div
              class="foot flex justify-end"
              v-if="!isShowDetailExplanationTransaction"
            >
              <el-button
                style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
                class="border-1 paddingX-10"
                @click="handleCloseDialogExplanationTransaction"
                type="info"
                >{{ $t('configUser.cancel') }}
              </el-button>
              <el-button
                style="background-color: #059efb; border: none"
                class="border-1 paddingX-30"
                @click="handleExplanationTransaction"
                type="success"
                >{{
                  isUpdateExplanationTransaction
                    ? $t('configUser.updateUser')
                    : $t('omsSetting.confirm')
                }}
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.text-file {
  white-space: nowrap;
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.width-50 {
  width: 50% !important;
}
.group-opinion {
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    height: 2px; /* Chiều cao của thanh cuộn ngang */
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc; /* Màu của thanh cuộn */
    border-radius: 2px; /* Làm góc thanh cuộn bo tròn */
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0; /* Màu nền của thanh cuộn */
  }
}

.input-custom {
  :deep(.el-form-item__content) {
    display: block !important;
  }
}

ol {
  list-style: decimal !important;
}
:deep(.ql-font-arial) {
  font-family: Arial, sans-serif;
}
:deep(.ql-font-comic-sans) {
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
.ql-font-courier-new {
  font-family: 'Courier New', monospace;
}
.ql-font-georgia {
  font-family: Georgia, serif;
}
.ql-font-helvetica {
  font-family: Helvetica, sans-serif;
}
.ql-font-times-new-roman {
  font-family: 'Times New Roman', serif;
}
</style>
