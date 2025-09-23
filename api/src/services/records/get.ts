import { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const getRecords: QueryResolvers['getRecords'] = async () => {
  const records = await db.record.findMany({
    orderBy: { id: 'asc' },
    include: { workflowSteps: true },
  })

  return records
}

export const getRecord: QueryResolvers['getRecord'] = async ({ id }) => {
  const record = await db.record.findUniqueOrThrow({
    where: { id: id },
    include: { workflowSteps: true },
  })

  return record
}
