import {
  RecordStatus,
  WorkflowStepStatus,
  WorkflowStepType,
} from '@prisma/client'
import type { MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const completeWorkflowStep: MutationResolvers['completeWorkflowStep'] =
  async ({ input }) => {
    const { id, sendEmailInput } = input

    return db.$transaction(async (tx) => {
      // Load the step with its record and sibling steps
      const step = await tx.workflowStep.findUniqueOrThrow({
        where: { id },
        include: {
          record: {
            include: {
              workflowSteps: { orderBy: { order: 'asc' } },
            },
          },
        },
      })

      // Validate inputs for SendEmail
      if (step.type === WorkflowStepType.SendEmail) {
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
            workflowStepId: step.id,
          },
        })
      }

      // Mark workflow step as completed
      const updatedStep = await tx.workflowStep.update({
        where: { id: step.id },
        data: { status: WorkflowStepStatus.Completed },
      })

      // If IssueRecord, mark record as Issued immediately
      if (step.type === WorkflowStepType.IssueRecord) {
        await tx.record.update({
          where: { id: step.recordId },
          data: { status: RecordStatus.Issued },
        })
        return updatedStep
      }

      // If last step and not IssueRecord, mark record as Completed
      const steps = step.record.workflowSteps
      const isLast = steps.length > 0 && steps[steps.length - 1].id === step.id
      if (isLast) {
        await tx.record.update({
          where: { id: step.recordId },
          data: { status: RecordStatus.Completed },
        })
      }

      return updatedStep
    })
  }
