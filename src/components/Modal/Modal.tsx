import type { ReactNode } from 'react'

type ModalProps = {
  children: ReactNode
  open: boolean
}

export function Modal({ children, open }: ModalProps) {
  if (!open) {
    return null
  }

  return <div className="modal">{children}</div>
}
