import { useEffect, useRef } from 'react'

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
  const queryResult = useQuery<GetRecordsQuery>(GetRecordsQueryDocument, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  })
  const retryCountRef = useRef(0)
  const retryTimeoutRef = useRef<number | null>(null)

  const { error, refetch, data } = queryResult

  useEffect(() => {
    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }

    // Reset retry count on successful data fetch
    if (data && retryCountRef.current > 0) {
      retryCountRef.current = 0
      return
    }

    // Only retry on network errors (connection issues, server not ready, etc.)
    if (error && retryCountRef.current < 5) {
      const isNetworkError =
        error.networkError ||
        error.message?.includes('fetch') ||
        error.message?.includes('Network') ||
        error.message?.includes('Failed to fetch')

      if (isNetworkError) {
        // Exponential backoff: 500ms, 1s, 2s, 4s, 8s
        const delay = Math.min(500 * Math.pow(2, retryCountRef.current), 8000)
        retryCountRef.current += 1

        retryTimeoutRef.current = setTimeout(() => {
          refetch().catch(() => {
            // Ignore errors from refetch, they'll be handled by the next effect run
          })
        }, delay)
      }
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [error, refetch, data])

  return queryResult
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
