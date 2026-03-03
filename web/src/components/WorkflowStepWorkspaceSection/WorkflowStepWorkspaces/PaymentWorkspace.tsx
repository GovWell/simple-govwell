import { useCallback, useMemo, useState } from 'react'

import {
  CompleteWorkflowStepTaskInput,
  WorkflowStepFragment,
} from 'types/graphql'

type Props = {
  workflowStep: WorkflowStepFragment
  onWorkflowStepTaskCompleted: (input: CompleteWorkflowStepTaskInput) => void
  loading?: boolean
}

const formatWithCommas = (value: string): string => {
  const [integerPart, decimalPart] = value.split('.')
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimalPart !== undefined ? `${withCommas}.${decimalPart}` : withCommas
}

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const parseAmount = (formatted: string): number => {
  return parseFloat(formatted.replace(/,/g, ''))
}

export default function PaymentWorkspace({
  workflowStep,
  onWorkflowStepTaskCompleted,
  loading,
}: Props) {
  const [amount, setAmount] = useState('')

  const tasks = useMemo(
    () =>
      [...(workflowStep.workflowStepTasks ?? [])].sort(
        (a, b) => a.order - b.order
      ),
    [workflowStep.workflowStepTasks]
  )

  const firstTask = tasks[0]
  const secondTask = tasks[1]
  const isFirstTaskDone = firstTask?.status === 'Completed'
  const currentTask = isFirstTaskDone ? secondTask : firstTask
  const payment = workflowStep.payments?.[0]

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '')

      const parts = raw.split('.')
      if (parts.length > 2) return
      if (parts[1] !== undefined && parts[1].length > 2) return

      setAmount(formatWithCommas(raw))
    },
    []
  )

  const parsedAmount = useMemo(() => parseAmount(amount), [amount])

  const isInvoiceDisabled = useMemo(() => {
    return loading || !parsedAmount || parsedAmount <= 0 || isNaN(parsedAmount)
  }, [loading, parsedAmount])

  const handleCreateInvoice = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (isInvoiceDisabled || !currentTask) return

      onWorkflowStepTaskCompleted({
        id: currentTask.id,
        paymentInput: { amount: parsedAmount },
      })
    },
    [isInvoiceDisabled, onWorkflowStepTaskCompleted, currentTask, parsedAmount]
  )

  const handlePayInvoice = useCallback(() => {
    if (loading || !currentTask) return
    onWorkflowStepTaskCompleted({ id: currentTask.id })
  }, [loading, onWorkflowStepTaskCompleted, currentTask])

  if (!currentTask) return null

  if (isFirstTaskDone) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-slate-600">Pay Invoice</div>
        {payment && (
          <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <span className="text-slate-500">Invoice Amount: </span>
            <span className="font-medium text-slate-900">
              {formatCurrency(payment.invoiceAmount)}
            </span>
          </div>
        )}
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={loading}
          onClick={handlePayInvoice}
        >
          Pay Invoice
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-slate-600">
        Configure Invoice
      </div>
      <form onSubmit={handleCreateInvoice} className="space-y-3">
        <div>
          <label
            htmlFor="invoice-amount"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Invoice Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              $
            </span>
            <input
              type="text"
              id="invoice-amount"
              className="w-full rounded border py-2 pl-7 pr-3 text-sm outline-none focus:ring"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={isInvoiceDisabled}
        >
          Create Invoice
        </button>
      </form>
    </div>
  )
}
