<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import * as calculator from '@/utils/calculator'

const type = ref(1) // 1 公积金贷款 2 商业贷款 3 组合贷款
const repaymentMethod = ref(0) // 0 等额本息 1 等额本金
const providentFund = ref(0) // 公积金贷款金额
const providentFundYear = ref(30) // 公积金贷款年限
const providentFundRate = ref(2.85) // 公积金贷款利率%
const providentFundRepayments = ref()
const commercial = ref(0) // 商业贷款金额
const commercialYear = ref(30) // 商业贷款年限
const commercialRate = ref(3.95) // 商业贷款利率%
const commercialRepayments = ref()
const firstRepaymentDate = ref(dayjs().startOf('month').valueOf())

const isChooseProvidentFund = computed(() => (type.value & 1) === 1)
const isChooseCommercial = computed(() => (type.value & 2) === 2)

function monthlyInterestRate(yearlyRate: number) {
  return yearlyRate / 12 / 100
}

function calculate() {
  commercialRepayments.value = undefined
  providentFundRepayments.value = undefined
  if (isChooseCommercial.value) {
    const rate = monthlyInterestRate(commercialRate.value)
    const period = commercialYear.value * 12
    if (repaymentMethod.value === 0) {
      const rps = calculator.calculateFixedInstallmentRepayments(
        commercial.value,
        period,
        rate,
        firstRepaymentDate.value
      )
      commercialRepayments.value = rps
    } else if (repaymentMethod.value === 1) {
      const rps = calculator.calculateReducingInstallmentRepayments(
        commercial.value,
        period,
        rate,
        firstRepaymentDate.value
      )
      commercialRepayments.value = rps
    }
  }
  if (isChooseProvidentFund.value) {
    const rate = monthlyInterestRate(providentFundRate.value)
    const period = providentFundYear.value * 12
    if (repaymentMethod.value === 0) {
      const rps = calculator.calculateFixedInstallmentRepayments(
        providentFund.value,
        period,
        rate,
        firstRepaymentDate.value
      )
      providentFundRepayments.value = rps
    } else if (repaymentMethod.value === 1) {
      const rps = calculator.calculateReducingInstallmentRepayments(
        providentFund.value,
        period,
        rate,
        firstRepaymentDate.value
      )
      providentFundRepayments.value = rps
    }
  }
}
</script>

<template>
  <n-layout embedded content-style="padding: 24px;height:100vh;">
    <n-card>
      <NSpace vertical>
        <n-grid cols="12" item-responsive responsive="screen">
          <n-gi span="12 s:6 m:4 xl:3">
            <NFormItem label="贷款方式">
              <NRadioGroup v-model:value="type" name="type">
                <NRadioButton :value="1" label="公积金贷款" />
                <NRadioButton :value="2" label="商业贷款" />
                <NRadioButton :value="3" label="组合贷款" />
              </NRadioGroup> </NFormItem
          ></n-gi>
          <n-gi span="12 s:6 m:4 xl:3">
            <NFormItem label="还款方式">
              <NRadioGroup v-model:value="repaymentMethod" name="repaymentMethod">
                <NRadioButton :value="0" label="等额本息" />
                <NRadioButton :value="1" label="等额本金" />
              </NRadioGroup> </NFormItem
          ></n-gi>
        </n-grid>
        <n-grid cols="12" item-responsive responsive="screen">
          <n-gi v-if="isChooseProvidentFund" span="12 s:6 m:12">
            <n-grid cols="12" item-responsive responsive="screen"
              ><n-gi span="12 m:4 xl:3">
                <NFormItem label="公积金贷款金额">
                  <NInputNumber v-model:value="providentFund" :min="0">
                    <template #prefix>￥</template>
                  </NInputNumber>
                </NFormItem></n-gi
              >
              <n-gi span="12 m:4 xl:3">
                <NFormItem label="公积金贷款年限">
                  <NInputNumber v-model:value="providentFundYear" :min="1" :max="30">
                    <template #suffix>年</template>
                  </NInputNumber>
                </NFormItem></n-gi
              >
              <n-gi span="12 m:4 xl:3">
                <NFormItem label="公积金贷款利率">
                  <NInputNumber v-model:value="providentFundRate" :min="0">
                    <template #suffix>%</template>
                  </NInputNumber>
                </NFormItem></n-gi
              ></n-grid
            ></n-gi
          >
          <n-gi v-if="isChooseCommercial" span="12 s:6 m:12"
            ><n-grid cols="12" item-responsive responsive="screen"
              ><n-gi span="12 m:4 xl:3"
                ><NFormItem label="商业贷款金额">
                  <NInputNumber v-model:value="commercial" :min="0">
                    <template #prefix>￥</template>
                  </NInputNumber>
                </NFormItem></n-gi
              >
              <n-gi span="12 m:4 xl:3"
                ><NFormItem label="商业贷款年限">
                  <NInputNumber v-model:value="commercialYear" :min="1" :max="30">
                    <template #suffix>年</template>
                  </NInputNumber>
                </NFormItem></n-gi
              >
              <n-gi span="12 m:4 xl:3"
                ><NFormItem label="商业贷款利率">
                  <NInputNumber v-model:value="commercialRate" :min="0">
                    <template #suffix>%</template>
                  </NInputNumber>
                </NFormItem></n-gi
              ></n-grid
            ></n-gi
          >
        </n-grid>

        <n-grid cols="12" item-responsive responsive="screen">
          <n-gi span="12 s:6 m:4 xl:3"
            ><NFormItem label="首次还款日期">
              <NDatePicker v-model:value="firstRepaymentDate" type="month" /> </NFormItem
          ></n-gi>
          <n-gi span="12 s:6 m:4 xl:3" class="flex flex-row items-center"
            ><NButton type="primary" @click="calculate()">计算</NButton></n-gi
          ></n-grid
        >

        <n-tabs>
          <n-tab-pane name="表格">
            <RepaymentsTable
              :commercial-repayments="commercialRepayments"
              :provident-fund-repayments="providentFundRepayments"
            />
          </n-tab-pane>
          <n-tab-pane name="图表">
            <RepaymentsChart
              :commercial-repayments="commercialRepayments"
              :provident-fund-repayments="providentFundRepayments"
            />
          </n-tab-pane>
        </n-tabs>
      </NSpace>
    </n-card>
  </n-layout>
</template>

<style scoped></style>
