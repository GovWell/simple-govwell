import { useCallback, useState } from 'react'

import type { WorkflowStepType } from 'types/graphql'

import Modal from 'src/components/Modal/Modal'
import { useCreateRecord } from 'src/fetch/records'
import {
  getWorkflowStepDisplayName,
  WorkflowStepTypes,
} from 'src/utils/workflow-step-utils'

import AddedWorkflowStepCard from './AddedWorkflowStepCard'

interface CreateRecordModalProps {
  onClose: () => void
  onCreated?: (recordId: number) => void
}

export default function CreateRecordModal({
  onClose,
  onCreated,
}: CreateRecordModalProps) {
  const [steps, setSteps] = useState<WorkflowStepType[]>([])
  const [newStep, setNewStep] = useState<WorkflowStepType>('Review')
  const [createRecord, { loading }] = useCreateRecord()

  const canCreate = steps.length > 0 && !loading

  const addStep = useCallback(() => {
    setSteps((prev) => [...prev, newStep])
  }, [newStep])

  const removeStepAt = useCallback((index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleCreate = useCallback(async () => {
    if (!canCreate) return
    try {
      const { data } = await createRecord({
        variables: {
          input: {
            workflowSteps: steps.map((type) => ({ type })),
          },
        },
      })
      const id: number | undefined = data?.createRecord?.id
      onClose()
      setSteps([])
      if (id && onCreated) onCreated(id)
    } catch {
      // surface minimal error state; production apps may want toast notifications
    }
  }, [canCreate, createRecord, onClose, onCreated, steps])

  const handleNewStepChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setNewStep(e.target.value as WorkflowStepType)
    },
    []
  )

  return (
    <Modal>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-900">
          Configure Workflow Steps
        </h3>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="space-y-2">
          <label
            htmlFor="new-step"
            className="text-xs font-medium text-slate-600"
          >
            Add New Step
          </label>
          <div className="flex items-center gap-2">
            <select
              id="new-step"
              value={newStep}
              onChange={handleNewStepChange}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {WorkflowStepTypes.map((t) => (
                <option key={t} value={t}>
                  {getWorkflowStepDisplayName(t)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addStep}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-white shadow hover:bg-blue-500 active:bg-blue-700"
              aria-label="Add step"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="current-steps"
            className="text-xs font-medium text-slate-600"
          >
            Current Steps
          </label>
          <div className="space-y-2">
            {steps.map((type, index) => (
              <AddedWorkflowStepCard
                key={`${type}-${index}`}
                type={type}
                index={index}
                onRemove={removeStepAt}
              />
            ))}
            {steps.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-500">
                No steps added yet
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!canCreate}
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Create Record
        </button>
      </div>
    </Modal>
  )
}
