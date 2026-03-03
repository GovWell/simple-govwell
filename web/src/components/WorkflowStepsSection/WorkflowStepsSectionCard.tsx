import { useMemo } from 'react'

import { WorkflowStepFragment } from 'types/graphql'

import {
  getPaymentTaskDisplayName,
  getWorkflowStepDisplayName,
} from 'src/utils/workflow-step-utils'

import WorkflowStatusPill from '../WorkflowStatusPill/WorkflowStatusPill'

type Props = {
  workflowStep: WorkflowStepFragment
  isCurrent: boolean
}

const WorkflowStepsSectionCard = (props: Props) => {
  const { workflowStep, isCurrent } = props
  const isCompleted = workflowStep.status === 'Completed'
  const isPayment = workflowStep.type === 'Payment'

  const sortedTasks = useMemo(() => {
    if (!isPayment) return []
    return [...(workflowStep.workflowStepTasks ?? [])].sort(
      (a, b) => a.order - b.order
    )
  }, [isPayment, workflowStep.workflowStepTasks])

  const showTaskIndicator = isPayment && (isCurrent || isCompleted)

  return (
    <div
      className={
        'rounded-lg border px-4 py-3 ' +
        (isCurrent
          ? 'border-blue-400 bg-blue-50'
          : isCompleted
            ? 'bg-emerald-50'
            : 'bg-slate-50')
      }
    >
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>Step {workflowStep.order + 1}</div>
        <WorkflowStatusPill
          status={workflowStep.status}
          isCurrent={isCurrent}
        />
      </div>
      <div className="mt-1 text-sm font-medium text-slate-800">
        {getWorkflowStepDisplayName(workflowStep.type)}
      </div>
      {showTaskIndicator && sortedTasks.length > 0 && (
        <div className="mt-2 space-y-1">
          {sortedTasks.map((task) => {
            const taskCompleted = task.status === 'Completed'
            const taskActive = isCurrent && !taskCompleted &&
              sortedTasks.every(
                (t) => t.order >= task.order || t.status === 'Completed'
              )

            return (
              <div
                key={task.id}
                className="flex items-center gap-1.5 text-xs"
              >
                {taskCompleted ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      className="h-2.5 w-2.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : taskActive ? (
                  <span className="h-4 w-4 rounded-full border-2 border-blue-500 bg-blue-500" />
                ) : (
                  <span className="h-4 w-4 rounded-full border-2 border-slate-300" />
                )}
                <span
                  className={
                    taskCompleted
                      ? 'text-emerald-700'
                      : taskActive
                        ? 'font-medium text-blue-700'
                        : 'text-slate-400'
                  }
                >
                  {getPaymentTaskDisplayName(task.order)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default React.memo(WorkflowStepsSectionCard)
