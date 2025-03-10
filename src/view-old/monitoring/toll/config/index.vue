<template>
  <div
    class="paddingX-24 padding-top-14"
    v-loading="loading"
  >
    <div class="config-cont bg-white padding-20">
      <div class="flex justify-between items-center">
        <el-form-item
          :label="t('monitoring.toll.changeHis')"
          class="mb-0"
        >
          <el-select
            v-model="formulaId"
            class="w-[150px]"
            required
            :placeholder="t('configUser.pleaseSelect')"
            @change="handleChangeFormula"
          >
            <el-option
              v-for="item in formulaLst"
              :key="item.id"
              :label="formatDate(item.lastTime)"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-button
            text
            size="default"
            class="!p-0 margin-left-10"
            @click="handleChangeFormula(formulaId)"
            v-if="canEdit"
          >
            <svg-icon
              icon-class="refreshNotColor"
              class="width-20 height-20"
            ></svg-icon>
          </el-button>
        </el-form-item>
        <el-button
          class="el-button--main"
          type="primary"
          @click="submitForm()"
          :loading="process"
          v-if="canEdit"
          >{{ t('omsSetting.save') }}</el-button
        >
      </div>
    </div>
    <div class="config-cont bg-white padding-20">
      <h2 class="title-block flex justify-between items-center">KPI đầu ra</h2>
      <div
        v-for="(f, fIdx) in outputFormula"
        :key="f.id"
      >
        <div
          class="formula"
          :class="{ hidden: !f.isEditable }"
        >
          <div class="tuso">
            <template
              v-for="(ele, idx) in f.tu"
              :key="`tu_${f.id}_${idx}`"
            >
              <div
                class="field-wrap"
                v-if="idx % 2 === 0"
              >
                <el-select
                  v-model="f.tu[idx]"
                  class="select-field"
                  :class="{
                    'no-remove': !canEdit || f.tu.length === 1,
                    'is-error': isSubmit && !ele,
                  }"
                  placement="bottom"
                  :disabled="!canEdit"
                >
                  <el-option
                    v-for="item in outputFields"
                    :key="item.realCode"
                    :label="`(${item.code}) ${item.title}`"
                    :value="item.realCode"
                  />
                </el-select>
                <div
                  class="suffix"
                  v-if="canEdit && f.tu.length !== 1"
                  @click="remove(false, true, fIdx, idx)"
                >
                  <svg-icon
                    icon-class="remove-administrative"
                    class="width-18 height-18"
                  />
                </div>
              </div>
              <el-select
                v-model="f.tu[idx]"
                v-if="idx % 2 === 1"
                class="operationSelect"
                :disabled="!canEdit"
              >
                <template #label="{ label }">
                  <svg-icon
                    :icon-class="label"
                    class="width-20 height-20"
                  />
                </template>
                <el-option
                  value="+"
                  class="operationOption"
                  label="plus"
                >
                  <template #default>
                    <svg-icon
                      icon-class="plus"
                      class="width-20 height-20"
                    />
                  </template>
                </el-option>
                <el-option
                  value="-"
                  class="operationOption"
                  label="minus"
                >
                  <template #default>
                    <svg-icon
                      icon-class="minus"
                      class="width-20 height-20"
                    />
                  </template>
                </el-option>
              </el-select>
            </template>
            <div
              class="pointer add"
              @click="add(false, true, fIdx)"
              v-if="canEdit"
            >
              <svg-icon
                icon-class="add"
                class="width-20 height-20"
              />
            </div>
          </div>
          <div class="divider">
            <div class="name">({{ f.columnCode }}) {{ f.columnName }}</div>
            <div class="line"></div>
          </div>
          <div class="mauso">
            <template
              v-for="(ele, idx) in f.mau"
              :key="`mau_${f.id}_${idx}`"
            >
              <div
                class="field-wrap"
                v-if="idx % 2 === 0"
              >
                <el-select
                  v-model="f.mau[idx]"
                  class="select-field"
                  :class="{
                    'no-remove': !canEdit || f.mau.length === 1,
                    'is-error': isSubmit && !ele,
                  }"
                  placement="bottom"
                  :disabled="!canEdit"
                >
                  <el-option
                    v-for="item in outputFields"
                    :key="item.realCode"
                    :label="`(${item.code}) ${item.title}`"
                    :value="item.realCode"
                  />
                </el-select>
                <div
                  class="suffix"
                  v-if="canEdit && f.mau.length !== 1"
                  @click="remove(false, false, fIdx, idx)"
                >
                  <svg-icon
                    icon-class="remove-administrative"
                    class="width-18 height-18"
                  />
                </div>
              </div>
              <el-select
                v-model="f.mau[idx]"
                v-if="idx % 2 === 1"
                class="operationSelect"
                :disabled="!canEdit"
              >
                <template #label="{ label }">
                  <svg-icon
                    :icon-class="label"
                    class="width-20 height-20"
                  />
                </template>
                <el-option
                  value="+"
                  class="operationOption"
                  label="plus"
                >
                  <template #default>
                    <svg-icon
                      icon-class="plus"
                      class="width-20 height-20"
                    />
                  </template>
                </el-option>
                <el-option
                  value="-"
                  class="operationOption"
                  label="minus"
                >
                  <template #default>
                    <svg-icon
                      icon-class="minus"
                      class="width-20 height-20"
                    />
                  </template>
                </el-option>
              </el-select>
            </template>
            <div
              class="pointer add"
              @click="add(false, false, fIdx)"
              v-if="canEdit"
            >
              <svg-icon
                icon-class="add"
                class="width-20 height-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="config-cont bg-white padding-20">
      <h2 class="title-block flex justify-between items-center">KPI đầu vào</h2>
      <div
        v-for="(f, fIdx) in inputFormula"
        :key="f.id"
      >
        <div
          class="formula"
          :class="{ hidden: !f.isEditable }"
        >
          <div class="tuso">
            <template
              v-for="(ele, idx) in f.tu"
              :key="`tu_${f.id}_${idx}`"
            >
              <div
                class="field-wrap"
                v-if="idx % 2 === 0"
              >
                <el-select
                  v-model="f.tu[idx]"
                  class="select-field"
                  :class="{
                    'no-remove': !canEdit || f.tu.length === 1,
                    'is-error': isSubmit && !ele,
                  }"
                  placement="bottom"
                  :disabled="!canEdit"
                >
                  <el-option
                    v-for="item in inputFields"
                    :key="item.realCode"
                    :label="`(${item.code}) ${item.title}`"
                    :value="item.realCode"
                  />
                </el-select>
                <div
                  class="suffix"
                  v-if="canEdit && f.tu.length !== 1"
                  @click="remove(true, true, fIdx, idx)"
                >
                  <svg-icon
                    icon-class="remove-administrative"
                    class="width-18 height-18"
                  />
                </div>
              </div>
              <el-select
                v-model="f.tu[idx]"
                v-if="idx % 2 === 1"
                class="operationSelect"
                :disabled="!canEdit"
              >
                <template #label="{ label }">
                  <svg-icon
                    :icon-class="label"
                    class="width-20 height-20"
                  />
                </template>
                <el-option
                  value="+"
                  class="operationOption"
                  label="plus"
                >
                  <template #default>
                    <svg-icon
                      icon-class="plus"
                      class="width-20 height-20"
                    />
                  </template>
                </el-option>
                <el-option
                  value="-"
                  class="operationOption"
                  label="minus"
                >
                  <template #default>
                    <svg-icon
                      icon-class="minus"
                      class="width-20 height-20"
                    />
                  </template>
                </el-option>
              </el-select>
            </template>
            <div
              class="pointer add"
              @click="add(true, true, fIdx)"
              v-if="canEdit"
            >
              <svg-icon
                icon-class="add"
                class="width-20 height-20"
              />
            </div>
          </div>
          <div class="divider">
            <div class="name">({{ f.columnCode }}) {{ f.columnName }}</div>
            <div class="line"></div>
          </div>
          <div class="mauso">
            <template
              v-for="(ele, idx) in f.mau"
              :key="`mau_${f.id}_${idx}`"
            >
              <div
                class="field-wrap"
                v-if="idx % 2 === 0"
              >
                <el-select
                  v-model="f.mau[idx]"
                  class="select-field"
                  :class="{
                    'no-remove': !canEdit || f.mau.length === 1,
                    'is-error': isSubmit && !ele,
                  }"
                  placement="bottom"
                  :disabled="!canEdit"
                >
                  <el-option
                    v-for="item in inputFields"
                    :key="item.realCode"
                    :label="`(${item.code}) ${item.title}`"
                    :value="item.realCode"
                  />
                </el-select>
                <div
                  class="suffix"
                  v-if="canEdit && f.mau.length !== 1"
                  @click="remove(true, false, fIdx, idx)"
                >
                  <svg-icon
                    icon-class="remove-administrative"
                    class="width-18 height-18"
                  />
                </div>
              </div>
              <el-select
                v-model="f.mau[idx]"
                v-if="idx % 2 === 1"
                class="operationSelect"
                :disabled="!canEdit"
              >
                <template #label="{ label }">
                  <svg-icon
                    :icon-class="label"
                    class="width-20 height-20"
                  />
                </template>
                <el-option
                  value="+"
                  class="operationOption"
                  label="plus"
                >
                  <template #default>
                    <svg-icon
                      icon-class="plus"
                      class="width-20 height-20"
                    />
                  </template>
                </el-option>
                <el-option
                  value="-"
                  class="operationOption"
                  label="minus"
                >
                  <template #default>
                    <svg-icon
                      icon-class="minus"
                      class="width-20 height-20"
                    />
                  </template>
                </el-option>
              </el-select>
            </template>
            <div
              class="pointer add"
              @click="add(true, false, fIdx)"
              v-if="canEdit"
            >
              <svg-icon
                icon-class="add"
                class="width-20 height-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { apiGetFormulaLibrary, apiGetAllFormula, apiGetFormula, apiUpdateFormula } from '@/api/toll'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '@/store'
