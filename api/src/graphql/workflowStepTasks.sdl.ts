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
  }

  enum WorkflowStepTaskStatus {
    Pending
    Completed
  }

  input SendEmailWorkflowStepTaskInput {
    subject: String!
    body: String!
  }

  input CompleteWorkflowStepTaskInput {
    id: Int!
    sendEmailInput: SendEmailWorkflowStepTaskInput
  }

  type Mutation {
    completeWorkflowStepTask(
      input: CompleteWorkflowStepTaskInput!
    ): WorkflowStep! @skipAuth
  }
`
