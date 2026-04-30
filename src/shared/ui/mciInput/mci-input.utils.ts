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

export function getInputStateStyles(error: string | undefined, darkMode: boolean) {
    if (darkMode) {
        if (error) {
            return 'border-red-500 hover:border-red-500 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(231,0,11,0.25)]'
        }
        return 'border-neutral-200 hover:border-neutral-100 focus:border-blue-500 focus:shadow-[0_0_0_2px_var(--opacity-25,rgba(21,93,252,0.25))]'
    }

    if (error) return 'border-red-600 focus:border-red-600 shadow-red'
    return 'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600'
}

export function getInputIconColor(
    disabled: boolean,
    error: string | undefined,
    isFocused: boolean,
    darkMode: boolean
) {
    if (darkMode) {
        if (disabled) return 'text-neutral-100/50'
        if (error) return 'text-red-500'
        if (isFocused) return 'text-white'
        return 'text-neutral-100'
    }

    if (disabled) return 'text-slate-400'
    if (error) return 'text-red-600'
    if (isFocused) return 'text-black'
    return 'text-slate-400'
}

export function getInputRightPaddingClass(size: 'sm' | 'md' | 'base', rightControlsCount: number) {
    if (rightControlsCount <= 0) return ''

    if (size === 'sm') {
        if (rightControlsCount >= 3) return 'pr-14'
        if (rightControlsCount === 2) return 'pr-11'
        return 'pr-7'
    }

    if (size === 'md') {
        if (rightControlsCount >= 3) return 'pr-16'
        if (rightControlsCount === 2) return 'pr-12'
        return 'pr-8'
    }

    if (rightControlsCount >= 3) return 'pr-20'
    if (rightControlsCount === 2) return 'pr-16'
    return 'pr-10'
}
