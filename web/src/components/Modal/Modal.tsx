type Props = {
  children: React.ReactNode
}

const ModalContainer = ({ children }: Props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="fixed inset-0 bg-black/50" />
    <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-0 shadow-xl">
      {children}
    </div>
  </div>
)

export default React.memo(ModalContainer)
