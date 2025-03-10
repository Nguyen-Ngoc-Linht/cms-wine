<template>
  <div v-loading="loading">
    <VueDraggable
      ref="el"
      v-model="config"
      class="paddingX-20 paddingY-10"
      v-if="config.length > 0"
      :animation="300"
    >
      <div
        v-for="(item, idx) in config"
        :key="item.id"
        class="section"
      >
        <svg-icon
          icon-class="dot-drag"
          class="dot-drag"
        />
        <div class="section-name">
          <span v-if="item.type === 'kpi_in'">{{ t('dashboard.kpiIn') }}</span>
          <span v-if="item.type === 'kpi_out'">{{ t('dashboard.kpiOut') }}</span>
          <span v-if="item.type === 'warning'">{{ t('dashboard.warning') }}</span>
        </div>
        <VueDraggable
          ref="el-item"
          v-model="config[idx].elements"
          class="section-drag"
          :class="`${item.type}`"
          :animation="300"
        >
          <div
            v-for="ele in item.elements"
            :key="item.type + ele.id"
            class="item-drag"
          >
            <svg-icon
              icon-class="dot-drag"
              class="dot-drag"
            />
            <span v-if="ele.type == 'kpi1'">{{ t('dashboard.rateRecognizeVehicle') }}</span>
            <span v-if="ele.type == 'kpi2'">{{ t('dashboard.rateRecognizeEtag') }}</span>
            <span v-if="ele.type == 'kpi3'">{{ t('dashboard.rateRecognizePlate') }}</span>
            <span v-if="ele.type == 'kpi4'">{{ t('dashboard.systemKPI') }}</span>
            <span v-if="ele.type == 'chart1'">{{ t('dashboard.chartTraffic') }}</span>
            <span v-if="ele.type == 'chart2'">{{ t('dashboard.chartRevenue') }}</span>
            <span v-if="ele.type == 'chart3'">{{ t('dashboard.chartTrafficForecast') }}</span>
            <span v-if="ele.type == 'chart4'">{{ t('dashboard.chartRevenueForecast') }}</span>
            <span v-if="ele.type == 'map'">{{ t('dashboard.map') }}</span>
            <span v-if="ele.type == 'notify'">{{ t('dashboard.todo') }}</span>
            <span v-if="ele.type == 'incident'">{{ t('dashboard.incident') }}</span>
            <span v-if="ele.type == 'warn1'">{{ t('dashboard.warnAbnormal') }}</span>
            <span v-if="ele.type == 'warn2'">{{ t('dashboard.warnRevenue') }}</span>
            <span v-if="ele.type == 'warn3'">{{ t('dashboard.warnCollect') }}</span>
          </div>
        </VueDraggable>
      </div>
    </VueDraggable>
    <div
      class="paddingX-20"
      v-if="roleData.canUpdate"
    >
      <el-button
        class="el-button--main float-right"
        type="primary"
        @click="handleSubmit()"
        :loading="process"
        v-if="roleData.canUpdate"
      >
        {{ t('omsSetting.save') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from '@/locale'
import { apiGetPosition, apiUpdatePosition } from '@/api/dashboard'
import { usePermissionStore } from '@/store'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const config = ref([])

const loading = ref(true)
const getConfig = () => {
  apiGetPosition()
    .then(res => {
      config.value = res.data
    })
    .finally(_ => {
      loading.value = false
    })
}

onBeforeMount(() => {
  getConfig()
})

const process = ref(false)
const handleSubmit = () => {
  config.value.forEach((val, idx) => {
    val.orderIndex = idx
    val.elements.forEach((ele, eIdx) => {
      ele.orderIndex = eIdx
    })
  })

  const data = {
    data: config.value,
  }
  process.value = true
  apiUpdatePosition(data)
    .then(res => {
      getConfig()
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
      })
    })
    .catch(_ => {})
    .finally(_ => {
      process.value = false
    })
}
defineOptions({
  name: 'DashboardConfig',
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.module.scss';
.section {
  position: relative;
  width: 100%;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='5' ry='5' stroke='%230078D4' stroke-width='2' stroke-dasharray='10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  background-position: center center;
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 10px 10px 10px 25px;
}

.section-drag {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  &.kpi_in,
  &.kpi_out {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  &.warning {
    grid-template-columns: 1fr 1fr 1fr;
  }
  &.incident {
    grid-template-columns: 1fr;
  }
}

.item-drag {
  position: relative;
  background: white;
  border-radius: 2px;
  border: 1px solid #ebebec;
  padding: 20px 10px 20px 30px;
  cursor: all-scroll;

  span {
    color: $menuText;
    font-weight: 600;
  }
}

.section-name span {
  color: $menuText;
  font-weight: 600;
}

.dot-drag {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  width: 8px;
  height: 25px;
  cursor: all-scroll;
}
</style>
