<script setup lang="ts">
import type { RepaymentEntry } from '@/models/repaymentEntry'

const props = defineProps<{
  commercialRepayments?: RepaymentEntry[]
  providentFundRepayments?: RepaymentEntry[]
}>()

const showCommercial = computed(
  () => props.commercialRepayments && props.commercialRepayments.length
)
const showProvidentFund = computed(
  () => props.providentFundRepayments && props.providentFundRepayments.length
)
const datas = computed(() => {
  const rps = new Map<number, { commercial?: RepaymentEntry; providentFund?: RepaymentEntry }>()

  if (props.commercialRepayments) {
    for (const rp of props.commercialRepayments) {
      rps.set(rp.date, { commercial: rp })
    }
  }

  if (props.providentFundRepayments) {
    for (const rp of props.providentFundRepayments) {
      const entry = rps.get(rp.date)
      if (entry) {
        entry.providentFund = rp
      } else {
        rps.set(rp.date, { providentFund: rp })
      }
    }
  }

  return rps
})
</script>

<template>
  <n-table v-if="commercialRepayments?.length || providentFundRepayments?.length">
    <thead>
      <tr>
        <th rowspan="2">日期</th>
        <th v-if="showProvidentFund" colspan="3">公积金贷款</th>
        <th v-if="showCommercial" colspan="3">商业贷款</th>
      </tr>
      <tr>
        <th v-if="showProvidentFund">本期本金</th>
        <th v-if="showProvidentFund">本期利息</th>
        <th v-if="showProvidentFund">本期剩余本金</th>
        <th v-if="showCommercial">本期本金</th>
        <th v-if="showCommercial">本期利息</th>
        <th v-if="showCommercial">本期剩余本金</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, index) of datas.values()" :key="index">
        <td>
          <n-time type="date" :time="entry.providentFund?.date ?? entry.commercial?.date"></n-time>
        </td>
        <td v-if="showProvidentFund">{{ entry.providentFund?.principal }}</td>
        <td v-if="showProvidentFund">{{ entry.providentFund?.interest }}</td>
        <td v-if="showProvidentFund">{{ entry.providentFund?.remainingPrincipal }}</td>
        <td v-if="showCommercial">{{ entry.commercial?.principal }}</td>
        <td v-if="showCommercial">{{ entry.commercial?.interest }}</td>
        <td v-if="showCommercial">{{ entry.commercial?.remainingPrincipal }}</td>
      </tr>
    </tbody>
  </n-table>
  <n-empty v-else description="无数据"></n-empty>
</template>
