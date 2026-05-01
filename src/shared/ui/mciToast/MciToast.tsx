import type { ReactNode } from 'react'
import React, { useEffect, useState } from 'react'
import { createRoot, Root } from 'react-dom/client'
import CloseIcon from '../../../assets/icons/close.svg?react'
import { cn } from '../../lib/utils'
import type { ToastProps } from '../../types/ui/toast.types'
import { getOrCreateToastContainer, TOAST_ICONS, TOAST_STYLES } from './mci-toast.utils'

const toastContainer = getOrCreateToastContainer()

let root: Root | null = null
let toastCounter = 0
const activeToasts: { id: number; element: React.ReactElement }[] = []

const renderToasts = () => {
   if (!root) {
      root = createRoot(toastContainer)!
   }

   root.render(
      <div className="flex flex-col gap-3">
         {activeToasts.map(({ id, element }) => (
            <div key={id} className="pointer-events-auto">
               {element}
            </div>
         ))}
      </div>
   )
}

function ToastItem({
   title,
   description,
   type = 'info',
   duration = 3000,
   action,
   darkMode = false,
   onClose,
}: ToastProps) {
   const [progress, setProgress] = useState(100)

   useEffect(() => {
      if (duration === Infinity) {
         setProgress(100)
         return
      }

      let start: number | null = null
      const animate = (timestamp: number) => {
         if (!start) start = timestamp
         const elapsed = timestamp - start
         const remaining = Math.max(0, ((duration - elapsed) / duration) * 100)

         setProgress(remaining)

         if (remaining > 0) {
            requestAnimationFrame(animate)
         } else {
            onClose?.()
         }
      }

      const rafId = requestAnimationFrame(animate)

      return () => cancelAnimationFrame(rafId)
   }, [duration, onClose])

   return (
      <div
         className={cn(
            'relative w-[300px] max-w-full overflow-hidden rounded-lg shadow-md',
            'animate-in fade-in slide-in-from-top-2 duration-300',
            darkMode ? TOAST_STYLES.bgDark[type] : TOAST_STYLES.bg[type]
         )}
      >
         <div
            className={cn(
               'absolute bottom-0 left-0 h-1',
               darkMode ? TOAST_STYLES.lineDark[type] : TOAST_STYLES.line[type]
            )}
            style={{
               width: `${progress}%`,
               transition: 'none',
            }}
         />

         <div className="p-4">
            <div className="flex items-start gap-2">
               <div
                  className={cn(
                     'shrink-0',
                     darkMode ? TOAST_STYLES.textDark[type] : TOAST_STYLES.text[type]
                  )}
               >
                  {TOAST_ICONS[type]}
               </div>

               <div className="min-w-0 flex-1">
                  <h4
                     className={cn(
                        'mb-1 text-base font-medium',
                        darkMode && TOAST_STYLES.textDark[type]
                     )}
                  >
                     {title}
                  </h4>

                  {description && (
                     <p className={cn('text-sm', darkMode ? 'text-slate-400' : 'text-[#82828C]')}>
                        {description}
                     </p>
                  )}

                  {action && (
                     <div className="mt-3">
                        <div
                           className={cn(
                              'text-sm font-medium underline',
                              darkMode ? TOAST_STYLES.actionDark[type] : TOAST_STYLES.action[type]
                           )}
                        >
                           {action}
                        </div>
                     </div>
                  )}
               </div>

               <button
                  onClick={onClose}
                  className="shrink-0 cursor-pointer rounded-full transition active:animate-spin"
               >
                  <CloseIcon
                     className={cn('h-6 w-6', darkMode ? 'text-slate-400' : 'text-slate-base')}
                  />
               </button>
            </div>
         </div>
      </div>
   )
}

// Global
const showToast = (props: Omit<ToastProps, 'onClose'>) => {
   const id = toastCounter++

   const handleClose = () => {
      const idx = activeToasts.findIndex((t) => t?.id === id)
      if (idx !== -1) {
         activeToasts.splice(idx, 1)
         renderToasts()
      }
   }

   const element = <ToastItem {...props} onClose={handleClose} />
   activeToasts.push({ id, element })
   renderToasts()

   if (props.duration !== Infinity) {
      setTimeout(handleClose, (props.duration || 3000) + 300)
   }

   return { close: handleClose }
}

const MciToast = {
   success: (title: string | Omit<ToastProps, 'type'>, desc?: string, action?: ReactNode) =>
      showToast(
         typeof title === 'string'
            ? { title, description: desc, type: 'success', action }
            : {
                 ...title,
                 type: 'success',
              }
      ),

   error: (title: string | Omit<ToastProps, 'type'>, desc?: string, action?: ReactNode) =>
      showToast(
         typeof title === 'string'
            ? { title, description: desc, type: 'error', action }
            : {
                 ...title,
                 type: 'error',
              }
      ),

   warning: (title: string | Omit<ToastProps, 'type'>, desc?: string, action?: ReactNode) =>
      showToast(
         typeof title === 'string'
            ? { title, description: desc, type: 'warning', action }
            : {
                 ...title,
                 type: 'warning',
              }
      ),

   info: (title: string | Omit<ToastProps, 'type'>, desc?: string, action?: ReactNode) =>
      showToast(
         typeof title === 'string'
            ? { title, description: desc, type: 'info', action }
            : {
                 ...title,
                 type: 'info',
              }
      ),

   loading: (title: string | Omit<ToastProps, 'type'>, desc?: string) =>
      showToast(
         typeof title === 'string'
            ? {
                 title,
                 description: desc,
                 type: 'loading',
                 duration: Infinity,
              }
            : { ...title, type: 'loading', duration: Infinity }
      ),
}

export default MciToast
