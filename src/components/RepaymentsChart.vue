<script lang="ts" setup>
import { use, type ComposeOption } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, type LineSeriesOption } from 'echarts/charts'
import VChart from 'vue-echarts'

import {
  TitleComponent,
  type TitleComponentOption,
  ToolboxComponent,
  type ToolboxComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  GridComponent,
  type GridComponentOption,
  LegendComponent,
  type LegendComponentOption
} from 'echarts/components'
import type { RepaymentEntry } from '@/models/repaymentEntry'

use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
  LineChart
])
type EChartsOption = ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
>

const props = defineProps<{
  commercialRepayments?: RepaymentEntry[]
  providentFundRepayments?: RepaymentEntry[]
}>()

const option: Ref<EChartsOption> = ref({
  darkMode: true,
  title: {
    text: '还款详情',
    left: 'center'
  },
  tooltip: { trigger: 'axis' },
  legend: { top: 30 },
  grid: { containLabel: true, left: 0, top: 90 },
  yAxis: { type: 'value' },
  xAxis: { type: 'time' }
})

watch(
  () => [props.commercialRepayments, props.providentFundRepayments],
  () => {
    rerender()
  }
)

onMounted(() => {
  rerender()
})

function rerender() {
  let series: LineSeriesOption[] = []
  if (props.commercialRepayments?.length) {
    series = [
      ...series,
      {
        name: '商业贷款本金',
        type: 'line',
        stack: 'total',
        showSymbol: false,
        areaStyle: {},
        data: props.commercialRepayments?.map((item) => [item.date, item.principal])
      },
      {
        name: '商业贷款利息',
        type: 'line',
        stack: 'total',
        showSymbol: false,
        areaStyle: {},
        data: props.commercialRepayments?.map((item) => [item.date, item.interest])
      }
    ]
  }
  if (props.providentFundRepayments?.length) {
    series = [
      ...series,
      {
        name: '公积金贷款本金',
        type: 'line',
        stack: 'total',
        showSymbol: false,
        areaStyle: {},
        data: props.providentFundRepayments?.map((item) => [item.date, item.principal])
      },
      {
        name: '公积金贷款利息',
        type: 'line',
        stack: 'total',
        showSymbol: false,
        areaStyle: {},
        data: props.providentFundRepayments?.map((item) => [item.date, item.interest])
      }
    ]
  }
  option.value.series = series
  console.log(option.value)
}
</script>

<template>
  <div style="height: 400px">
    <v-chart style="height: 100%" :option="option" autoresize />
  </div>
</template>
