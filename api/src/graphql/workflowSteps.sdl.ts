export const schema = gql`
  type WorkflowStep {
    id: Int!
    order: Int!
    status: WorkflowStepStatus!
    type: WorkflowStepType!
    createdAt: DateTime!
    updatedAt: DateTime!
    workflowStepTasks: [WorkflowStepTask!]
  }

  enum WorkflowStepType {
    Review
    SendEmail
    IssueRecord
  }

  enum WorkflowStepStatus {
    Pending
    Completed
  }
`
