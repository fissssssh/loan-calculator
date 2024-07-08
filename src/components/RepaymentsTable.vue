<script setup lang="ts">
import type { RepaymentEntry } from '@/models/repaymentEntry'
import { NTime, type DataTableColumns } from 'naive-ui'

const columns: DataTableColumns<RepaymentEntry> = [
  {
    title: '日期',
    key: 'date',
    fixed: 'left',
    width: 100,
    render(row) {
      return h(NTime, { type: 'date', time: row.date })
    }
  },
  {
    title: '公积金还款',
    titleColSpan: 3,
    key: 'providentFund',
    children: [
      { title: '本期本金', key: 'providentFund.principal' },
      { title: '本期利息', key: 'providentFund.interest' },
      { title: '剩余本金', key: 'providentFund.remainingPrincipal' }
    ]
  },
  {
    title: '商贷还款',
    titleColSpan: 3,
    key: 'commercial',
    children: [
      { title: '本期本金', key: 'commercial.principal' },
      { title: '本期利息', key: 'commercial.interest' },
      { title: '剩余本金', key: 'commercial.remainingPrincipal' }
    ]
  }
]

const props = defineProps<{
  commercialRepayments?: RepaymentEntry[]
  providentFundRepayments?: RepaymentEntry[]
}>()

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

  return Array.from(rps.entries()).map(([date, entry]) => ({
    date,
    ...entry
  }))
})
</script>

<template>
  <n-data-table
    :columns="columns"
    :data="datas"
    scroll-x="1000px"
    max-height="500px"
    virtual-scroll
  />
</template>