import { formatDate } from '@/utils/date'
import { cloneDeep } from 'lodash-unified'

const { t } = useI18n()
const { roleData } = usePermissionStore()

const loading = ref(true)
const inputFields = ref([])
const outputFields = ref([])
const formulaLst = ref([])
const formulaId = ref(null)
const canEdit = ref(false)
const inputFormula = ref([])
const outputFormula = ref([])

const getFormulaLibrary = () => {
  apiGetFormulaLibrary({ type: 1 }).then(res => {
    inputFields.value = res.data?.map(i => ({
      ...i,
      realCode: '$' + i.code,
    }))
  })
  apiGetFormulaLibrary({ type: 0 }).then(res => {
    outputFields.value = res.data?.map(i => ({
      ...i,
      realCode: '$' + i.code,
    }))
  })
}

const getListFormula = () => {
  apiGetAllFormula()
    .then(res => {
      formulaLst.value = res.data
      if (res.data?.length) {
        handleChangeFormula(res.data[0].id)
      }
    })
    .catch(_ => {})
    .finally(() => {
      loading.value = false
    })
}

const handleChangeFormula = id => {
  const formula = formulaLst.value.find(i => i.id === id)
  if (formula) {
    formulaId.value = id
    canEdit.value = roleData.canUpdate && !!formula.enabled
    inputFormula.value = convertFormula(formula.reportFormulasIn)
    outputFormula.value = convertFormula(formula.reportFormulasOut)
  } else {
    formulaId.value = null
    inputFormula.value = []
    outputFormula.value = []
  }
}

