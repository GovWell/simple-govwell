import { useCallback, useMemo } from 'react'

import { navigate, routes, useParams } from '@redwoodjs/router'

import RecordDetailsSection from 'src/components/RecordDetailsSection/RecordDetailsSection'
import WorkflowStepsSection from 'src/components/WorkflowStepsSection/WorkflowStepsSection'
import WorkflowStepWorkspaceSection from 'src/components/WorkflowStepWorkspaceSection/WorkflowStepWorkspaceSection'
import { useGetRecord } from 'src/fetch/records'

const RecordDetailsPage = () => {
  const { recordId } = useParams()
  const id = useMemo(() => Number(recordId), [recordId])
  const { data, loading, error, refetch } = useGetRecord({ id })

  const onBackClick = useCallback(() => {
    navigate(routes.records())
  }, [])

  if (loading) {
    return (
      <div className="mx-auto mt-8 max-w-6xl px-4 text-slate-200">
        Loading record…
      </div>
    )
  }

  if (error || !data?.getRecord) {
    return (
      <div className="mx-auto mt-8 max-w-6xl px-4 text-rose-300">
        Unable to load record.
      </div>
    )
  }

  const record = data.getRecord

  return (
    <div className="mx-auto mt-8 max-w-6xl px-4">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBackClick}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M12.707 15.707a1 1 0 01-1.414 0L6.586 11l4.707-4.707a1 1 0 011.414 1.414L9.414 11l3.293 3.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-800">Record Details</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <RecordDetailsSection record={record} />
          <WorkflowStepWorkspaceSection record={record} refetch={refetch} />
        </div>
        <div className="lg:col-span-1">
          <WorkflowStepsSection record={record} />
        </div>
      </div>
    </div>
  )
}

export default RecordDetailsPage
