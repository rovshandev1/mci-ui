import CloseIcon from '../../../assets/icons/close.svg?react'
import React, {useEffect, useRef} from 'react'
import {cn, useClickOutside, useEscapeKey} from '../../lib/utils'

interface ModalProps {
    show: boolean
    setShow: (show: boolean) => void
    title?: string
    description?: string
    Header?: React.ReactNode
    Body?: React.ReactNode
    footer?: React.ReactNode
    handleClickOutside?: boolean
}

export default function MciModal({
                                     show,
                                     setShow,
                                     title,
                                     description,
                                     Header,
                                     Body,
                                     footer,
                                     handleClickOutside = false,
                                 }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null!)

    const {handleEscape} = useEscapeKey(() => setShow(false))
    useEffect(() => {
        if (show) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => document.removeEventListener('keydown', handleEscape)
    }, [show, handleEscape])

    const {handleClick} = useClickOutside(modalRef, () => {
        if (handleClickOutside) {
            setShow(false)
        }
    })

    useEffect(() => {
        if (show && handleClickOutside) {
            document.addEventListener('mousedown', handleClick)
        }
        return () => document.removeEventListener('mousedown', handleClick)
    }, [show, handleClick, handleClickOutside])

    return (
        <div
            className={cn(
                'bg-black/40 fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ease-in-out',
                show ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
        >
            <div
                ref={modalRef}
                className={cn(
                    'relative bg-white w-full max-w-[720px] rounded-2xl',
                    'transform transition-all duration-500 ease-out',
                    show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                )}
            >
                {(Header || title || description) && (
                    <div className="border-b border-slate-200 flex items-start justify-between p-6 mb-4">
                        {Header || (
                            <div className='block'>
                                <h2 className="text-h3 font-semibold text-black">{title}</h2>

                                {description && (
                                    <p className="text-base text-slate-base font-normal mt-2">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => setShow(false)}
                            className="bg-slate-100 rounded-xl w-12 h-12 hover:cursor-pointer text-black transition flex items-center justify-center group"
                        >
                            <CloseIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180"/>
                        </button>
                    </div>
                )}

                {Body && (
                    <div className="scrollbar-thin scrollbar-thumb-slate-200 max-h-96 px-6 overflow-y-auto mb-2">
                        {Body}
                    </div>
                )}

                {footer && (
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}
