export const schema = gql`
  type Record {
    id: Int!
    status: RecordStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
    workflowSteps: [WorkflowStep!]
  }

  enum RecordStatus {
    Submitted
    InProgress
    Rejected
    Completed
    Issued
  }

  input CreateWorkflowStepInput {
    type: WorkflowStepType!
  }

  input CreateRecordInput {
    workflowSteps: [CreateWorkflowStepInput!]!
  }

  type Mutation {
    createRecord(input: CreateRecordInput!): Record! @skipAuth
  }

  type Query {
    getRecords: [Record!]! @skipAuth
    getRecord(id: Int!): Record! @skipAuth
  }
`
