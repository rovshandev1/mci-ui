import React, {useState, useCallback, useMemo, memo} from 'react';
import CheckIcon from "../../../assets/icons/check.svg?react"
import {cn} from '../../lib/utils';
import type { MciCheckProps } from '../../types/ui/check.types'

const STYLE_MAP = {
    blue: {
        border: 'border-blue-600',
        bg: 'bg-blue-600',
        hover: 'hover:border-blue-600 hover:bg-blue-100',
        focus: 'peer-focus-visible:shadow-blue',
        darkFocus: 'peer-focus-visible:shadow-[0_0_0_2px_var(--opacity-25,rgba(21,93,252,0.25))]',
        darkBorder: 'border-blue-500',
        darkBg: 'bg-blue-500',
        darkHover: 'hover:border-blue-500 hover:bg-blue-500',
    },
    yellow: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500',
        hover: 'hover:border-yellow-500 hover:bg-yellow-100',
        focus: 'peer-focus-visible:ring-2 peer-focus-visible:ring-yellow-300',
        darkFocus: 'peer-focus-visible:ring-2 peer-focus-visible:ring-yellow-300/40',
        darkBorder: 'border-yellow-500',
        darkBg: 'bg-yellow-500',
        darkHover: 'hover:border-yellow-500 hover:bg-yellow-500',
    },
    orange: {
        border: 'border-orange-600',
        bg: 'bg-orange-600',
        hover: 'hover:border-orange-600 hover:bg-orange-100',
        focus: 'peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(227,98,12,0.25)]',
        darkFocus: 'peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(227,98,12,0.25)]',
        darkBorder: 'border-orange-600',
        darkBg: 'bg-orange-600',
        darkHover: 'hover:border-orange-600 hover:bg-orange-600',
    }
} as const;

const MciCheck = memo(function MciCheck({
                                            type = 'checkbox',
                                            label,
                                            supportText,
                                            checked: controlledChecked,
                                            onChange,
                                            error,
                                            disabled = false,
                                            required = false,
                                            className,
                                            variant = 'orange',
                                            darkMode = false,
                                            name,
                                            value,
                                            ...rest
                                        }: MciCheckProps) {
    const [internalChecked, setInternalChecked] = useState(false);
    const isRadio = type === 'radio';

    const checked = useMemo(
        () => controlledChecked ?? internalChecked,
        [controlledChecked, internalChecked]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (disabled) return;
            if (controlledChecked === undefined) {
                setInternalChecked(e.target.checked);
            }
            onChange?.(e);
        },
        [controlledChecked, onChange, disabled]
    );

    const styles = useMemo(() => {
        if (disabled) {
            const base = darkMode
                ? 'border-neutral-200 bg-neutral-300/60'
                : 'border-slate-200 bg-slate-100';

            if (isRadio) {
                return {
                    container: base,
                    dot: checked
                        ? (darkMode ? 'bg-neutral-100/70' : 'bg-slate-300')
                        : 'bg-transparent',
                    check: darkMode ? 'text-neutral-100/50' : 'text-slate-400'
                };
            }

            return {
                container: base,
                dot: '',
                check: checked
                    ? (darkMode ? 'text-neutral-100/50' : 'text-slate-400')
                    : 'text-transparent'
            };
        }

        const st = STYLE_MAP[variant];

        // RADIO STYLING
        if (isRadio) {
            const container = cn(
                'border transition-all duration-200',
                checked ? (darkMode ? st.darkBorder : st.border) : darkMode ? 'border-neutral-200 bg-transparent' : 'border-slate-400',
                !checked && (darkMode ? 'hover:border-neutral-100 hover:bg-neutral-300' : st.hover),
                darkMode ? st.darkFocus : st.focus,
                checked && ''
            );

            const dot = cn(
                'transition-all duration-200 rounded-full',
                checked ? (darkMode ? 'bg-white' : st.bg) : 'bg-transparent'
            );

            return {
                container,
                dot,
                check: ''
            };
        }

        // CHECKBOX STYLING
        const container = cn(
            'border transition-all duration-200',
            checked
                ? cn(darkMode ? st.darkBg : st.bg, darkMode ? st.darkBorder : st.border)
                : darkMode
                    ? 'border-neutral-200 bg-transparent'
                    : 'border-slate-400',
            !checked && (darkMode ? 'hover:border-neutral-100 hover:bg-neutral-300' : st.hover),
            checked && darkMode && st.darkHover,
            darkMode ? st.darkFocus : st.focus
        );

        return {
            container,
            dot: '',
            check: checked ? 'text-white' : 'text-transparent'
        };
    }, [isRadio, checked, disabled, variant, darkMode]);

    const LabelSection = useMemo(() => {
        if (!label && !supportText) return null;

        return (
            <div className="flex flex-col">
                {label && (
                    <span
                        className={cn(
                            'text-base font-medium',
                            error && (darkMode ? 'text-red-500' : 'text-red-600'),
                            !error && (darkMode ? 'text-neutral-50' : 'text-slate-700'),
                            disabled && (darkMode ? 'text-neutral-50/50' : 'text-slate-400')
                        )}
                    >
                        {label}
                        {required && <span className="text-extra-small text-red-600 ml-1">*</span>}
                    </span>
                )}

                {supportText && (
                    <span
                        className={cn(
                            'text-base font-normal',
                            darkMode ? 'text-neutral-100' : 'text-slate-500',
                            disabled && (darkMode ? 'text-neutral-100/50' : 'text-slate-400')
                        )}
                    >
                        {supportText}
                    </span>
                )}
            </div>
        );
    }, [label, supportText, error, disabled, required, darkMode]);

    return (
        <div className={cn('flex flex-col items-start', className)}>
            <label
                className={cn(
                    'flex shrink-0 items-start gap-2 select-none',
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                )}
            >
                <input
                    {...rest}
                    type={type}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    required={required}
                    className="peer sr-only"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    name={name}
                    value={value}
                />

                <div
                    className={cn(
                        'relative box-border flex h-5 w-5 shrink-0 items-center justify-center',
                        isRadio ? 'w-5 h-5 rounded-full' : 'w-5 h-5 rounded',
                        styles.container
                    )}
                >
                    {isRadio ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span
                                className={cn(
                                    'w-3 h-3 rounded-full transition-all duration-200',
                                    styles.dot,
                                    checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                )}
                            />
                        </div>
                    ) : (
                        <CheckIcon
                            className={cn(
                                'w-4 h-4 stroke-[2.5px] transition-opacity duration-200',
                                styles.check,
                                checked ? 'opacity-100' : 'opacity-0'
                            )}
                        />
                    )}
                </div>

                {LabelSection}
            </label>

            {error && (
                <p
                    id={`${name}-error`}
                    className={cn(
                        'mt-1 text-extra-small',
                        darkMode ? 'text-red-500' : 'text-red-600'
                    )}
                >
                    {error}
                </p>
            )}
        </div>
    );
});

MciCheck.displayName = 'MciCheck';

export default MciCheck;
