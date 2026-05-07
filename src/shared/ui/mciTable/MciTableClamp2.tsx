import type { ReactNode } from 'react'

type Clamp2Props = {
    children: ReactNode
    title?: string
}

export default function MciTableClamp2({ children, title }: Clamp2Props) {
    const textTitle = typeof children === 'string' ? children : undefined

    if (typeof children !== 'string' && typeof children !== 'number') {
        return (
            <div className="-m-1 inline-flex w-fit max-w-full items-start overflow-visible p-1 align-top">
                {children}
            </div>
        )
    }

    return (
        <div className="min-w-0">
            <div className="clamp-2 break-words" title={title ?? textTitle}>
                {children}
            </div>
        </div>
    )
}
