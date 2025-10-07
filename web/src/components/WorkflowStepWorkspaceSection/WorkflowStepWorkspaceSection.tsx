import { useMemo } from 'react'

import { CompleteWorkflowStepTaskInput, RecordFragment } from 'types/graphql'

import { useCompleteWorkflowStepTask } from 'src/fetch/workflowStepTasks'
import {
  getCurrentWorkflowStep,
  getWorkflowStepDisplayName,
} from 'src/utils/workflow-step-utils'

import IssueRecordWorkspace from './WorkflowStepWorkspaces/IssueRecordWorkspace'
import ReviewWorkspace from './WorkflowStepWorkspaces/ReviewWorkspace'
import SendEmailWorkspace from './WorkflowStepWorkspaces/SendEmailWorkspace'

interface Props {
  record: RecordFragment
  refetch: () => void
}

export default function WorkflowStepWorkspaceSection({
  record,
  refetch,
}: Props) {
  const steps = useMemo(
    () => [...(record.workflowSteps ?? [])].sort((a, b) => a.order - b.order),
    [record.workflowSteps]
  )
  const current = useMemo(() => getCurrentWorkflowStep(steps), [steps])

  const [completeWorkflowStepTask, { loading }] = useCompleteWorkflowStepTask()

  const handleCompleted = async (input: CompleteWorkflowStepTaskInput) => {
    await completeWorkflowStepTask({ variables: { input } })
    refetch()
  }

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <div className="border-b px-4 py-3 text-lg text-slate-800">
        Current Workflow Step
      </div>
      <div className="space-y-4 px-4 py-5">
        {current ? (
          <div className="space-y-2">
            <div className="text-base font-medium text-slate-800">
              {getWorkflowStepDisplayName(current.type)}
            </div>
            <div>
              {current.type === 'SendEmail' && (
                <SendEmailWorkspace
                  workflowStep={current}
                  onWorkflowStepTaskCompleted={handleCompleted}
                  loading={loading}
                />
              )}
              {current.type === 'Review' && (
                <ReviewWorkspace
                  workflowStep={current}
                  onWorkflowStepTaskCompleted={handleCompleted}
                  loading={loading}
                />
              )}
              {current.type === 'IssueRecord' && (
                <IssueRecordWorkspace
                  workflowStep={current}
                  onWorkflowStepTaskCompleted={handleCompleted}
                  loading={loading}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-600">All steps completed.</div>
        )}
      </div>
    </div>
  )
}
