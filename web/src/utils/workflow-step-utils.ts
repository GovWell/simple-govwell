import { WorkflowStepFragment, WorkflowStepType } from 'types/graphql'

export const WorkflowStepTypes: WorkflowStepType[] = [
  'Review',
  'SendEmail',
  'IssueRecord',
]

const workflowStepDisplayNames: Record<WorkflowStepType, string> = {
  Review: 'Review',
  SendEmail: 'Send Email',
  IssueRecord: 'Issue Record',
}

export const getWorkflowStepDisplayName = (type: WorkflowStepType) => {
  return workflowStepDisplayNames[type]
}

export const getCurrentWorkflowStep = (
  workflowSteps: WorkflowStepFragment[] | null | undefined
) => {
  return workflowSteps?.find((step) => step.status === 'Pending') ?? null
}
