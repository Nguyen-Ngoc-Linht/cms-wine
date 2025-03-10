<template>
  <div class="form-role">
    <div class="relative">
      <div
        class="page-header z-[100] bg-[#fff] flex items-center justify-between sticky z-[1000] top-0 left-0 right-0 height-50 border-b border-[#CDCDCE]"
      >
        <div
          class="flex gap-px-8 items-center paddingX-12 paddingY-12"
          @click="backToList"
        >
          <svg-icon
            icon-class="back"
            class="color-[#525B73] cursor-pointer width-20 height-20"
          />
          <span class="text-[18px] text-[#525B73]">
            {{
              isCreate
                ? t('configUser.addNew')
                : isEdit
                ? t('configUser.edit')
                : t('administration.role.detail')
            }}
          </span>
        </div>
        <div
          class="action-head paddingX-12"
          v-if="!viewOnly"
        >
          <div class="flex justify-content-end">
            <el-button
              type="default"
              @click="backToList()"
              >{{ t('omsSetting.cancel') }}</el-button
            >
            <el-button
              class="el-button--main"
              type="primary"
              @click="submitForm()"
              :loading="processing"
              >{{ isCreate ? t('omsSetting.save') : t('omsSetting.update') }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <el-form
        ref="ruleForm"
        class="flex"
        :model="roleInfo"
        :rules="rules"
        label-position="top"
        label-width="200px"
        v-loading="loading"
      >
        <div class="paddingX-14 w-full">
          <div class="bg-white paddingX-16 padding-top-12 padding-bottom-3 marginY-14">
            <h2 class="font-medium text-[18px]">{{ t('omsSetting.generalInfo') }}</h2>
            <el-row :gutter="20">
              <el-col
                :sm="12"
                :lg="9"
              >
                <el-form-item
                  :label="t('administration.role.roleName')"
                  prop="roleName"
                  required
                >
                  <el-input
                    v-model="roleInfo.roleName"
                    :disabled="viewOnly"
                    :maxlength="250"
                  />
                </el-form-item>
                <el-form-item
                  :label="t('administration.role.description')"
                  prop="description"
                >
                  <el-input
                    type="textarea"
                    v-model="roleInfo.description"
                    :disabled="viewOnly"
                    :maxlength="250"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="bg-white paddingX-16 paddingY-14 role-table">
            <el-scrollbar height="520">
              <table
                class="table-roles"
                :key="updateKey"
              >
                <thead>
                  <tr>
                    <th style="width: calc(100%)">
                      <div class="header-block-item">
                        <h2 class="font-medium text-[18px] required mr-2">
                          {{ t('administration.role.feature') }}
                        </h2>
                        <div class="w-full max-w-[250px]">
                          <el-select
                            v-model="typeMenu"
                            clearable
                            placeholder="Tất cả"
                          >
                            <el-option
                              label="Tất cả"
                              value="0"
                            />
                            <el-option
                              v-for="item in menu"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            />
                          </el-select>
                        </div>
                      </div>
                    </th>
                    <th style="min-width: 100px">{{ t('administration.role.all') }}</th>
                    <th>{{ t('administration.role.view') }}</th>
                    <th>{{ t('administration.role.create') }}</th>
                    <th>{{ t('administration.role.alter') }}</th>
                    <th>{{ t('administration.role.delete') }}</th>
                    <th>{{ t('administration.role.export') }}</th>
                    <th>{{ t('administration.role.approve') }}</th>
                    <th>{{ t('administration.role.confirm') }}</th>
                    <th>{{ t('administration.role.explain') }}</th>
                    <th>{{ t('administration.role.notify') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="menu">
                    <template
                      v-for="val in menuListQuery"
                      :key="val.id"
                    >
                      <tr>
                        <td>
                          <b>{{ val.name }}</b>
                        </td>
                        <td style="min-width: 100px">
                          <div class="resource-check">
                            <el-checkbox
                              v-model="roleInfo.checkAllApp[val.id]"
                              :disabled="viewOnly || val.id === 7"
                              @change="checkAllMenuForApp($event, val.id)"
                            />
                          </div>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <template
                        v-for="valChild in val.listMenu"
                        :key="valChild.id"
                      >
                        <tr>
                          <td style="width: calc(100%)">
                            <span style="padding-left: 30px" />
                            <span
                              v-if="valChild.parentId !== null"
                              style="padding-left: 30px"
                            />
                            {{ valChild.name }}
                          </td>
                          <td style="min-width: 100px">
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-model="roleInfo.checkAllGroup[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeMenu($event, valChild, val.id)"
                              />
                            </div>
                            <div
                              class="resource-check"
                              v-else
                            >
                              <el-checkbox
                                v-model="roleInfo.checkAllMenu[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeAllMenu($event, valChild.id, val.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-if="dectectRoleMenu(valChild.methods, 'detail')"
                                :disabled="
                                  detectDisableMenu(valChild) || viewOnly || valChild.disabled
                                "
                                v-model="roleInfo.listPolicyType[valChild.id]"
                                @change="changeCheckMenu($event, valChild, 'list', val.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-if="dectectRoleMenu(valChild.methods, 'create')"
                                v-model="roleInfo.createPolicyType[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeCheckMenu($event, valChild, 'create', val.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-if="dectectRoleMenu(valChild.methods, 'update')"
                                v-model="roleInfo.updatePolicyType[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeCheckMenu($event, valChild, 'update', val.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-if="dectectRoleMenu(valChild.methods, 'delete')"
                                v-model="roleInfo.deletePolicyType[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeCheckMenu($event, valChild, 'delete', val.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-if="dectectRoleMenu(valChild.methods, 'export')"
                                v-model="roleInfo.exportPolicyType[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeCheckMenu($event, valChild, 'export', val.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-if="dectectRoleMenu(valChild.methods, 'approve')"
                                v-model="roleInfo.approvePolicyType[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeCheckMenu($event, valChild, 'approve', val.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-if="dectectRoleMenu(valChild.methods, 'confirm')"
                                v-model="roleInfo.confirmPolicyType[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeCheckMenu($event, valChild, 'confirm', val.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-if="dectectRoleMenu(valChild.methods, 'explain')"
                                v-model="roleInfo.explainPolicyType[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeCheckMenu($event, valChild, 'explain', val.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <div
                              class="resource-check"
                              v-if="
                                valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                              "
                            >
                              <el-checkbox
                                v-if="dectectRoleMenu(valChild.methods, 'notify')"
                                v-model="roleInfo.notifyPolicyType[valChild.id]"
                                :disabled="viewOnly || valChild.disabled"
                                @change="changeCheckMenu($event, valChild, 'notify', val.id)"
                              />
                            </div>
                          </td>
                        </tr>
                      </template>
                    </template>
                  </template>
                </tbody>
              </table>
            </el-scrollbar>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref, getCurrentInstance } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import { useAppStore, usePermissionStore, useUserStore } from '@/store'
import lang from '@/locale/getMessage.js'
import {
  apiGetAbacResource,
  apiCheckRoleRelation,
  apiAddRole,
  apiUpdateRole,
  apiGetRoleDetail,
} from '@/api/role'
import { apiGetListMenu, apiGetMenuByRole } from '@/api/menu-management'
import { trimData } from '@/utils'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'

const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])

