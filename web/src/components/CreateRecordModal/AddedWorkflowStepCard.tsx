import { useCallback } from 'react'

import { WorkflowStepType } from 'types/graphql'

import { getWorkflowStepDisplayName } from 'src/utils/workflow-step-utils'

type Props = {
  type: WorkflowStepType
  index: number
  onRemove: (index: number) => void
}

const AddedWorkflowStepCard = ({ type, index, onRemove }: Props) => {
  const handleRemove = useCallback(() => {
    onRemove(index)
  }, [onRemove, index])

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
      <span className="text-sm font-medium text-slate-800">
        {getWorkflowStepDisplayName(type)}
      </span>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        onClick={handleRemove}
        aria-label="Remove step"
      >
        x
      </button>
    </div>
  )
}

export default React.memo(AddedWorkflowStepCard)
