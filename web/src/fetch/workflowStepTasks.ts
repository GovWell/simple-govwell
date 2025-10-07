import { useMutation } from '@redwoodjs/web'

const CompleteWorkflowStepTaskDocument = gql`
  mutation CompleteWorkflowStepTask($input: CompleteWorkflowStepTaskInput!) {
    completeWorkflowStepTask(input: $input) {
      id
    }
  }
`

export const useCompleteWorkflowStepTask = () => {
  return useMutation(CompleteWorkflowStepTaskDocument)
}
