import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { cn, useClickOutside, useEscapeKey } from '../../lib/utils'
import CloseIcon from '../../../assets/icons/close.svg?react'

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    position?: 'left' | 'right'
    children?: React.ReactNode
    footer?: React.ReactNode
    title?: string
    description?: string
    showCloseButton?: boolean
    drawerClassName?: string
    closeOnOverlayClick?: boolean
    closeOnEscape?: boolean
    width?: string | number
}

export default function MciDrawer({
                                      isOpen,
                                      onClose,
                                      position = 'right',
                                      children,
                                      footer,
                                      title,
                                      description,
                                      showCloseButton = true,
                                      drawerClassName,
                                      closeOnOverlayClick = true,
                                      closeOnEscape = true,
                                      width = 572,
                                  }: DrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)

    const handleClose = useCallback(() => {
        onClose()
    }, [onClose])

    useEscapeKey(() => {
        if (closeOnEscape && isOpen) handleClose()
    })

    useClickOutside(drawerRef, () => {
        if (closeOnOverlayClick && isOpen) handleClose()
    })

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement
            drawerRef.current?.focus()
        } else {
            previousActiveElement.current?.focus()
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const drawerStyle = useMemo(() => ({
        width: typeof width === 'number' ? `${width}px` : width,
        transform: isOpen
            ? 'translateX(0)'
            : position === 'right'
                ? 'translateX(calc(100% + 48px))'
                : 'translateX(calc(-100% - 48px))'
    }), [isOpen, width, position])

    const positionClasses = {
        left: 'top-6 left-6 bottom-6',
        right: 'top-6 right-6 bottom-6',
    }

    return (
        <>
            <div
                className={cn(
                    'fixed inset-0 z-50 bg-black/40 transition-opacity duration-300',
                    isOpen ? 'opacity-100 visible cursor-pointer' : 'opacity-0 invisible pointer-events-none'
                )}
                onClick={closeOnOverlayClick ? handleClose : undefined}
                aria-hidden="true"
            />

            <div
                ref={drawerRef}
                tabIndex={-1}
                style={drawerStyle}
                className={cn(
                    'fixed flex flex-col z-50 w-full rounded-2xl bg-white transition-transform duration-300 ease-in-out outline-none',
                    positionClasses[position],
                    drawerClassName
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'drawer-title' : undefined}
            >
                {(title || showCloseButton || description) && (
                    <div className="flex items-start justify-between border-b border-slate-200 p-6 shrink-0">
                        {title && (
                            <div className="block">
                                <h2 id="drawer-title" className="text-h3 font-semibold text-black">
                                    {title}
                                </h2>
                                {description && (
                                    <p className="text-base text-slate-base font-normal mt-2">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={handleClose}
                                className="bg-slate-100 rounded-xl w-12 h-12 hover:cursor-pointer text-black transition flex items-center justify-center group active:scale-95"
                            >
                                <CloseIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180" />
                            </button>
                        )}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 p-6">
                    {children}
                </div>

                {footer && (
                    <div className="flex items-center justify-end border-t border-slate-200 p-6 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </>
    )
}