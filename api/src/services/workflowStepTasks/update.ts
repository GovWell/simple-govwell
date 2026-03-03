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
    const { id, sendEmailInput, paymentInput } = input

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

      // Validate inputs for Payment
      if (workflowStepTask.type === WorkflowStepTaskType.Payment) {
        const existingPayment = await tx.payment.findFirst({
          where: { workflowStepId: workflowStepTask.workflowStepId },
        })

        if (existingPayment) {
          // Second subtask: mark invoice as paid
          await tx.payment.update({
            where: { id: existingPayment.id },
            data: { invoicePaid: true },
          })
        } else {
          // First subtask: configure invoice
          if (!paymentInput?.amount || paymentInput.amount <= 0) {
            throw new Error(
              'paymentInput with a positive amount is required for configuring an invoice'
            )
          }

          await tx.payment.create({
            data: {
              invoiceAmount: paymentInput.amount,
              workflowStepId: workflowStepTask.workflowStepId,
            },
          })
        }
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
