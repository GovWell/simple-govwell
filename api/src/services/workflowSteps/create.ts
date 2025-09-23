import { WorkflowStepStatus, WorkflowStepType } from '@prisma/client'

import { db } from 'src/lib/db'

type CreateWorkflowStepParams = {
  order: number
  recordId: number
  type: WorkflowStepType
}
export const createWorkflowStep = async (input: CreateWorkflowStepParams) => {
  const workflowStep = await db.workflowStep.create({
    data: {
      order: input.order,
      recordId: input.recordId,
      type: input.type,
      status: WorkflowStepStatus.Pending,
    },
  })

  return workflowStep
}
