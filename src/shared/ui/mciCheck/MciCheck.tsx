import React, {useState, useCallback, useMemo, memo} from 'react';
import CheckIcon from "../../../assets/icons/check.svg?react"
import {cn} from '../../lib/utils';
import type { MciCheckProps } from '../../types/ui/check.types'

const STYLE_MAP = {
    blue: {
        border: 'border-blue-600',
        bg: 'bg-blue-600',
        hover: 'hover:border-blue-600 hover:bg-blue-100',
        focus: 'focus:shadow-blue',
    },
    yellow: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500',
        hover: 'hover:border-yellow-500 hover:bg-yello-100',
        focus: 'focus:ring-2 focus:ring-yellow-300',
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
                                            variant = 'yellow',
                                            name,
                                            value
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
            const base = 'border-slate-200 bg-slate-100';

            if (isRadio) {
                return {
                    container: base,
                    dot: checked ? 'bg-slate-300' : 'bg-transparent',
                    check: 'text-slate-400'
                };
            }

            return {
                container: base,
                dot: '',
                check: checked ? 'text-slate-400' : 'text-transparent'
            };
        }

        const st = STYLE_MAP[variant];

        // RADIO STYLING
        if (isRadio) {
            const container = cn(
                'border transition-all duration-200',
                checked ? st.border : 'border-slate-400',
                !checked && st.hover,
                st.focus,
                checked && ''
            );

            const dot = cn(
                'transition-all duration-200 rounded-full',
                checked ? st.bg : 'bg-transparent'
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
            checked ? cn(st.bg, st.border) : 'border-slate-400',
            !checked && st.hover,
            st.focus
        );

        return {
            container,
            dot: '',
            check: checked ? 'text-white' : 'text-transparent'
        };
    }, [isRadio, checked, disabled, variant]);

    const LabelSection = useMemo(() => {
        if (!label && !supportText) return null;

        return (
            <div className="flex flex-col">
                {label && (
                    <span
                        className={cn(
                            'text-base font-medium text-slate-700',
                            error && 'text-red-600',
                            disabled && 'text-slate-400'
                        )}
                    >
                        {label}
                        {required && <span className="text-extra-small text-red-600 ml-1">*</span>}
                    </span>
                )}

                {supportText && (
                    <span
                        className={cn(
                            'text-slate-500 text-base font-normal',
                            disabled && 'text-slate-400'
                        )}
                    >
                        {supportText}
                    </span>
                )}
            </div>
        );
    }, [label, supportText, error, disabled, required]);

    return (
        <div className={cn('flex items-start', className)}>
            <label
                className={cn(
                    'flex items-start gap-2 select-none',
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                )}
            >
                <input
                    type={type}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    required={required}
                    className="sr-only"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    name={name}
                    value={value}
                />

                <div
                    className={cn(
                        'relative flex items-center justify-center',
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
                <p id={`${name}-error`} className="mt-1 text-extra-small text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
});

MciCheck.displayName = 'MciCheck';

export default MciCheck;
