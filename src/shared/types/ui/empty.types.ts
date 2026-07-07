import type {ReactNode} from 'react'

export type MciEmptyLocale = 'uz' | 'ru'

export interface MciEmptyProps {
    className?: string
    image?: ReactNode
    imageClassName?: string
    imageSrc?: string
    locale?: MciEmptyLocale
    title?: string
    description?: string
}
