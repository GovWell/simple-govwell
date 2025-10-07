import {
  Prisma,
  RecordStatus,
  WorkflowStepStatus,
  WorkflowStepTaskStatus,
} from '@prisma/client'

type UpdateWorkflowStepParams = {
  tx: Prisma.TransactionClient
  workflowStepId: number
}

export const updateWorkflowStep = async ({
  tx,
  workflowStepId,
}: UpdateWorkflowStepParams) => {
  const workflowStep = await tx.workflowStep.findUniqueOrThrow({
    where: { id: workflowStepId },
    include: {
      workflowStepTasks: true,
    },
  })

  // If all tasks are completed, update the step status to Completed
  if (
    workflowStep.workflowStepTasks.every(
      (task) => task.status === WorkflowStepTaskStatus.Completed
    )
  ) {
    await tx.workflowStep.update({
      where: { id: workflowStepId },
      data: { status: WorkflowStepStatus.Completed },
    })

    const record = await tx.record.findUniqueOrThrow({
      where: { id: workflowStep.recordId },
      include: {
        workflowSteps: true,
      },
    })

    // If the record is not Issued, check to see if the record is complete
    if (record.status !== RecordStatus.Issued) {
      // If all steps are completed, update the record status to Completed
      if (
        record.workflowSteps.every(
          (step) => step.status === WorkflowStepStatus.Completed
        )
      ) {
        await tx.record.update({
          where: { id: workflowStep.recordId },
          data: { status: RecordStatus.Completed },
        })
      }
    }
  }
}
