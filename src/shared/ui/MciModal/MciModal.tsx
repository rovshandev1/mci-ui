import CloseIcon from '../../../assets/icons/close.svg?react'
import { useCallback, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'
import type { ModalProps } from '../../types/ui/modal.types'

export default function MciModal({
    show,
    setShow,
    title,
    description,
    Header,
    Body,
    footer,
    handleClickOutside = false,
    showCloseIcon = true,
    showHeader = true,
    darkMode = false,
    overlayClassName,
    containerClassName,
    bodyClassName,
    footerClassName,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null!)

    const handleClose = useCallback(() => setShow(false), [setShow])

    useEffect(() => {
        if (!show) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [show, handleClose])

    useEffect(() => {
        if (show) document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'unset' }
    }, [show])

    const shouldRenderHeader = showHeader && Boolean(Header || title || description)

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex justify-center bg-black/40',
                'items-end sm:items-center',
                'transition-opacity duration-300',
                show ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
                handleClickOutside && 'cursor-pointer',
                overlayClassName
            )}
            onClick={handleClickOutside ? handleClose : undefined}
            aria-hidden="true"
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-hidden={!show}
                aria-labelledby={title ? 'modal-title' : undefined}
                className={cn(
                    'relative flex flex-col w-full outline-none',
                    'cursor-default',
                    darkMode ? 'bg-black' : 'bg-white',
                    'rounded-t-2xl sm:rounded-2xl',
                    'sm:max-w-[720px]',
                    'transition-[transform,opacity] duration-300 ease-out',
                    show ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                    containerClassName
                )}
            >
                {shouldRenderHeader && (
                    <div
                        className={cn(
                            'flex items-start justify-between border-b shrink-0 p-4 sm:p-6',
                            darkMode ? 'border-neutral-700' : 'border-slate-200'
                        )}
                    >
                        {Header || (
                            <div className="block pr-3">
                                {title && (
                                    <h2
                                        id="modal-title"
                                        className={cn(
                                            'text-h3 font-semibold',
                                            darkMode ? 'text-slate-50' : 'text-black'
                                        )}
                                    >
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p
                                        className={cn(
                                            'text-base font-normal mt-2',
                                            darkMode ? 'text-neutral-400' : 'text-slate-base'
                                        )}
                                    >
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}

                        {showCloseIcon && (
                            <button
                                type="button"
                                onClick={handleClose}
                                aria-label="Close modal"
                                className={cn(
                                    'rounded-xl w-11 h-11 sm:w-12 sm:h-12',
                                    'flex items-center justify-center shrink-0',
                                    'cursor-pointer transition group active:scale-95',
                                    darkMode ? 'bg-neutral-800 text-slate-50' : 'bg-slate-100 text-black'
                                )}
                            >
                                <CloseIcon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:rotate-180" />
                            </button>
                        )}
                    </div>
                )}

                {Body && (
                    <div
                        className={cn(
                            'flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200',
                            'max-h-[70dvh] sm:max-h-96',
                            'p-4 sm:p-6',
                            bodyClassName
                        )}
                    >
                        {Body}
                    </div>
                )}

                {footer && (
                    <div
                        className={cn(
                            'shrink-0 flex items-center justify-end gap-3 border-t',
                            darkMode ? 'border-neutral-700' : 'border-slate-200',
                            'p-4 sm:p-6',
                            footerClassName
                        )}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}
