<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from '@/locale'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as _ from 'lodash'

defineOptions({
  name: 'ListUnitDepartment',
})
const { t } = useI18n()

const emit = defineEmits(['createUnit', 'createDepartment', 'getDetailUnit', 'getDetailDepartment'])

const props = defineProps({
  dataUnit: {
    type: Array,
    default: () => [],
  },
  newActive: {
    type: Number,
    default: 0,
  },
  newActiveDepartment: {
    type: Number,
    default: 0,
  },
})

watch(
  () => [props.dataUnit, props.newActive, props.newActiveDepartment],
  newVal => {
    activeNames.value = newVal[1]
    if (newVal[2] !== 0) {
      indexDepartment.value = newVal[2]
    }
  }
)

const indexDepartment = ref(null)

const indexUnit = ref(null)

const inputSearch = ref('')

const activeNames = ref(0)
const handleChange = val => {
  indexDepartment.value = null
  indexUnit.value = val
  const objChange = {
    indexUnit: indexUnit.value,
    type: 1,
  }
  emit('getDetailUnit', objChange)
}
const handleCreateUnit = () => {
  emit('createUnit')
}
const handleCreateDepartment = idUnit => {
  emit('createDepartment', idUnit)
}
const handleGetDetailDepartment = (id, index, indexUnit) => {
  const objChange = {
    indexUnit,
    idDepartment: id,
    type: 2,
  }
  indexDepartment.value = index
  emit('getDetailDepartment', objChange)
}
const handleSearchUnit = () => {
  const searchText = inputSearch.value.toLowerCase()
  // let indexUnitSearch = -1
  // let indexDepartmentSearch = -1
  const objDetailUnit = {
    indexUnit: indexUnit.value,
    type: 1,
  }
  const objDetailDepartment = {
    indexUnit: indexUnit.value,
    idDepartment: null,
    type: 2,
  }

  // Tìm kiếm trong units
  // props.dataUnit.forEach((unit, unitIndex) => {
  //   indexUnitSearch = unitIndex
  //   console.log('unit: ', unit.unitName.toLowerCase(), searchText, unit.unitName.toLowerCase() === searchText)
  //   if (unit.unitName.toLowerCase() === searchText && indexUnitSearch > -1) {
  //     activeNames.value = indexUnitSearch
  //     indexUnit.value = indexUnitSearch
  //     objDetailUnit.indexUnit = indexUnit.value
  //     isCheck = false
  //     return
  //   }
  //
  //   // Tìm kiếm trong listDepartment
  //   unit.departmentUnit.forEach((department, departmentIndex) => {
  //     console.log('departmentUnit: ', department.departmentName.toLowerCase(), searchText, department.departmentName.toLowerCase() === searchText)
  //     if (!(unit.unitName.toLowerCase() === searchText) && !(department.departmentName.toLowerCase() === searchText)) {
  //       isCheck = true
  //     }
  //     if (department.departmentName.toLowerCase() === searchText) {
  //       indexDepartmentSearch = departmentIndex
  //       if (indexDepartmentSearch > -1) {
  //         indexUnit.value = indexUnitSearch
  //         activeNames.value = indexUnitSearch
  //         indexDepartment.value = indexDepartmentSearch
  //         objDetailDepartment.indexUnit = indexUnit.value
  //         objDetailDepartment.idDepartment = department.id
  //         isCheck = false
  //       }
  //     }
  //   })
  // })

  // Tìm kiếm đơn vị
  const unit = _.find(props.dataUnit, unit => unit.unitName.toLowerCase() === searchText)
  if (unit) {
    activeNames.value = _.indexOf(props.dataUnit, unit)
    indexUnit.value = _.indexOf(props.dataUnit, unit)
    objDetailUnit.indexUnit = indexUnit.value
    emit('getDetailUnit', objDetailUnit)
    return
  }

  // Tìm kiếm phòng ban
  let department
  for (let i = 0; i < props.dataUnit.length; i++) {
    department = _.find(
      props.dataUnit[i].departmentUnit,
      dept => dept.departmentName.toLowerCase() === searchText
    )
    if (department) {
      indexUnit.value = i
      activeNames.value = i
      indexDepartment.value = _.indexOf(props.dataUnit[i].departmentUnit, department)
      objDetailDepartment.indexUnit = indexUnit.value
      objDetailDepartment.idDepartment = department.id
      emit('getDetailDepartment', objDetailDepartment)
      return
    }
  }
  if (!department || !unit) {
    ElMessage({
      message: t('el.select.noData'),
      type: 'warning',
    })
  }
}
</script>

<template>
  <div class="demo-collapse bg-white paddingY-12">
    <div class="flex items-center justify-between paddingX-20">
      <span class="text--primary font-[700]"> Danh mục hành chính </span>
      <svg-icon
        @click="handleCreateUnit"
        icon-class="plus"
        class="width-14 height-14 color-[#212633] pointer"
        tooltip-content="Thêm mới đơn vị"
      />
    </div>
    <div class="search-unit padding-10">
      <el-input
        v-model="inputSearch"
        :placeholder="t('el.transfer.filterPlaceholder')"
        class="w-full"
      >
        <template #append>
          <el-button
            :icon="Search"
            @click="handleSearchUnit"
          />
        </template>
      </el-input>
    </div>
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
      class="padding-10"
      accordion
    >
      <el-collapse-item
        v-for="(itemUnit, index) in dataUnit"
        :key="index"
        :name="index"
      >
        <template #title>
          <div class="custom-header flex items-center justify-between pl-2 pr-3">
            <span
              class="text--primary text-unit-custom"
              :title="itemUnit.unitName"
              >{{ itemUnit.unitName }}</span
            >
            <svg-icon
              @click="handleCreateDepartment(itemUnit.id)"
              icon-class="plus"
              class="width-14 height-14 color-[#212633]"
            />
          </div>
        </template>
        <div
          v-for="(itemDepartment, idx) in itemUnit.departmentUnit"
          :key="idx"
          class="pointer item-content"
          @click="handleGetDetailDepartment(itemDepartment.id, idx, index)"
          :class="{
            'department-active': indexDepartment === idx,
          }"
        >
          <span
            class="text-unit-custom block"
            :title="itemDepartment.departmentName"
            >{{ itemDepartment.departmentName }}</span
          >
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
.custom-header {
  width: 90%;
}
//:deep(.el-collapse-item__arrow) {
//  order: 1;
//}
:deep(.el-collapse-item__header) {
  justify-content: space-between;
}
:deep(.el-collapse-item__header.is-active) {
  background: #edf1fa;
}
:deep(.el-collapse-item__content) {
  padding-bottom: 0;
  .item-content {
    padding: 10px 10px 10px 40px;
    &:first-child {
      margin-top: 10px;
    }
  }
  .department-active {
    background: #edf1fa;
  }
}
.text-unit-custom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  text-align: left;
}
.search-unit {
  :deep(.el-input-group__append) {
    padding: 0 12px;
  }
  :deep(.el-input__wrapper) {
    border-bottom-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }
}
</style>
