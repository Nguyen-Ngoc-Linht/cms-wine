<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backSupplier"
        >
          <img
            src="@/assets/imgs/weightStation/back.png"
            alt=""
          />
        </div>
        <div
          v-if="!isEdit"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.addNew') }}
        </div>
        <div
          v-if="isEdit"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.editUser') }}
        </div>
      </h5>
      <el-button
        v-if="!isEdit"
        :loading="processing"
        @click="handleCreateSupplier"
        class="el-button--main mx-2"
        >{{ $t('omsSetting.save') }}
      </el-button>
      <el-button
        v-if="isEdit"
        :loading="processing"
        @click="handleUpdateSupplier"
        class="el-button--main mx-2"
        >{{ $t('omsSetting.update') }}
      </el-button>
    </div>
    <div
      v-loading="loadingPage"
      class="content-page px-6 mt-4"
    >
      <div class="bg-white px-5 pt-6 pb-4">
        <el-form
          ref="formSupplier"
          :rules="ruleEdit"
          :model="infoSupplier"
          class="custom-form"
        >
          <h5 class="text-black font-semibold text-lg">{{ $t('configUser.infoSupplier') }}</h5>
          <el-row :gutter="10">
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('configUser.codeSupplier')"
                class="custom"
                prop="code"
                style="display: inline-block; width: 100%"
                required
              >
                <el-input
                  v-model="infoSupplier.code"
                  :placeholder="$t('configUser.pleaseEnter')"
                  disabled
                >
                  <template #suffix>
                    <svg-icon
                      icon-class="plus"
                      class="cursor-pointer width-20 height-20"
                      @click="getCode"
                      v-if="!infoSupplier.code"
                    />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('configUser.nameSupplier')"
                prop="name"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoSupplier.name"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </el-col>
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('configUser.address')"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoSupplier.address"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </el-col>
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('configUser.phoneNumber1')"
                class="custom mb-2"
                prop="contactNumber"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoSupplier.contactNumber"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </el-col>
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('configUser.servicePeriod')"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <InputInteger
                  v-model="infoSupplier.duration"
                  :append="true"
                  :max-length="3"
                  :placeholder="$t('configUser.pleaseEnter')"
                >
                  <template #append>{{ t('el.datepicker.year')?.toLowerCase() }}</template>
                </InputInteger>
              </el-form-item>
            </el-col>
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('configUser.typeSupplier')"
                class="custom"
                prop="type"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoSupplier.type"
                  filterable
                  collapse-tags
                  clearable
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                >
                  <el-option
                    v-for="item in listTypeSupplier"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="flex justify-between mt-4">
          <h5 class="text-black font-semibold text-lg">{{ t('configUser.listMembers') }}</h5>
          <el-button
            text
            size="default"
            class="!p-0"
            @click="openAddMember"
          >
            <div
              class="flex items-center pointer text-[#525B73]"
              style="line-height: 20px"
            >
              <svg-icon
                icon-class="el-icon-plus"
                class="width-20 height-20 margin-right-4"
              />
              {{ $t('configUser.addMember') }}
            </div>
          </el-button>
        </div>
        <div class="mt-3">
          <el-table
            v-loading="listLoading"
            :data="infoSupplier.members"
            fit
            row-key="id"
            highlight-current-row
            style="width: 100%"
            class="cell-main-3 table-members"
            :row-class-name="({ row }) => (row.isDelete ? 'delete-row' : '')"
          >
            <el-table-column
              type="index"
              label="STT"
              width="55"
            >
              <template #default="{ row }">
                <span>{{ getIndex(row) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('administration.category.administrativeDepartment.nameOfTheResponsible')"
            >
              <template #default="{ row }">
                <span :title="row.name">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('configUser.phoneNumber1')">
              <template #default="{ row }">
                <span>{{ row.contactNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Email">
              <template #default="{ row }">
                <span>{{ row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('configUser.action')"
              width="100"
            >
              <template #default="{ row, $index }">
                <span
                  @click.stop="openEditMember(row, $index)"
                  class="delete-member pointer ms-2 me-3"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="edit-administrative"
                    class="mr-2"
                  />
                </span>
                <span
                  @click.stop="openDeleteMember(row, $index)"
                  class="delete-member pointer"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="remove-administrative"
                  />
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <Dialog
      :show="showDialog"
      :appendToBody="true"
      :width="'556'"
      :title="t('configUser.addMember')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <AddMember
          @closeUpdate="handleCloseDialog"
          @backupData="handleBackupMember"
          @successAddMember="handleAddMember"
          @successUpdateMember="handleUpdateMember"
          :member-info="infoMember"
          :is-edit="editMember"
        />
      </template>
    </Dialog>
    <el-dialog
      v-model="showDialogDelete"
      :title="$t('configUser.deleteMember')"
      width="500"
      align-center
    >
      <span>{{ $t('omsSetting.confirmDelete') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogDelete = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteMember()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import { apiGenCategoryCode } from '@/api/category'
import { useAppStore, usePermissionStore } from '@/store'
import InputInteger from '@/components/InputInteger/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import AddMember from '@/views/administration/category/expressway/components/addMember.vue'
import { apiCreateSupplier, apiGetSupplier, apiUpdateSupplier } from '@/api/expressway'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const isEdit = ref(false)
const listTypeSupplier = ref([
  {
    id: 1,
    name: t('configUser.serviceProviderFe'),
    value: 1,
  },
  {
    id: 2,
    name: t('configUser.serviceProviderBE'),
    value: 2,
  },
  {
    id: 3,
    name: t('configUser.miningOperatingUnit'),
    value: 3,
  },
  {
    id: 4,
    name: t('configUser.managementUnit'),
    value: 4,
  },
])
const ruleEdit = ref({
  code: [{ required: true, message: t('omsSetting.ruleEnter') }],
  name: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  type: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  address: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  contactNumber: [
    { required: false, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    {
      pattern: /^[0-9]{10}$/,
      message: t('configUser.validateMessage.phoneFormat'),
      trigger: 'blur',
    },
  ],
  duration: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})

const loadingPage = ref(false)
const listLoading = ref(false)
const processing = ref(false)
const showDialog = ref(false)
const showDialogDelete = ref(false)
const formSupplier = ref(null)
const infoSupplier = ref({})
const infoMember = ref({})
const indexMember = ref(null)

onMounted(() => {
  initData()
})

const getCode = async () => {
  await apiGenCategoryCode(7)
    .then(res => {
      infoSupplier.value.code = res.data
    })
    .catch(_ => {
      ElMessage({
        type: 'error',
        message: 'Gen code error',
      })
    })
}
const initData = async () => {
  await getCode()
  const id_supplier = route.params.id
  if (id_supplier) {
    isEdit.value = true
    const rs = await apiGetSupplier(id_supplier)
    if (rs.status === 200) {
      console.log(rs)
      infoSupplier.value = rs.data
    }
  }
}
const handleCreateSupplier = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      code: infoSupplier.value.code,
      name: infoSupplier.value.name,
      contactNumber: infoSupplier.value.contactNumber,
      address: infoSupplier.value.address,
      duration: infoSupplier.value.duration,
      type: infoSupplier.value.type,
      members: infoSupplier.value.members ? infoSupplier.value.members : [],
    }
    const rs = await apiCreateSupplier(params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push(`/administration/category/expressway/?activeName=supplier`)
    }
    processing.value = false
  } catch (e) {
    console.log(e)
    processing.value = false
  }
}
const handleUpdateSupplier = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const rs = await apiUpdateSupplier(infoSupplier.value, infoSupplier.value.id)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push(`/administration/category/expressway/?activeName=supplier`)
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}

const validFormData = () => {
  return new Promise((resolve, reject) => {
    formSupplier.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}

const editMember = ref(false)
const handleAddMember = member => {
  if (!infoSupplier.value.members || !Array.isArray(infoSupplier.value.members)) {
    infoSupplier.value.members = []
  }
  infoSupplier.value.members.push(member)
  showDialog.value = false
}
const handleUpdateMember = () => {
  showDialog.value = false
}
const handleDeleteMember = async () => {
  // infoSupplier.value.members.splice(indexMember.value, 1)
  infoSupplier.value.members[indexMember.value].isDelete = true
  showDialogDelete.value = false
}
const handleBackupMember = member => {
  infoSupplier.value.members[indexMember.value] = member
  showDialog.value = false
}
const openAddMember = () => {
  editMember.value = false
  showDialog.value = true
  infoMember.value = {}
}
const openEditMember = (data, index) => {
  indexMember.value = index
  editMember.value = true
  infoMember.value = data
  showDialog.value = true
}
const openDeleteMember = (data, index) => {
  infoMember.value = data
  indexMember.value = index
  showDialogDelete.value = true
}
const getIndex = row => {
  const filteredData = infoSupplier.value.members.filter(member => !member.isDelete)
  return filteredData.indexOf(row) + 1
}

const handleCloseDialog = () => {
  showDialog.value = false
}
const backSupplier = () => {
  router.push(`/administration/category/expressway?activeName=supplier`)
}
</script>

<style lang="scss">
.table-members {
  .delete-row {
    display: none !important;
  }
}
</style>
