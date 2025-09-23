import { useCallback } from 'react'

import { navigate } from '@redwoodjs/router'

import CreateRecordModal from 'src/components/CreateRecordModal/CreateRecordModal'
import RecordStatusPill from 'src/components/RecordStatusPill/RecordStatusPill'
import { useGetRecords } from 'src/fetch/records'
import useDisclosure from 'src/hooks/use-disclosure'
import { getCurrentWorkflowStep } from 'src/utils/workflow-step-utils'

const formatDateTime = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

//

const RecordsPage = () => {
  const { data, loading, error } = useGetRecords()
  const {
    isOpen: isCreateRecordModalOpen,
    open: openCreateRecordModal,
    close: closeCreateRecordModal,
  } = useDisclosure()

  const onCreateRecordClick = useCallback(() => {
    openCreateRecordModal()
  }, [openCreateRecordModal])

  const onRecordClick = useCallback((recordId: number) => {
    navigate(`/records/${recordId}`)
  }, [])

  const onRecordCreated = useCallback(
    (recordId: number) => {
      onRecordClick(recordId)
    },
    [onRecordClick]
  )

  if (loading) {
    return (
      <div className="mx-auto mt-8 max-w-6xl px-4 text-slate-200">
        Loading records…
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto mt-8 max-w-6xl px-4 text-rose-300">
        Error loading records
      </div>
    )
  }

  const records = data?.getRecords ?? []

  return (
    <>
      <div className="mx-auto mt-8 max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">
            Workflow Management
          </h1>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 active:bg-blue-700"
            onClick={onCreateRecordClick}
          >
            + Create Record
          </button>
        </div>

        <div className="overflow-hidden rounded-md border bg-white">
          <div className="px-4 py-3 text-lg text-slate-800">
            Records ({records.length})
          </div>
          <div className="w-full overflow-auto rounded-md p-4">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs text-slate-700">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">CURRENT STEP</th>
                  <th className="px-4 py-3">CREATED DATE</th>
                  <th className="px-4 py-3">UPDATED DATE</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-slate-300 text-slate-700 hover:bg-slate-50"
                    onClick={() => onRecordClick(r.id)}
                  >
                    <td className="px-4 py-3 tabular-nums">{r.id}</td>
                    <td className="px-4 py-3">
                      <RecordStatusPill status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      {getCurrentWorkflowStep(r.workflowSteps)?.type ?? '-'}
                    </td>
                    <td className="px-4 py-3">{formatDateTime(r.createdAt)}</td>
                    <td className="px-4 py-3">{formatDateTime(r.updatedAt)}</td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr className="border-t border-slate-300">
                    <td
                      className="px-4 py-6 text-center text-slate-400"
                      colSpan={5}
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isCreateRecordModalOpen && (
        <CreateRecordModal
          onClose={closeCreateRecordModal}
          onCreated={onRecordCreated}
        />
      )}
    </>
  )
}

export default RecordsPage
