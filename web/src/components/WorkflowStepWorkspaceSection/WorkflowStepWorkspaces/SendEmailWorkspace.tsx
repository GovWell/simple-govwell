import { useCallback, useMemo, useState } from 'react'

import { CompleteWorkflowStepInput } from 'types/graphql'

type Props = {
  workflowStepId: number
  onWorkflowStepCompleted: (input: CompleteWorkflowStepInput) => void
  loading?: boolean
}

export default function SendEmailWorkspace({
  workflowStepId,
  onWorkflowStepCompleted,
  loading,
}: Props) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const isDisabled = useMemo(() => {
    return loading || subject.trim().length === 0 || body.trim().length === 0
  }, [loading, subject, body])

  const handleClick = useCallback(() => {
    if (isDisabled) {
      return
    }

    onWorkflowStepCompleted({
      id: workflowStepId,
      sendEmailInput: { subject, body },
    })
  }, [isDisabled, onWorkflowStepCompleted, workflowStepId, subject, body])

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="send-email-subject"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Subject
        </label>
        <input
          type="text"
          className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring"
          id="send-email-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />
      </div>

      <div>
        <label
          htmlFor="send-email-body"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Body
        </label>
        <textarea
          className="h-32 w-full rounded border px-3 py-2 text-sm outline-none focus:ring"
          id="send-email-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your email body"
        />
      </div>

      <button
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        disabled={isDisabled}
        onClick={handleClick}
      >
        Submit email
      </button>
    </div>
  )
}
