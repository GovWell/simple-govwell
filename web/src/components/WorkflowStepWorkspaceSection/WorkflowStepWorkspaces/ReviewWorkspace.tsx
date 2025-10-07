import { useCallback } from 'react'

import {
  CompleteWorkflowStepTaskInput,
  WorkflowStepFragment,
} from 'types/graphql'

type Props = {
  workflowStep: WorkflowStepFragment
  onWorkflowStepTaskCompleted: (input: CompleteWorkflowStepTaskInput) => void
  loading?: boolean
}

export default function ReviewWorkspace({
  workflowStep,
  onWorkflowStepTaskCompleted,
  loading,
}: Props) {
  const handleClick = useCallback(() => {
    const firstTaskId = workflowStep.workflowStepTasks?.[0]?.id
    if (firstTaskId == null) return
    onWorkflowStepTaskCompleted({ id: firstTaskId })
  }, [onWorkflowStepTaskCompleted, workflowStep])

  return (
    <div>
      <button
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        disabled={loading}
        onClick={handleClick}
      >
        Record reviewed
      </button>
    </div>
  )
}