const { roleData } = usePermissionStore()
const { roles, isAdmin } = useUserStore()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const props = defineProps({
  isCreate: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const loading = ref(true)
// const isSuperAdmin = ref(false)
const viewOnly = ref(
  (!props.isCreate && !props.isEdit) ||
    (props.isCreate && !roleData.canCreate) ||
    (props.isEdit && !roleData.canUpdate)
)

const backToList = () => {
  router.push('/administration/system/role')
}

const roleInfo = reactive({
  id: '',
  roleName: '',
  roleCode: '',
  description: '',
  createPolicyType: {},
  detailPolicyType: {},
  listPolicyType: {},
  updatePolicyType: {},
  deletePolicyType: {},
  exportPolicyType: {},
  approvePolicyType: {},
  confirmPolicyType: {},
  explainPolicyType: {},
  notifyPolicyType: {},
  checkAllGroup: {},
  checkAllMenu: {},
  checkAllApp: {},
  menu: {},
  resource: [],
})

const rules = reactive({
  roleName: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})

const menu = ref([])
const typeMenu = ref(null)
const resource = ref(null)
const checkRoleRelation = ref([])
const getMenuForRole = roleCode => {
  const params = {
    role: roleCode,
  }
  apiGetMenuByRole(params)
    .then(res => {
      if (res.data && res.data.length > 0) {
        const menu = res.data
        menu.forEach(val => {
          if (val.canCreate) roleInfo.createPolicyType[val.menuId.id] = true
          if (val.canRead) roleInfo.detailPolicyType[val.menuId.id] = true
          if (val.canRead) roleInfo.listPolicyType[val.menuId.id] = true
          if (val.canUpdate) roleInfo.updatePolicyType[val.menuId.id] = true
          if (val.canDelete) roleInfo.deletePolicyType[val.menuId.id] = true
          if (val.canExport) roleInfo.exportPolicyType[val.menuId.id] = true
          if (val.canApprove) roleInfo.approvePolicyType[val.menuId.id] = true
          if (val.canConfirm) roleInfo.confirmPolicyType[val.menuId.id] = true
          if (val.canExplain) roleInfo.explainPolicyType[val.menuId.id] = true
          if (val.canNotify) roleInfo.notifyPolicyType[val.menuId.id] = true

          // if (roleInfo.createPolicyType[val.menuId.id] &&
          //   roleInfo.listPolicyType[val.menuId.id] &&
          //   roleInfo.updatePolicyType[val.menuId.id] &&
          //   roleInfo.deletePolicyType[val.menuId.id] &&
          //   roleInfo.approvePolicyType[val.menuId.id] &&
          //   roleInfo.confirmPolicyType[val.menuId.id] &&
          //   roleInfo.explainPolicyType[val.menuId.id] &&
          //   roleInfo.notifyPolicyType[val.menuId.id]
          // ) {
          //   roleInfo.checkAllGroup[val.menuId.id] = true
          // }
          roleInfo.checkAllGroup[val.menuId.id] = detectGroupCheck(val.menuId)

          roleInfo.checkAllMenu[val.menuId.parentId] = detectMenuCheck(
            detectAppId(val.menuId.id),
            val.menuId.parentId
          )
          roleInfo.checkAllApp[detectAppId(val.menuId.id)] = detectMenuCheckApp(
            detectAppId(val.menuId.id)
          )
        })
      }
      roleInfo.roleName = roleInfo.roleName + ' '
      roleInfo.roleName = roleInfo.roleName.trim()
    })
    .catch(err => {
      console.log(err)
    })
}
const getRoleInfo = async () => {
  if (!props.isCreate) {
    const { data } = await apiGetRoleDetail(route.params.id)
    if (data) {
      if (data.isAdmin) {
        viewOnly.value = true
      }
      Object.assign(roleInfo, data)
      getMenuForRole(data.roleCode)
    }
  }
}
const getAbacResources = () => {
  apiGetAbacResource()
    .then(res => {
      resource.value = res.data
    })
    .catch(_ => {})
}

const getMenu = () => {
  apiGetListMenu()
    .then(res => {
      menu.value = res.data
      if (!props.isCreate && roleInfo.isAdmin) {
        checkAllIfAdmin(res.data)
      }
    })
    .catch(_ => {})
}
const checkAllIfAdmin = data => {
  data.forEach(val => {
    roleInfo.checkAllApp[val.id] = true
    val.listMenu.forEach(valChild => {
      roleInfo.checkAllMenu[valChild.parentId] = true
      roleInfo.checkAllGroup[valChild.id] = true
      roleInfo.createPolicyType[valChild.id] = true
      roleInfo.detailPolicyType[valChild.id] = true
      roleInfo.listPolicyType[valChild.id] = true
      roleInfo.updatePolicyType[valChild.id] = true
      roleInfo.deletePolicyType[valChild.id] = true
      roleInfo.exportPolicyType[valChild.id] = true
      roleInfo.approvePolicyType[valChild.id] = true
      roleInfo.confirmPolicyType[valChild.id] = true
      roleInfo.explainPolicyType[valChild.id] = true
      roleInfo.notifyPolicyType[valChild.id] = true
    })
  })
}
const ObjectFilter = obj => {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value))
}

