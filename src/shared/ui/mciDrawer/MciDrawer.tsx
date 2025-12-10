import React, {useEffect, useRef} from 'react'
import {cn, useClickOutside, useEscapeKey} from '../../lib/utils'
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
                                  }: DrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)

    const {handleEscape} = useEscapeKey(() => {
        if (closeOnEscape && isOpen) {
            onClose()
        }
    })

    const {handleClick} = useClickOutside(drawerRef, () => {
        if (closeOnOverlayClick && isOpen) {
            onClose()
        }
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
            document.addEventListener('keydown', handleEscape)
            document.addEventListener('mousedown', handleClick)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.removeEventListener('mousedown', handleClick)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, handleEscape, handleClick])

    const positionClasses = {
        left: 'top-6 left-6 bottom-6 max-w-[572px]',
        right: 'top-6 right-6 bottom-6 max-w-[572px]',
    }

    const transformClasses = {
        right: isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+24px)]',
        left: isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+24px)]',
    }

    return (
        <>
            <div
                className={cn(
                    'fixed inset-0 z-50 bg-black/40 transition-opacity duration-300',
                    isOpen ? 'cursor-pointer' : 'pointer-events-none',
                    isOpen ? 'opacity-100' : 'opacity-0'
                )}
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            <div
                ref={drawerRef}
                tabIndex={-1}
                className={cn(
                    'fixed flex flex-col z-50 w-full rounded-2xl bg-white transition-transform duration-300 ease-in-out outline-none',
                    positionClasses[position],
                    transformClasses[position],
                    drawerClassName
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'mciDrawer-title' : undefined}
            >
                {(title || showCloseButton || description) && (
                    <div
                        className={cn(
                            'flex items-start justify-between border-b border-slate-200 p-6  flex-shrink-0',
                        )}
                    >
                        {title && (
                            <div className='block'>
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
                                onClick={onClose}
                                className="bg-slate-100 rounded-xl w-12 h-12 hover:cursor-pointer text-black transition flex items-center justify-center group"
                            >
                                <CloseIcon
                                    className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180"/>
                            </button>
                        )}
                    </div>
                )}

                {children && (
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 p-6">
                        {children}
                    </div>
                )}

                {footer && (
                    <div className="flex items-center justify-end border-t border-slate-200 p-6">
                        {footer}
                    </div>
                )}
            </div>
        </>
    )
}
