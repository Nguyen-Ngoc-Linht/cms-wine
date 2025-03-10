<template>
  <div
    class="vww__widget"
    :style="{ color: textColor }"
    :class="{ mini: miniShow }"
  >
    <slot name="header">
      <div
        v-if="!hideHeader"
        class="vww__header"
        :style="{ borderColor: barColor }"
      >
        <span class="vww__title">
          <slot name="title">Weather</slot>
        </span>
      </div>
    </slot>

    <div
      class="vww__content"
      @mouseover="miniShow = false"
      @mouseleave="miniShow = true"
    >
      <div
        v-if="loading"
        class="vww__loading"
      >
        <slot name="loading">
          <skycon
            condition="partly-cloudy-day"
            :color="textColor"
            :paused="disableAnimation"
          />
          <span class="vww__title">Loading...</span>
        </slot>
      </div>

      <div
        v-else-if="error || !weather || !currently || !daily"
        class="vww__error"
      >
        <slot name="error">
          <skycon
            condition="rain"
            :color="textColor"
            :paused="disableAnimation"
          />
          <span class="vww__title">{{ error || 'Something went wrong!' }}</span>
        </slot>
      </div>

      <template v-else>
        <div class="mini__widget">
          <span class="temperature">{{ Math.round(currently.temperature) }}&deg;{{ unit }}</span>
          <span class="mini__summary ml-1 padding-right-5 text-white">
            {{ currently.summary }}
          </span>
          <skycon
            :condition="currently.icon"
            size="24"
            :color="textColor"
            :paused="disableAnimation"
            class="skyicon"
          />
          <div class="mini__datetime ml-1">{{ now }}</div>
        </div>
        <!-- <div v-else class="extra-widget">
          <div class="vww__currently">
            <div>
              <skycon
                :condition="currently.icon"
                size="80"
                :color="textColor"
                :paused="disableAnimation"
              />
              <div class="vww__temp">
                {{ Math.round(currently.temperature) }}&deg;{{ unit }}
              </div>
            </div>
            <div class="vww__title">{{ currently.summary }}</div>
            <div class="vww__wind">
              Gió: {{ Math.round(currently.windSpeed) }} mph ({{ windBearing }})
            </div>
          </div>

          <div class="vww__daily">
            <div v-for="day in daily" :key="day.time" class="vww__day">
              <span>{{ day.weekName }}</span>
              <span>
                <skycon
                  style="display: block"
                  :condition="day.icon"
                  size="26"
                  :color="textColor"
                  :paused="disableAnimation"
                />
              </span>
              <div class="vww__day-bar">
                <div :style="{ height: `${day.top}%` }">
                  <span>{{ Math.round(day.temperatureMax) }}&deg;</span>
                </div>
                <div
                  :style="{
                    borderRadius: '10px',
                    background: barColor,
                    height: `${day.height}%`,
                  }"
                >
                  &nbsp;
                </div>
                <div :style="{ height: `${day.bottom}%` }">
                  <span>{{ Math.round(day.temperatureMin) }}&deg;</span>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </template>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss">
@import './style.scss';
</style>
<style lang="scss" scoped>
.mini__widget {
  display: flex;
  align-items: center;
  span,
  div {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    padding-right: 3px;
  }
}
.temperature {
  color: #fff !important;
  font-size: 22px !important;
}
.vww__widget {
  padding: 0 10px;
}
.mini__summary {
  display: inline-block;
  text-overflow: ellipsis;
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
}
</style>