const getRoleRelation = () => {
  apiCheckRoleRelation()
    .then(res => {
      checkRoleRelation.value = res.data
    })
    .catch(_ => {})
}

onMounted(async () => {
  if (props.isCreate) {
    getAbacResources()
    getMenu()
    getRoleRelation()
    loading.value = false
  } else {
    // isSuperAdmin.value = Array.isArray(roles) && roles.length > 0 && roles[0] === 'SUPER_ADMIN'
    await getRoleInfo()
    //  getAbacResources()
    getMenu()
    loading.value = false
  }
})

const menuListQuery = computed(() => {
  const data = menu.value
  if (typeMenu.value && typeMenu.value !== '0') {
    return data.filter(val => {
      return val.id === typeMenu.value
    })
  }
  return data
})
const checkTypeParam = type => {
  const typeValue = ['group', 'role', 'owner']
  if (typeValue !== null) {
    return typeValue.includes(type)
  }
}
const checkRoleStar = (type, val) => {
  let resutl = true
  if (val[type] === '*') {
    resutl = false
  }
  return resutl
}
const updateKey = ref(0)

const forceUpdate = () => {
  // updateKey.value++
  const instance = getCurrentInstance()
  instance?.proxy?.$forceUpdate()
}
const dectectRoleMenu = (method, type) => {
  if (method !== null) {
    switch (type) {
      case 'detail':
        return method.includes('DETAIL')
      case 'create':
        return method.includes('POST')
      case 'update':
        return method.includes('PUT')
      case 'delete':
        return method.includes('DELETE')
      case 'export':
        return method.includes('EXPORT')
      case 'approve':
        return method.includes('APPROVE')
      case 'confirm':
        return method.includes('CONFIRM')
      case 'explain':
        return method.includes('EXPLAIN')
      case 'notify':
        return method.includes('NOTIFY')
      default:
        return false
    }
  }
  return false
}
const checkOnlyMenu = (menuId, menuParentId) => {
  let menuList = menu.value.filter(val => {
    return val.id == menuParentId
  })
  if (menuList.length > 0) {
    menuList = menuList[0].listMenu.filter(val => {
      return val.parentId == menuId
    })
    if (menuList.length == 0) {
      return false
    }
  }
  return true
}

