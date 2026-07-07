import emptyImage from '../../../assets/png/empty.png'
import {cn} from '../../lib/utils'
import type {MciEmptyLocale, MciEmptyProps} from '../../types/ui/empty.types'

const EMPTY_TRANSLATIONS: Record<MciEmptyLocale, { title: string; description: string }> = {
    uz: {
        title: "Ma'lumot topilmadi",
        description:
            "Hozircha bu bo'limda ma'lumot mavjud emas.\nQidiruv so'zini o'zgartiring yoki yangi ma'lumot qo'shing",
    },
    ru: {
        title: 'Данные не найдены',
        description:
            'В этом разделе пока нет данных.\nИзмените поисковый запрос или добавьте новые данные',
    },
}

export default function MciEmpty({
                                     className,
                                     imageClassName,
                                     locale = 'uz',
                                     title,
                                     description,
                                 }: MciEmptyProps) {
    const t = EMPTY_TRANSLATIONS[locale]
    const resolvedDescription = description ?? t.description

    return (
        <div className={cn('flex flex-col items-center justify-center text-center', className)}>
            <img
                src={emptyImage}
                alt=""
                className={cn('mb-4 h-auto w-40 shrink-0', imageClassName)}
            />
            <h4 className="text-h4 font-semibold text-black">{title ?? t.title}</h4>

            {resolvedDescription && (
                <p className="mt-2 whitespace-pre-line text-base text-slate-700">
                    {resolvedDescription}
                </p>
            )}
        </div>
    )
}
