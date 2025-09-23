import { useMemo, useState } from 'react'

export interface UseDisclosureReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

type Params = {
  initialOpen: boolean
}

export const useDisclosure = (params?: Params): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState(params?.initialOpen || false)

  return useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((previous) => !previous),
    }),
    [isOpen]
  )
}

export default useDisclosure
