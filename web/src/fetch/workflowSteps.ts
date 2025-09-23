import { useMutation } from '@redwoodjs/web'

const CompleteWorkflowStepDocument = gql`
  mutation CompleteWorkflowStep($input: CompleteWorkflowStepInput!) {
    completeWorkflowStep(input: $input) {
      id
    }
  }
`

export const useCompleteWorkflowStep = () => {
  return useMutation(CompleteWorkflowStepDocument)
}
