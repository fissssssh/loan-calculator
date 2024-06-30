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
        <th>日期</th>
        <th v-if="showProvidentFund">本期本金（公）</th>
        <th v-if="showProvidentFund">本期利息（公）</th>
        <th v-if="showProvidentFund">本期剩余本金（公）</th>
        <th v-if="showCommercial">本期本金（商）</th>
        <th v-if="showCommercial">本期利息（商）</th>
        <th v-if="showCommercial">本期剩余本金（商）</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, index) of datas.values()" :key="index">
        <td>
          <n-time type="date" :time="entry.providentFund?.date ?? entry.commercial?.date"></n-time>
        </td>
        <td v-if="entry.providentFund">{{ entry.providentFund.principal }}</td>
        <td v-if="entry.providentFund">{{ entry.providentFund.interest }}</td>
        <td v-if="entry.providentFund">{{ entry.providentFund.remainingPrincipal }}</td>
        <td v-if="entry.commercial">{{ entry.commercial.principal }}</td>
        <td v-if="entry.commercial">{{ entry.commercial.interest }}</td>
        <td v-if="entry.commercial">{{ entry.commercial.remainingPrincipal }}</td>
      </tr>
    </tbody>
  </n-table>
  <n-empty v-else description="无数据"></n-empty>
</template>
