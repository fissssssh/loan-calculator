<script setup lang="ts">
interface RepaymentDetail {
  year: number
  month: number
  interest: number
  principal: number
  remainingPrincipal: number
}
import { computed } from 'vue'
import dayjs from 'dayjs'
import { groupBy, mapValues, round } from 'lodash'

const type = ref(1) // 1 公积金贷款 2 商业贷款 3 组合贷款
const repaymentMethod = ref(0) // 1 等额本息 2 等额本金
const providentFund = ref(250000) // 公积金贷款金额
const providentFundYear = ref(30) // 公积金贷款年限
const providentFundRate = ref(2.85) // 公积金贷款利率%
const commercial = ref(300000) // 商业贷款金额
const commercialYear = ref(30) // 商业贷款年限
const commercialRate = ref(3.95) // 商业贷款利率%
const firstRepaymentDate = ref(dayjs().startOf('month').valueOf())
const repaymentTableData = ref({})

const isChooseProvidentFund = computed(() => (type.value & 1) === 1)
const isChooseCommercial = computed(() => (type.value & 2) === 2)

function monthlyInterestRate(yearlyRate: number) {
  return yearlyRate / 12 / 100
}

function calc() {
  const repaymentDetails: { p: RepaymentDetail[]; c: RepaymentDetail[] } = { p: [], c: [] }
  // 等额本息
  if (repaymentMethod.value === 0) {
    if (isChooseProvidentFund.value) {
      repaymentDetails.p = equalInstallmentMonthlyPayment(
        providentFund.value,
        providentFundYear.value * 12,
        monthlyInterestRate(providentFundRate.value),
        dayjs(firstRepaymentDate.value)
      )
    }
    if (isChooseCommercial.value) {
      repaymentDetails.c = equalInstallmentMonthlyPayment(
        commercial.value,
        commercialYear.value * 12,
        monthlyInterestRate(commercialRate.value),
        dayjs(firstRepaymentDate.value)
      )
    }
  }
  // 等额本金
  else if (repaymentMethod.value === 1) {
    if (isChooseProvidentFund.value) {
      repaymentDetails.p = equalPrincipalMonthlyInterest(
        providentFund.value,
        providentFundYear.value * 12,
        monthlyInterestRate(providentFundRate.value),
        dayjs(firstRepaymentDate.value)
      )
    }
    if (isChooseCommercial.value) {
      repaymentDetails.c = equalPrincipalMonthlyInterest(
        commercial.value,
        commercialYear.value * 12,
        monthlyInterestRate(commercialRate.value),
        dayjs(firstRepaymentDate.value)
      )
    }
  }

  const data: { [key: string]: any } = {}
  for (const pp of repaymentDetails.p) {
    data[`${pp.year}-${pp.month}`] = {
      year: pp.year,
      month: pp.month,
      pi: pp.interest,
      pp: pp.principal,
      pr: pp.remainingPrincipal
    }
  }
  for (const cc of repaymentDetails.c) {
    if (data[`${cc.year}-${cc.month}`]) {
      data[`${cc.year}-${cc.month}`].ci = cc.interest
      data[`${cc.year}-${cc.month}`].cp = cc.principal
      data[`${cc.year}-${cc.month}`].cr = cc.remainingPrincipal
    } else {
      data[`${cc.year}-${cc.month}`] = {
        year: cc.year,
        month: cc.month,
        ci: cc.interest,
        cp: cc.principal,
        cr: cc.remainingPrincipal
      }
    }
  }

  repaymentTableData.value = mapValues(groupBy(data, 'year'), (g) => ({
    year: g[0].year,
    data: g
  }))

  console.log(repaymentTableData.value)
}

// 等额本息
function equalInstallmentMonthlyPayment(
  principal: number,
  months: number,
  monthlyRate: number,
  firstRepaymentDate: dayjs.Dayjs
) {
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, months)
  const denominator = Math.pow(1 + monthlyRate, months) - 1
  const payment = principal * (numerator / denominator) // 每月应还

  const repaymentDate = dayjs(firstRepaymentDate)
  const monthlyRepayment = []
  let remainingPrincipal = principal
  for (let i = 0; i < months; i++) {
    const monthlyInterest = remainingPrincipal * monthlyRate // 当期利息
    const monthlyPrincipal = payment - monthlyInterest // 当期本金
    remainingPrincipal -= monthlyPrincipal
    const date = repaymentDate.add(i, 'month')
    monthlyRepayment.push({
      year: date.year(),
      month: date.month(),
      interest: round(monthlyInterest, 2),
      principal: round(monthlyPrincipal, 2),
      remainingPrincipal: round(remainingPrincipal, 2)
    })
  }

  return monthlyRepayment
}

