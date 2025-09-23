import { twMerge } from 'tailwind-merge'
import type { WorkflowStepStatus } from 'types/graphql'

interface WorkflowStatusPillProps {
  status: WorkflowStepStatus
  isCurrent: boolean
}

const colorClassesByStatus: Record<WorkflowStepStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
}

export default function WorkflowStatusPill({
  status,
  isCurrent,
}: WorkflowStatusPillProps) {
  const colors = isCurrent
    ? 'bg-blue-100 text-blue-700'
    : (colorClassesByStatus[status] ?? 'bg-slate-700 text-slate-300')

  const statusText = isCurrent ? 'Current' : status
  return (
    <span
      className={twMerge(
        'inline-block rounded-full px-2 py-1 text-xs font-medium',
        colors
      )}
    >
      {statusText}
    </span>
  )
}
