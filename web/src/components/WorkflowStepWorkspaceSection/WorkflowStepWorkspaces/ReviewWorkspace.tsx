import { useCallback } from 'react'

import { CompleteWorkflowStepInput } from 'types/graphql'

type Props = {
  workflowStepId: number
  onWorkflowStepCompleted: (input: CompleteWorkflowStepInput) => void
  loading?: boolean
}

export default function ReviewWorkspace({
  workflowStepId,
  onWorkflowStepCompleted,
  loading,
}: Props) {
  const handleClick = useCallback(() => {
    onWorkflowStepCompleted({ id: workflowStepId })
  }, [onWorkflowStepCompleted, workflowStepId])

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
