import type { ReactNode } from 'react'

type Clamp2Props = {
    children: ReactNode
    title?: string
}

export default function MciTableClamp2({ children, title }: Clamp2Props) {
    const textTitle = typeof children === 'string' ? children : undefined

    return (
        <div className="min-w-0">
            <div className="clamp-2 break-words" title={title ?? textTitle}>
                {children}
            </div>
        </div>
    )
}