const detectGroupCheck = data => {
  let result = true
  if (
    !roleInfo.listPolicyType[data.id] ||
    (data.methods.includes('POST') && !roleInfo.createPolicyType[data.id]) ||
    (data.methods.includes('PUT') && !roleInfo.updatePolicyType[data.id]) ||
    (data.methods.includes('DELETE') && !roleInfo.deletePolicyType[data.id]) ||
    (data.methods.includes('EXPORT') && !roleInfo.exportPolicyType[data.id]) ||
    (data.methods.includes('APPROVE') && !roleInfo.approvePolicyType[data.id]) ||
    (data.methods.includes('CONFIRM') && !roleInfo.confirmPolicyType[data.id]) ||
    (data.methods.includes('EXPLAIN') && !roleInfo.explainPolicyType[data.id]) ||
    (data.methods.includes('NOTIFY') && !roleInfo.notifyPolicyType[data.id])
  ) {
    result = false
  }
  return result
}
const detectMenuCheck = (menuId, menuParentId) => {
  let result = true
  let menuList = menu.value.filter(val => {
    return val.id == menuParentId
  })
  if (menuList.length > 0) {
    menuList = menuList[0].listMenu.filter(val => {
      return val.parentId == menuId
    })
    menuList.forEach(val => {
      if (
        !roleInfo.listPolicyType[val.id] ||
        (val.methods.includes('POST') && !roleInfo.createPolicyType[val.id]) ||
        (val.methods.includes('PUT') && !roleInfo.updatePolicyType[val.id]) ||
        (val.methods.includes('DELETE') && !roleInfo.deletePolicyType[val.id]) ||
        (val.methods.includes('EXPORT') && !roleInfo.exportPolicyType[val.id]) ||
        (val.methods.includes('APPROVE') && !roleInfo.approvePolicyType[val.id]) ||
        (val.methods.includes('CONFIRM') && !roleInfo.confirmPolicyType[val.id]) ||
        (val.methods.includes('EXPLAIN') && !roleInfo.explainPolicyType[val.id]) ||
        (val.methods.includes('NOTIFY') && !roleInfo.notifyPolicyType[val.id])
      ) {
        result = false
      }
    })
  }
  return result
}
const detectMenuCheckApp = menuParentId => {
  let result = true
  if (menu.value) {
    const menuList = menu.value.filter(val => {
      return val.id == menuParentId
    })
    if (menuList.length > 0) {
      menuList[0].listMenu.forEach(val => {
        if (!val.parentId && checkOnlyMenu(val.id, menuParentId)) {
        } else {
          if (
            !roleInfo.listPolicyType[val.id] ||
            (val.methods.includes('POST') && !roleInfo.createPolicyType[val.id]) ||
            (val.methods.includes('PUT') && !roleInfo.updatePolicyType[val.id]) ||
            (val.methods.includes('DELETE') && !roleInfo.deletePolicyType[val.id]) ||
            (val.methods.includes('EXPORT') && !roleInfo.exportPolicyType[val.id]) ||
            (val.methods.includes('APPROVE') && !roleInfo.approvePolicyType[val.id]) ||
            (val.methods.includes('CONFIRM') && !roleInfo.confirmPolicyType[val.id]) ||
            (val.methods.includes('EXPLAIN') && !roleInfo.explainPolicyType[val.id]) ||
            (val.methods.includes('NOTIFY') && !roleInfo.notifyPolicyType[val.id])
          ) {
            result = false
          }
        }
      })
    }
  }
  return result
}
const detectAppId = menuId => {
  let idApp = null
  if (menu.value && menu.value.length > 0) {
    menu.value.forEach(val => {
      val.listMenu.forEach(valChild => {
        if (valChild.id == menuId) {
          idApp = val.id
        }
      })
    })
  }
  return idApp
}
const changeMenu = ($event, data, menuParentId) => {
  roleInfo.listPolicyType[data.id] = $event
  roleInfo.createPolicyType[data.id] = data.methods.includes('POST') ? $event : 0
  roleInfo.updatePolicyType[data.id] = data.methods.includes('PUT') ? $event : 0
  roleInfo.deletePolicyType[data.id] = data.methods.includes('DELETE') ? $event : 0
  roleInfo.exportPolicyType[data.id] = data.methods.includes('EXPORT') ? $event : 0
  roleInfo.approvePolicyType[data.id] = data.methods.includes('APPROVE') ? $event : 0
  roleInfo.confirmPolicyType[data.id] = data.methods.includes('CONFIRM') ? $event : 0
  roleInfo.explainPolicyType[data.id] = data.methods.includes('EXPLAIN') ? $event : 0
  roleInfo.notifyPolicyType[data.id] = data.methods.includes('NOTIFY') ? $event : 0
  forceUpdate()
  roleInfo.checkAllMenu[data.parentId] = detectMenuCheck(data.parentId, menuParentId)
  roleInfo.checkAllApp[menuParentId] = detectMenuCheckApp(menuParentId)
}
const changeCheckMenu = ($event, data, type, menuParentId) => {
  if (type === 'create') roleInfo.createPolicyType[data.id] = $event
  if (type === 'list') roleInfo.listPolicyType[data.id] = $event
  if (type === 'update') roleInfo.updatePolicyType[data.id] = $event
  if (type === 'delete') roleInfo.deletePolicyType[data.id] = $event
  if (type === 'export') roleInfo.exportPolicyType[data.id] = $event
  if (type === 'approve') roleInfo.approvePolicyType[data.id] = $event
  if (type === 'confirm') roleInfo.confirmPolicyType[data.id] = $event
  if (type === 'explain') roleInfo.explainPolicyType[data.id] = $event
  if (type === 'notify') roleInfo.notifyPolicyType[data.id] = $event

  if (
    ['create', 'delete', 'update', 'export', 'approve', 'confirm', 'explain', 'notify'].includes(
      type
    ) &&
    $event
  ) {
    roleInfo.listPolicyType[data.id] = $event
  }
  if (
    type === 'list' &&
    (roleInfo.createPolicyType[data.id] ||
      roleInfo.updatePolicyType[data.id] ||
      roleInfo.deletePolicyType[data.id] ||
      roleInfo.exportPolicyType[data.id] ||
      roleInfo.approvePolicyType[data.id] ||
      roleInfo.confirmPolicyType[data.id] ||
      roleInfo.explainPolicyType[data.id] ||
      roleInfo.notifyPolicyType[data.id])
  ) {
    roleInfo.listPolicyType[data.id] = true
  }

  // if (roleInfo.createPolicyType[data.id] && roleInfo.listPolicyType[data.id] && roleInfo.updatePolicyType[data.id] && roleInfo.deletePolicyType[data.id] && roleInfo.exportPolicyType[data.id] && roleInfo.approvePolicyType[data.id] && roleInfo.confirmPolicyType[data.id] && roleInfo.explainPolicyType[data.id] && roleInfo.notifyPolicyType[data.id]) {
  //   roleInfo.checkAllGroup[data.id] = true
  // }
  if ($event) {
    roleInfo.checkAllGroup[data.id] = detectGroupCheck(data)
  } else {
    roleInfo.checkAllGroup[data.id] = false
  }
  roleInfo.checkAllMenu[data.parentId] = detectMenuCheck(data.parentId, menuParentId)
  roleInfo.checkAllApp[menuParentId] = detectMenuCheckApp(menuParentId)
  roleInfo.roleName = roleInfo.roleName + ' '
  roleInfo.roleName = roleInfo.roleName.trim()
  // forceUpdate()
}
const detectDisableMenu = data => {
  if (
    roleInfo.createPolicyType[data.id] ||
    roleInfo.updatePolicyType[data.id] ||
    roleInfo.deletePolicyType[data.id] ||
    roleInfo.exportPolicyType[data.id] ||
    roleInfo.approvePolicyType[data.id] ||
    roleInfo.confirmPolicyType[data.id] ||
    roleInfo.explainPolicyType[data.id] ||
    roleInfo.notifyPolicyType[data.id]
  ) {
    return true
  }
  return false
}
const changeAllMenu = ($event, menuId, menuParentId) => {
  let menuList = menu.value.filter(val => {
    return val.id == menuParentId
  })
  if (menuList.length > 0) {
    menuList = menuList[0].listMenu.filter(val => {
      return val.parentId == menuId || val.id == menuId
    })
    if (menuList.length > 0) {
      menuList.forEach(val => {
        roleInfo.listPolicyType[val.id] = $event
        roleInfo.createPolicyType[val.id] = val.methods.includes('POST') ? $event : 0
        roleInfo.updatePolicyType[val.id] = val.methods.includes('PUT') ? $event : 0
        roleInfo.deletePolicyType[val.id] = val.methods.includes('DELETE') ? $event : 0
        roleInfo.exportPolicyType[val.id] = val.methods.includes('EXPORT') ? $event : 0
        roleInfo.approvePolicyType[val.id] = val.methods.includes('APPROVE') ? $event : 0
        roleInfo.confirmPolicyType[val.id] = val.methods.includes('CONFIRM') ? $event : 0
        roleInfo.explainPolicyType[val.id] = val.methods.includes('EXPLAIN') ? $event : 0
        roleInfo.notifyPolicyType[val.id] = val.methods.includes('NOTIFY') ? $event : 0
        roleInfo.checkAllGroup[val.id] = $event
      })
    } else {
      roleInfo.createPolicyType[menuId] = $event
      roleInfo.listPolicyType[menuId] = $event
      roleInfo.updatePolicyType[menuId] = $event
      roleInfo.deletePolicyType[menuId] = $event
      roleInfo.exportPolicyType[menuId] = $event
      roleInfo.approvePolicyType[menuId] = $event
      roleInfo.confirmPolicyType[menuId] = $event
      roleInfo.explainPolicyType[menuId] = $event
      roleInfo.notifyPolicyType[menuId] = $event
      roleInfo.checkAllGroup[menuId] = $event
    }
  }
  forceUpdate()
  roleInfo.checkAllApp[menuParentId] = detectMenuCheckApp(menuParentId)
}
const checkAllMenuForApp = ($event, menuId) => {
  const menuList = menu.value.filter(val => {
    return val.id == menuId
  })

  if (menuList.length > 0) {
    menuList[0].listMenu.forEach(val => {
      roleInfo.listPolicyType[val.id] = $event
      roleInfo.createPolicyType[val.id] = val.methods.includes('POST') ? $event : 0
      roleInfo.updatePolicyType[val.id] = val.methods.includes('PUT') ? $event : 0
      roleInfo.deletePolicyType[val.id] = val.methods.includes('DELETE') ? $event : 0
      roleInfo.exportPolicyType[val.id] = val.methods.includes('EXPORT') ? $event : 0
      roleInfo.approvePolicyType[val.id] = val.methods.includes('APPROVE') ? $event : 0
      roleInfo.confirmPolicyType[val.id] = val.methods.includes('CONFIRM') ? $event : 0
      roleInfo.explainPolicyType[val.id] = val.methods.includes('EXPLAIN') ? $event : 0
      roleInfo.notifyPolicyType[val.id] = val.methods.includes('NOTIFY') ? $event : 0
      roleInfo.checkAllGroup[val.id] = $event
      roleInfo.checkAllMenu[val.parentId] = detectMenuCheck(val.parentId, menuId)
    })
  }
  forceUpdate()
}

