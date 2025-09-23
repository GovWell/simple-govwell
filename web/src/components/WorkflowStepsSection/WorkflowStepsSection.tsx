import { useMemo } from 'react'

import type { GetRecord } from 'types/graphql'

import { getCurrentWorkflowStep } from 'src/utils/workflow-step-utils'

import WorkflowStepsSectionCard from './WorkflowStepsSectionCard'

interface Props {
  record: NonNullable<GetRecord['getRecord']>
}

export default function WorkflowStepsSection({ record }: Props) {
  const steps = useMemo(
    () => [...(record.workflowSteps ?? [])],
    [record.workflowSteps]
  )
  const current = useMemo(() => getCurrentWorkflowStep(steps), [steps])
  const currentId = current?.id

  return (
    <aside className="overflow-hidden rounded-md border bg-white">
      <div className="border-b px-4 py-3 text-lg text-slate-800">
        Workflow Steps
      </div>
      <div className="space-y-3 p-4">
        {steps.map((s) => {
          return (
            <WorkflowStepsSectionCard
              key={s.id}
              workflowStep={s}
              isCurrent={s.id === currentId}
            />
          )
        })}
      </div>
    </aside>
  )
}