// 等额本金
function equalPrincipalMonthlyInterest(
  principal: number,
  months: number,
  monthlyRate: number,
  firstRepaymentDate: dayjs.Dayjs
) {
  const repaymentDate = dayjs(firstRepaymentDate)
  const monthlyPrincipal = principal / months
  const monthlyRepayment = []
  for (let i = 0; i < months; i++) {
    const monthlyInterest = (principal - monthlyPrincipal * i) * monthlyRate // 当期利息
    const remainingPrincipal = principal - monthlyPrincipal * (i + 1)
    const date = repaymentDate.add(i, 'month')
    monthlyRepayment.push({
      year: date.year(),
      month: date.month(),
      interest: round(monthlyInterest, 2),
      principal: round(monthlyPrincipal, 2),
      remainingPrincipal: round(remainingPrincipal, 2)
    })
  }
  return monthlyRepayment
}
</script>

<template>
  <n-layout embedded content-style="padding: 24px;height:100vh;">
    <n-card>
      <NSpace vertical>
        <NForm>
          <NFormItem label="贷款方式">
            <NRadioGroup v-model:value="type" name="type">
              <NRadioButton :value="1" label="公积金贷款" />
              <NRadioButton :value="2" label="商业贷款" />
              <NRadioButton :value="3" label="组合贷款" />
            </NRadioGroup>
          </NFormItem>
          <NFormItem label="还款方式">
            <NRadioGroup v-model:value="repaymentMethod" name="repaymentMethod">
              <NRadioButton :value="0" label="等额本息（每月等额还款）" />
              <NRadioButton :value="1" label="等额本金（每月递减还款）" />
            </NRadioGroup>
          </NFormItem>
          <template v-if="isChooseProvidentFund">
            <NFormItem label="公积金贷款金额">
              <NInputNumber v-model:value="providentFund" :min="0">
                <template #prefix>￥</template>
              </NInputNumber>
            </NFormItem>
            <NFormItem label="公积金贷款年限">
              <NInputNumber v-model:value="providentFundYear" :min="1" :max="30">
                <template #suffix>年</template>
              </NInputNumber>
            </NFormItem>
            <NFormItem label="公积金贷款利率">
              <NInputNumber v-model:value="providentFundRate" :min="0">
                <template #suffix>%</template>
              </NInputNumber>
            </NFormItem>
          </template>
          <template v-if="isChooseCommercial">
            <NFormItem label="商业贷款金额">
              <NInputNumber v-model:value="commercial" :min="0">
                <template #prefix>￥</template>
              </NInputNumber>
            </NFormItem>
            <NFormItem label="商业贷款年限">
              <NInputNumber v-model:value="commercialYear" :min="1" :max="30">
                <template #suffix>年</template>
              </NInputNumber>
            </NFormItem>
            <NFormItem label="商业贷款利率">
              <NInputNumber v-model:value="commercialRate" :min="0">
                <template #suffix>%</template>
              </NInputNumber>
            </NFormItem>
          </template>
          <NFormItem label="首次还款日期">
            <NDatePicker v-model:value="firstRepaymentDate" type="month" />
          </NFormItem>
        </NForm>
      </NSpace>
      <NButton type="primary" @click="calc">计算</NButton>
      <NTimeline>
        <NTimelineItem v-for="(item, index) in repaymentTableData" :key="index" :title="item.year">
          <NTable>
            <thead>
              <tr>
                <th>月份</th>
                <th>商贷还款</th>
                <th>公积金还款</th>
                <th>本期本金</th>
                <th>本期利息</th>
                <th>本期剩余</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, index) in item.data" :key="index">
                <td>{{ i.month }}</td>
                <td>{{ (i.ci || 0) + (i.cp || 0) }}</td>
                <td>{{ (i.pi || 0) + (i.pp || 0) }}</td>
                <td>{{ (i.cp || 0) + (i.pp || 0) }}</td>
                <td>{{ (i.ci || 0) + (i.pi || 0) }}</td>
                <td>{{ (i.cr || 0) + (i.pr || 0) }}</td>
              </tr>
            </tbody>
          </NTable>
        </NTimelineItem>
      </NTimeline>
    </n-card>
  </n-layout>
</template>

<style scoped></style>