const dectDataMenu = data => {
  const listRoleMenus = []
  let item = {}
  const listMenuCheck = []
  console.log(data)
  Object.keys(data.createPolicyType).forEach(function (key) {
    if (data.createPolicyType[key]) {
      if (listMenuCheck[key]) {
        listMenuCheck[key].create = 1
      } else {
        listMenuCheck[key] = {}
        listMenuCheck[key].create = 1
      }
    }
  })
  Object.keys(data.listPolicyType).forEach(function (key) {
    if (data.listPolicyType[key]) {
      if (listMenuCheck[key]) {
        listMenuCheck[key].list = 1
        listMenuCheck[key].detail = 1
      } else {
        listMenuCheck[key] = {}
        listMenuCheck[key].list = 1
        listMenuCheck[key].detail = 1
      }
    }
  })
  Object.keys(data.updatePolicyType).forEach(function (key) {
    if (data.updatePolicyType[key]) {
      if (listMenuCheck[key]) {
        listMenuCheck[key].update = 1
      } else {
        listMenuCheck[key] = {}
        listMenuCheck[key].update = 1
      }
    }
  })
  Object.keys(data.deletePolicyType).forEach(function (key) {
    if (data.deletePolicyType[key]) {
      if (listMenuCheck[key]) {
        listMenuCheck[key].delete = 1
      } else {
        listMenuCheck[key] = {}
        listMenuCheck[key].delete = 1
      }
    }
  })
  Object.keys(data.exportPolicyType).forEach(function (key) {
    if (data.exportPolicyType[key]) {
      if (listMenuCheck[key]) {
        listMenuCheck[key].export = 1
      } else {
        listMenuCheck[key] = {}
        listMenuCheck[key].export = 1
      }
    }
  })
  Object.keys(data.approvePolicyType).forEach(function (key) {
    if (data.approvePolicyType[key]) {
      if (listMenuCheck[key]) {
        listMenuCheck[key].approve = 1
      } else {
        listMenuCheck[key] = {}
        listMenuCheck[key].approve = 1
      }
    }
  })
  Object.keys(data.confirmPolicyType).forEach(function (key) {
    if (data.confirmPolicyType[key]) {
      if (listMenuCheck[key]) {
        listMenuCheck[key].confirm = 1
      } else {
        listMenuCheck[key] = {}
        listMenuCheck[key].confirm = 1
      }
    }
  })
  Object.keys(data.explainPolicyType).forEach(function (key) {
    if (data.explainPolicyType[key]) {
      if (listMenuCheck[key]) {
        listMenuCheck[key].explain = 1
      } else {
        listMenuCheck[key] = {}
        listMenuCheck[key].explain = 1
      }
    }
  })
  Object.keys(data.notifyPolicyType).forEach(function (key) {
    if (data.notifyPolicyType[key]) {
      if (listMenuCheck[key]) {
        listMenuCheck[key].notify = 1
      } else {
        listMenuCheck[key] = {}
        listMenuCheck[key].notify = 1
      }
    }
  })

  let menuDetail = {}
  listMenuCheck.forEach((val, key) => {
    menuDetail = cloneDeep(detectInfoMenu(key))
    item = {}
    if (menuDetail && val) {
      item.menuName = menuDetail.name
      item.menuId = menuDetail.id
      item.canRead = val.list ?? 0
      item.canUpdate = val.update ?? 0
      item.canDelete = val.delete ?? 0
      item.canCreate = val.create ?? 0
      item.canDetail = val.list ?? 0
      item.canExport = val.export ?? 0
      item.canApprove = val.approve ?? 0
      item.canConfirm = val.confirm ?? 0
      item.canExplain = val.explain ?? 0
      item.canNotify = val.notify ?? 0
      listRoleMenus.push(item)
    }
  })
  return listRoleMenus
}

