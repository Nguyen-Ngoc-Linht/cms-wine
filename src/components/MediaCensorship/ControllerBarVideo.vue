<template>
  <div class="control-custom-bar">
    <div
      id="d"
      style="display: none"
    />
    <div
      :id="'position-start' + '-' + cameraConfig.id"
      class="time-line-scroll"
    >
      <div class="content-time-line">
        <div
          :id="'content-fail-time' + '-' + cameraConfig.id"
          class="content-fail-time"
          :style="wrapperStyleTime"
          @mousedown="onButtonDownTime"
          @mouseleave="handleMouseLeave"
        >
          <div
            v-for="(val, ind) in timeRangerListFilter"
            :key="ind"
            class="timeslot"
            :style="wrapperStyleTimeSlot"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="val"
              placement="top-start"
            >
              <span class="tmpl_line line" />
            </el-tooltip>
          </div>
        </div>
      </div>
      <template v-if="startDateDisplay">
        <span class="date-display-timeline">{{ formatTimeDayMonthYear(startDateDisplay) }}</span>
        <div class="handle-center" />
        <span class="time-display-timeline">{{ formatTimeMinutesSeconds(startDateDisplay) }}</span>
      </template>
      <template v-else>
        <span class="date-display-timeline">{{ formatTimeDayMonthYear(startDate) }}</span>
        <div class="handle-center" />
        <span class="time-display-timeline">{{ formatTimeMinutesSeconds(startDate) }}</span>
      </template>
    </div>
    <div class="time-line-control">
      <div class="control-ranger-time">
        <div class="date-custom">
          <svg-icon
            icon-class="xlDate"
            class="width-20 height-20 margin-right-4"
          />
        </div>
        <el-date-picker
          v-model="timePick"
          popper-class="pick-time-for-cam"
          type="datetime"
          :picker-options="datePickerOptionsTimePick"
          @change="changeTimePick()"
          @click="clickTimePickerHandle()"
        />
        <el-select
          v-model="speedVal"
          popper-class="control-speed-select"
          placeholder="Lựa chọn"
          :popper-append-to-body="true"
          @change="play(speedVal, true)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="control-play">
        <div
          class="pre-button last"
          @click="changeTimeStep5s(-1)"
        >
          <svg-icon
            icon-class="xlpre5s"
            class="width-20 height-20 margin-right-4"
          />
        </div>
        <div class="play-block">
          <svg-icon
            v-if="!isPauseBack"
            style="margin-right: 24px; cursor: pointer; font-size: 15px"
            class="width-20 height-20 margin-right-4"
            icon-class="xlPlay"
            @click="checkTimePlay(0)"
          />
          <svg-icon
            v-else
            style="margin-right: 24px; cursor: pointer; font-size: 15px"
            class="width-20 height-20 margin-right-4"
            icon-class="xlPre"
            @click="checkTimePlay(-1)"
          />
          <svg-icon
            v-if="!isPauseNext"
            style="cursor: pointer"
            class="width-20 height-20 margin-right-4"
            icon-class="xlPlay"
            @click="checkTimePlay(0)"
          />
          <svg-icon
            v-else
            style="cursor: pointer"
            class="width-20 height-20 margin-right-4"
            icon-class="xlNext"
            @click="checkTimePlay(1)"
          />
        </div>
        <div
          class="next-button first"
          @click="changeTimeStep5s(1)"
        >
          <svg-icon
            icon-class="xlnext5s"
            class="width-20 height-20 margin-right-4"
          />
        </div>
      </div>
      <div class="control-speed">
        <div class="create-event">
          <svg-icon
            v-if="!flagZoom && !fullScreenProp"
            icon-class="full-screen"
            class="width-20 height-20 margin-right-4"
            @click="zoomVideo"
          />
          <svg-icon
            v-else
            style="font-size: 15px"
            class="width-20 height-20 margin-right-4"
            icon-class="xlZoomOut"
            @click="zoomVideo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { cloneDeep } from 'lodash-unified'
import { h } from 'vue'

