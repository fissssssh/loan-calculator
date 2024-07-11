<script setup lang="ts">
import type { RepaymentEntry } from '@/models/repaymentEntry'
import { NTime, type DataTableColumns } from 'naive-ui'

const props = defineProps<{
  commercialRepayments?: RepaymentEntry[]
  providentFundRepayments?: RepaymentEntry[]
}>()

const columns = computed(() => {
  const cols: DataTableColumns<RepaymentEntry> = [
    {
      title: '日期',
      key: 'date',
      fixed: 'left',
      width: 100,
      render(row) {
        return h(NTime, { type: 'date', time: row.date })
      }
    }
  ]

  if (props.providentFundRepayments && props.providentFundRepayments.length) {
    cols.push({
      title: '公积金还款',
      titleColSpan: 3,
      key: 'providentFund',
      children: [
        { title: '本期本金', key: 'providentFund.principal' },
        { title: '本期利息', key: 'providentFund.interest' },
        { title: '剩余本金', key: 'providentFund.remainingPrincipal' }
      ]
    })
  }

  if (props.commercialRepayments && props.commercialRepayments.length) {
    cols.push({
      title: '商贷还款',
      titleColSpan: 3,
      key: 'commercial',
      children: [
        { title: '本期本金', key: 'commercial.principal' },
        { title: '本期利息', key: 'commercial.interest' },
        { title: '剩余本金', key: 'commercial.remainingPrincipal' }
      ]
    })
  }

  return cols
})

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
    size="small"
    striped
    :scroll-x="columns.length > 2 ? '1000px' : '550px'"
    max-height="500px"
    virtual-scroll />
</template>
