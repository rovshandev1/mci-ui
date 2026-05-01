import React, {useEffect, useRef, useCallback, useMemo} from 'react'
import {cn, useClickOutside, useEscapeKey} from '../../lib/utils'
import CloseIcon from '../../../assets/icons/close.svg?react'
import type {DrawerProps} from '../../types/ui/drawer.types'

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
                                      contentClassName,
                                      closeOnOverlayClick = true,
                                      closeOnEscape = true,
                                      width = 572,
                                      darkMode = false,
                                  }: DrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)

    const handleClose = useCallback(() => onClose(), [onClose])

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
        if (isOpen) document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const drawerStyle = useMemo<React.CSSProperties & Record<'--drawer-w', string>>(
        () => ({
            '--drawer-w': typeof width === 'number' ? `${width}px` : width,
            transform: isOpen
                ? 'translateX(0)'
                : position === 'right'
                    ? 'translateX(calc(100% + 48px))'
                    : 'translateX(calc(-100% - 48px))',
        }),
        [isOpen, width, position]
    )

    const hasHeader = Boolean(title || description || showCloseButton)

    const mobilePos =
        position === 'right'
            ? 'top-0 bottom-0 right-0 left-3 rounded-l-3xl rounded-r-none'
            : 'top-0 bottom-0 left-0 right-3 rounded-r-3xl rounded-l-none'

    const desktopPos =
        position === 'right'
            ? 'sm:top-6 sm:bottom-6 sm:right-6 sm:left-auto'
            : 'sm:top-6 sm:bottom-6 sm:left-6 sm:right-auto'

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
                    `fixed z-50 flex flex-col ${darkMode ? 'bg-black' : 'bg-white'}  outline-none min-h-0`,
                    'transition-[transform,opacity,visibility] duration-300 ease-in-out',
                    isOpen ? 'opacity-100 visible pointer-events-auto shadow-2xl' : 'opacity-0 invisible pointer-events-none shadow-none',

                    mobilePos,
                    'h-[100dvh]',
                    'pb-[env(safe-area-inset-bottom)]',

                    desktopPos,
                    'sm:h-auto sm:rounded-2xl sm:pb-0',
                    'sm:w-[var(--drawer-w)]',

                    drawerClassName
                )}
                role="dialog"
                aria-modal="true"
                aria-hidden={!isOpen}
                aria-labelledby={title ? 'drawer-title' : undefined}
            >
                {hasHeader && (
                    <div
                        className={`flex items-start justify-between border-b ${darkMode ? 'border-neutral-200' : 'border-slate-200'}  shrink-0 px-4 py-4 sm:p-6`}>
                        {(title || description) && (
                            <div className="block pr-3">
                                {title && (
                                    <h2
                                        id="drawer-title"
                                        className={`font-semibold ${darkMode ? 'text-slate-50' : 'text-black'} text-xl leading-tight sm:text-h3`}
                                    >
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className={`text-sm sm:text-base ${darkMode ? 'text-neutral-50' : 'text-slate-base'} font-normal mt-2`}>
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={handleClose}
                                className={`${darkMode ? 'bg-neutral-300 text-slate-50' : 'bg-slate-100 text-black'} rounded-xl w-11 h-11 sm:w-12 sm:h-12 hover:cursor-pointer transition flex items-center justify-center group active:scale-95`}
                            >
                                <CloseIcon
                                    className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:rotate-180"/>
                            </button>
                        )}
                    </div>
                )}

                <div
                    className={cn(
                        'flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 px-4 py-4 sm:p-6',
                        contentClassName
                    )}
                >
                    {children}
                </div>

                {footer && (
                    <div
                        className={`shrink-0 flex items-center justify-end border-t ${darkMode ? 'border-neutral-200' : 'border-slate-200'} px-4 py-4 sm:p-6 gap-3 [&>*]:w-fit [&>*]:shrink-0 [&>*]:whitespace-nowrap`}>
                        {footer}
                    </div>
                )}
            </div>
        </>
    )
}