export default {
  name: 'ControllerBar',
  props: {
    startTimeControl: {
      type: [String, Number],
      default: null,
    },
    endTimeControl: {
      type: [String, Number],
      default: null,
    },
    fullScreenProp: {
      type: Boolean,
      default: false,
    },
    handleCreateDone: {
      type: Function,
      default: null,
    },
    cameraConfig: {
      default: null,
    },
    flagChangeStream: {
      type: Number,
      default: 10,
    },
    heightVideo: {
      type: Number,
      default: 0,
    },
    timeChangeCam: {
      type: Number,
      default: 0,
    },
    resSequencesInterval: {
      type: Array,
      default: () => {
        return []
      },
    },
    numberGrid: {
      type: Number,
      default: 1,
    },
    flagChangeScreen: {
      type: Number,
      default: 0,
    },
    loadingSuccess: {
      type: Number,
      default: 0,
    },
  },

  data() {
    const self = this
    const validateTime = (rule, value, callback) => {
      if (value) {
        const startTime = moment(value[0]).valueOf()
        const endTime = moment(value[1]).valueOf()
        const rangeTimeExport = (endTime - startTime) / 1000
        if (rangeTimeExport > 3600) {
          callback(new Error('Khoảng thời gian xuất không được vượt quá 60 phút'))
        }
        if (startTime == endTime) {
          callback(new Error('Thời gian bắt đầu và kết thúc không được trùng nhau'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      dialogCreateEvent: false,
      validateTime,
      speedVal: 1,
      showingBookmark: {
        cameraId: '51741f89-f663-4a1a-a468-0110b15164a4',
        cameraName: 'Camera dò xe cửa hầm',
        imageUrl: null,
        time: null,
      },
      showForm: false,
      visibleActionReplay: false,
      activeSetting: false,
      timeExport: [
        moment().subtract(60, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        moment().format('YYYY-MM-DD HH:mm:ss'),
      ],
      datePickerOptionsTimePick: {
        disabledDate(date) {
          const dateNow = moment()
            .subtract(self.startDay - 1, 'day')
            .format('YYYY-MM-DD 00:00:00')
          const dateExpire = moment().add(0.1, 'minutes').format('YYYY-MM-DD HH:mm:ss')
          return date < moment(dateNow).toDate() || date > moment(dateExpire).toDate()
        },
      },
      datePickerOptions: {
        disabledDate(date) {
          const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
          const dateNowTimstamp = moment(dateNow).unix()
          const dateTimstamp = moment(date).unix()
          const day = self.startDay
          const expireTime = dateNowTimstamp - day * 24 * 60 * 60
          return date > moment(dateNow).toDate() || dateTimstamp < expireTime
        },
      },
      delayTime: 5000,
      hovering: false,
      dialogExportVisible: false,
      timeExportLoading: false,
      dragging: false,
      draggingTime: false,
      isClick: false,
      ExportId: null,
      visibleRangerTime: false,
      startX: 0,
      currentX: 0,
      startY: 0,
      currentY: 0,
      startPosition: 0,
      percentComplete: 0,
      startPositionTime: 0,
      startPositionTimeCurrent: 0,
      sizeVideo: 0,
      totalVideo: 0,
      flagDownload: 0,
      rangerTimeVideo: 0,
      newPosition: null,
      listCamExport: [
        {
          id: 1,
        },
      ],
      camList: [],
      exportVideoForm: {
        camId: [],
        timeExport: [
          {
            startTime: moment().subtract(60, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
      },
      intelCheckStatusVideoId: null,
      oldValue: 0,
      flagClick: false,
      sliderSize: 1,
      vertical: false,
      value: 0,
      currentPositionTimeLine: 0,
      timeRangerList: [],
      startDay: 7,
      rangerTime: 40,
      stepTime: 40,
      stepTimeLine: 15,
      rangerTimeLine: 36,
      diffRangerTime: 0,
      rangerTimeList: [
        {
          label: '5 phút',
          val: 0,
        },
        {
          label: '10 phút',
          val: 10,
        },
        {
          label: '30 phút',
          val: 20,
        },
        {
          label: '1 giờ',
          val: 30,
        },
        {
          label: '3 giờ',
          val: 40,
        },
        {
          label: '6 giờ',
          val: 50,
        },
        {
          label: '12 giờ',
          val: 60,
        },
        {
          label: '24 giờ',
          val: 70,
        },
        {
          label: '48 giờ',
          val: 80,
        },
      ],
      options: [
        {
          value: 0.25,
          label: '0.25x',
        },
        {
          value: 0.5,
          label: '0.5x',
        },
        {
          value: 0.75,
          label: '0.75x',
        },
        {
          value: 1,
          label: '1x',
        },
        {
          value: 2,
          label: '2x',
        },
        {
          value: 4,
          label: '4x',
        },
        {
          value: 8,
          label: '8x',
        },
        {
          value: 16,
          label: '16x',
        },
      ],
      rules: {},
      speed: 0,
      timeProgress: 0,
      createDone: false,
      flagZoom: false,
      linkDownLoadVideo: null,
      playbackControllerId: null,
      totalTime: 60 * 1000 * 60 * 20,
      isPause: true,
      timeSlotWidth: '2.77778%',
      isPauseBack: true,
      isPauseNext: true,
      positionCurrent: 0,
      startDate: moment().subtract(60, 'minutes').valueOf(),
      timePick: moment().subtract(60, 'minutes').valueOf(),
      clickTimePicker: moment().subtract(60, 'minutes').valueOf(),
      startDateDisplay: null,
      startTimeBookMark: null,
      endTimeBookMark: null,
      events: [
        {
          name: 'stack',
          start: new Date(1995, 0, 1),
          end: new Date(),
        },
      ],
      marks: {
        '-10': '-10x',
        0: {
          style: {
            color: '#ffffff',
          },
          label: h('strong', '0x'),
        },
      },
      config: {
        onEventClick: function (e) {},
      },
    }
  },
  computed: {
    timeRangerListFilter() {
      const startTime = moment(this.startDate).subtract(this.detectStartTime(), 'minutes').unix()
      const endTime = moment(this.startDate).add(this.detectEndTime(), 'minutes').unix()
      const result = this.timeRangerList.filter(function (val) {
        return moment(val).unix() > startTime && moment(val).unix() < endTime
      })
      // this.$emit('detectTimeRangerList', this.detectTimeRangerList)
      return this.detectTimeRangerList
    },
    detectTimeRangerList() {
      const timeRangerList = []
      let a = this.detectTimeForStartTime(this.timeRangerList, this.startDate / 1000)
      a = moment.unix(a).format('YYYY-MM-DD HH:mm:ss')
      const b = moment.unix(this.startDate / 1000).format('YYYY-MM-DD HH:mm:ss')
      let startTime = moment(a).subtract(this.detectStartTime(), 'minutes').unix()
      startTime = moment.unix(startTime).format('YYYY-MM-DD HH:mm:ss')
      let item = null
      for (let i = 0; i < this.rangerTimeLine; i++) {
        item = moment(startTime)
          .add(this.stepTimeLine * i, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss')
        timeRangerList.push(item)
      }
      return timeRangerList
    },
    detectWidthTimeLine() {
      let startWidth = 0
      const id = 'position-start' + '-' + this.cameraConfig.id
      if (document.getElementById(id)) {
        startWidth = document.getElementById(id).getBoundingClientRect().width
      }
      return startWidth
    },

    max() {
      return 100
    },

    min() {
      return 0
    },

    step() {
      return 1
    },

    precision() {
      return 0
    },

    currentPosition() {
      return `${((this.value - this.min) / (this.max - this.min)) * 100}%`
    },

    currentPositionRight() {
      return `${((this.value - this.min) / (this.max - this.min)) * 100}%`
    },

    wrapperStyle() {
      return { left: this.currentPosition }
    },

    wrapperStyleTime() {
      return { 'margin-left': this.currentPositionTimeLine + 'px' }
    },

    wrapperStyleRight() {
      return { left: this.currentPosition }
    },

    wrapperStyleTimeSlot() {
      return { width: this.timeSlotWidth }
    },
    XPMobileSDK() {
      return XPMobileSDK
    },
  },
  watch: {
    flagChangeStream(val, valOld) {
      if (valOld == 10 && this.timeChangeCam) {
        this.startDate = this.timeChangeCam
      }
    },
  },
  created() {
    if (this.cameraConfig) {
      const data = this.cameraConfig
      this.camList = []
      this.camList.push({
        id: data.id,
        name: data.name ?? data.label,
      })
      this.exportVideoForm.camId[0] = data.id
      this.showingBookmark.cameraId = data.id
      this.showingBookmark.cameraName = data.name ?? data.label
    }
    this.startX = 88
    this.getDaysArray(this.stepTimeLine)
    window.addEventListener('resize', this.caculateDistance)
  },
  mounted() {
    this.calculateTime(true)
    this.startDate = cloneDeep(this.startTimeControl)
  },

  methods: {
    formatTimeMinutesSeconds(val) {
      return moment(val).format('HH:mm:ss')
    },
    formatTimeDayMonthYear(val) {
      return moment.unix(val / 1000).format('DD-MM-YYYY')
    },
    startTimer() {
      const self = this
      clearInterval(self.downloadTimer)
      const dateExpire = moment()
        .subtract(self.startDay - 1, 'day')
        .format('YYYY-MM-DD 00:00:00')
      self.downloadTimer = setInterval(() => {
        if (self.endTimeControl && self.startDate < self.startTimeControl) {
          clearInterval(self.downloadTimer)
          self.startDate = self.startTimeControl
          this.play(0)
          this.checkTimePlay(0)
        }
        if (self.endTimeControl && self.startDate > self.endTimeControl) {
          clearInterval(self.downloadTimer)
          this.play(0)
          self.startDate = self.endTimeControl
          this.checkTimePlay(0)
        }
        if (
          self.startDate / 1000 > moment().unix() ||
          (self.startDate / 1000 <= moment(dateExpire).unix() && !this.isPauseBack)
        ) {
          clearInterval(self.downloadTimer)
          this.play(0)
        }
        if (self.isPauseNext && self.isPauseBack) {
          clearInterval(self.downloadTimer)
        } else if (self.isPauseNext) {
          self.startDate = self.startDate / 1000 - 1
          self.startDate = moment.unix(self.startDate).valueOf()

          self.currentPositionTimeLine =
            self.currentPositionTimeLine + this.detectWidthForMinute() / 60
        } else if (self.isPauseBack) {
          self.startDate = self.startDate / 1000 + 1
          self.startDate = moment.unix(self.startDate).valueOf()
          self.currentPositionTimeLine =
            self.currentPositionTimeLine - this.detectWidthForMinute() / 60
        }
        const totalMinute = self.startDate / 1000 / 60
        if (totalMinute % self.stepTimeLine == 0) {
          this.caculateDistance()
        }
        //
      }, 1000 / self.speedVal)
    },
    // thoi gian video
    detectTimeForStartTime(data, target) {
      data = data.map(val => {
        return moment(val).unix()
      })
      let returnValue = null
      for (let i = 0; i < data.length; i++) {
        const cal = target - data[i]
        if (cal >= 0 && cal < target - returnValue) {
          returnValue = i
        }
      }
      return data[returnValue + 1]
    },
    handleMouseEnter() {
      this.hovering = true
    },
    handleMouseLeave() {
      this.hovering = false
    },
    preventClickEvent(event) {
      event.preventDefault()
    },
    flagClickHandle() {
      this.flagClick = true
    },
    // scroll time line
    onButtonDownTime(event) {
      event.preventDefault()
      this.onDragStarttime(event)
      window.addEventListener('mousemove', this.onDraggingTime)
      window.addEventListener('touchmove', this.onDraggingTime)
      window.addEventListener('mouseup', this.onDragEndTime)
      window.addEventListener('touchend', this.onDragEndTime)
      window.addEventListener('contextmenu', this.onDragEndTime)
    },
    detectWidthForMinute() {
      const id = 'content-fail-time' + '-' + this.cameraConfig.id
      const elementTimeLine = document.getElementById(id)
      const widthTotalDiv = elementTimeLine.getBoundingClientRect().width
      const flagPosition = widthTotalDiv / this.timeRangerListFilter.length / this.stepTimeLine
      return flagPosition
    },
    calculateTime(flag = false, changeDate = false, stepChange = false) {
      const id = 'position-start' + '-' + this.cameraConfig.id
      let startWidth = document.getElementById(id).getBoundingClientRect().width
      startWidth = startWidth / 2
      let startTime = moment(this.timeRangerListFilter[0]).unix()
      let endTime = moment(this.timeRangerListFilter[this.timeRangerListFilter.length - 1]).unix()
      const totalMinute = (endTime - startTime) / 60
      const timeCenterPosition = moment.unix(startTime).unix()
      let endTimeLine = this.detectEndTime()
      if (this.stepTimeLine > 5) {
        endTimeLine = (this.stepTimeLine / 5) * 60
      }
      const rangerCurrentTime = this.startDate / 1000 - timeCenterPosition - endTimeLine * 60
      const flagPosition = this.detectWidthForMinute()
      if (changeDate) {
        this.currentPositionTimeLine =
          -(rangerCurrentTime / 60) * flagPosition +
          startWidth -
          flagPosition * (this.stepTimeLine / 2)
      }
      if (flag) {
        this.currentPositionTimeLine =
          -(rangerCurrentTime / 60) * flagPosition +
          startWidth -
          flagPosition * (this.stepTimeLine / 2)
      } else if (stepChange) {
        this.currentPositionTimeLine =
          -(rangerCurrentTime / 60) * flagPosition +
          startWidth -
          flagPosition * (this.stepTimeLine / 2)
      } else {
        // tinh toan thoi gian sau khi thay doi vi tri
        const minuteChange = this.diffRangerTime / flagPosition
        const minuteCurrent = moment
          .unix(this.startDate / 1000)
          .subtract(minuteChange, 'minutes')
          .unix()
        startTime = moment(this.timeRangerList[0]).unix()
        endTime = moment(this.timeRangerList[this.timeRangerList.length - 1]).unix()
        endTime = endTime - 60 * 45
        startTime = startTime - 45 * 60
        if (minuteCurrent < endTime && minuteCurrent > startTime) {
          this.currentPositionTimeLine =
            this.currentPositionTimeLine +
            this.detectWidthForMinute() *
              this.detectStepTime(minuteChange, this.startDate, minuteCurrent)
          this.startDate = moment.unix(minuteCurrent).valueOf()
          this.$emit('handleChangeProgressBarTimeCustom', {
            startDate: this.startDate,
            speed: this.speed,
          })
          this.checkTimePlay(this.speed)
        }
      }
      this.detectTimeBookmark()
    },
    detectTimeBookmark() {
      const id = 'position-start' + '-' + this.cameraConfig.id
      let startWidth = document.getElementById(id).getBoundingClientRect().width
      startWidth = startWidth / 2
      const flagPosition = this.detectWidthForMinute()
      this.startTimeBookMark = moment
        .unix(this.startDate / 1000)
        .subtract(startWidth / flagPosition, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss')
      this.endTimeBookMark = moment
        .unix(this.startDate / 1000)
        .add(startWidth / flagPosition, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss')
    },
    detectStepTime(minuteChange, startDate, minuteCurrent) {
      let flagPosition = 0
      const a = this.getCLosestValuePromotion(this.timeRangerListFilter, startDate / 1000)
      const b = this.getCLosestValuePromotion(this.timeRangerListFilter, minuteCurrent)
      if (b - a == 0) {
        flagPosition = 0
      } else {
        flagPosition = (b - a) * this.stepTimeLine
      }
      return flagPosition
    },
    getCLosestValuePromotion(data, target) {
      data = data.map(val => {
        return moment(val).unix()
      })
      let returnValue = null
      for (let i = 0; i < data.length; i++) {
        const cal = target - data[i]
        if (cal >= 0 && cal < target - returnValue) {
          returnValue = i
        }
      }
      return returnValue
    },
    onDragStarttime(event) {
      this.draggingTime = true
      this.startPositionTime = event.clientX
      this.startPositionTimeCurrent = cloneDeep(this.currentPositionTimeLine)
    },
    onDraggingTime(event) {
      if (this.draggingTime) {
        this.flagClick = true
        const startTime = moment(this.timeRangerListFilter[0]).unix()
        const endTime = moment(
          this.timeRangerListFilter[this.timeRangerListFilter.length - 1]
        ).unix()
        const totalMinute = (endTime - startTime) / 60
        const widthTotal = (totalMinute / 15) * 120 - 120 * 14.48
        if (event.type === 'touchmove') {
          event.clientX = event.touches[0].clientX
        }
        let diff = event.clientX - this.startPositionTime
        let currentPositionTimeLine = 0
        if (event.clientX > this.startPositionTime) {
          diff = event.clientX - this.startPositionTime
          currentPositionTimeLine = this.startPositionTimeCurrent + diff
          this.diffRangerTime = currentPositionTimeLine - this.startPositionTimeCurrent
        } else {
          diff = this.startPositionTime - event.clientX
          currentPositionTimeLine = this.startPositionTimeCurrent - diff
          this.diffRangerTime = currentPositionTimeLine - this.startPositionTimeCurrent
        }
        this.currentPositionTimeLine = currentPositionTimeLine
        const minuteChange = this.diffRangerTime / this.detectWidthForMinute()
        const minuteCurrent = moment
          .unix(this.startDate / 1000)
          .subtract(minuteChange, 'minutes')
          .unix()
        const dateExpire = moment()
          .subtract(this.startDay - 1, 'day')
          .format('YYYY-MM-DD 00:00:00')
        if (minuteCurrent > moment().unix()) {
          // this.currentPositionTimeLine = this.positionCurrent
          this.startDateDisplay = moment().valueOf()
          this.startDate = moment().valueOf()
          this.caculateDistance()
          this.diffRangerTime = this.currentPositionTimeLine - this.startPositionTimeCurrent
        } else if (minuteCurrent < moment(dateExpire).unix()) {
          this.currentPositionTimeLine = this.positionCurrent
          this.startDateDisplay = moment.unix(dateExpire).valueOf()
          this.diffRangerTime = this.currentPositionTimeLine - this.startPositionTimeCurrent
        } else {
          this.positionCurrent = this.currentPositionTimeLine
          this.startDateDisplay = minuteCurrent * 1000
        }
      }
    },
    onDragEndTime() {
      if (this.draggingTime) {
        this.draggingTime = false
        this.startDateDisplay = null
        window.addEventListener('mousemove', this.onDraggingTime)
        window.addEventListener('touchmove', this.onDraggingTime)
        window.addEventListener('mouseup', this.onDragEndTime)
        window.addEventListener('touchend', this.onDragEndTime)
        window.addEventListener('contextmenu', this.onDragEndTime)
        if (this.startPositionTimeCurrent != this.currentPositionTimeLine) {
          this.calculateTime()
        }
      }
    },
    detectListTimeRanger(date) {
      const startTime = moment(date).subtract(this.detectStartTime(), 'minutes').unix()
      const endTime = moment(date).add(this.detectEndTime(), 'minutes').unix()
      const result = this.timeRangerList.filter(function (val) {
        return moment(val).unix() > startTime && moment(val).unix() < endTime
      })
      return result
    },
    caculateDistance() {
      const id = 'position-start' + '-' + this.cameraConfig.id
      let startWidth = document.getElementById(id).getBoundingClientRect().width
      startWidth = startWidth / 2
      const startTime = moment(this.timeRangerListFilter[0]).unix()
      const timeCenterPosition = moment.unix(startTime).unix()
      let endTimeLine = this.detectEndTime()
      if (this.stepTimeLine > 5) {
        endTimeLine = (this.stepTimeLine / 5) * 60
      }
      const rangerCurrentTime = this.startDate / 1000 - timeCenterPosition - endTimeLine * 60
      const flagPosition = this.detectWidthForMinute()
      this.currentPositionTimeLine =
        -(rangerCurrentTime / 60) * flagPosition +
        startWidth -
        flagPosition * (this.stepTimeLine / 2)
      this.detectTimeBookmark()
    },
    // xu ly download video
    timeExportHandleNew() {
      const startTime = moment.unix(this.startDate / 1000).format('YYYY-MM-DD HH:mm:ss')
      let endTime = moment
        .unix(this.startDate / 1000)
        .add(60, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss')
      if (moment().unix() - moment(startTime).unix() < 3600) {
        endTime = moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.exportVideoForm.timeExport = [
        {
          startTime,
          endTime,
        },
      ]
      this.detectTotalSizeAmountVideo()
      this.dialogExportVisible = true
    },
    clickTimePickerHandle() {
      this.timePick = this.clickTimePicker
    },
    changeTimePick() {
      const startTime = moment(this.timePick).valueOf()
      const expireTime = moment().subtract(this.startDay, 'day').valueOf()
      const currentTime = moment().unix()
      if (startTime > currentTime * 1000) {
        this.$message({
          type: 'warning',
          message: 'Thời gian bắt đầu không được lớn hơn thời gian hiện tại',
        })
        this.timePick = moment().format('YYYY-MM-DD HH:mm:ss')
        this.startDate = moment(this.timePick).valueOf()
        return
      }
      if (expireTime > startTime) {
        this.$message({
          type: 'warning',
          message: 'Thời gian bắt đầu không được nhỏ hơn ' + this.startDay + ' ngày',
        })
        this.timePick = moment().subtract(this.startDay, 'day').format('YYYY-MM-DD HH:mm:ss')
        this.startDate = moment(this.timePick).valueOf()
        return
      }
      this.startDate = moment(this.timePick).valueOf()
      this.clickTimePicker = cloneDeep(this.timePick)
      this.timePick = moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      this.$emit('handleChangeProgressBarTimeCustom', {
        startDate: this.startDate,
        speed: this.speed,
      })
      this.checkTimePlay(this.speed)
      this.caculateDistance()
    },
    changeTimeExport() {
      const startTime = moment(this.timeExport[0]).valueOf()
      const endTime = moment(this.timeExport[1]).valueOf()
      const currentTime = moment().unix()
      if (startTime > currentTime * 1000 || endTime > currentTime * 1000) {
        this.$message({
          type: 'warning',
          message: 'Thời gian bắt đầu và kết thúc không được lớn hơn thời gian hiện tại',
        })
        this.timeExport = [
          moment().subtract(0.1, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          moment().format('YYYY-MM-DD HH:mm:ss'),
        ]
        return
      }
      const day = this.startDay
      let currentTimeEx = moment().format('YYYY-MM-DD 00:00:00')
      currentTimeEx = moment(currentTimeEx).unix()
      const expireTime = currentTimeEx - day * 24 * 60 * 60
      if (startTime < expireTime * 1000 || endTime < expireTime * 1000) {
        this.$message({
          type: 'warning',
          message:
            'Thời gian bắt đầu và kết thúc không được nhỏ hơn ' +
            moment.unix(expireTime).format('DD/MM/YYYY 00:00:00'),
        })
        this.timeExport = [
          moment().subtract(0.1, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          moment().format('YYYY-MM-DD HH:mm:ss'),
        ]
        return
      }
      if (this.timeExport && this.timeExport.length > 0) {
        this.startDate = moment(this.timeExport[0]).valueOf()
        this.$emit('handleChangeProgressBarTimeCustom', {
          startDate: this.startDate,
          speed: this.speed,
        })
        this.checkTimePlay(this.speed)
        this.caculateDistance()
      }
    },
    changeTimeStep5s(type) {
      const day = this.startDay
      const currentTime = cloneDeep(this.startDate)
      let startTime = moment()
        .subtract(day - 1, 'd')
        .format('YYYY-MM-DD 00:00:00')
      startTime = moment(startTime).unix()
      if (currentTime / 1000 < moment().unix() && currentTime / 1000 >= startTime) {
        let currentTimeChange = currentTime
        if (type == -1) {
          currentTimeChange = moment
            .unix(currentTime / 1000)
            .subtract(5, 'seconds')
            .unix()
        } else {
          currentTimeChange = moment
            .unix(currentTime / 1000)
            .add(5, 'seconds')
            .unix()
        }
        this.startDate = moment.unix(currentTimeChange).valueOf()
        this.$emit('handleChangeProgressBarTimeCustom', {
          startDate: this.startDate,
          speed: this.speed,
        })
        this.checkTimePlay(this.speed)
        this.caculateDistance()
      }
    },
    changeTimeLast(type) {
      const currentTime = cloneDeep(this.startDate)
      const day = this.startDay
      if (type == 0) {
        const startTime = moment().subtract(day, 'd').format('YYYY-MM-DD 00:00:00')
        this.startDate = moment(startTime).valueOf()
      } else {
        this.startDate = moment().valueOf()
      }
    },
    checkStatusVideoExport(data) {
      const self = this
      // clearInterval(this.intelCheckStatusVideoId)
      this.ExportId = data.response.outputParameters.ExportId
      this.intelCheckStatusVideoId = setInterval(function () {
        this.XPMobileSDK.getExport(
          data.response.outputParameters.ExportId,
          self.createExportDownloadLink,
          self.createLinkDownloadFail
        )
      }, 500)
    },
    postHistoryVideoResource(status) {},
    callBackExportFail(data) {
      this.timeExportLoading = false
    },
    // ket thuc
    createLinkDownloadFail(data) {
      this.timeExportLoading = false
    },
    // ket thuc
    formatTooltip(val) {
      return val / 100
    },
    onClick(e) {},
    changeMultipleStreamsHandle(time, type = 0) {
      let test = time / 1000
      test = moment.unix(test).format('YYYY-MM-DD HH:mm:ss')
      const sel = this
      this.play(0)
      this.XPMobileSDK.changeMultipleStreams(
        {
          PlaybackControllerId: this.playbackControllerId,
          SeekType: 'Time',
          Time: time,
        },
        async parameters => {
          await this.delay(2000)
          sel.play(type)
        }
      )
    },
    offset(el) {
      var rect = el.getBoundingClientRect()
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    },

    createPlaybackController() {
      this.XPMobileSDK.createPlaybackController(
        {
          SeekType: 'Time',
          Time: this.startDate,
        },
        this.createPlaybackControllerCallback,
        function (__) {}
      )
    },
    checkTimePlay(speed) {
      if (speed == 0) {
        this.$emit('handleChangeProgressBarTimeCustom', {
          startDate: this.startDate,
          speed: 0,
        })
        this.play(0)
      } else {
        if (this.startDate / 1000 > moment().unix()) {
          this.play(0)
          clearInterval(self.downloadTimer)
        } else {
          this.play(speed)
        }
      }
    },
    play(speed, flag = false) {
      const self = this
      if (speed == 0) {
        this.isPauseBack = true
        this.isPauseNext = true
        this.isPause = true
      } else if (speed == -1) {
        this.isPauseBack = false
        this.isPauseNext = true
        speed = -this.speedVal
      } else if (speed == 1 && !flag) {
        this.isPauseNext = false
        this.isPauseBack = true
        speed = this.speedVal
      } else {
        this.isPause = false
      }
      if (flag) {
        if (!this.isPauseBack) speed = -speed
        // eslint-disable-next-line no-self-assign
        if (!this.isPauseNext) speed = speed
        if (!this.isPauseBack || !this.isPauseNext) {
          this.$emit('stopAndRun', speed)
        }
      } else {
        this.$emit('stopAndRun', speed)
      }
      this.startTimer()
      this.speed = speed
    },
    handleTimeBar() {
      let diffDate = new Date(this.currentDate).getTime() - this.startDate
      if (diffDate > this.totalTime) {
        diffDate = this.totalTime
      }
      if (diffDate < 0) {
        diffDate = 0
      }
      const bar = document.getElementById('defaultBar')
      const progressBar = document.getElementById('progressBar')
      if (bar && progressBar) {
        this.sizeProgress = bar.offsetWidth
        this.timeProgress = diffDate
        if (this.totalTime > 0) {
          this.timeProgressBar = parseInt((bar.offsetWidth * diffDate) / this.totalTime)
          progressBar.style.width = this.timeProgressBar + 'px'
        }
      }
    },
    onPlaybackEvents(playbackEvents) {
      if (playbackEvents & this.XPMobileSDK.library.ItemHeaderParser.PlaybackFlags.Stopped) {
        // onPlaybackStopped();
      }
      if (playbackEvents & this.XPMobileSDK.library.ItemHeaderParser.PlaybackFlags.Forward) {
        // onPlaybackForward();
      }
      if (playbackEvents & this.XPMobileSDK.library.ItemHeaderParser.PlaybackFlags.Backward) {
        // onPlaybackBackwards();
      }
    },
    onReceivedFrame(frame) {
      if (frame.hasPlaybackInformation) {
        this.onPlaybackEvents(frame.currentPlaybackEvents)
      }

      this.currentDate = frame.timestamp
      this.handleTimeBar()
    },
    delay(ms) {
      // eslint-disable-next-line promise/param-names
      return new Promise(res => setTimeout(res, ms))
    },
    async createPlaybackControllerCallback(connection) {
      const videoConnection = connection
      this.playbackControllerId = connection.response.parameters.PlaybackControllerId
      const self1 = this
      var videoConnectionObserver = {
        videoConnectionReceivedFrame: self1.onReceivedFrame,
        videoConnectionTemporaryDown: function () {},
        videoConnectionRecovered: function () {},
        videoConnectionNotAvailable: function () {},
      }

      videoConnection.addObserver(videoConnectionObserver)

      if (videoConnection.getState() == this.XPMobileSDK.library.VideoConnectionState.notOpened) {
        videoConnection.open()
      }
      await this.delay(1000)
      this.play(this.speed)
    },

    getObject() {
      if (this.layoutSelect) {
        return this.data.filter(f => f.label == this.layoutSelect)[0]
      }
      return []
    },
    getDaysArray(step) {
      this.timeRangerList = []
      const day = this.startDay
      const totalMinute = (day + 1) * 24 * 60 + 180
      const countArr = totalMinute / step
      let startTime = moment().subtract(day, 'd').format('YYYY-MM-DD 00:00:00')
      startTime = moment(startTime).unix() - 180 * 60
      startTime = moment.unix(startTime).format('YYYY-MM-DD HH:mm:ss')
      let item = null
      for (let i = 0; i < countArr; i++) {
        item = moment(startTime)
          .add(step * i, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss')
        this.timeRangerList.push(item)
      }
    },
    closeDialog(formName) {
      this.$refs[formName].clearValidate()
      this.$refs[formName].resetFields()
      this.rangerTimeVideo = 0
      const startTime = moment.unix(this.startDate / 1000).format('YYYY-MM-DD HH:mm:ss')
      const endTime = moment
        .unix(this.startDate / 1000)
        .add(60, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss')
      this.exportVideoForm.timeExport[0] = {
        startTime,
        endTime,
      }
    },
    addCam() {
      this.listCamExport.push({
        id: this.uuid(),
      })
    },
    removeCam(item, ind) {
      const listCamExport = cloneDeep(this.listCamExport)
      this.listCamExport = listCamExport.filter(val => {
        return item != val.id
      })
      const exportVideoForm = cloneDeep(this.exportVideoForm)
      delete exportVideoForm.camId[ind]
      delete exportVideoForm.timeExport[ind]
      this.exportVideoForm.camId = exportVideoForm.camId.filter(val => {
        return val
      })
      this.exportVideoForm.timeExport = exportVideoForm.timeExport.filter(val => {
        return val
      })
      this.detectTotalSizeAmountVideo()
    },
    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0
        var v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    detectTotalSizeAmountVideo() {
      this.sizeVideo = 0
      this.totalVideo = this.exportVideoForm.camId.length
      this.exportVideoForm.timeExport.forEach((val, ind) => {
        if (val) {
          if (val.startTime && val.endTime) {
            const startTimeCheck = moment(val.startTime).valueOf()
            const endTimeCheck = moment(val.endTime).valueOf()
            const rangeTimeExport = (endTimeCheck - startTimeCheck) / 1000
            if (rangeTimeExport > 3600) {
              this.$notify({
                title: 'Lỗi',
                message: 'Khoảng thời gian xuất không được vượt quá 60 phút',
                type: 'error',
              })
              return
            }
            if (rangeTimeExport < 0) {
              this.$notify({
                title: 'Lỗi',
                message: 'Khoảng thời gian xuất phải nhiều hơn 0 phút',
                type: 'error',
              })
              return
            }
            if (startTimeCheck == endTimeCheck) {
              this.$notify({
                title: 'Lỗi',
                message: 'Thời gian bắt đầu và kết thúc không được trùng nhau',
                type: 'error',
              })
              return
            }
            const startTime = moment(val.startTime).unix()
            const endTime = moment(val.endTime).unix()
            if (this.exportVideoForm.camId[ind]) {
              this.sizeVideo += (endTime - startTime) * 0.03
              this.rangerTimeVideo = (endTime - startTime) / 60
            }
          }
        }
      })
    },
    isFloat(n) {
      return Number(n) === n && n % 1 !== 0
    },
    detectTime() {
      const val = this.stepTime
      let label = ''
      if (val == 0) label = '5 phút'
      if (val == 10) label = '10 phút'
      if (val == 20) label = '30 phút'
      if (val == 30) label = '1 giờ'
      if (val == 40) label = '3 giờ'
      if (val == 50) label = '6 giờ'
      if (val == 60) label = '12 giờ'
      if (val == 70) label = '24 giờ'
      if (val == 80) label = '48 giờ'
      return label
    },
    detectStartTime() {
      let result = 0
      if (this.stepTime == 0) result = 10
      if (this.stepTime == 10) result = 20
      if (this.stepTime == 20) result = 60
      if (this.stepTime == 30) result = 120
      if (this.stepTime == 40) result = 360
      if (this.stepTime == 50) result = 720
      if (this.stepTime == 60) result = 1440
      if (this.stepTime == 70) result = 3600
      if (this.stepTime == 80) result = 6480
      return result
    },
    detectEndTime() {
      let result = 0
      if (this.stepTime == 0) result = 5
      if (this.stepTime == 10) result = 10
      if (this.stepTime == 20) result = 30
      if (this.stepTime == 30) result = 60
      if (this.stepTime == 40) result = 180
      if (this.stepTime == 50) result = 360
      if (this.stepTime == 60) result = 720
      if (this.stepTime == 70) result = 1440
      if (this.stepTime == 80) result = 4320
      return result
    },
    changeStepTimeSetting(val) {
      this.visibleRangerTime = false
      this.visibleActionReplay = true
      this.changeStepTime(val)
    },
    backStepTimeSetting() {
      this.visibleRangerTime = false
      this.visibleActionReplay = true
    },
    changeStepTime(val) {
      let step = 1
      this.stepTime = val
      this.rangerTimeLine = 36
      if (val == 0) {
        // eslint-disable-next-line no-unused-expressions, no-sequences
        ;(step = 1), (this.timeSlotWidth = '6.66667%'), (this.rangerTimeLine = 15)
      }
      if (val == 10) {
        // eslint-disable-next-line no-unused-expressions, no-sequences
        ;(step = 1), (this.timeSlotWidth = '3.33333%'), (this.rangerTimeLine = 30)
      }
      if (val == 20) {
        // eslint-disable-next-line no-unused-expressions, no-sequences
        ;(step = 5), (this.timeSlotWidth = '5.55556%'), (this.rangerTimeLine = 18)
      }
      // eslint-disable-next-line no-unused-expressions, no-sequences
      if (val == 30) (step = 5), (this.timeSlotWidth = '2.77778%')
      // eslint-disable-next-line no-unused-expressions, no-sequences
      if (val == 40) (step = 15), (this.timeSlotWidth = '2.77778%')
      // eslint-disable-next-line no-unused-expressions, no-sequences
      if (val == 50) (step = 30), (this.timeSlotWidth = '2.77778%')
      // eslint-disable-next-line no-unused-expressions, no-sequences
      if (val == 60) (step = 60), (this.timeSlotWidth = '2.77778%')
      // eslint-disable-next-line no-unused-expressions, no-sequences
      if (val == 70) (step = 120), (this.timeSlotWidth = '2.77778%')
      // eslint-disable-next-line no-unused-expressions, no-sequences
      if (val == 80) (step = 240), (this.timeSlotWidth = '2.77778%')
      this.stepTimeLine = step
      this.getDaysArray(step)
      this.calculateTime(false, false, true)
    },
    handleCloseForm() {
      this.showForm = false
    },
    zoomVideo() {
      this.flagZoom = !this.flagZoom
      this.$emit('zoomVideo')
    },
  },
}
</script>
<style type="text/css" lang="scss" scoped>
.time-export-video-cctv {
  z-index: 9999999 !important;
}

.icon-zoomout::before {
  content: '\f109';
  font-family: VideoJS;
  color: white;
  cursor: pointer;
}

.pick-time-for-cam {
  .popper__arrow {
    left: 2px !important;
  }
}

.pick-time-for-cam,
.list-ranger-by-cam,
.list-bookmark-by-cam,
.list-action-replaycam {
  z-index: 999999 !important;
}
</style>
<style lang="scss">
@import '@/styles/variables.module.scss';
.el-tooltip__popper {
  z-index: 9999999 !important;
}

.full-screen-setting.list-action-replaycam {
  /*z-index: 999999 !important;*/
  bottom: 46px !important;
  right: 2px !important;
  top: initial !important;
  left: initial !important;
}

.full-screen-setting.list-ranger-by-cam {
  bottom: 58px !important;
  right: 2px !important;
  top: initial !important;
  left: initial !important;
}

.list-ranger-by-cam {
  background: initial;
  border: initial;
  padding: 0;

  .item.label {
    border-bottom: 1px solid white;
    padding: 6px;
    font-weight: 500;
    margin-bottom: 5px;

    i {
      cursor: pointer;
    }
  }

  .popper__arrow {
    display: none;
  }

  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
    border-radius: 3px;
    color: white;

    div {
      .item {
        padding: 6px 6px;
        cursor: pointer;
      }
    }
  }
}

.barplayback div {
  position: absolute;
  top: 0;
  height: 8px;
  background-color: red;
  min-width: 1px;
}

.barplayback-container {
  position: absolute;
  top: 30px;
  left: -100%;
  right: -100%;
}

.barplayback {
  height: 8px;
  position: relative;
  width: 100%;
  background: #323232;
}

.list-action-replaycam {
  padding: 0;
  background: none;
  border: none;
  border-radius: 4px;

  .popper__arrow {
    border-right-color: rgba(0, 0, 0, 0.8);

    &::after {
      border-right-color: rgba(0, 0, 0, 0.8);
    }
  }

  &[x-placement^='top'] .popper__arrow {
    display: none;
  }
}

.export-ruleForm {
  .item {
    float: left;
    width: 100%;
    margin-bottom: 7px;
  }

  .el-form-item {
    width: 100%;
    float: left;

    .el-date-editor {
      width: 100%;
    }
  }

  .plus-minus-icon {
    width: 30px;
    float: left;
    margin-left: 10px;
    height: 36px;
    line-height: 36px;
    font-size: 22px;
    text-align: center;
    color: black;
    cursor: pointer;
  }
}

.control-step-select {
  .el-select-dropdown__list {
    background: white !important;
  }
}

.control-speed-select {
  z-index: 999999 !important;
  min-width: 40px !important;
  background: rgba(0, 0, 0, 0.8);
  border: 0;

  .el-select-dropdown__item {
    height: 30px;
    line-height: 30px;
  }

  .popper__arrow {
    display: none !important;
  }

  .el-select-dropdown__list {
    /*background: rgba(0,0,0,0.8);*/
    padding-top: 0;

    .el-select-dropdown__item.selected {
      background: initial;
    }

    .el-select-group__title {
      color: white;
      font-size: 13px;
      border-bottom: 1px solid #dddd;
      padding-bottom: 5px;
      padding-top: 5px;
    }

    .el-select-dropdown__item.selected,
    .el-select-dropdown__item:active,
    .el-select-dropdown__item:focus,
    .el-select-dropdown__item:hover {
      background: rgba(97, 97, 97, 0.89) !important;
    }

    li {
      background: initial !important;
      padding: 0;
      padding-left: 5px;

      span {
        font-size: 12px;
        color: white !important;
        font-weight: 500 !important;
      }
    }
  }
}

.control-custom-bar {
  /*margin-top: 40px;*/
  width: 100%;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.75) 100%);

  .export-video-replay {
    .el-dialog {
      margin-top: 15% !important;
    }

    .cancel-dialog {
      text-align: left;
      padding-left: 3px;

      span {
        color: #606266 !important;
        font-weight: normal !important;
        font-size: 14px !important;
        text-transform: initial !important;
      }
    }

    .save-dialog {
      background: #35377a !important;
      width: 105px;
    }

    .time-export {
      color: $menuText;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  }

  .cancel-dialog {
    padding-left: 0;
    border: initial;
    background: white;
  }

  .el-dialog__footer {
    padding: 10px 25px 20px;
    padding-top: 0;
  }

  .date-display-timeline {
    color: white;
    position: relative;
    display: inline-block;
    right: 25px;
    font-size: 14px;
    font-weight: bold;
    top: 3px;
  }

  .time-display-timeline {
    color: white;
    position: relative;
    display: inline-block;
    left: 7px;
    font-size: 14px;
    font-weight: bold;
    top: 3px;
  }

  .content-time-line {
    position: absolute;
    left: -100%;
    right: -100%;
    height: 8px;
    bottom: 10px;
    font-size: 0;
    /*background: #323232;*/
    background: #db3332;
    cursor: pointer;
    white-space: nowrap;
    -ms-touch-action: none;
    touch-action: none;

    .content-fail-time {
      position: relative;
      width: 100%;
      height: 8px;

      .timeslot {
        position: relative;
        display: inline-block;
        height: 8px;
        line-height: 50px;
        font-size: 12px;
        transition: 0.8s;
        text-align: center;

        .tmpl_time {
          color: white;
        }

        .line {
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -1px;
          width: 1px;
          height: 8px;
          background-color: #fff;
        }
      }
    }
  }

  .time-line-scroll {
    height: 48px;
    position: relative;
    width: 100%;

    .handle {
      height: 50px;
      width: 5px;
      cursor: w-resize;
      background: #329ae4;
    }

    .handle-left {
      position: absolute;
    }

    .handle-right {
      position: absolute;
    }

    .handle-center {
      height: 24px;
      width: 5px;
      background: white;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 3px;
      margin: 0 auto;
      border-radius: 4px;
    }
  }

  .time-line-control {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 2px;
    color: white;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      padding: 10px 15px;
    }
  }

  .control-ranger-time {
    .el-select {
      float: left;
      width: 34px;
      margin-right: 5px;
      position: relative;
      left: -20px;
      top: 5px;

      .el-input__wrapper {
        padding: 0px;
      }
    }

    .date-custom {
      display: inline-block;
      float: left;
      cursor: pointer;
    }

    .el-input__inner {
      height: 21px;
      line-height: 21px;
      padding-left: 0px;
      padding-right: 0px;
      text-align: center;
      font-size: 11px;
      font-weight: 500;
    }

    .el-input__suffix {
      display: none;
    }

    .el-date-editor {
      opacity: 0;
      border: initial;
      width: 34px;
      float: left;
      margin-right: 0;
      display: inline-block;
      position: relative;
      cursor: pointer;
      left: -28px;

      .el-input__prefix {
        left: 0;
        width: 20px;
      }

      .el-icon-time {
        width: 20px;
      }

      .el-range-input {
        background: #1a1a1a;
        color: white;
      }
    }

    button {
      margin-left: 5px;
      background: #0369d3;
      border-radius: 4px;
      font-weight: normal;
    }

    .el-range-separator {
      color: white !important;
    }

    .el-slider {
      width: 150px;
      float: left;

      // .el-slider__runway {
      //   /*margin-top: 8px;*/
      // }
    }

    .label-ranger-time {
      float: left;
      margin-left: 15px;
      padding-top: 7px;
      font-weight: 300;
      font-size: 15px;
    }
  }

  .control-play {
    .next-button.last {
      margin-left: 10px;

      svg {
        position: relative;
        top: -2px;
      }
    }

    .next-button.first {
      margin-left: 11px;
      padding-left: 5px;
      padding-right: 5px;
    }

    .pre-button.last {
      margin-right: 11px;
      padding-left: 5px;
      padding-right: 5px;
    }

    .pre-button.first {
      margin-right: 10px;

      svg {
        position: relative;
        top: -2px;
      }
    }

    // .next-button {
    //   svg {
    //     /*transform: rotate(180deg);*/
    //   }
    // }

    .next-button,
    .pre-button {
      position: relative;
      display: inline-block;
      cursor: pointer;

      .el-icon-d-arrow-left {
        margin-right: 5px;
      }

      .el-icon-d-arrow-right {
        margin-left: 5px;
      }

      svg {
        font-size: 16px;
      }

      span {
        font-size: 20px;
        font-weight: bold;
        position: relative;
      }
    }

    .play-block {
      display: inline-block;

      .replay-icon {
        float: left;
        font-size: 30px;
        cursor: pointer;
        position: relative;
        top: 2px;
      }

      .el-icon-caret-right {
        float: left;
        font-size: 30px;
        cursor: pointer;
      }

      .time-video {
        float: left;
        padding-left: 15px;
        padding-right: 15px;
        line-height: 18px;

        span:nth-child(1) {
          display: block;
          font-weight: bold;
        }

        span:nth-child(2) {
          font-size: 14px;
          font-weight: 300;
        }
      }
    }
  }

  .control-speed {
    .setting-control.active {
      svg {
        color: #3cc0ff;
      }
    }

    .setting-control {
      svg {
        color: white;
      }
    }

    .create-event {
      display: inline-block;
      margin-right: 10px;
      cursor: pointer;

      svg {
        font-size: 18px;
        height: 20px !important;
        width: 20px !important;
      }
    }

    button {
      margin-right: 5px;
      background: #0369d3;
      border-radius: 4px;
      font-weight: normal;
    }

    .el-select {
      width: 160px;
    }

    .el-input__inner {
      background: #1a1a1a;
      height: 35px !important;
      color: white;
      border: initial;
    }
  }
}
</style>
<style lang="scss" scoped>
:deep(.event-create .block-item .el-row) {
  padding-bottom: 0 !important;
}

:deep(.create-event .el-dialog__header) {
  background: white !important;
  justify-content: flex-start;
  padding: 16px;
}

:deep(.create-event .el-dialog__header span) {
  color: $menuText !important;
  text-align: left;
  font-size: 20px;
  font-weight: 500;
  width: 100%;
}

:deep(.create-event .el-dialog__body) {
  padding: 0 16px 16px;
}

:deep(.create-event .el-dialog__header i.el-dialog__close) {
  color: #000000;
}

.controller-bar {
  #defaultBar {
    cursor: pointer;
    border: none;
    position: relative;
    float: left;
    border-radius: 5px;
    width: 100%;
    height: 5px;
    background: #ffffff94 !important;
  }

  #progressBar {
    position: absolute;
    width: 0px;
    border-radius: 5px;
    height: 4px;
    background: red;
  }

  .nav-controll {
    #defaultBar {
      width: calc(100% - 38px);
    }
  }

  min-height: 60px;
  background: linear-gradient(#222222, #040404);

  .timeline-bar {
    min-height: 70px;
  }

  .button-bar {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;

    .main-button {
      display: grid;
      grid-auto-flow: column;
      grid-gap: 5px;
      align-items: center;

      i {
        font-size: 22px;
      }
    }

    .suff-button {
      .speed-slider {
        width: 100px;
      }
    }
  }
}

div:not(.full-screen-setting) {
  .content-list-action {
    position: relative;
    bottom: 17px;
    right: 14px;
  }

  .content-ranger-time {
    position: relative;
    bottom: -93px;
    right: 0px;
    background: rgba(0, 0, 0, 0.8);
  }
}

.content-list-action {
  color: #fff;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 80px;
  overflow-y: auto;
  border-radius: 3px;

  .item {
    display: flex;
    align-items: center;
    padding: 5px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
    justify-content: space-between;
  }

  .icon {
    width: 12px;
    height: 12px;
  }

  .item div {
    display: flex;
    align-items: center;
  }
}
</style>
