<template>
  <div></div>
</template>

<script setup>
import { handleRedirect, handleRedirectWeight } from '../redirect'
import moment from 'moment'
import { useNotifyStore } from '@/store'
import { h, onMounted, inject } from 'vue'
import { ElNotification } from 'element-plus'
import soundurl from '@/assets/media/notify.mp3'

const notifyStore = useNotifyStore()

const props = defineProps({
  numberNoti: {
    type: Number,
    default: 0,
  },
})
const notifyEvent = event => {
  const message = `
      <div class="pointer">
        <div class="flex justify-between">
          <div class="font-[600] fs-16">${event.title}</div>
          <div><el-icon><CloseBold /></el-icon></div>
        </div>

        <div>
          <div class="content text-left fs-16">${replaceContent(event.content)}</div>
          <div class="content text-right fs-14 margin-top-2 text-[#76809B]">${replaceContentToTime(
            event.timeRequest
          )}</div>
        </div>
      </div>
    `
  ElNotification({
    position: 'bottom-right',
    dangerouslyUseHTMLString: true,
    customClass: 'noti-event',
    duration: 20000,
    message,
    onClick: () => {
      handleRedirect(event)
    },
  })
}
const replaceTitle = title => {
  if (typeof title.content === 'object') {
    return title.content.eventName
  } else {
    return title.title
  }
}
const replaceContent = content => {
  if (content) {
    if (typeof content === 'object') {
      return 'Vị trí: ' + content.site.site_name + '<br>' + 'Nguồn: ' + content.sourceName
    } else {
      return content.replace(/\n/g, '<br>')
    }
  }
  return ''
}
const replaceContentToTime = time => {
  if (time) {
    return moment.unix(time).format('DD/MM/YYYY HH:mm:ss')
  }
}
const notifyWeightOverload = data => {
  const message = `
    <div class="pointer">
      <div class="flex justify-between">
        <div class="font-[600] fs-16">${data?.title || ''}</div>
        <div><el-icon><CloseBold /></el-icon></div>
      </div>

      <div class="content text-left fs-16">${replaceContent(data.content)}</div>

      <div class="content margin-top-2 w-full flex justify-end">
        <p class="fs-14 text-[#76809B]">${replaceContentToTime(data.timeRequest)}</p>
      </div>
    </div>`
  ElNotification({
    position: 'bottom-right',
    dangerouslyUseHTMLString: true,
    customClass: 'notify-overload',
    duration: 8000,
    message,
    onClick: () => {
      handleRedirectWeight({
        routerName: 'omsWeightSessionDetail',
        id: data.objectData.id,
        startTime: moment(new Date(data.objectData.startTime)).format('YYYY-MM-DD HH:mm:ss'),
      })
    },
  })
}

// const $socket = inject('$socket')
const emit = defineEmits(['getCountNotify', 'receiveNotifySocket'])
onMounted(() => {
  // $socket.on('receiveNotification', data => {
  //   console.log('data: ', data)
  // const dataAppList = data.appList?.includes('OMS')
  // if (dataAppList) {
  //   emit('receiveNotifySocket')
  //   playSound()
  //   const { objectType } = data
  //   if (objectType === 'over-weight-vehicle' && notifyStore.isReceiveNotify === 1) {
  //     notifyWeightOverload(data)
  //   }
  //   if (props.numberNoti < 100) {
  //     setTimeout(() => {
  //       emit('getCountNotify')
  //     }, 2000)
  //   }
  // }
  // })
})

const playSound = () => {
  const audioFile = new Audio(soundurl)
  audioFile.play()
}
</script>

<style lang="scss">
.notify-overload {
  .el-notification__group {
    width: 100%;
  }
}
</style>