const detectInfoMenu = id => {
  let result = null
  // let menuList = []
  menu.value.forEach(val => {
    val.listMenu.forEach(valChild => {
      if (valChild.id === id) {
        result = valChild
      }
    })
  })
  return result
}
const processing = ref(false)
const ruleForm = ref()

const submitForm = () => {
  const formEl = ruleForm

  roleInfo.value = trimData(roleInfo)
  formEl.value.validate(valid => {
    if (valid) {
      roleInfo.createPolicyType = ObjectFilter(roleInfo.createPolicyType)
      roleInfo.detailPolicyType = ObjectFilter(roleInfo.detailPolicyType)
      roleInfo.listPolicyType = ObjectFilter(roleInfo.listPolicyType)
      roleInfo.updatePolicyType = ObjectFilter(roleInfo.updatePolicyType)
      roleInfo.deletePolicyType = ObjectFilter(roleInfo.deletePolicyType)
      roleInfo.exportPolicyType = ObjectFilter(roleInfo.exportPolicyType)
      roleInfo.approvePolicyType = ObjectFilter(roleInfo.approvePolicyType)
      roleInfo.confirmPolicyType = ObjectFilter(roleInfo.confirmPolicyType)
      roleInfo.explainPolicyType = ObjectFilter(roleInfo.explainPolicyType)
      roleInfo.notifyPolicyType = ObjectFilter(roleInfo.notifyPolicyType)
      if (
        Object.keys(roleInfo.createPolicyType).length === 0 &&
        Object.keys(roleInfo.detailPolicyType).length === 0 &&
        Object.keys(roleInfo.listPolicyType).length === 0 &&
        Object.keys(roleInfo.updatePolicyType).length === 0 &&
        Object.keys(roleInfo.deletePolicyType).length === 0 &&
        Object.keys(roleInfo.exportPolicyType).length === 0 &&
        Object.keys(roleInfo.approvePolicyType).length === 0 &&
        Object.keys(roleInfo.confirmPolicyType).length === 0 &&
        Object.keys(roleInfo.explainPolicyType).length === 0 &&
        Object.keys(roleInfo.notifyPolicyType).length === 0
      ) {
        ElMessage({
          type: 'warning',
          message: t('configUser.validateMessage.fieldRequired', [
            t('administration.role.feature'),
          ]),
        })
        processing.value = false
        return
      }
      if (props.isCreate) {
        handleAddRole()
      } else if (props.isEdit) {
        handleEditRole()
      }
    }
  })
}
const handleAddRole = () => {
  processing.value = true
  const params = {
    roleName: roleInfo.roleName,
    roleCode: uuidv4(),
    description: roleInfo.description,
    listRoleMenus: dectDataMenu(roleInfo),
    listRoleStates: [],
    // isAdmin: 0,
    // parentId: 0,
    // createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
  }
  // Lay thong tin trang thai
  apiAddRole(params)
    .then(res => {
      if (res.status === 200 || res.status === 201) {
        // saveMenuForRole()
        // saveResourceRole()
        backToList()
        ElMessage({
          type: 'success',
          message: t('configUser.message.addSuccess'),
        })
      } else {
        ElMessage({
          type: 'warning',
          message: res.data.message,
        })
      }
    })
    .catch(() => {})
    .finally(_ => {
      processing.value = false
    })
}

