<template>
  <div class="bg-white">
    <el-form
      ref="createExplanationNotice"
      :model="infoExplanationNotice"
      :rules="ruleEdit"
      label-position="top"
      label-width="100%"
    >
      <div class="item-mid">
        <el-form-item
          class="custom mb-5"
          :label="$t('monitoring.toll.nameExplanationNotice')"
          prop="nameExplanationNotice"
        >
          <el-input
            v-model="infoExplanationNotice.nameExplanationNotice"
            maxlength="250"
            :placeholder="$t('configUser.pleaseEnter')"
          />
        </el-form-item>
      </div>
      <div class="item-mid">
        <el-form-item
          class="custom mb-5"
          prop="contentExplanationNotice"
          :label="$t('monitoring.toll.contentExplanationNotice')"
          style="font-weight: 600 !important"
        >
          <el-input
            v-model="infoExplanationNotice.contentExplanationNotice"
            maxlength="5000"
            type="textarea"
            show-word-limit
            :placeholder="$t('configUser.pleaseEnter')"
            :autosize="{ minRows: 5, maxRows: 10 }"
          />
        </el-form-item>
      </div>
      <div class="item-mid">
        <el-form-item
          class="custom mb-5"
          :label="$t('report.time')"
          prop="time"
        >
          <el-date-picker
            v-model="infoExplanationNotice.time"
            type="date"
            :placeholder="$t('configUser.pleaseSelect')"
            format="DD/MM/YYYY"
            value-format="DD/MM/YYYY"
            style="width: 100%"
          />
        </el-form-item>
      </div>
      <div class="flex justify-between gap-4">
        <div style="width: 50%">
          <el-form-item
            prop="route.id"
            class="custom"
            :label="$t('configUser.gland')"
          >
            <el-select
              v-model="infoExplanationNotice.route.id"
              @change="
                value => {
                  setListStation(value)
                }
              "
              clearable
              filterable
              collapse-tags
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
        <div style="width: 50%">
          <el-form-item
            prop="station.id"
            class="custom"
            :label="$t('configUser.station')"
          >
            <el-select
              v-model="infoExplanationNotice.station.id"
              clearable
              filterable
              collapse-tags
              style="width: 100%"
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
    </el-form>
    <hr class="margin-bottom-24" />
    <div class="action">
      <div class="flex justify-end">
        <el-button
          type="default"
          @click="closeDialog"
          class="bg-outline-secondary"
          >{{ $t('configUser.cancel') }}</el-button
        >
        <el-button
          @click="handleCreateExplanationNotice()"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
          >{{ $t('configUser.addNew') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import { getListRoute, getListStation } from '@/api/expressway'
const { t } = useI18n()

const props = defineProps({
  typeDialog: {
    type: String,
    required: true,
  },
  explanationNoticeInfo: {
    type: Object,
    required: false,
  },
})
const ruleEdit = ref({
  nameExplanationNotice: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  contentExplanationNotice: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
  ],
  time: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  route: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  station: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
})
const infoExplanationNotice = ref({
  route: {
    id: '',
  },
  station: {
    id: '',
  },
})
const createExplanationNotice = ref(null)
const listRoute = ref([])
const listStation = ref([])
const emit = defineEmits(['closeUpdate'])

onMounted(() => {
  setDataDefault()
})

const setDataDefault = async () => {
  const rs = await getListRoute()
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
}
const handleCreateExplanationNotice = async () => {
  if (createExplanationNotice.value) {
    createExplanationNotice.value.validate(valid => {
      if (valid) {
        console.log(createExplanationNotice.value.timePutsInto)
        ElMessage({
          message: t('configUser.message.addSuccess'),
          type: 'success',
          duration: 3 * 1000,
        })
        emit('closeUpdate')
      } else {
        console.log('Lỗi validate form')
        return false
      }
    })
  } else {
    console.log('Form chưa được gán hoặc không tồn tại')
  }
}
const closeDialog = () => {
  emit('closeUpdate')
}
const setListStation = async routeId => {
  listStation.value = []
  infoExplanationNotice.value.station = {
    id: '',
  }
  const route_id = routeId
  if (route_id) {
    const params = {
      page: 1,
      size: 20,
      keywors: '',
      routeIds: [route_id],
      unitIds: [],
    }
    const rs = await getListStation(params)
    if (rs.status === 200) {
      listStation.value = rs.data.dataRows
    } else {
      listStation.value = []
    }
  }
}
</script>

<style lang="scss">
.custom {
  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}
</style>
