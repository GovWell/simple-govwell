import { fragmentRegistry } from '@redwoodjs/web/apollo'

export const WorkflowStepTaskFragment = gql`
  fragment WorkflowStepTaskFragment on WorkflowStepTask {
    id
    order
    type
    status
  }
`

export const WorkflowStepFragment = gql`
  fragment WorkflowStepFragment on WorkflowStep {
    id
    order
    type
    status
    createdAt
    updatedAt
    workflowStepTasks {
      ...WorkflowStepTaskFragment
    }
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

fragmentRegistry.register(
  WorkflowStepFragment,
  RecordFragment,
  WorkflowStepTaskFragment
)
