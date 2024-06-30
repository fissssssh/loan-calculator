import type { RepaymentEntry } from '@/models/repaymentEntry'
import dayjs from 'dayjs'
import { round } from 'lodash'

export function calculateFixedInstallmentRepayments(
  principal: number,
  period: number,
  rate: number,
  firstRepaymentDate: number
): RepaymentEntry[] {
  const numerator = rate * Math.pow(1 + rate, period)
  const denominator = Math.pow(1 + rate, period) - 1
  const payment = principal * (numerator / denominator) // 每月应还

  const repaymentDate = dayjs(firstRepaymentDate)
  const repayments: RepaymentEntry[] = []
  let remainingPrincipal = principal
  for (let i = 0; i < period; i++) {
    const monthlyInterest = remainingPrincipal * rate // 当期利息
    const monthlyPrincipal = payment - monthlyInterest // 当期本金
    remainingPrincipal -= monthlyPrincipal
    const date = repaymentDate.add(i, 'month')
    repayments.push({
      date: date.valueOf(),
      interest: round(monthlyInterest, 2),
      principal: round(monthlyPrincipal, 2),
      remainingPrincipal: round(remainingPrincipal, 2)
    })
  }

  return repayments
}

export function calculateReducingInstallmentRepayments(
  principal: number,
  period: number,
  rate: number,
  firstRepaymentDate: number
): RepaymentEntry[] {
  const repaymentDate = dayjs(firstRepaymentDate)
  const monthlyPrincipal = principal / period
  const repayments: RepaymentEntry[] = []
  for (let i = 0; i < period; i++) {
    const monthlyInterest = (principal - monthlyPrincipal * i) * rate // 当期利息
    const remainingPrincipal = principal - monthlyPrincipal * (i + 1)
    const date = repaymentDate.add(i, 'month')
    repayments.push({
      date: date.valueOf(),
      interest: round(monthlyInterest, 2),
      principal: round(monthlyPrincipal, 2),
      remainingPrincipal: round(remainingPrincipal, 2)
    })
  }
  return repayments
}
