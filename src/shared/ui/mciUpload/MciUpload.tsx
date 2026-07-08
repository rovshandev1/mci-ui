import { Upload } from '@solar-icons/react'
import React from 'react'
import { cn } from '../../lib/utils'
import type { MciUploadProps } from '../../types/ui/upload.types'
import { MciUploadFileList } from './MciUploadFileList'
import { useMciUpload } from './useMciUpload'

const MciUpload: React.FC<MciUploadProps> = ({
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
        isDragging,
        isUploading,
        fileInputRef,
        t,
        theme,
        secureAccept,
        allowedFormatsHint,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileInput,
        handleRemoveFile,
        handleClearAll,
        handleUploadClick,
        openPreview,
    } = upload

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

            <div
                className={cn(
                    'group relative flex min-h-[180px] w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all duration-300',
                    theme.dropBorder,
                    theme.dropBg,
                    isDragging && theme.dropActive,
                    disabled && 'cursor-not-allowed opacity-60',
                    error && (darkMode ? 'border-red-500 bg-red-950/30' : 'border-red-600 bg-red-50/30')
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={secureAccept}
                    onChange={handleFileInput}
                    disabled={disabled}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-3">
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', theme.iconWrap)}>
                        <Upload size={20} />
                    </div>

                    <p className={cn('text-base font-medium', theme.title)}>{t.dropHereTitle}</p>

                    <p className={cn('text-sm font-normal', theme.hint)}>
                        {t.fileRequirements(multiple, maxFiles, maxSize, allowedFormatsHint)}
                    </p>
                </div>
            </div>

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

export default MciUpload