const convertFormula = formula => {
  const data = [...formula]
  data.forEach(f => {
    const [tu, mau] = f.expression.replace(/[)(]/g, '').split('/')
    f.tu = tu.split(/([+\-])/)
    f.mau = mau ? mau.split(/([+\-])/) : []
  })
  return data
}

onMounted(() => {
  getFormulaLibrary()
  getListFormula()
})

const add = (isInput, isTuso, formulaIdx) => {
  const formula = isInput ? inputFormula : outputFormula
  const target = isTuso ? formula.value[formulaIdx].tu : formula.value[formulaIdx].mau
  target.push('+', null)
}

const remove = (isInput, isTuso, formulaIdx, idx) => {
  const formula = isInput ? inputFormula : outputFormula
  const target = isTuso ? formula.value[formulaIdx].tu : formula.value[formulaIdx].mau
  if (idx === target.length - 1) {
    idx--
  }
  target.splice(idx, 2)
}

const process = ref(false)
const isSubmit = ref(false)
const submitForm = () => {
  isSubmit.value = true

  if (
    inputFormula.value.some(i => i.tu.includes(null) || i.mau.includes(null)) ||
    outputFormula.value.some(i => i.tu.includes(null) || i.mau.includes(null))
  ) {
    ElMessage({
      message: 'Vui lòng chọn đầy đủ giá trị các trường input',
      type: 'warning',
    })
    return
  }
  const input = cloneDeep(inputFormula.value)
  const output = cloneDeep(outputFormula.value)
  input.forEach(i => {
    const tu = i.tu.length > 1 && i.mau.length > 0 ? `(${i.tu.join('')})` : i.tu.join('')
    const mau = i.mau.length > 1 ? `(${i.mau.join('')})` : i.mau.join('')
    i.expression = i.mau.length > 0 ? `${tu}/${mau}` : tu
    delete i.tu
    delete i.mau
  })
  output.forEach(i => {
    const tu = i.tu.length > 1 && i.mau.length > 0 ? `(${i.tu.join('')})` : i.tu.join('')
    const mau = i.mau.length > 1 ? `(${i.mau.join('')})` : i.mau.join('')
    i.expression = i.mau.length > 0 ? `${tu}/${mau}` : tu
    delete i.tu
    delete i.mau
  })

  process.value = true

  const data = {
    id: formulaId.value,
    reportFormulasIn: [...input],
    reportFormulasOut: [...output],
  }

  apiUpdateFormula(data)
    .then(res => {
      getListFormula()
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
      })
    })
    .catch(_ => {})
    .finally(_ => {
      process.value = false
      isSubmit.value = false
    })
}

