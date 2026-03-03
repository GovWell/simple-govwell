import { WorkflowStepFragment, WorkflowStepType } from 'types/graphql'

export const WorkflowStepTypes: WorkflowStepType[] = [
  'Review',
  'SendEmail',
  'IssueRecord',
  'Payment',
]

const workflowStepDisplayNames: Record<WorkflowStepType, string> = {
  Review: 'Review',
  SendEmail: 'Send Email',
  IssueRecord: 'Issue Record',
  Payment: 'Payment',
}

export const getWorkflowStepDisplayName = (type: WorkflowStepType) => {
  return workflowStepDisplayNames[type]
}

export const getCurrentWorkflowStep = (
  workflowSteps: WorkflowStepFragment[] | null | undefined
) => {
  return workflowSteps?.find((step) => step.status === 'Pending') ?? null
}

const paymentTaskDisplayNames: Record<number, string> = {
  0: 'Configure Invoice',
  1: 'Pay Invoice',
}

export const getPaymentTaskDisplayName = (order: number): string => {
  return paymentTaskDisplayNames[order] ?? `Task ${order + 1}`
}
