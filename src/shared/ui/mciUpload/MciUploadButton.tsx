import { Upload } from '@solar-icons/react'
import React from 'react'
import { cn } from '../../lib/utils'
import type { MciUploadButtonProps } from '../../types/ui/upload.types'
import { MciUploadFileList } from './MciUploadFileList'
import { useMciUpload } from './useMciUpload'

const MciUploadButton: React.FC<MciUploadButtonProps> = ({
    multiple = false,
    accept = '*/*',
    maxSize = 10,
    maxFiles = 5,
    disabled = false,
    label,
    required = false,
    error,
    className,
    onFilesChange,
    onUpload,
    defaultValue,
    value,
    onValueChange,
    showPreview = true,
    locale = 'uz',
    showFileTypeIcon = true,
    variant = 'orange',
    customValidator,
    darkMode = false,
    buttonText,
    fullWidth = false,
}) => {
    const upload = useMciUpload({
        multiple,
        accept,
        maxSize,
        maxFiles,
        disabled,
        defaultValue,
        value,
        onFilesChange,
        onValueChange,
        onUpload,
        locale,
        variant,
        darkMode,
        customValidator,
    })

    const {
        files,
        isUploading,
        fileInputRef,
        t,
        theme,
        secureAccept,
        handleFileInput,
        handleRemoveFile,
        handleClearAll,
        handleUploadClick,
        openPreview,
    } = upload

    const triggerLabel = buttonText ?? t.uploadFile

    return (
        <div className={cn('w-full', className)}>
            {label && (
                <label
                    className={cn(
                        'mb-2 block text-base font-medium',
                        error ? 'text-red-600' : darkMode ? 'text-slate-300' : 'text-slate-700'
                    )}
                >
                    {label}
                    {required && <span className="ml-1 text-extra-small text-red-600">*</span>}
                </label>
            )}

            <button
                type="button"
                onClick={handleUploadClick}
                disabled={disabled || isUploading}
                className={cn(
                    'inline-flex h-12 cursor-pointer overflow-hidden rounded-xl border text-left transition-colors',
                    fullWidth ? 'w-full' : 'w-fit min-w-70 max-w-full',
                    (disabled || isUploading) && 'cursor-not-allowed',
                    darkMode
                        ? 'border-neutral-700 hover:border-neutral-600'
                        : 'border-slate-200 hover:border-slate-300',
                    disabled && 'cursor-not-allowed opacity-60',
                    error && (darkMode ? 'border-red-500' : 'border-red-600')
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={secureAccept}
                    onChange={handleFileInput}
                    disabled={disabled || isUploading}
                    className="hidden"
                />

                <span
                    className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center border-r',
                        darkMode ? 'border-neutral-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-200 text-slate-600'
                    )}
                >
                    <Upload size={22} />
                </span>

                <span
                    className={cn(
                        'flex h-12 w-12 flex-1 items-center rounded-r-xl px-4',
                        darkMode ? 'bg-neutral-900 text-base text-slate-400' : 'bg-white text-base text-slate-400'
                    )}
                >
                    <span className="truncate">{triggerLabel}</span>
                </span>
            </button>

            <MciUploadFileList
                files={files}
                theme={theme}
                t={t}
                darkMode={darkMode}
                showPreview={showPreview}
                showFileTypeIcon={showFileTypeIcon}
                disabled={disabled}
                isUploading={isUploading}
                onPreview={openPreview}
                onRemove={handleRemoveFile}
                onClearAll={handleClearAll}
            />

            {error && <p className="mt-2 text-sm font-normal text-red-600">{error}</p>}
        </div>
    )
}

export default MciUploadButton
