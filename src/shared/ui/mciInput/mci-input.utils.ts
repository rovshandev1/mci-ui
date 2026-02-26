type InputSizeConfig = {
    input: string
    icon: string
    leftIcon: string
    rightIcon: string
    labelFont: string
    iconWrapper: string
}

const INPUT_SIZE_BASE: Record<'sm' | 'md' | 'base', InputSizeConfig> = {
    sm: {
        input: 'h-9 text-sm',
        icon: 'w-4 h-4',
        leftIcon: 'left-2',
        rightIcon: 'right-2',
        labelFont: 'text-sm',
        iconWrapper: 'h-4',
    },
    md: {
        input: 'h-10 text-sm',
        icon: 'w-4 h-4',
        leftIcon: 'left-2',
        rightIcon: 'right-2',
        labelFont: 'text-base',
        iconWrapper: 'h-4',
    },
    base: {
        input: 'h-12 text-base',
        icon: 'w-5 h-5',
        leftIcon: 'left-3',
        rightIcon: 'right-3',
        labelFont: 'text-base',
        iconWrapper: 'h-5',
    },
}

type InputSizeWithPadding = InputSizeConfig & { padding: string }

export function getInputSizes(hasLeftIcon: boolean, hasRightIcon: boolean) {
    const computePadding = (size: 'sm' | 'md' | 'base') => {
        if (size === 'sm') {
            if (hasLeftIcon && hasRightIcon) return 'pl-7 pr-7'
            if (hasLeftIcon) return 'pl-7 pr-2'
            if (hasRightIcon) return 'pl-2 pr-7'
            return 'px-2'
        }

        if (size === 'md') {
            if (hasLeftIcon && hasRightIcon) return 'pl-8 pr-8'
            if (hasLeftIcon) return 'pl-8 pr-2'
            if (hasRightIcon) return 'pl-2 pr-8'
            return 'px-4'
        }

        if (hasLeftIcon && hasRightIcon) return 'pl-9 pr-9'
        if (hasLeftIcon) return 'pl-9 pr-3'
        if (hasRightIcon) return 'pl-3 pr-9'
        return 'px-4'
    }

    return {
        sm: { ...INPUT_SIZE_BASE.sm, padding: computePadding('sm') } as InputSizeWithPadding,
        md: { ...INPUT_SIZE_BASE.md, padding: computePadding('md') } as InputSizeWithPadding,
        base: { ...INPUT_SIZE_BASE.base, padding: computePadding('base') } as InputSizeWithPadding,
    }
}

export function getInputStateStyles(error?: string) {
    if (error) return 'border-red-600 focus:border-red-600 shadow-red'
    return 'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600'
}

export function getInputIconColor(disabled: boolean, error: string | undefined, isFocused: boolean) {
    if (disabled) return 'text-slate-400'
    if (error) return 'text-red-600'
    if (isFocused) return 'text-black'
    return 'text-slate-400'
}
