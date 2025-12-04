import { createContext, useContext, useState, ReactNode } from 'react'

export interface ConfirmOptions {
  title: string
  message: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => void
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export const useConfirm = () => {
  const context = useContext(ConfirmContext)
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const confirm = (confirmOptions: ConfirmOptions) => {
    setOptions(confirmOptions)
    setIsOpen(true)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await options?.onConfirm()
    } catch (error) {
      console.error('Error in confirm:', error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
      setOptions(null)
    }
  }

  const handleCancel = () => {
    options?.onCancel?.()
    setIsOpen(false)
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <h2 style={{
              margin: '0 0 12px 0',
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f2937'
            }}>
              {options.title}
            </h2>
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.5'
            }}>
              {options.message}
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                {options.cancelText || 'Batal'}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Memproses...' : (options.confirmText || 'Hapus')}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </ConfirmContext.Provider>
  )
}