defineOptions({
  name: 'MonitorConfig',
})
</script>

<style scoped lang="scss">
.config-cont {
  margin-bottom: 10px;
}

.title-block {
  font-weight: 600;
  color: #525b73;
  font-size: 16px;
  margin-bottom: 5px;
}

.formula {
  padding: 10px 10px 10px 250px;
  display: inline-block;

  &.hidden {
    display: none;
  }

  :deep(.el-select) {
    display: contents;
  }

  :deep(.el-select__placeholder) {
    white-space: normal;
    position: relative;
    top: unset;
    transform: unset;
  }

  .select-field {
    :deep(.el-select__wrapper) {
      min-width: 200px;
      max-width: 500px;
      padding: 4px 30px 4px 12px;
    }

    &.no-remove :deep(.el-select__wrapper) {
      padding: 4px 12px;
    }
  }

  .operationSelect {
    display: contents;

    :deep(.el-select__wrapper) {
      height: 32px;
    }

    :deep(.el-select__placeholder) {
      color: #059efb;
      line-height: 10px;
    }
  }

  .field-wrap {
    position: relative;
  }

  .suffix {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-45%);
    cursor: pointer;
  }

  .tuso,
  .mauso {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }

  .divider {
    position: relative;
    margin-bottom: 10px;
    padding: 0 10px;

    .line {
      position: relative;
      border-bottom: 1px solid #000;

      &::before {
        position: absolute;
        content: '=';
        top: 50%;
        left: -30px;
        transform: translateY(-50%);
        font-size: 20px;
      }
    }

    .name {
      position: absolute;
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      width: 250px;
      padding-right: 30px;
    }
  }

  .add {
    color: #059efb;
  }
}

.is-error {
  :deep(.el-select__wrapper),
  :deep(.el-select__wrapper:hover),
  :deep(.el-select__wrapper:focus),
  :deep(.el-select__wrapper.is-focus) {
    border: 2px solid var(--el-color-danger);
    box-shadow: 0 0 0 2px transparent inset;
  }
}

:deep(.el-form-item__label) {
  font-weight: normal;
}
</style>
