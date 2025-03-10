<template>
  <div class="px-4">
    <p class="mb-5">Hello đây là Thiết bị 222</p>
    <div class="bg-white px-3 py-4">
      <TableViolation
        :listLoading="listLoading"
        :data="dataList"
        :fields="fields"
        :selectRow="true"
      >
        <template #action="{ row }">
          <el-button
            @click="handle(row)"
            class="el-button--default bg--dark-purple"
            >Hahah</el-button
          >
        </template>
      </TableViolation>
    </div>
  </div>
</template>

<script setup>
import TableViolation from '@/components/Table/index.vue'
import { ref } from 'vue'
defineOptions({
  name: 'Device',
})

const listLoading = ref(false)

const fields = ref([
  {
    key: 'name',
    label: 'Tên',
    prop: 'name',
    sort: true,
  },
  {
    key: 'age',
    label: 'Tổi',
    prop: 'age',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    prop: 'address',
  },
  {
    key: 'action',
    label: 'Hành động',
    prop: 'action',
  },
])

const dataList = ref([
  {
    id: '1',
    name: 'Linh Linh',
    age: '22',
    address: '1234',
    isSelected: true,
  },
  {
    id: '2', // Sửa ID để tránh trùng
    name: 'Linh Linh 2',
    age: '23',
    address: '1235',
    isSelected: false,
  },
])

const handle = row => {
  console.log(row)
}
</script>
