import { useMemo } from 'react'

import type { GetRecord } from 'types/graphql'

import RecordStatusPill from 'src/components/RecordStatusPill/RecordStatusPill'
import { formatDateTime } from 'src/utils/date-utils'
import { getCurrentWorkflowStep } from 'src/utils/workflow-step-utils'

interface Props {
  record: NonNullable<GetRecord['getRecord']>
}

export default function RecordDetailsSection({ record }: Props) {
  const steps = useMemo(
    () => [...(record.workflowSteps ?? [])],
    [record.workflowSteps]
  )
  const total = steps.length
  const current = useMemo(() => getCurrentWorkflowStep(steps), [steps])
  const currentIndex = current ? current.order + 1 : 0

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="text-lg text-slate-800">Record Information</div>
      </div>

      <div className="divide-y">
        <div className="grid grid-cols-2 gap-6 px-4 py-5 text-sm text-slate-600 md:grid-cols-4">
          <div>
            <div className="text-slate-500">ID</div>
            <div className="text-slate-900">{record.id}</div>
          </div>
          <div>
            <div className="text-slate-500">Status</div>
            <RecordStatusPill status={record.status} className="mt-1" />
          </div>
          <div>
            <div className="text-slate-500">Current Step</div>
            <div className="text-slate-900">{current?.type ?? '-'}</div>
          </div>
          <div>
            <div className="text-slate-500">Progress</div>
            <div className="text-slate-900">
              {total > 0 ? `Step ${currentIndex} of ${total}` : '-'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 px-4 py-5 text-sm text-slate-600 md:grid-cols-2">
          <div>
            <div className="text-slate-500">Created</div>
            <div className="text-slate-900">
              {formatDateTime(record.createdAt)}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Last Updated</div>
            <div className="text-slate-900">
              {formatDateTime(record.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
