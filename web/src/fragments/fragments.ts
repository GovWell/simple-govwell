import { fragmentRegistry } from '@redwoodjs/web/apollo'

export const WorkflowStepTaskFragment = gql`
  fragment WorkflowStepTaskFragment on WorkflowStepTask {
    id
    order
    type
    status
  }
`

export const PaymentFragment = gql`
  fragment PaymentFragment on Payment {
    id
    invoiceAmount
    invoicePaid
    createdAt
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
    payments {
      ...PaymentFragment
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
  PaymentFragment,
  WorkflowStepFragment,
  RecordFragment,
  WorkflowStepTaskFragment
)
