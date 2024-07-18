<script lang="ts" setup>
import type { RepaymentEntry } from '@/models/repaymentEntry'
import { RepaymentDisplayMode } from '@/shared/enums'

const props = defineProps<{
  mode: RepaymentDisplayMode
  commercialRepayments?: RepaymentEntry[]
  providentFundRepayments?: RepaymentEntry[]
}>()

const principalOfCommercial = ref(0)
const interestOfCommercial = ref(0)
const principalOfProvidentFund = ref(0)
const interestOfProvidentFund = ref(0)

const totalOfCommercial = computed(() => principalOfCommercial.value + interestOfCommercial.value)
const totalOfProvidentFund = computed(
  () => principalOfProvidentFund.value + interestOfProvidentFund.value
)

const principal = computed(() => principalOfCommercial.value + principalOfProvidentFund.value)
const interest = computed(() => interestOfCommercial.value + interestOfProvidentFund.value)
const total = computed(() => principal.value + interest.value)

watchEffect(() => {
  principalOfCommercial.value = 0
  interestOfCommercial.value = 0
  principalOfProvidentFund.value = 0
  interestOfProvidentFund.value = 0
  if (props.commercialRepayments) {
    for (const r of props.commercialRepayments) {
      principalOfCommercial.value += r.principal
      interestOfCommercial.value += r.interest
    }
  }
  if (props.providentFundRepayments) {
    for (const r of props.providentFundRepayments) {
      principalOfProvidentFund.value += r.principal
      interestOfProvidentFund.value += r.interest
    }
  }
})
</script>

<template>
  <n-grid :cols="3" :x-gap="12" :y-gap="12">
    <template v-if="mode === RepaymentDisplayMode.Simple">
      <n-gi>
        <n-card title="本金" embedded>
          <span class=""> {{ (principal / 10000).toFixed(2) }} </span>
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
          <span class="">{{ (total / 10000).toFixed(2) }}</span>
          <span class="">万</span>
        </n-card>
      </n-gi>
    </template>
    <template v-if="mode === RepaymentDisplayMode.Full">
      <n-gi>
        <n-card title="本金(公积金)" embedded>
          <span class=""> {{ (principalOfProvidentFund / 10000).toFixed(2) }} </span>
          <span class="">万</span>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="利息(公积金)" embedded>
          <span class="">{{ (interestOfProvidentFund / 10000).toFixed(2) }}</span>
          <span class="">万</span>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="合计(公积金)" embedded>
          <span class="">{{ (totalOfProvidentFund / 10000).toFixed(2) }}</span>
          <span class="">万</span>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="本金(商贷)" embedded>
          <span class=""> {{ (principalOfCommercial / 10000).toFixed(2) }} </span>
          <span class="">万</span>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="利息(商贷)" embedded>
          <span class="">{{ (interestOfCommercial / 10000).toFixed(2) }}</span>
          <span class="">万</span>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="合计(商贷)" embedded>
          <span class="">{{ (totalOfCommercial / 10000).toFixed(2) }}</span>
          <span class="">万</span>
        </n-card>
      </n-gi>
    </template>
  </n-grid>
</template>