const handleEditRole = () => {
  processing.value = true
  const params = {
    roleId: roleInfo.id,
    roleName: roleInfo.roleName,
    roleCode: roleInfo.roleCode,
    description: roleInfo.description,
    listRoleMenus: dectDataMenu(roleInfo),
    listRoleStates: [],
  }
  apiUpdateRole(params)
    .then(res => {
      if (res.status === 200 || res.status === 201) {
        backToList()
        ElMessage({
          type: 'success',
          message: t('configUser.message.updateSuccess'),
        })
      } else {
        ElMessage({
          type: 'warning',
          message: res.data.message,
        })
      }
    })
    .catch(() => {})
    .finally(_ => {
      processing.value = false
    })
}

defineOptions({
  name: 'RoleForm',
})
</script>

<style scoped lang="scss">
.role-table {
  min-height: 550px;
  border: 4px solid #e1e2e2;
}

h2.required::before {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
}

table.table-roles {
  //margin-top: 15px;
  display: block;
  //height: 515px;
  //overflow-y: auto;
  padding-top: 0 !important;
  margin-bottom: 0px !important;
}

table.table-roles thead {
  position: sticky;
  top: 0px;
  background: white;
  z-index: 9;
  padding: 15px;
  width: 100%;
}

table.table-roles thead th {
  padding: 0px 0px 15px;
}

