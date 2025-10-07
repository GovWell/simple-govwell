import { WorkflowStepStatus, WorkflowStepTaskType } from '@prisma/client'

import { db } from 'src/lib/db'

type CreateWorkflowStepTaskParams = {
  order: number
  workflowStepId: number
  type: WorkflowStepTaskType
}
export const createWorkflowStepTask = async (
  input: CreateWorkflowStepTaskParams
) => {
  const workflowStepTask = await db.workflowStepTask.create({
    data: {
      order: input.order,
      workflowStepId: input.workflowStepId,
      type: input.type,
      status: WorkflowStepStatus.Pending,
    },
  })

  return workflowStepTask
}
