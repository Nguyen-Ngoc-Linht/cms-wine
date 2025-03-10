<template>
  <div class="user-form">
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
                : t('configUser.detailUser')
            }}
          </span>
        </div>
        <div class="action-head paddingX-12">
          <div
            class="flex justify-content-end"
            v-if="!viewOnly"
          >
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
            >
              {{ isCreate ? t('omsSetting.save') : t('omsSetting.update') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <el-form
        ref="userForm"
        class="flex flex-wrap lg:flex-nowrap"
        :model="userInfo"
        :rules="rulesUser"
        label-position="top"
        label-width="200px"
        v-loading="loading"
        v-if="updateRule"
      >
        <div class="left">
          <div class="status-block">
            <el-form-item :label="t('configUser.status')">
              <el-switch
                v-model="userInfo.enabled"
                :disabled="viewOnly"
              />
            </el-form-item>
          </div>
          <div class="content-block">
            <div class="info">
              <h2 class="title-block">{{ t('configUser.personalInfo') }}</h2>
              <div class="group">
                <el-form-item
                  :label="t('configUser.fullName')"
                  prop="fullName"
                  required
                  :class="{ 'marginX-0': isCreate }"
                >
                  <el-input
                    v-model="userInfo.fullName"
                    :disabled="viewOnly"
                    maxlength="250"
                  />
                </el-form-item>
                <el-form-item
                  :label="t('configUser.userCode')"
                  v-if="!isCreate"
                >
                  <el-input
                    v-model="userInfo.userCode"
                    disabled
                    maxlength="250"
                  />
                </el-form-item>
              </div>
              <div class="group">
                <el-form-item
                  label="Email"
                  prop="email"
                  required
                >
                  <el-input
                    v-model="userInfo.email"
                    :disabled="viewOnly"
                    maxlength="250"
                  />
                </el-form-item>
                <el-form-item
                  :label="t('configUser.phoneNumber1')"
                  prop="mobile"
                  required
                >
                  <el-input
                    v-model="userInfo.mobile"
                    :disabled="viewOnly"
                    maxlength="250"
                  />
                </el-form-item>
              </div>
              <div class="group">
                <el-form-item
                  :label="t('configUser.workUnit')"
                  required
                  prop="department"
                >
                  <el-tree-select
                    v-model="userInfo.department"
                    class="w-full"
                    required
                    :disabled="viewOnly"
                    :placeholder="t('configUser.pleaseSelect')"
                    :data="departmentList"
                    default-expand-all
                    check-strictly
                    @change="handleChangeDepartment"
                  >
                  </el-tree-select>
                </el-form-item>
                <el-form-item
                  :label="t('configUser.position')"
                  required
                  prop="positionId"
                >
                  <el-select
                    v-model="userInfo.positionId"
                    class="w-full"
                    required
                    :disabled="viewOnly"
                    :readonly="viewOnly"
                    :placeholder="t('configUser.pleaseSelect')"
                  >
                    <el-option
                      v-for="item in positionList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="group">
                <el-form-item
                  :label="t('configUser.userManagement.route')"
                  required
                  prop="routeSelect"
                >
                  <el-select
                    v-model="userInfo.routeSelect"
                    class="w-full"
                    :disabled="viewOnly"
                    multiple
                    collapse-tags
                    :placeholder="t('configUser.pleaseSelect')"
                    v-if="!viewOnly && !roleAdmin"
                  >
                    <el-option
                      v-for="item in routeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>

                  <!--                  <el-tree-select-->
                  <!--                    ref="routeSelect"-->
                  <!--                    v-model="userInfo.routeSelect"-->
                  <!--                    class="w-full"-->
                  <!--                    required-->
                  <!--                    :placeholder="t('configUser.pleaseSelect')"-->
                  <!--                    :data="routeList"-->
                  <!--                    default-expand-all-->
                  <!--                    show-checkbox-->
                  <!--                    multiple-->
                  <!--                    collapse-tags-->
                  <!--                    v-if="!viewOnly && !roleAdmin"-->
                  <!--                  >-->
                  <!--                  </el-tree-select>-->
                  <el-scrollbar
                    :max-height="260"
                    :min-size="100"
                    class="w-full"
                    v-else
                  >
                    <el-tree
                      class="grid md:grid-cols-2"
                      :data="userRouteList"
                      :default-checked-keys="userInfo.routeSelect"
                      node-key="value"
                      default-expand-all
                    >
                    </el-tree>
                  </el-scrollbar>
                </el-form-item>
                <el-form-item v-if="!viewOnly && !roleAdmin"> </el-form-item>
                <!--                <el-form-item-->
                <!--                  :label="t('configUser.userManagement.station')"-->
                <!--                  required-->
                <!--                  prop="stationId"-->
                <!--                >-->
                <!--                  <el-select-->
                <!--                    v-model="userInfo.stationId"-->
                <!--                    class="w-full"-->
                <!--                    :disabled="viewOnly"-->
                <!--                    :placeholder="t('configUser.pleaseSelect')"-->
                <!--                  >-->
                <!--                    <el-option-->
                <!--                      v-for="item in stationList"-->
                <!--                      :key="item.id"-->
                <!--                      :label="item.name"-->
                <!--                      :value="item.id"-->
                <!--                    >-->
                <!--                    </el-option>-->
                <!--                  </el-select>-->

                <!--                </el-form-item>-->
              </div>
            </div>
            <div class="accout">
              <h2 class="title-block">{{ t('configUser.account') }}</h2>
              <el-form-item
                :label="t('configUser.userManagement.username')"
                prop="userName"
                required
              >
                <el-input
                  v-model="userInfo.userName"
                  :disabled="!isCreate"
                  autocomplete="username-new"
                  maxlength="250"
                />
              </el-form-item>
              <div
                class="group"
                v-if="!viewOnly"
              >
                <el-form-item
                  :label="t('configUser.loginPassword')"
                  prop="password"
                  :required="isCreate"
                >
                  <el-input
                    v-model="userInfo.password"
                    type="password"
                    :disabled="viewOnly"
                    autocomplete="new-password"
                    maxlength="250"
                  />
                </el-form-item>

                <el-form-item
                  :label="t('configUser.retypePassword')"
                  prop="matchingPassword"
                  :required="isCreate"
                >
                  <el-input
                    v-model="userInfo.matchingPassword"
                    type="password"
                    :disabled="viewOnly"
                    maxlength="250"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <el-form-item
            class="role-select"
            :label="t('configUser.role')"
            prop="roleCode"
            required
          >
            <el-select
              v-model="userInfo.roleCode"
              filterable
              :placeholder="t('configUser.userManagement.selectRole')"
              @change="handleRoleChange"
              :disabled="viewOnly"
            >
              <template
                v-for="role in rolesLst"
                :key="role.roleCode"
              >
                <el-option
                  :label="role.roleName"
                  :value="role.roleCode"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item :label="t('configUser.userManagement.listPerByRole')">
            <div
              class="role-table"
              v-loading="loadingRole"
            >
              <el-scrollbar height="650">
                <table
                  class="table-roles"
                  v-if="userInfo.roleCode"
                  :key="updateKey"
                >
                  <thead>
                    <tr>
                      <th>
                        <b>{{ t('administration.role.feature') }}</b>
                      </th>
                      <th
                        style="min-width: 65px"
                        class="text-center"
                      >
                        {{ t('administration.role.all') }}
                      </th>
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
                              <span style="padding-left: 18px" />
                              <span
                                v-if="valChild.parentId !== null"
                                style="padding-left: 18px"
                              />
                              {{ valChild.name }}
                            </td>
                            <td style="min-width: 70px">
                              <div
                                class="resource-check"
                                v-if="
                                  valChild.parentId !== null || !checkOnlyMenu(valChild.id, val.id)
                                "
                              >
                                <el-checkbox
                                  v-model="roleInfo.checkAllGroup[valChild.id]"
                                  disabled
                                />
                              </div>
                              <div
                                class="resource-check"
                                v-else
                              >
                                <el-checkbox
                                  v-model="roleInfo.checkAllMenu[valChild.id]"
                                  disabled
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
                                  disabled
                                  v-model="roleInfo.listPolicyType[valChild.id]"
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
                                  disabled
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
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from '@/locale'
import { useAppStore, usePermissionStore, useUserStore } from '@/store'
import { getRoleByUser, apiGetRoleDetail } from '@/api/role'
import { apiGetMenuByRole, apiGetListMenu, apiGetAppByRole } from '@/api/menu-management'
import {
  getUserDetail,
  getPasswordRulePolicy,
  getListPosition,
  apiAddUser,
  apiEditUser,
} from '@/api/user'
import { apiGetUnits, apiGetUnitDepartments } from '@/api/administrativeDepartment'
import {
  getListRoute,
  getListStation,
  apiListRouteStation,
  apiGetRouteUser,
} from '@/api/expressway'
import { getListApp } from '@/api/app'
import moment from 'moment/moment'
import lang from '@/locale/getMessage.js'
import { validEmail, validPhone } from '@/utils/validate'
import { trimData } from '@/utils'
import { cloneDeep } from 'lodash-unified'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()
const { roleData } = usePermissionStore()
const { isAdmin } = useUserStore()
const locale = computed(() => lang[appStore.lang])

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

const viewOnly = ref(
  (!props.isCreate && !props.isEdit) ||
    (props.isCreate && !roleData.canCreate) ||
    (props.isEdit && !roleData.canUpdate)
)

const backToList = () => {
  router.push('/administration/system/user')
}
const loading = ref(true)
const processing = ref(false)

const disableCheckApp = ref(false)
const rolesLst = ref([])

const getRoleLst = async () => {
  const result = await getRoleByUser()
  if (result && result.data) {
    rolesLst.value = result.data
  }
}
const updateRule = ref(false)
const getPasswordRule = () => {
  getPasswordRulePolicy().then(res => {
    const specChar = []
    const rule = [
      { min: res.data.minLength, max: res.data.maxLength, message: '', trigger: 'blur' },
    ]
    if (res.data.specialCharacters) {
      specChar.push(t('configUser.passwordPolicy.specialChar').toLowerCase())
      rule.push({ validator: validSpecialChar, message: '', trigger: 'blur' })
    }
    if (res.data.digits) {
      specChar.push(t('configUser.passwordPolicy.number').toLowerCase())
      rule.push({ validator: validDigit, message: '', trigger: 'blur' })
    }
    if (res.data.uppercase) {
      specChar.push(t('configUser.passwordPolicy.upperCase').toLowerCase())
      rule.push({ validator: validUpperChar, message: '', trigger: 'blur' })
    }
    if (res.data.lowercase) {
      specChar.push(t('configUser.passwordPolicy.lowerCase').toLowerCase())
      rule.push({ validator: validLowerChar, message: '', trigger: 'blur' })
    }
    const message = t('configUser.validateMessage.passwordFormat', [
      res.data.minLength,
      res.data.maxLength,
      specChar.join(', '),
    ])
    rule.forEach(i => {
      i.message = message
    })

    if (props.isCreate) {
      rule.push({
        required: true,
        message: t('configUser.validateMessage.required'),
        trigger: 'blur',
      })
    }

    rulesUser.password = [...rulesUser.password, ...rule]
    updateRule.value = true
  })
}

const departmentList = ref([])
const routeList = ref([])
const userRouteList = ref([])
const stationList = ref([])
const positionList = ref([])
const appList = ref([])

const getPositionList = () => {
  getListPosition().then(res => {
    positionList.value = res?.data || []
  })
}
const getListDepartment = () => {
  apiGetUnitDepartments().then(res => {
    let data = res?.data || []
    data = data.map(i => ({
      label: i.unitName,
      value: i.id,
      // disabled: i.departmentUnit && i.departmentUnit.length > 0,
      children: i.departmentUnit.map(d => ({
        value: d.id,
        label: d.departmentName,
      })),
    }))
    departmentList.value = data
  })
}
const getRouteList = () => {
  apiListRouteStation().then(res => {
    let data = res?.data || []
    data = data.map(i => ({
      label: i.name,
      value: i.id,
      // children: i.stations.map(s => ({
      //   value: s.id,
      //   label: s.name
      // }))
    }))
    routeList.value = data
  })
}

const routeSelect = ref()
const checkAllRoute = () => {
  const select = routeList.value.map(r => r.value)
  // routeList.value.forEach(r => {
  //   r.children?.forEach(s => {
  //     select.push(s.value)
  //   })
  // })
  userRouteList.value = [...routeList.value]
  userInfo.routeSelect = select
}
const routeStationData = () => {
  // const routeStation = []
  // const checkedNote = routeSelect.value.getCheckedNodes(false, true)
  // let idx = -1
  // checkedNote.forEach(i => {
  //   if (i.children) {
  //     idx++
  //     routeStation[idx] = {router_id: i.value, stations: []}
  //   } else {
  //     routeStation[idx].stations.push(i.value)
  //   }
  // })
  return roleAdmin.value ? [] : userInfo.routeSelect
}
const getAppList = async () => {
  await getListApp().then(res => {
    const app = res.data || []
    appList.value = app.map(i => i.id)
  })
}

const validSpecialChar = (rule, value, callback) => {
  const regex = /[!@#$%^&*(),.?":{}|<>`\[\]\\\/\-=_+~;']/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validUpperChar = (rule, value, callback, message) => {
  const regex = /[A-Z]/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validLowerChar = (rule, value, callback) => {
  const regex = /[a-z]/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validDigit = (rule, value, callback) => {
  const regex = /\d/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validateEmail = (rule, value, callback) => {
  const strLength = value.trim().length
  if (strLength > 0 && !validEmail(value)) {
    callback(new Error(t('configUser.validateMessage.invalid', { data: 'Email' })))
  } else {
    callback()
  }
}
const validatePhone = (rule, value, callback) => {
  const strLength = value.trim().length
  if (strLength > 0 && !validPhone(value)) {
    callback(
      new Error(t('configUser.validateMessage.invalid', { data: t('configUser.phoneNumber') }))
    )
  } else {
    callback()
  }
}
const validConfirmPass = (rule, value, callback) => {
  if (value !== userInfo.password) {
    callback(new Error(t('configUser.validateMessage.passwordMismatch')))
  } else {
    callback()
  }
}

const userInfo = reactive({
  uuid: null,
  email: null,
  mobile: null,
  userName: null,
  fullName: null,
  matchingPassword: null,
  password: null,
  birthDay: null,
  groupsUuid: null,
  policeRank: null,
  department: null,
  administrativeUnitId: null,
  routeSelect: null,
  userRoute: null,
  stationId: null,
  departmentUnitId: null,
  positionId: null,
  enabled: true,
  app: [],
  accessedApp: '0',
  oldRoleCode: null,
})

const getUserInfo = async () => {
  if (!props.isCreate) {
    const { data } = await getUserDetail(route.params.id)
    if (data && data.length > 0) {
      const { data: userRoute } = await apiGetRouteUser({ id: route.params.id })
      const routeSelect = userRoute.map(r => r.routeId)
      // userRoute.forEach(r => {
      //   if (r.stations.length) routeSelect = [...routeSelect, ...r.stations]
      //   else routeSelect.push(r.router_id)
      // })
      userRouteList.value = userRoute.map(r => {
        const routeData = routeList.value.find(i => i.value === r.routeId)
        return {
          ...routeData,
          // Filter children to only include those in `parentIdObj.child`
          // children: routeData?.children.filter(s => r.stations.includes(s.value)) || []
        }
      })

      Object.assign(userInfo, {
        ...data[0],
        app: data[0].app !== null ? data[0].app.split(',').map(Number) : [],
        department: data[0].departmentUnitId
          ? data[0].departmentUnitId
          : data[0].administrativeUnitId,
        positionId: data[0].positionUnitId ? parseInt(data[0].positionUnitId) : null,
        oldRoleCode: data[0].roleCode,
        routeSelect,
        userRoute,
      })
      handleRoleChange(data[0].roleCode)
    }
  }
  loading.value = false
}

const rulesUser = reactive({
  fullName: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' },
  ],
  department: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  ],
  positionId: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  routeSelect: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  ],
  stationId: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  ],
  userName: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  password: [],
  matchingPassword: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    { validator: validConfirmPass, trigger: 'blur' },
  ],
  roleCode: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})

onBeforeMount(() => {
  getRoleLst()
  getPositionList()
  getListDepartment()
  getRouteList()
  getPasswordRule()
  getMenu()
  getAppList()
})

onMounted(() => {
  getUserInfo()
})

const loadingRole = ref(false)

const roleInfo = reactive({
  id: '',
  roleName: '',
  roleCode: '',
  description: '',
  createPolicyType: {},
  exportPolicyType: {},
  detailPolicyType: {},
  listPolicyType: {},
  updatePolicyType: {},
  deletePolicyType: {},
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
const menu = ref([])
const typeMenu = ref(null)

const getMenu = () => {
  apiGetListMenu()
    .then(res => {
      menu.value = res.data
    })
    .catch(_ => {})
}
const checkAllIfAdmin = () => {
  menu.value.forEach(val => {
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

const menuListQuery = computed(() => {
  const data = menu.value
  if (typeMenu.value && typeMenu.value !== '0') {
    return data.filter(val => {
      return val.id === typeMenu.value
    })
  }
  return data
})
const roleAdmin = ref(false)
const handleRoleChange = async roleCode => {
  loadingRole.value = true
  if (roleCode === 'SUPER_ADMIN') {
    checkAllIfAdmin()
    checkAllRoute()
    viewOnly.value = true
    loadingRole.value = false
    roleAdmin.value = true
  } else if (roleCode === 'ADMIN') {
    checkAllIfAdmin()
    checkAllRoute()
    loadingRole.value = false
    roleAdmin.value = true
    if (!isAdmin) {
      viewOnly.value = true
    }
  } else {
    roleAdmin.value = false
    const role = rolesLst.value.find(i => i.roleCode === roleCode)
    resetRole()
    if (role) {
      const { data } = await apiGetRoleDetail(role.id)
      if (data) {
        Object.assign(roleInfo, data)
        getMenuForRole(roleCode)
      } else {
        loadingRole.value = false
      }
    } else {
      loadingRole.value = false
    }
  }
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

          // if (roleInfo.createPolicyType[val.menuId.id] && roleInfo.listPolicyType[val.menuId.id] && roleInfo.updatePolicyType[val.menuId.id] && roleInfo.deletePolicyType[val.menuId.id]) {
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
      forceUpdate()
      loadingRole.value = false
    })
    .catch(err => {
      console.log(err)
    })
}
const updateKey = ref(0)
const resetRole = () => {
  const defaultInfo = {
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
    checkAllGroup: {},
    checkAllMenu: {},
    checkAllApp: {},
    menu: {},
    resource: [],
  }
  Object.assign(roleInfo, defaultInfo)
}
const forceUpdate = () => {
  // updateKey.value++
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

const handleChangeDepartment = selected => {
  for (const parent of departmentList.value) {
    if (parent.value === selected) {
      userInfo.administrativeUnitId = selected
      userInfo.departmentUnitId = null
      break
    }

    if (parent.children.some(i => i.value === selected)) {
      userInfo.administrativeUnitId = parent.value
      userInfo.departmentUnitId = selected
      break
    }
  }
}

const userForm = ref()
const submitForm = () => {
  const formEl = userForm
  if (processing.value) {
    return
  }
  userInfo.value = trimData(userInfo.value)
  formEl.value.validate(valid => {
    if (valid) {
      if (props.isCreate) {
        addUser()
      } else if (props.isEdit) {
        editUser()
      }
    }
  })
}

const addUser = () => {
  const data = cloneDeep(userInfo)
  // const paramRegister = this.userInfo
  const params = {
    disableCheckApp: false,
    userName: data.userName,
    password: data.password,
    matchingPassword: data.matchingPassword,
    email: data.email,
    mobile: data.mobile,
    fullName: data.fullName,
    status: data.status,
    address: data.address,
    facebook: data.facebook,
    signupType: data.signupType,
    createdAt: data.createdAt,
    lastLogin: data.createdAt,
    gender: data.gender,
    policeRank: data.policeRank,
    unit: data.groupsUuid,
    roleCode: data.roleCode,
    position: data.position,
    birthDay: data.birthDay,
    accessedApp: data.accessedApp,
    app: appList.value ? appList.value.toString() : '',
    administrativeUnitId: data.administrativeUnitId,
    user_route: routeStationData(),
    departmentUnitId: data.departmentUnitId,
    positionId: data.positionId + '',
    enabled: data.enabled,
  }
  processing.value = true
  apiAddUser(params)
    .then(res => {
      if (res.status === 200 || res.status === 201) {
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
    .catch(_ => {})
    .finally(_ => {
      processing.value = false
    })
}

const editUser = () => {
  const data = cloneDeep(userInfo)
  // const paramRegister = this.userInfo
  const params = {
    disableCheckApp: false,
    userName: data.userName,
    password: data.password,
    matchingPassword: data.matchingPassword,
    email: data.email,
    mobile: data.mobile,
    fullName: data.fullName,
    status: data.status,
    address: data.address,
    facebook: data.facebook,
    signupType: data.signupType,
    createdAt: data.createdAt,
    lastLogin: data.createdAt,
    gender: data.gender,
    policeRank: data.policeRank,
    unit: data.groupsUuid,
    newRole: data.roleCode,
    roleCode: data.oldRoleCode,
    position: data.position,
    birthDay: data.birthDay,
    accessedApp: data.accessedApp,
    app: appList.value ? appList.value.toString() : '',
    administrativeUnitId: data.administrativeUnitId,
    user_route: routeStationData(),
    departmentUnitId: data.departmentUnitId,
    positionId: data.positionId + '',
    enabled: data.enabled,
  }
  processing.value = true
  apiEditUser(data.uuid, params)
    .then(res => {
      if (res.status === 200 || res.status === 201) {
        ElMessage({
          type: 'success',
          message: t('configUser.message.updateSuccess'),
        })
        backToList()
      } else {
        ElMessage({
          type: 'warning',
          message: res.data.message,
        })
      }
    })
    .catch(_ => {})
    .finally(_ => {
      processing.value = false
    })
}

watch(
  () => userInfo.department,
  newValue => {}
)

defineOptions({
  name: 'UserForm',
})
</script>

<style lang="scss" scoped>
:deep(.el-table th.el-table__cell > .cell) {
  line-height: 24px;
}

.role-select {
  max-width: 283px;
}

h2.title-block {
  font-weight: 600;
  color: #212633;
  font-size: 18px;
}

:deep(.app-table::before) {
  height: 0;
}

.list-app {
  max-width: 582px;
}

form.el-form > div {
  background: white;
  padding: 16px;
  height: 100%;
}

form.el-form > .left {
  margin-right: 8px;
  width: 55%;
}

form.el-form > .right {
  margin-left: 8px;
  width: 45%;
  padding-right: 10px;
}

@media (max-width: 1024px) {
  form.el-form > .left {
    margin-right: 0px;
    width: 100%;
    height: unset;
  }

  form.el-form > .right {
    margin-top: 10px;
    margin-left: 0px;
    width: 100%;
  }
}

.status-block .el-form-item {
  //display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.status-block .el-form-item label) {
  margin: 0 !important;
  margin-right: 5px;
}

.avatar .el-form-item {
  margin-bottom: 0;
}

:deep(.user-form .action-head button) {
  height: 32px;
}

.user-form .header {
  background: white;
  padding: 8px 24px;
}

.user-form .title-head {
  color: #212633;
}

.user-form .title-head {
  display: flex;
  align-items: center;
}

.user-form .title-head h2 {
  font-size: 20px;
  margin-left: 10px;
  margin-bottom: 0;
}

.user-form .content-block .info {
  border-bottom: 1px solid #ebebec;
  padding-bottom: 10px;
}

.user-form .content-block .accout {
  margin-top: 20px;
}

.user-form .content-block .action {
  margin-top: 0px;
}

// .user-form .content-block > div {
//   flex: 1;
// }
.user-form .avatar h2 {
  text-align: center;
  color: #212633;
  font-size: 18px;
  margin: 20px;
}

.user-form .content-block h2.title-block {
  color: #212633;
  font-size: 18px;
}

.user-form > .content {
  padding: 0;
  max-width: 98%;
  margin: 15px auto;
  height: calc(100vh - 130px);
}

.user-form > .content form {
  height: 100%;
}

.user-form .img_avatar {
  text-align: center;
  margin-bottom: 30px;
}

.user-form .img_avatar img {
  border-radius: 100%;
}

.user-form .content-block label {
  font-weight: 500;
  color: #525b73;
}

.user-form .content-block .group {
  display: flex;
}

.user-form .group > div {
  flex: 1;
}

.user-form .group > div:first-child {
  margin-right: 5px;
}

.user-form .group > div:last-child {
  margin-left: 5px;
}

.empty-data {
  text-align: center;
  height: 100px;
  width: 100%;
}

.role-table {
  width: 100%;
  min-height: 680px;
  line-height: 21px;
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
  padding: 7px 0px 7px;
  font-size: 13px;
}

table {
  width: 100%;

  th {
    text-align: left;
    color: #363030;
    font-size: 13px;
    font-weight: 500;
  }

  th:first-child {
    text-align: left;
  }

  th:nth-child(2) {
    text-align: left;
  }

  td:nth-child(2) {
    text-align: right;
  }

  th:last-child {
    text-align: left;
  }

  td {
    border-bottom: 1px solid #eeee;
    padding-bottom: 7px;
    padding-top: 7px;
    font-size: 13px;

    b {
      font-size: 13px;
    }
  }

  tr:last-child td {
    border-bottom: initial;
  }
}

.resource-check {
  position: relative;
  margin: 0 auto;
  display: flex;
  align-items: center;
  width: 41px;
}
</style>