table.table-roles tr:hover > td {
  background: #f5f7fa;
}

.form-role {
  .popup-active {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .require-relation {
    .el-checkbox__inner {
      border: 1px solid red;
    }
  }

  .resource-check {
    position: relative;
    float: left;
    width: 53px;
    @media (max-width: 1400px) {
      width: 45px;
    }
  }

  .flag-star {
    color: #666;
    position: relative;
    left: 5px;
  }

  .info-general {
    // float: left;
    width: 100%;
  }

  .update-status-popup {
    .item {
      .el-form-item__content {
        clear: both;

        .el-select {
          width: 100%;
        }
      }
    }
  }

  :deep(.block-item.role .el-tabs__content) {
    min-height: 530px;
  }

  :deep(.block-item.role .is-top) {
    margin: 0;
    min-width: 200px;
    text-align: center;
  }

  :deep(.form-role .block-item.role .table-roles) {
    display: block;
    height: 515px;
    overflow-y: auto;
    padding-top: 0 !important;
    margin-bottom: 0px !important;
  }

  .block-item.role {
    margin-top: 12px;
    padding: 15px;
    // float: left;
    width: 100%;
    border-bottom: 1px solid #ddd;
    padding-bottom: 30px;
    margin-bottom: 10px;
    background: white;
    border: 4px solid var(--neutral-black-10, #e1e2e2);
    background: var(--neutral-white-100, #fff);
  }

  .block-item.info {
    width: 600px;
    float: left;
    margin-right: 40px;
  }

  .block-item.clone {
    float: left;
    /*width: calc(100% - 415px);*/
    width: 600px;

    .el-select {
      width: 235px;
    }
  }

  .block-item.resource {
    clear: both;
  }

  .status-block {
    float: left;
    width: 100%;
    margin-bottom: 50px;

    .status {
      clear: both;
      float: left;
      width: 100%;
    }

    .status:nth-child(2) {
      /*border-left: 1px solid #ddd;
          padding-left: 4%;*/
    }

    table {
      th:first-child {
        text-align: left;
      }

      th:nth-child(2) {
        text-align: left;
        width: 200px;
      }
    }
  }

  .header-block-item {
    display: flex;
    align-items: center;
  }

  table {
    width: 100%;

    th {
      text-align: left;
      color: #363030;
      font-size: 14px;
      font-weight: 500;
      padding-bottom: 15px;
    }

    th:first-child {
      text-align: left;
    }

    th:nth-child(2) {
      text-align: left;
    }

    td:nth-child(2) {
      text-align: center;
    }

    th:last-child {
      text-align: left;
    }

    td {
      border-bottom: 1px solid #eeee;
      padding-bottom: 7px;
      padding-top: 7px;
      font-size: 15px;
    }

    tr:last-child td {
      border-bottom: initial;
    }
  }

  // min-height: 100vh;

  .header h4 {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: #36327a;
    margin: 0;
    text-align: center;
    color: white;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: 500;
  }

  .el-form-item__label {
    padding-bottom: 0;
    font-size: 14px;
    color: #363030;
    font-weight: 500;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .content,
  .footer {
    padding: 10px 10px 0px;
    clear: both;
  }

  .footer {
    padding-top: 20px;
  }

  .el-input input {
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    border: solid 1px #9999;
  }

  .block-item {
    h4 {
      color: #363030;
      font-weight: 500;
      font-size: 16px;
      margin-bottom: 0;
      margin-right: 16px;
    }
  }

  .action {
    margin-top: 0;
    text-align: right;

    .el-button--primary {
      background: #9e9e9e;
      border: initial;
      border-radius: 4px;
      width: 147px;
      height: 40px;
      font-size: 16px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .el-button--success {
      background: #1f7ff5;
      border: initial;
      border-radius: 4px;
      width: 147px;
      height: 40px;
      float: right;
      font-size: 16px;
      font-weight: 500;
      text-transform: uppercase;
      margin-left: 15px;
    }
  }
}
</style>
