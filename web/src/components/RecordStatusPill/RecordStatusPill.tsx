import { twMerge } from 'tailwind-merge'
import type { RecordStatus } from 'types/graphql'

interface RecordStatusPillProps {
  status: RecordStatus
  className?: string
}

const colorClassesByStatus: Record<RecordStatus, string> = {
  Submitted: 'bg-amber-100 text-amber-700',
  InProgress: 'bg-sky-100 text-sky-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Issued: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-emerald-100 text-emerald-700',
}

export default function RecordStatusPill({
  status,
  className,
}: RecordStatusPillProps) {
  const colors = colorClassesByStatus[status] ?? 'bg-slate-700 text-slate-300'
  return (
    <span
      className={twMerge(
        'inline-block rounded-full px-2 py-1 text-xs font-medium',
        colors,
        className
      )}
    >
      {status}
    </span>
  )
}
