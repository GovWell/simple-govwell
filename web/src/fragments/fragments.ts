import { fragmentRegistry } from '@redwoodjs/web/apollo'

export const WorkflowStepFragment = gql`
  fragment WorkflowStepFragment on WorkflowStep {
    id
    order
    type
    status
    createdAt
    updatedAt
  }
`

export const RecordFragment = gql`
  fragment RecordFragment on Record {
    id
    status
    createdAt
    updatedAt
    workflowSteps {
      ...WorkflowStepFragment
    }
  }
`

fragmentRegistry.register(WorkflowStepFragment, RecordFragment)
