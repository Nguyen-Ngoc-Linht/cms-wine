<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backRating()"
        >
          <img
            src="@/assets/imgs/weightStation/back.png"
            alt="..."
          />
        </div>
        <div
          v-if="!isEdit && !isView"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('monitoring.rating.addRating') }}
        </div>
        <div
          v-if="isEdit && !isView"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('monitoring.rating.editRating') }}
        </div>
        <div
          v-if="isView"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('monitoring.rating.evaluationInfo') }}
        </div>
      </h5>
      <div class="flex items-center">
        <el-button
          type="default"
          @click="backRating"
          class="bg-outline-secondary"
          >{{ $t('configUser.closed') }}
        </el-button>
        <el-button
          v-if="!isEdit && roleData.canCreate && !isView"
          :loading="processing"
          @click="handleAddReview()"
          class="el-button--main"
          >{{ $t('omsSetting.save') }}
        </el-button>
        <el-button
          :loading="processing"
          v-if="isEdit && !isView && roleData.canUpdate"
          @click="handleUpdateRating()"
          class="el-button--main"
        >
          {{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
    <!--  Content  -->
    <div
      v-if="roleData.canRead"
      class="px-6 mt-4 content-page"
    >
      <div
        v-loading="loading"
        class="bg-white px-5 pt-6 pb-4"
      >
        <el-form
          ref="viewInfoReview"
          :rules="ruleEdit"
          :model="infoReviewRating"
        >
          <div class="flex items-center justify-between">
            <h5 class="text-black font-semibold text-lg">
              {{ $t('monitoring.rating.evaluationInfo') }}
            </h5>
          </div>
          <div class="flex justify-between gap-5 mt-4">
            <div style="width: 50%">
              <el-form-item
                :label="t('monitoring.rating.title')"
                prop="title"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoReviewRating.title"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                  :disabled="true"
                />
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('monitoring.rating.timeRating')"
                prop="scoringWeek.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <div class="flex gap-2.5 w-full">
                  <el-select
                    v-model="infoReviewRating.scoringWeek.id"
                    clearable
                    filterable
                    collapse-tags
                    style="width: 100px"
                    @change="
                      value => {
                        setDateTimeRating(value)
                      }
                    "
                    :placeholder="$t('configUser.pleaseSelect')"
                    :disabled="isEdit || isView"
                  >
                    <el-option
                      v-for="item in listWeek"
                      :key="item.id"
                      :label="item.weekName"
                      :value="item.id"
                    />
                  </el-select>
                  <el-date-picker
                    v-model="infoReviewRating.timeRating"
                    type="datetimerange"
                    :start-placeholder="t('el.datepicker.startTime')"
                    :range-separator="t('el.datepicker.to')"
                    :end-placeholder="t('el.datepicker.endTime')"
                    clearable
                    value-format="YYYY-MM-DD"
                    format="06:00 - DD/MM/YYYY"
                    style="flex: 1"
                    :disabled="true"
                  />
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5 mt-2">
            <div style="width: 50%">
              <el-form-item
                :label="$t('configUser.gland')"
                prop="route.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoReviewRating.route.id"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="
                    value => {
                      updateListStation(value)
                    }
                  "
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isEdit || isView"
                >
                  <el-option
                    v-for="item in routeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.station')"
                prop="station.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoReviewRating.station.id"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="setNameRating"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isEdit || isView"
                >
                  <el-option
                    v-for="item in stationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>

        <div class="mt-5">
          <el-tabs
            v-model="activeName"
            class="tab-review-rating"
          >
            <!--    Cơ sở vật chất    -->
            <el-tab-pane
              :label="t('monitoring.rating.facilities')"
              name="facilities"
            >
              <div class="flex justify-between items-center">
                <h5 class="text-black font-semibold text-lg">
                  {{ $t('monitoring.rating.evaluationCriteria') }}
                </h5>
                <div class="flex items-center">
                  <h5 class="text-black font-semibold text-lg me-3">
                    {{ $t('monitoring.rating.totalPoint') }}
                  </h5>
                  <el-button class="bg--success text-white btn-default"
                    >{{ checkIsNumber(totalRating[0]) }} {{ $t('monitoring.rating.score') }}
                  </el-button>
                </div>
              </div>
              <div class="info-general mt-3">
                <el-collapse v-model="activeNameCollapse">
                  <div
                    v-for="(label, index) of titleFacilities[0]"
                    :key="index"
                  >
                    <el-collapse-item :name="label.id">
                      <template #title="{}">
                        <div class="flex w-full justify-between items-center">
                          <h5
                            class="text-black text-start font-semibold text-lg mb-0 me-16"
                            style="line-height: 1.8"
                          >
                            {{ index + 1 }}. {{ label.title }}
                          </h5>
                          <el-button class="bg--dark-blue text-white btn-default"
                            >{{ checkIsNumber(scoringDetails[0][index].totalPoint) }}
                            {{ $t('monitoring.rating.score') }}
                          </el-button>
                        </div>
                      </template>
                      <el-row
                        :gutter="20"
                        class="mt-2"
                      >
                        <el-col
                          :sm="7"
                          :md="8"
                        >
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.maxScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.minusPoint') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.ratingScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.detailViolation') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.fileRating') }}
                          </h5>
                        </el-col>
                      </el-row>
                      <el-row
                        v-for="(item, childrenIndex) of label.children"
                        :key="item.id"
                        :gutter="20"
                        class="mt-3"
                      >
                        <el-col
                          :md="8"
                          :sm="7"
                        >
                          <div class="flex">
                            <div
                              v-html="item.title"
                              class="ms-4"
                            ></div>
                          </div>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5 mx-2"
                            style="height: 100%"
                          >
                            {{ item.maxScore }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <el-input
                            v-model="scoringDetails[0][index].scores[childrenIndex].minusScore"
                            type="number"
                            @input="
                              value => {
                                setTotalPoint(Number(value), index, childrenIndex, 0)
                              }
                            "
                            @blur="
                              () => {
                                setValueDefault(
                                  scoringDetails[0][index].scores[childrenIndex].minusScore,
                                  index,
                                  childrenIndex,
                                  0
                                )
                              }
                            "
                            class="w-full text-start text-custom"
                            style="height: 100%; padding-top: 0; font-size: 18px"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5"
                            style="height: 100%"
                          >
                            {{
                              checkIsNumber(
                                item.maxScore -
                                  scoringDetails[0][index].scores[childrenIndex].minusScore
                              )
                            }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <el-input
                            type="textarea"
                            maxlength="5000"
                            show-word-limit
                            v-model="scoringDetails[0][index].scores[childrenIndex].violateDetail"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <el-upload
                            v-model:file-list="
                              scoringDetails[0][index].scores[childrenIndex].listFile
                            "
                            class="upload-demo"
                            :on-success="null"
                            :on-error="null"
                            :on-change="
                              (file, fileList) =>
                                handleUploadFile(file, fileList, 0, index, childrenIndex)
                            "
                            :auto-upload="false"
                            :on-preview="handlePreview"
                            :before-remove="beforeRemove"
                            :on-remove="file => handleRemove(file, 0, index, childrenIndex)"
                            :disabled="isView"
                            accept=".jpg,.png,.pdf"
                          >
                            <label class="text--info flex font-medium pointer">
                              <svg-icon
                                icon-class="import-file"
                                class="mr-2"
                                style="width: 20px; height: 20px"
                              />
                              {{ $t('monitoring.rating.addFiles') }}
                            </label>
                          </el-upload>
                        </el-col>
                      </el-row>
                    </el-collapse-item>
                    <hr class="mb-6 mt-4" />
                  </div>
                </el-collapse>
              </div>
            </el-tab-pane>
            <!--    Độ tin cậy 2    -->
            <el-tab-pane
              :label="t('monitoring.rating.reliability')"
              name="reliability"
            >
              <div class="flex justify-between items-center">
                <h5 class="text-black font-semibold text-lg">
                  {{ $t('monitoring.rating.evaluationCriteria') }}
                </h5>
                <div class="flex items-center">
                  <h5 class="text-black font-semibold text-lg me-3">
                    {{ $t('monitoring.rating.totalPoint') }}
                  </h5>
                  <el-button class="bg--success text-white btn-default"
                    >{{ checkIsNumber(totalRating[1]) }} {{ $t('monitoring.rating.score') }}
                  </el-button>
                </div>
              </div>
              <div class="info-general mt-3">
                <el-collapse v-model="activeNameCollapse">
                  <div
                    v-for="(label, index) of titleFacilities[1]"
                    :key="index"
                  >
                    <el-collapse-item :name="label.id">
                      <template #title="{}">
                        <div class="flex w-full justify-between items-center">
                          <h5
                            class="text-black text-start font-semibold text-lg mb-0 me-16"
                            style="line-height: 1.8"
                          >
                            {{ index + 1 }}. {{ label.title }}
                          </h5>
                          <el-button class="bg--dark-blue text-white btn-default"
                            >{{ checkIsNumber(scoringDetails[1][index].totalPoint) }}
                            {{ $t('monitoring.rating.score') }}
                          </el-button>
                        </div>
                      </template>
                      <el-row
                        :gutter="20"
                        class="mt-2"
                      >
                        <el-col
                          :sm="7"
                          :md="8"
                        >
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.maxScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.minusPoint') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.ratingScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.detailViolation') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.fileRating') }}
                          </h5>
                        </el-col>
                      </el-row>
                      <el-row
                        v-for="(item, childrenIndex) of label.children"
                        :key="item.id"
                        :gutter="20"
                        class="mt-3"
                      >
                        <el-col
                          :md="8"
                          :sm="7"
                        >
                          <div class="flex">
                            <div
                              v-html="item.title"
                              class="ms-4"
                            ></div>
                          </div>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5 mx-2"
                            style="height: 100%"
                          >
                            {{ item.maxScore }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <el-input
                            v-model="scoringDetails[1][index].scores[childrenIndex].minusScore"
                            type="number"
                            @input="
                              value => {
                                setTotalPoint(value, index, childrenIndex, 1)
                              }
                            "
                            @blur="
                              () => {
                                setValueDefault(
                                  scoringDetails[1][index].scores[childrenIndex].minusScore,
                                  index,
                                  childrenIndex,
                                  1
                                )
                              }
                            "
                            class="w-full text-start text-custom"
                            style="height: 100%; padding-top: 0; font-size: 18px"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5"
                            style="height: 100%"
                          >
                            {{
                              checkIsNumber(
                                item.maxScore -
                                  scoringDetails[1][index].scores[childrenIndex].minusScore
                              )
                            }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <el-input
                            type="textarea"
                            maxlength="5000"
                            show-word-limit
                            v-model="scoringDetails[1][index].scores[childrenIndex].violateDetail"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <el-upload
                            v-model:file-list="
                              scoringDetails[1][index].scores[childrenIndex].listFile
                            "
                            class="upload-demo"
                            :on-success="null"
                            :on-change="
                              (file, fileList) => {
                                handleUploadFile(file, fileList, 1, index, childrenIndex)
                              }
                            "
                            :auto-upload="false"
                            :on-preview="handlePreview"
                            :before-remove="beforeRemove"
                            :on-remove="file => handleRemove(file, 1, index, childrenIndex)"
                            :disabled="isView"
                            accept=".jpg,.png,.pdf"
                          >
                            <label class="text--info flex font-medium pointer">
                              <svg-icon
                                icon-class="import-file"
                                class="mr-2"
                                style="width: 20px; height: 20px"
                              />
                              {{ $t('monitoring.rating.addFiles') }}
                            </label>
                          </el-upload>
                        </el-col>
                      </el-row>
                    </el-collapse-item>
                    <hr class="mb-6 mt-4" />
                  </div>
                </el-collapse>
              </div>
            </el-tab-pane>
            <!--    Mức độ đáp ứng 3   -->
            <el-tab-pane
              :label="t('monitoring.rating.responsiveness')"
              name="responsiveness"
            >
              <div class="flex justify-between items-center">
                <h5 class="text-black font-semibold text-lg">
                  {{ $t('monitoring.rating.evaluationCriteria') }}
                </h5>
                <div class="flex items-center">
                  <h5 class="text-black font-semibold text-lg me-3">
                    {{ $t('monitoring.rating.totalPoint') }}
                  </h5>
                  <el-button class="bg--success text-white btn-default"
                    >{{ checkIsNumber(totalRating[2]) }} {{ $t('monitoring.rating.score') }}
                  </el-button>
                </div>
              </div>
              <div class="info-general mt-3">
                <el-collapse v-model="activeNameCollapse">
                  <div
                    v-for="(label, index) of titleFacilities[2]"
                    :key="index"
                  >
                    <el-collapse-item :name="label.id">
                      <template #title="{}">
                        <div class="flex w-full justify-between items-center">
                          <h5
                            class="text-black text-start font-semibold text-lg mb-0 me-16"
                            style="line-height: 1.8"
                          >
                            {{ index + 1 }}. {{ label.title }}
                          </h5>
                          <el-button class="bg--dark-blue text-white btn-default"
                            >{{ checkIsNumber(scoringDetails[2][index].totalPoint) }}
                            {{ $t('monitoring.rating.score') }}
                          </el-button>
                        </div>
                      </template>
                      <el-row
                        :gutter="20"
                        class="mt-2"
                      >
                        <el-col
                          :sm="7"
                          :md="8"
                        >
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.maxScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.minusPoint') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.ratingScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.detailViolation') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.fileRating') }}
                          </h5>
                        </el-col>
                      </el-row>
                      <el-row
                        v-for="(item, childrenIndex) of label.children"
                        :key="item.id"
                        :gutter="20"
                        class="mt-3"
                      >
                        <el-col
                          :md="8"
                          :sm="7"
                        >
                          <div class="flex">
                            <div
                              v-html="item.title"
                              class="ms-4"
                            ></div>
                          </div>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5 mx-2"
                            style="height: 100%"
                          >
                            {{ item.maxScore }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <el-input
                            v-model="scoringDetails[2][index].scores[childrenIndex].minusScore"
                            type="number"
                            @input="
                              value => {
                                setTotalPoint(value, index, childrenIndex, 2)
                              }
                            "
                            @blur="
                              () => {
                                setValueDefault(
                                  scoringDetails[2][index].scores[childrenIndex].minusScore,
                                  index,
                                  childrenIndex,
                                  2
                                )
                              }
                            "
                            class="w-full text-start text-custom"
                            style="height: 100%; padding-top: 0; font-size: 18px"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5"
                            style="height: 100%"
                          >
                            {{
                              checkIsNumber(
                                item.maxScore -
                                  scoringDetails[2][index].scores[childrenIndex].minusScore
                              )
                            }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <el-input
                            type="textarea"
                            maxlength="5000"
                            show-word-limit
                            v-model="scoringDetails[2][index].scores[childrenIndex].violateDetail"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <el-upload
                            v-model:file-list="
                              scoringDetails[2][index].scores[childrenIndex].listFile
                            "
                            class="upload-demo"
                            :on-success="null"
                            :on-change="
                              (file, fileList) => {
                                handleUploadFile(file, fileList, 2, index, childrenIndex)
                              }
                            "
                            :auto-upload="false"
                            :on-preview="handlePreview"
                            :before-remove="beforeRemove"
                            :on-remove="file => handleRemove(file, 2, index, childrenIndex)"
                            :disabled="isView"
                            accept=".jpg,.png,.pdf"
                          >
                            <label class="text--info flex font-medium pointer">
                              <svg-icon
                                icon-class="import-file"
                                class="mr-2"
                                style="width: 20px; height: 20px"
                              />
                              {{ $t('monitoring.rating.addFiles') }}
                            </label>
                          </el-upload>
                        </el-col>
                      </el-row>
                    </el-collapse-item>
                    <hr class="mb-6 mt-4" />
                  </div>
                </el-collapse>
              </div>
            </el-tab-pane>
            <!--    Năng lực phục vụ 4    -->
            <el-tab-pane
              :label="t('monitoring.rating.serviceCapacity')"
              name="serviceCapacity"
            >
              <div class="flex justify-between items-center">
                <h5 class="text-black font-semibold text-lg">
                  {{ $t('monitoring.rating.evaluationCriteria') }}
                </h5>
                <div class="flex items-center">
                  <h5 class="text-black font-semibold text-lg me-3">
                    {{ $t('monitoring.rating.totalPoint') }}
                  </h5>
                  <el-button class="bg--success text-white btn-default"
                    >{{ checkIsNumber(totalRating[3]) }} {{ $t('monitoring.rating.score') }}
                  </el-button>
                </div>
              </div>
              <div class="info-general mt-3">
                <el-collapse v-model="activeNameCollapse">
                  <div
                    v-for="(label, index) of titleFacilities[3]"
                    :key="index"
                  >
                    <el-collapse-item :name="label.id">
                      <template #title="{}">
                        <div class="flex w-full justify-between items-center">
                          <h5
                            class="text-black text-start font-semibold text-lg mb-0 me-16"
                            style="line-height: 1.8"
                          >
                            {{ index + 1 }}. {{ label.title }}
                          </h5>
                          <el-button class="bg--dark-blue text-white btn-default"
                            >{{ checkIsNumber(scoringDetails[3][index].totalPoint) }}
                            {{ $t('monitoring.rating.score') }}
                          </el-button>
                        </div>
                      </template>
                      <el-row
                        :gutter="20"
                        class="mt-2"
                      >
                        <el-col
                          :sm="7"
                          :md="8"
                        >
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.maxScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.minusPoint') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.ratingScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.detailViolation') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.fileRating') }}
                          </h5>
                        </el-col>
                      </el-row>
                      <el-row
                        v-for="(item, childrenIndex) of label.children"
                        :key="item.id"
                        :gutter="20"
                        class="mt-3"
                      >
                        <el-col
                          :md="8"
                          :sm="7"
                        >
                          <div class="flex">
                            <div
                              v-html="item.title"
                              class="ms-4"
                            ></div>
                          </div>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5 mx-2"
                            style="height: 100%"
                          >
                            {{ item.maxScore }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <el-input
                            v-model="scoringDetails[3][index].scores[childrenIndex].minusScore"
                            type="number"
                            @input="
                              value => {
                                setTotalPoint(value, index, childrenIndex, 3)
                              }
                            "
                            @blur="
                              () => {
                                setValueDefault(
                                  scoringDetails[3][index].scores[childrenIndex].minusScore,
                                  index,
                                  childrenIndex,
                                  3
                                )
                              }
                            "
                            class="w-full text-start text-custom"
                            style="height: 100%; padding-top: 0; font-size: 18px"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5"
                            style="height: 100%"
                          >
                            {{
                              checkIsNumber(
                                item.maxScore -
                                  scoringDetails[3][index].scores[childrenIndex].minusScore
                              )
                            }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <el-input
                            type="textarea"
                            maxlength="5000"
                            show-word-limit
                            v-model="scoringDetails[3][index].scores[childrenIndex].violateDetail"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <el-upload
                            v-model:file-list="
                              scoringDetails[3][index].scores[childrenIndex].listFile
                            "
                            class="upload-demo"
                            :on-success="null"
                            :on-change="
                              (file, fileList) => {
                                handleUploadFile(file, fileList, 3, index, childrenIndex)
                              }
                            "
                            :auto-upload="false"
                            :on-preview="handlePreview"
                            :before-remove="beforeRemove"
                            :on-remove="file => handleRemove(file, 3, index, childrenIndex)"
                            :disabled="isView"
                            accept=".jpg,.png,.pdf"
                          >
                            <label class="text--info flex font-medium pointer">
                              <svg-icon
                                icon-class="import-file"
                                class="mr-2"
                                style="width: 20px; height: 20px"
                              />
                              {{ $t('monitoring.rating.addFiles') }}
                            </label>
                          </el-upload>
                        </el-col>
                      </el-row>
                    </el-collapse-item>
                    <hr class="mb-6 mt-4" />
                  </div>
                </el-collapse>
              </div>
            </el-tab-pane>
            <!--    Văn hóa phục vụ 5    -->
            <el-tab-pane
              :label="t('monitoring.rating.serviceCulture')"
              name="serviceCulture"
            >
              <div class="flex justify-between items-center">
                <h5 class="text-black font-semibold text-lg">
                  {{ $t('monitoring.rating.evaluationCriteria') }}
                </h5>
                <div class="flex items-center">
                  <h5 class="text-black font-semibold text-lg me-3">
                    {{ $t('monitoring.rating.totalPoint') }}
                  </h5>
                  <el-button class="bg--success text-white btn-default"
                    >{{ checkIsNumber(totalRating[4]) }} {{ $t('monitoring.rating.score') }}
                  </el-button>
                </div>
              </div>
              <div class="info-general mt-3">
                <el-collapse v-model="activeNameCollapse">
                  <div
                    v-for="(label, index) of titleFacilities[4]"
                    :key="index"
                  >
                    <el-collapse-item :name="label.id">
                      <template #title="{}">
                        <div class="flex w-full justify-between items-center">
                          <h5
                            class="text-black text-start font-semibold text-lg mb-0 me-16"
                            style="line-height: 1.8"
                          >
                            {{ index + 1 }}. {{ label.title }}
                          </h5>
                          <el-button class="bg--dark-blue text-white btn-default"
                            >{{ checkIsNumber(scoringDetails[4][index].totalPoint) }}
                            {{ $t('monitoring.rating.score') }}
                          </el-button>
                        </div>
                      </template>
                      <el-row
                        :gutter="20"
                        class="mt-2"
                      >
                        <el-col
                          :sm="7"
                          :md="8"
                        >
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.maxScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.minusPoint') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.ratingScore') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.detailViolation') }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <h5 class="text-black font-semibold text-lg mb-0">
                            {{ $t('monitoring.rating.fileRating') }}
                          </h5>
                        </el-col>
                      </el-row>
                      <el-row
                        v-for="(item, childrenIndex) of label.children"
                        :key="item.id"
                        :gutter="20"
                        class="mt-3"
                      >
                        <el-col
                          :md="8"
                          :sm="7"
                        >
                          <div class="flex">
                            <div
                              v-html="item.title"
                              class="ms-4"
                            ></div>
                          </div>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5 mx-2"
                            style="height: 100%"
                          >
                            {{ item.maxScore }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <el-input
                            v-model="scoringDetails[4][index].scores[childrenIndex].minusScore"
                            type="number"
                            @input="
                              value => {
                                setTotalPoint(value, index, childrenIndex, 4)
                              }
                            "
                            @blur="
                              () => {
                                setValueDefault(
                                  scoringDetails[4][index].scores[childrenIndex].minusScore,
                                  index,
                                  childrenIndex,
                                  4
                                )
                              }
                            "
                            class="w-full text-start text-custom"
                            style="height: 100%; padding-top: 0; font-size: 18px"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="2"
                          :sm="3"
                        >
                          <h5
                            class="flex w-full text-xl my-1.5"
                            style="height: 100%"
                          >
                            {{
                              checkIsNumber(
                                item.maxScore -
                                  scoringDetails[4][index].scores[childrenIndex].minusScore
                              )
                            }}
                          </h5>
                        </el-col>
                        <el-col
                          :md="7"
                          :sm="6"
                        >
                          <el-input
                            type="textarea"
                            maxlength="5000"
                            show-word-limit
                            v-model="scoringDetails[4][index].scores[childrenIndex].violateDetail"
                            :disabled="isView"
                          ></el-input>
                        </el-col>
                        <el-col
                          :md="3"
                          :sm="2"
                        >
                          <el-upload
                            v-model:file-list="
                              scoringDetails[4][index].scores[childrenIndex].listFile
                            "
                            class="upload-demo"
                            :on-success="null"
                            :on-change="
                              (file, fileList) => {
                                handleUploadFile(file, fileList, 4, index, childrenIndex)
                              }
                            "
                            :auto-upload="false"
                            :on-preview="handlePreview"
                            :before-remove="beforeRemove"
                            :on-remove="file => handleRemove(file, 4, index, childrenIndex)"
                            :disabled="isView"
                            accept=".jpg,.png,.pdf"
                          >
                            <label class="text--info flex font-medium pointer">
                              <svg-icon
                                icon-class="import-file"
                                class="mr-2"
                                style="width: 20px; height: 20px"
                              />
                              {{ $t('monitoring.rating.addFiles') }}
                            </label>
                          </el-upload>
                        </el-col>
                      </el-row>
                    </el-collapse-item>
                    <hr class="mb-6 mt-4" />
                  </div>
                </el-collapse>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { getListRoute, getListStation } from '@/api/expressway'
import {
  apiAddRating,
  apiGetDetailRating,
  apiGetListWeek,
  apiGetTitleRating,
  apiUpdateRating,
  uploadFile,
} from '@/api/rating'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { usePermissionStore, useRouteUser } from '@/store'
import { useConfig } from '@/config'

const props = defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n()

const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const processing = ref(false)
const titleFacilities = ref([{}, {}, {}, {}, {}])
const scoringDetails = ref([[], [], [], [], []])
const totalRating = ref([0, 0, 0, 0, 0])
const ruleEdit = ref({
  title: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  scoringWeek: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  route: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  station: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
})
const listWeek = ref([])
const routeList = ref([])
const stationList = ref([])
const activeName = ref('facilities')
const infoReviewRating = ref({
  scoringWeek: {
    id: '',
    weekNumber: 0,
    startDate: '',
    endDate: '',
  },
  route: {
    id: '',
  },
  station: {
    id: '',
  },
})
const viewInfoReview = ref(null)
const activeNameCollapse = ref(null)

onMounted(async () => {
  await setDataDefault()
  await initData()
})

const setDataDefault = async () => {
  try {
    loading.value = true
    const [title1, title2, title3, title4, title5] = await Promise.all([
      apiGetTitleRating({ type: '1' }),
      apiGetTitleRating({ type: '2' }),
      apiGetTitleRating({ type: '3' }),
      apiGetTitleRating({ type: '4' }),
      apiGetTitleRating({ type: '5' }),
    ])
    processTitleData(title1, 0)
    processTitleData(title2, 1)
    processTitleData(title3, 2)
    processTitleData(title4, 3)
    processTitleData(title5, 4)
    activeNameCollapse.value = titleFacilities.value[0][0].id
    const params = {
      routeIds: routeUser.routes,
    }
    const rs = await getListRoute(params)
    if (rs.status === 200) {
      routeList.value = rs.data.dataRows
    }

    const rsw = await apiGetListWeek()
    if (rsw.status === 200) {
      console.log(rsw.data)
      listWeek.value = rsw.data
    }
    loading.value = false
  } catch (error) {
    console.error('Lỗi khi gọi API: ', error)
  }
}
const processTitleData = (title, numberArray) => {
  if (title.status === 200) {
    titleFacilities.value[numberArray] = title.data
    // eslint-disable-next-line array-callback-return
    titleFacilities.value[numberArray].map((item, index) => {
      scoringDetails.value[numberArray].push({ scores: [], totalPoint: 0 })
      // eslint-disable-next-line array-callback-return
      item.children.map(res => {
        scoringDetails.value[numberArray][index].scores.push({
          scoringKpi: { id: res.id },
          minusScore: 0,
          violateDetail: '',
          fileVaultIds: [],
          listFile: [],
        })
        scoringDetails.value[numberArray][index].totalPoint += res.maxScore
      })
      totalRating.value[numberArray] += scoringDetails.value[numberArray][index].totalPoint
    })
  }
}
const initData = async () => {
  const rating_id = route.params.id
  if (rating_id) {
    const rs = await apiGetDetailRating(rating_id)
    if (rs.status === 200) {
      infoReviewRating.value = rs.data
      const params = {
        page: 1,
        size: 20,
        keyword: '',
        stationIds: [],
        routeIds: [rs.data.route.id],
        unitIds: [],
      }
      infoReviewRating.value.timeRating = [
        formatDateApi(rs.data.scoringWeek.startDate),
        formatDateApi(dayjs(rs.data.scoringWeek.endDate).add(1, 'day').toDate()),
      ]
      const station = await getListStation(params)
      if (station.status === 200) {
        stationList.value = station.data.dataRows
      }
    }
    await setScoringDetail(rs.data.scoringDetails)
  } else {
    infoReviewRating.value = {
      route: {
        id: '',
      },
      station: {
        id: '',
      },
      scoringWeek: {
        id: '',
        weekNumber: null,
      },
    }
  }
}
const setScoringDetail = async data => {
  scoringDetails.value = [[], [], [], [], []]
  totalRating.value = [0, 0, 0, 0, 0]
  const listDataType = [[], [], [], [], []]
  // eslint-disable-next-line array-callback-return
  data.map(item => {
    switch (item.scoringKpi.type) {
      case 1:
        return listDataType[0].push(item)
      case 2:
        return listDataType[1].push(item)
      case 3:
        return listDataType[2].push(item)
      case 4:
        return listDataType[3].push(item)
      case 5:
        return listDataType[4].push(item)
      default:
        return null
    }
  })
  for (let i = 0; i < 5; i++) {
    // eslint-disable-next-line array-callback-return
    titleFacilities.value[i].map((item, index) => {
      scoringDetails.value[i].push({ scores: [], totalPoint: 0 })
      const length = item.children.length
      for (let j = 0; j < length; j++) {
        const l = listDataType[i].length
        for (let k = 0; k < l; k++) {
          if (listDataType[i][k].scoringKpi.id === item.children[j].id) {
            scoringDetails.value[i][index].scores.push(listDataType[i][k])
            scoringDetails.value[i][index].totalPoint +=
              item.children[j].maxScore - listDataType[i][k].minusScore
          }
        }
      }
      totalRating.value[i] += scoringDetails.value[i][index].totalPoint
    })
  }
  await setListFile()
}
const setListFile = async () => {
  for (let i = 0; i < 5; i++) {
    const length = scoringDetails.value[i].length
    for (let j = 0; j < length; j++) {
      const listScore = scoringDetails.value[i][j].scores
      // eslint-disable-next-line array-callback-return
      listScore.map((item, index) => {
        const lengthFile = item.fileVaultsDTOS.length
        for (let k = 0; k < lengthFile; k++) {
          if (
            !Array.isArray(scoringDetails.value[i][j].scores[index].fileVaultIds) ||
            !scoringDetails.value[i][j].scores[index].fileVaultIds
          ) {
            scoringDetails.value[i][j].scores[index].fileVaultIds = []
          }
          if (
            !Array.isArray(scoringDetails.value[i][j].scores[index].listFile) ||
            !scoringDetails.value[i][j].scores[index].listFile
          ) {
            scoringDetails.value[i][j].scores[index].listFile = []
          }
          scoringDetails.value[i][j].scores[index].listFile.push({
            name: item.fileVaultsDTOS[k].fileName,
            url: item.fileVaultsDTOS[k].filePath,
          })
          scoringDetails.value[i][j].scores[index].fileVaultIds.push(item.fileVaultsDTOS[k].id)
        }
      })
    }
  }
  // console.log(scoringDetails.value)
}
const handleAddReview = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    transformScoringDetail()
    // console.log('Du lieu gui api', infoReviewRating.value)
    const rs = await apiAddRating(infoReviewRating.value)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backRating()
    }
    processing.value = false
  } catch (error) {
    processing.value = false
    console.log(error)
  }
}
const handleUpdateRating = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    transformScoringDetail()
    const rating_id = route.params.id
    const rs = await apiUpdateRating(rating_id, infoReviewRating.value)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backRating()
    }
    processing.value = false
  } catch (error) {
    processing.value = false
    console.log(error)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    viewInfoReview.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const transformScoringDetail = () => {
  infoReviewRating.value.scoringDetails = []
  infoReviewRating.value.totalScore = 0
  const length = scoringDetails.value.length
  for (let i = 0; i < length; i++) {
    const scoring = scoringDetails.value[i]
    const lengthIndex = scoring.length
    for (let j = 0; j < lengthIndex; j++) {
      const scoringKPI = scoring[j].scores
      // eslint-disable-next-line array-callback-return
      scoringKPI.map(item => {
        infoReviewRating.value.scoringDetails.push(item)
      })
    }
  }
  for (let i = 0; i < length; i++) {
    infoReviewRating.value.totalScore += totalRating.value[i]
  }
}
const updateListStation = async id => {
  stationList.value = []
  infoReviewRating.value.station = {
    id: '',
  }
  const route_id = id
  if (route_id) {
    setNameRating()
    const params = {
      page: 1,
      size: 20,
      keyword: '',
      stationIds: [],
      routeIds: [route_id],
      unitIds: [],
    }
    const rs = await getListStation(params)
    if (rs.status === 200) {
      stationList.value = rs.data.dataRows
    } else {
      stationList.value = []
    }
  }
}
const setValueDefault = (value, index, childrenIndex, typeScoringKPI) => {
  if (value === '' || isNaN(parseFloat(value))) {
    scoringDetails.value[typeScoringKPI][index].scores[childrenIndex].minusScore = 0
  } else {
    // scoringDetails.value[typeScoringKPI][index].scores[childrenIndex].minusScore = parseFloat(value)
    const numericValue = parseFloat(value)
    scoringDetails.value[typeScoringKPI][index].scores[childrenIndex].minusScore =
      numericValue.toString().includes('.') && numericValue.toString().split('.')[1].length > 2
        ? parseFloat(numericValue.toFixed(2))
        : numericValue
  }
}
const setTotalPoint = (value, index, childrenIndex, typeScoringKPI) => {
  const title = titleFacilities.value[typeScoringKPI][index].children
  const maxScore = title[childrenIndex].maxScore
  const length = title.length
  if (value > maxScore) {
    scoringDetails.value[typeScoringKPI][index].scores[childrenIndex].minusScore = maxScore
  } else if (value < 0) {
    scoringDetails.value[typeScoringKPI][index].scores[childrenIndex].minusScore = 0
  }
  const scoring = scoringDetails.value[typeScoringKPI][index]
  let total = 0
  for (let i = 0; i < length; i++) {
    total += title[i].maxScore - scoring.scores[i].minusScore
  }
  scoringDetails.value[typeScoringKPI][index].totalPoint = total
  totalRating.value[typeScoringKPI] = 0
  // eslint-disable-next-line array-callback-return
  scoringDetails.value[typeScoringKPI].map(item => {
    totalRating.value[typeScoringKPI] += item.totalPoint
  })
}
const setDateTimeRating = idWeeks => {
  const week = listWeek.value.find(item => item.id === idWeeks)
  const formattedStartOfWeek = week ? formatDateApi(week.startDate) : null
  const nextDay = dayjs(week.endDate).add(1, 'day').toDate()
  const formattedEndOfWeek = week ? formatDateApi(nextDay) : null
  infoReviewRating.value.timeRating = [formattedStartOfWeek, formattedEndOfWeek]
  const formatStart = dayjs(week.startDate).format('YYYY-MM-DD HH:mm:ss.SSS')
  const formatEnd = dayjs(week.endDate).format('YYYY-MM-DD HH:mm:ss.SSS')
  infoReviewRating.value.scoringWeek.startDate = formatStart
  infoReviewRating.value.scoringWeek.endDate = formatEnd
  setNameRating()
}
const handleUploadFile = async (file, fileList, type, index, childrenIndex) => {
  const isAllowedSize = file.size / 1024 / 1024 < 10
  if (!isAllowedSize) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error(t('configUser.message.overflowMaxSize', ['10']))
    return false
  }
  const allowedTypes = ['application/pdf', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.raw.type)) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error('File không đúng định dạng .pdf/.jpg/.png')
    return false
  }
  const fileToUpload = file.raw || file

  if (!fileToUpload || !(fileToUpload instanceof File)) {
    console.error('Invalid file provided:', file)
    return
  }
  const formData = new FormData()
  formData.append('file', fileToUpload)
  formData.append('keepFileName', true)
  formData.append('mainEntityName', 'rating')
  formData.append('fileCategory', 1)
  const rs = await uploadFile(formData)
  if (rs.status === 200) {
    const idFile = rs.data.data[0].id
    if (
      !Array.isArray(scoringDetails.value[type][index].scores[childrenIndex].fileVaultIds) ||
      !scoringDetails.value[type][index].scores[childrenIndex].fileVaultIds
    ) {
      scoringDetails.value[type][index].scores[childrenIndex].fileVaultIds = []
    }
    scoringDetails.value[type][index].scores[childrenIndex].fileVaultIds.push(idFile)
    if (
      !Array.isArray(scoringDetails.value[type][index].scores[childrenIndex].fileVaultsDTOS) ||
      !scoringDetails.value[type][index].scores[childrenIndex].fileVaultsDTOS
    ) {
      scoringDetails.value[type][index].scores[childrenIndex].fileVaultsDTOS = []
    }
    scoringDetails.value[type][index].scores[childrenIndex].fileVaultsDTOS.push(rs.data.data[0])

    console.log(scoringDetails.value[type][index].scores)
  } else {
    const fileIndex = fileList.indexOf(file)
    if (fileIndex > -1) {
      fileList.splice(fileIndex, 1)
    }
    ElMessage.error(t('configUser.message.uploadFailed'))
  }
}
const formatDateApi = dateString => {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
const backRating = () => {
  router.push('/monitoring/rating')
}
const handlePreview = file => {
  if (file.url) {
    const url = `${baseUrl.value}${file.url}`
    window.open(url, '_blank')
  } else if (file.raw) {
    const fileUrl = URL.createObjectURL(file.raw)
    window.open(fileUrl, '_blank')
  } else {
    ElMessage.error('Không thể xem trước file này')
  }
}
const beforeRemove = () => {
  return ElMessageBox.confirm(t('administration.ip.confirmDeleteFile'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  }).then(
    () => true,
    () => false
  )
}
const handleRemove = (file, type, index, childrenIndex) => {
  const item = scoringDetails.value[type][index].scores[childrenIndex].fileVaultsDTOS
  const length = item.length
  let id_file = ''
  let indexId = 0
  for (let i = 0; i < length; i++) {
    if (file.name === item[i].fileName) {
      id_file = item[i].id
      indexId = i
      // break
    }
  }
  scoringDetails.value[type][index].scores[childrenIndex].fileVaultsDTOS = scoringDetails.value[
    type
  ][index].scores[childrenIndex].fileVaultsDTOS.filter(item => item.id !== id_file)
  scoringDetails.value[type][index].scores[childrenIndex].fileVaultIds = scoringDetails.value[type][
    index
  ].scores[childrenIndex].fileVaultIds.filter(id => id !== id_file)
  // console.log(scoringDetails.value[type][index].scores)
}
const checkIsNumber = value => {
  return Number.isInteger(value) ? value : value.toFixed(2)
}

const setNameRating = () => {
  const checkRoute = infoReviewRating.value.route.id && infoReviewRating.value.route.id !== ''
  const checkStation = infoReviewRating.value.station.id && infoReviewRating.value.station.id !== ''
  const checkTime =
    infoReviewRating.value.scoringWeek.id && infoReviewRating.value.scoringWeek.id !== ''
  infoReviewRating.value.title = ''
  let name = 'Chấm điểm'
  if (checkStation) {
    const station = stationList.value.find(item => item.id === infoReviewRating.value.station.id)
    if (station) {
      name = `${name} trạm ${station.name}`
    }
  }
  if (checkRoute) {
    const route = routeList.value.find(item => item.id === infoReviewRating.value.route.id)
    if (route) {
      name = `${name} của tuyến ${route.name}`
    }
  }
  if (checkTime) {
    const week = listWeek.value.find(item => item.id === infoReviewRating.value.scoringWeek.id)
    const time = infoReviewRating.value.timeRating
    const startDate = time[0].split('-').reverse().join('-')
    const endDate = time[1].split('-').reverse().join('-')
    name = `${name} ${week.weekName} tháng ${week.monthNumber} (từ ngày ${startDate} đến ngày ${endDate})`
  }
  infoReviewRating.value.title = name
}
</script>

<style lang="scss">
.custom {
  color: #525b73;
  font-weight: 600 !important;

  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}
.custom-textarea {
  box-shadow: 0 0 0 1px #99a2bc;
  border-radius: 2px;
  line-height: 1.35;
  height: 100%;
  min-height: 1.7rem * 3;

  &:disabled {
    background-color: #f5f7fa;
  }
}
.el-textarea {
  height: 100%;

  .el-textarea__inner {
    height: 100%;
  }
}
.text-start {
  .el-input__wrapper {
    display: inline;
  }
}
.tab-review-rating {
  .el-tabs__item {
    padding: 12px 0px !important;
    min-width: 200px;
    width: 100%;
    height: 46px;
    font-size: 14px;
    line-height: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    font-weight: 500;
    color: #76809b;
    //background-color: #ebebec;
    border-bottom: 2px solid #cdcdce;
    position: relative;

    &.is-active {
      //background-color: white;
      color: #059efb;
    }
  }

  .el-tabs__active-bar {
    background-color: #059efb;
  }
}
.el-upload-list__item.is-success:focus:not(:hover) .el-icon--close-tip {
  display: none;
}
</style>
