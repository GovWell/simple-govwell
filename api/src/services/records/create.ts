import { RecordStatus } from '@prisma/client'
import { MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { createWorkflowStep } from 'src/services/workflowSteps/create'

export const createRecord: MutationResolvers['createRecord'] = async ({
  input,
}) => {
  const createdRecord = await db.record.create({
    data: {
      status: RecordStatus.Submitted,
    },
  })

  const steps = input.workflowSteps

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    await createWorkflowStep({
      order: i,
      recordId: createdRecord.id,
      type: step.type,
    })
  }

  const recordWithRelations = await db.record.findUniqueOrThrow({
    where: { id: createdRecord.id },
    include: { workflowSteps: true },
  })

  return recordWithRelations
}
