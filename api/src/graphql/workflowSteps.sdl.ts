export const schema = gql`
  type WorkflowStep {
    id: Int!
    order: Int!
    status: WorkflowStepStatus!
    type: WorkflowStepType!
    createdAt: DateTime!
    updatedAt: DateTime!
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

  input SendEmailWorkflowStepInput {
    subject: String!
    body: String!
  }

  input CompleteWorkflowStepInput {
    id: Int!
    sendEmailInput: SendEmailWorkflowStepInput
  }

  type Mutation {
    completeWorkflowStep(input: CompleteWorkflowStepInput!): WorkflowStep!
      @skipAuth
  }
`
