import router from '@/router'

export const handleRedirect = row => {
  // if (row.objectData && row.objectData.action === 'DETECT_VIOLATION') {
  //   if (row.objectData.violationStatus === 1) {
  //     router.push({
  //       path: '/censor',
  //       query: { startTime: row.startTime, key: row.objectData.key },
  //     })
  //   }
  // } else if (row.objectData && row.objectData.action === 'CHANGE_STATUS') {
  //   if (row.objectData.processStatus === 6) {
  //     router.push({
  //       path: '/violation/out-of-date',
  //       query: { startTime: row.startTime, key: row.objectData.key },
  //     })
  //   } else if (row.objectData.processStatus === 19) {
  //     router.push({
  //       path: '/violation/scene',
  //       query: { startTime: row.startTime, key: row.objectData.key },
  //     })
  //   }
  // } else if (row.notifyCode === 17) {
  //   router.push({
  //     path: '/patrol-schedule/patrol-schedule',
  //     query: { startTime: row.startTime, title: row.title },
  //   })
  // }
}

export function handleRedirectWeight(data) {
  if (data?.routerName === 'omsWeightSessionDetail') {
    router.push({
      name: data.routerName,
      params: { id: data.id },
      query: { startTime: data.startTime },
    })
  }
}
