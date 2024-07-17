<script lang="ts" setup>
import type { RepaymentEntry } from '@/models/repaymentEntry'

const props = defineProps<{
  commercialRepayments?: RepaymentEntry[]
  providentFundRepayments?: RepaymentEntry[]
}>()

const principal = ref(0)
const interest = ref(0)

watchEffect(() => {
  principal.value = 0
  interest.value = 0
  if (props.commercialRepayments) {
    for (const r of props.commercialRepayments) {
      principal.value += r.principal
      interest.value += r.interest
    }
  }
  if (props.providentFundRepayments) {
    for (const r of props.providentFundRepayments) {
      principal.value += r.principal
      interest.value += r.interest
    }
  }
})
</script>

<template>
  <n-grid :cols="3" :x-gap="12">
    <n-gi>
      <n-card title="本金" embedded>
        <span class="">{{ (principal / 10000).toFixed(2) }}</span>
        <span class="">万</span>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card title="利息" embedded>
        <span class="">{{ (interest / 10000).toFixed(2) }}</span>
        <span class="">万</span>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card title="合计" embedded>
        <span class="">{{ ((principal + interest) / 10000).toFixed(2) }}</span>
        <span class="">万</span>
      </n-card>
    </n-gi>
  </n-grid>
</template>
