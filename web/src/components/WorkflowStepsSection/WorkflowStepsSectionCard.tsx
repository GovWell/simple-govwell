import { WorkflowStepFragment } from 'types/graphql'

import { getWorkflowStepDisplayName } from 'src/utils/workflow-step-utils'

import WorkflowStatusPill from '../WorkflowStatusPill/WorkflowStatusPill'

type Props = {
  workflowStep: WorkflowStepFragment
  isCurrent: boolean
}

const WorkflowStepsSectionCard = (props: Props) => {
  const { workflowStep, isCurrent } = props
  const isCompleted = workflowStep.status === 'Completed'
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
    </div>
  )
}

export default React.memo(WorkflowStepsSectionCard)
