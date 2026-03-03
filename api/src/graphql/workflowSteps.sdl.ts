export const schema = gql`
  type Payment {
    id: Int!
    invoiceAmount: Float!
    invoicePaid: Boolean!
    createdAt: DateTime!
  }

  type WorkflowStep {
    id: Int!
    order: Int!
    status: WorkflowStepStatus!
    type: WorkflowStepType!
    createdAt: DateTime!
    updatedAt: DateTime!
    workflowStepTasks: [WorkflowStepTask!]
    payments: [Payment!]
  }

  enum WorkflowStepType {
    Review
    SendEmail
    IssueRecord
    Payment
  }

  enum WorkflowStepStatus {
    Pending
    Completed
  }
`
