import { GetRecordsQuery, GetRecord, GetRecordVariables } from 'types/graphql'

import { useQuery, useMutation } from '@redwoodjs/web'
import 'src/fragments/fragments'

export const GetRecordsQueryDocument = gql`
  query GetRecordsQuery {
    getRecords {
      ...RecordFragment
    }
  }
`

export const useGetRecords = () => {
  return useQuery<GetRecordsQuery>(GetRecordsQueryDocument)
}

export const GetRecordQueryDocument = gql`
  query GetRecord($id: Int!) {
    getRecord(id: $id) {
      ...RecordFragment
    }
  }
`

export const useGetRecord = (variables: GetRecordVariables) => {
  return useQuery<GetRecord, GetRecordVariables>(GetRecordQueryDocument, {
    variables,
  })
}

export const CreateRecordDocument = gql`
  mutation CreateRecord($input: CreateRecordInput!) {
    createRecord(input: $input) {
      id
    }
  }
`

export const useCreateRecord = () => useMutation(CreateRecordDocument)
