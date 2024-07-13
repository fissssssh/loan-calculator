<script setup lang="ts">
import type { RepaymentEntry } from '@/models/repaymentEntry'
import { RepaymentDisplayMode } from '@/shared/enums'
import { NTime, type DataTableColumns } from 'naive-ui'

const props = defineProps<{
  mode: RepaymentDisplayMode
  commercialRepayments?: RepaymentEntry[]
  providentFundRepayments?: RepaymentEntry[]
}>()

const columns = computed(() => {
  let cols: DataTableColumns<RepaymentEntry> = [
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
  if (props.mode === RepaymentDisplayMode.Simple) {
    cols = [
      ...cols,
      {
        title: '本期本金',
        key: 'principal',
        minWidth: 150,
        render: (row) => row.principal.toFixed(2)
      },
      {
        title: '本期利息',
        key: 'interset',
        minWidth: 150,
        render: (row) => row.interest?.toFixed(2)
      },
      {
        title: '本期还款',
        key: 'total',
        minWidth: 150,
        render: (row) => (row.principal + row.interest).toFixed(2)
      }
    ]
  } else if (props.mode === RepaymentDisplayMode.Full) {
    if (props.providentFundRepayments && props.providentFundRepayments.length) {
      cols.push({
        title: '公积金还款',
        titleColSpan: 3,
        key: 'providentFund',
        children: [
          { title: '本期本金', key: 'providentFund.principal', minWidth: 150 },
          { title: '本期利息', key: 'providentFund.interest', minWidth: 150 },
          { title: '剩余本金', key: 'providentFund.remainingPrincipal', minWidth: 150 }
        ]
      })
    }

    if (props.commercialRepayments && props.commercialRepayments.length) {
      cols.push({
        title: '商贷还款',
        titleColSpan: 3,
        key: 'commercial',
        children: [
          { title: '本期本金', key: 'commercial.principal', minWidth: 150 },
          { title: '本期利息', key: 'commercial.interest', minWidth: 150 },
          { title: '剩余本金', key: 'commercial.remainingPrincipal', minWidth: 150 }
        ]
      })
    }
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

  if (props.mode === RepaymentDisplayMode.Full) {
    return Array.from(rps.entries()).map(([date, entry]) => ({
      date,
      ...entry
    }))
  } else if (props.mode === RepaymentDisplayMode.Simple) {
    return Array.from(rps.entries()).map(([date, entry]) => ({
      date,
      principal: (entry.commercial?.principal ?? 0) + (entry.providentFund?.principal ?? 0),
      interest: (entry.commercial?.interest ?? 0) + (entry.providentFund?.interest ?? 0)
    }))
  }
})
</script>

<template>
  <n-data-table
    :columns="columns"
    :data="datas"
    size="small"
    striped
    :scroll-x="'100%'"
    max-height="500px"
    virtual-scroll />
</template>
