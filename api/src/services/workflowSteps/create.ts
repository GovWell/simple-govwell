import {
  WorkflowStepStatus,
  WorkflowStepTaskType,
  WorkflowStepType,
} from '@prisma/client'

import { db } from 'src/lib/db'

import { createWorkflowStepTask } from '../workflowStepTasks/create'

type CreateWorkflowStepParams = {
  order: number
  recordId: number
  type: WorkflowStepType
}
export const createWorkflowStep = async (input: CreateWorkflowStepParams) => {
  const { type, recordId, order } = input
  const workflowStep = await db.workflowStep.create({
    data: {
      order: order,
      recordId: recordId,
      type: type,
      status: WorkflowStepStatus.Pending,
    },
  })

  switch (type) {
    case WorkflowStepType.IssueRecord: {
      await createWorkflowStepTask({
        type: WorkflowStepTaskType.IssueRecord,
        workflowStepId: workflowStep.id,
        order: 0,
      })
      break
    }
    case WorkflowStepType.SendEmail: {
      await createWorkflowStepTask({
        type: WorkflowStepTaskType.SendEmail,
        workflowStepId: workflowStep.id,
        order: 0,
      })
      break
    }
    case WorkflowStepType.Review: {
      await createWorkflowStepTask({
        type: WorkflowStepTaskType.Review,
        workflowStepId: workflowStep.id,
        order: 0,
      })
      break
    }
  }

  return workflowStep
}
