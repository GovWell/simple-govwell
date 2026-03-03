export const schema = gql`
  type WorkflowStepTask {
    id: Int!
    order: Int!
    status: WorkflowStepTaskStatus!
    type: WorkflowStepTaskType!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum WorkflowStepTaskType {
    Review
    SendEmail
    IssueRecord
    Payment
  }

  enum WorkflowStepTaskStatus {
    Pending
    Completed
  }

  input SendEmailWorkflowStepTaskInput {
    subject: String!
    body: String!
  }

  input PaymentWorkflowStepTaskInput {
    amount: Float!
  }

  input CompleteWorkflowStepTaskInput {
    id: Int!
    sendEmailInput: SendEmailWorkflowStepTaskInput
    paymentInput: PaymentWorkflowStepTaskInput
  }

  type Mutation {
    completeWorkflowStepTask(
      input: CompleteWorkflowStepTaskInput!
    ): WorkflowStep! @skipAuth
  }
`
