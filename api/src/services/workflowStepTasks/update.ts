import {
  RecordStatus,
  WorkflowStepTaskStatus,
  WorkflowStepTaskType,
} from '@prisma/client'
import type { MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

import { updateWorkflowStep } from '../workflowSteps/update'

export const completeWorkflowStepTask: MutationResolvers['completeWorkflowStepTask'] =
  async ({ input }) => {
    const { id, sendEmailInput } = input

    return db.$transaction(async (tx) => {
      // Load the step with its record and sibling steps
      const workflowStepTask = await tx.workflowStepTask.findUniqueOrThrow({
        where: { id },
        include: {
          workflowStep: true,
        },
      })

      // Validate inputs for SendEmail
      if (workflowStepTask.type === WorkflowStepTaskType.SendEmail) {
        if (!sendEmailInput?.subject || !sendEmailInput?.body) {
          throw new Error(
            'sendEmailInput is required for SendEmail workflow steps'
          )
        }

        // Create the email associated with this step
        await tx.email.create({
          data: {
            subject: sendEmailInput.subject,
            body: sendEmailInput.body,
            workflowStepId: workflowStepTask.workflowStepId,
          },
        })
      }

      // If IssueRecord, mark record as Issued immediately
      if (workflowStepTask.type === WorkflowStepTaskType.IssueRecord) {
        await tx.record.update({
          where: { id: workflowStepTask.workflowStep.recordId },
          data: { status: RecordStatus.Issued },
        })
      }

      // Mark workflow step task as completed
      const updatedStep = await tx.workflowStepTask.update({
        where: { id: workflowStepTask.id },
        data: { status: WorkflowStepTaskStatus.Completed },
      })

      await updateWorkflowStep({
        tx,
        workflowStepId: workflowStepTask.workflowStepId,
      })

      return updatedStep
    })
  }
