<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import lang from '@/locale/getMessage'
import { useAdministrativeDepartmentStore, useAppStore } from '@/store'
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import { cloneDeep, filter } from 'lodash-unified'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])
const listLoading = ref(false)
const loadingInfo = ref(false)
const administrativeDepartmentStore = useAdministrativeDepartmentStore()

const props = defineProps({
  idDetail: {
    type: String,
    default: () => null,
  },
  idDetailDepartment: {
    type: String,
    default: () => null,
  },
  typeDetail: {
    type: Number,
    default: 1, // 1 la chi tiet don vi, 2 la chi tiet phong ban
  },
  listTypeUnit: {
    type: Array,
    default: () => [],
  },
  listUnit: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['initData', 'updateData', 'removeLoadData'])

watch(
  () => [props.idDetail, props.idDetailDepartment, props.typeDetail, props.listUnit],
  newVal => {
    if (newVal[2] === 1) {
      getDetailUnit(newVal[0])
      getUserUnit(newVal[0])
    } else if (newVal[2] === 2) {
      getDetailDepartment(newVal[1])
      getUserDepartment(newVal[1])
    }
  }
)

onMounted(() => {
  console.log('onMounted: ')
})

const dataTable = ref([])
const objDetailUnit = ref(null)
const nameTypeUnit = ref(null)
const nameUnitInDepartment = ref(null)

const objDetailDepartment = ref(null)

const listUserDetail = ref([])
const listUserDetailSearch = ref([])

const maxHeight = computed(() => {
  const viewportHeight = window.innerHeight
  return viewportHeight - 270
})

const showDialogDelete = ref(false)
const idDelete = ref(null)
const inputSearch = ref('')

const getFirstDetailUnit = async () => {
  await administrativeDepartmentStore
    .apiGetDetailUnit(props.idDetail)
    .then(res => {
      objDetailUnit.value = res
      nameTypeUnit.value = props.listTypeUnit.find(
        item => item.id === res.administrativeUnitTypeId
      )?.unitTypeName
    })
    .catch(err => {
      console.log(err)
    })
  getUserUnit(props.idDetail)
}

getFirstDetailUnit()

const getUserUnit = id => {
  listLoading.value = true
  const params = {
    id,
  }
  administrativeDepartmentStore
    .apiGetUserUnit(params)
    .then(res => {
      if (res.status === 200) {
        listUserDetail.value = res.data
        listUserDetailSearch.value = res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      listLoading.value = false
    })
}
const getUserDepartment = id => {
  listLoading.value = true
  const params = {
    id,
  }
  administrativeDepartmentStore
    .apiGetUserDepartment(params)
    .then(res => {
      listUserDetail.value = res
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      listLoading.value = false
    })
}

const tableRowClassName = ({ row }) => {
  if (row.violationLevel > 2) {
    return 'penalize-row'
  } else if (row.violationLevel === 2) {
    return 'warning-row'
  } else {
    return ''
  }
}
const getDetailUnit = async id => {
  loadingInfo.value = true
  await administrativeDepartmentStore
    .apiGetDetailUnit(id)
    .then(res => {
      objDetailUnit.value = res
      nameTypeUnit.value = props.listTypeUnit.find(
        item => item.id === res.administrativeUnitTypeId
      )?.unitTypeName
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      loadingInfo.value = false
    })
}
const getDetailDepartment = async id => {
  loadingInfo.value = true
  await administrativeDepartmentStore
    .apiGetDetailDepartment(id)
    .then(res => {
      objDetailDepartment.value = res
      nameUnitInDepartment.value = props.listUnit.find(
        item => item.id === res.administrativeUnitId
      )?.unitName
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      loadingInfo.value = false
    })
}

const deleteDepartment = async id => {
  showDialogDelete.value = true
  idDelete.value = id
}
const deleteUnit = async id => {
  showDialogDelete.value = true
  idDelete.value = id
}
const updateDetailData = obj => {
  const objUpdate = {
    objDetail: cloneDeep(obj),
    type: props.typeDetail,
  }
  emit('updateData', objUpdate)
}
const handleCloseDialogDelete = () => {
  showDialogDelete.value = false
}
const handleDelete = () => {
  if (props.typeDetail === 1) {
    administrativeDepartmentStore
      .apiDeleteUnit(idDelete.value)
      .then(res => {
        if (res.status === 200) {
          ElMessage({
            message: t('explanationSupport.textActionSuccess', [
              t('administration.category.administrativeDepartment.titleDeleteUnit'),
            ]),
            type: 'success',
          })
          emit('removeLoadData', props.typeDetail)
          showDialogDelete.value = false
        } else {
          ElMessage({
            message: res.message,
            type: 'error',
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    administrativeDepartmentStore
      .apiDeleteDepartment(idDelete.value)
      .then(res => {
        if (res.status === 200) {
          ElMessage({
            message: t('explanationSupport.textActionSuccess', [
              t('administration.category.administrativeDepartment.titleDeleteDepartment'),
            ]),
            type: 'success',
          })
          emit('removeLoadData', props.typeDetail)
          showDialogDelete.value = false
        } else {
          ElMessage({
            message: res.message,
            type: 'error',
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
const handleSearchMember = () => {
  if (inputSearch.value === '') {
    listUserDetail.value = listUserDetailSearch.value
  } else {
    listUserDetail.value = listUserDetailSearch.value.filter(unit =>
      unit.name.toLowerCase().includes(inputSearch.value.toLowerCase())
    )
  }
}
defineOptions({
  name: 'administrative-department-detail',
})
</script>

<template>
  <div>
    <div
      class="form-info padding-24 bg-white mb-4"
      v-loading="loadingInfo"
    >
      <div class="flex justify-between items-center">
        <p class="fs-18 font-[500] text--primary mb-2">
          {{
            typeDetail === 1
              ? $t('administration.category.administrativeDepartment.infoUnit')
              : $t('administration.category.administrativeDepartment.infoDepartment')
          }}
        </p>
        <div class="pointer">
          <svg-icon
            icon-class="edit-administrative"
            class="width-18 height-18 mr-2"
            @click="updateDetailData(typeDetail === 1 ? objDetailUnit : objDetailDepartment)"
          />
          <svg-icon
            icon-class="remove-administrative"
            class="width-18 height-18"
            @click="
              typeDetail === 1
                ? deleteUnit(objDetailUnit.id)
                : deleteDepartment(objDetailDepartment.id)
            "
          />
        </div>
      </div>
      <el-row
        :gutter="20"
        class="mb-1"
      >
        <el-col
          :span="4"
          class="fs-14 text--primary font-[500]"
          >{{
            typeDetail === 1
              ? $t('administration.category.administrativeDepartment.unitName')
              : $t('administration.category.administrativeDepartment.departmentName')
          }}:
        </el-col>
        <el-col
          :span="14"
          class="fs-14 color-[#525B73] text-unit-custom"
          :title="typeDetail === 1 ? objDetailUnit?.unitName : objDetailDepartment?.departmentName"
          >{{ typeDetail === 1 ? objDetailUnit?.unitName : objDetailDepartment?.departmentName }}
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        class="mb-1"
      >
        <el-col
          :span="4"
          class="fs-14 text--primary font-[500]"
          >{{
            typeDetail === 1
              ? $t('administration.category.administrativeDepartment.unitCode')
              : $t('administration.category.administrativeDepartment.departmentCode')
          }}:
        </el-col>
        <el-col
          :span="14"
          class="fs-14 color-[#525B73] text-unit-custom"
          :title="typeDetail === 1 ? objDetailUnit?.code : objDetailDepartment?.code"
          >{{ typeDetail === 1 ? objDetailUnit?.code : objDetailDepartment?.code }}
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        class="mb-1"
      >
        <el-col
          :span="4"
          class="fs-14 text--primary font-[500]"
          >{{
            typeDetail === 1
              ? $t('administration.category.administrativeDepartment.unitType')
              : $t('administration.category.administrativeDepartment.unit')
          }}:
        </el-col>
        <el-col
          :span="14"
          class="fs-14 color-[#525B73]"
          >{{ typeDetail === 1 ? nameTypeUnit : nameUnitInDepartment }}
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        class="mb-1"
      >
        <el-col
          :span="4"
          class="fs-14 text--primary font-[500]"
          >{{
            typeDetail === 1
              ? $t('configUser.address')
              : $t('administration.category.administrativeDepartment.description')
          }}:
        </el-col>
        <el-col
          :span="14"
          class="fs-14 color-[#525B73]"
          >{{ typeDetail === 1 ? objDetailUnit?.unit_address : objDetailDepartment?.description }}
        </el-col>
      </el-row>
    </div>
    <div class="form-info padding-24 bg-white">
      <p class="fs-18 font-[500] text--primary mb-3">
        {{
          typeDetail === 1
            ? $t('administration.category.administrativeDepartment.listMemberUnit')
            : $t('administration.category.administrativeDepartment.listMemberDepartment')
        }}
      </p>
      <el-row
        gutter="10"
        class="search-unit items-center"
      >
        <el-col :span="6">
          <el-input
            v-model="inputSearch"
            :placeholder="t('el.transfer.filterPlaceholder')"
            class="w-full"
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
            @click="handleSearchMember"
          >
            {{ t('configUser.search') }}
          </el-button>
        </el-col>
      </el-row>
      <div class="form-table">
        <el-config-provider :locale="locale">
          <el-table
            v-loading="listLoading"
            :data="listUserDetail"
            fit
            highlight-current-row
            style="width: 100%"
            class="cell-main-3"
            :max-height="maxHeight"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              type="index"
              width="50"
              label="STT"
            />
            <el-table-column
              :label="$t('administration.category.administrativeDepartment.memberName')"
            >
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('configUser.position')">
              <template #default="{ row }">
                <span>{{ row.position }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('configUser.phoneNumber')">
              <template #default="{ row }">
                <span>{{ row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('configUser.email')">
              <template #default="{ row }">
                <span>{{ row.email }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-config-provider>
      </div>
    </div>
    <Dialog
      :show="showDialogDelete"
      :appendToBody="true"
      width="500"
      :title="
        typeDetail === 1
          ? $t('administration.category.administrativeDepartment.titleDeleteUnit')
          : $t('administration.category.administrativeDepartment.titleDeleteDepartment')
      "
      @closeDialog="handleCloseDialogDelete"
    >
      <template v-slot:content>
        <div class="form-delete">
          <div class="content">
            {{
              typeDetail === 1
                ? $t('administration.category.administrativeDepartment.contentDeleteUnit')
                : $t('administration.category.administrativeDepartment.contentDeleteDepartment')
            }}
          </div>
          <div class="foot flex justify-end">
            <el-button
              style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
              class="border-1 paddingX-10"
              @click="handleCloseDialogDelete"
              type="info"
              >{{ $t('configUser.cancel') }}
            </el-button>
            <el-button
              style="background-color: #059efb; border: none"
              class="border-1 paddingX-30"
              @click="handleDelete"
              type="success"
              >{{ $t('omsSetting.confirm') }}
            </el-button>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.text-unit-custom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80%;
  text-align: left;
}
</style>
