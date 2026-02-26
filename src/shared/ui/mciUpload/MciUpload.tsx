import {
    Star2,
    File,
    Upload,
    Eye,
} from '@solar-icons/react'
import CloseIcon from "../../../assets/icons/close.svg?react"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { uploadLanguages } from '../../lib/uploadLanguage'
import { cn } from '../../lib/utils'
import type { FileInfo, MciUploadProps } from '../../types/ui/upload.types'
import {
    createPreview,
    formatFileSize,
    getFileIcon,
    validateFileSize,
    validateFileType,
} from './mci-upload.utils'

const UPLOAD_THEME = {
    blue: {
        dropBorder: 'border-blue-200 hover:border-blue-300',
        dropBg: 'bg-blue-50/40 hover:bg-blue-50/60',
        dropActive: 'border-blue-600 bg-blue-50',
        iconWrap: 'text-blue-600',
        title: 'text-blue-600',
        hint: 'text-slate-500',
        progress: 'bg-blue-600/30',
        progressFill: 'bg-blue-600',
        fileIconImg: 'bg-blue-50 text-blue-600',
        fileIconDoc: 'bg-green-50 text-green-600',
    },
    yellow: {
        dropBorder: 'border-yellow-200 hover:border-yellow-300',
        dropBg: 'bg-yellow-50/40 hover:bg-yellow-50/60',
        dropActive: 'border-yellow-500 bg-yellow-50',
        iconWrap: 'text-yellow-700',
        title: 'text-yellow-700',
        hint: 'text-slate-500',
        progress: 'bg-yellow-600/25',
        progressFill: 'bg-yellow-600',
        fileIconImg: 'bg-blue-50 text-blue-600',
        fileIconDoc: 'bg-green-50 text-green-600',
    },
} as const

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
                                                 showPreview = true,
                                                 locale = 'uz',
                                                 showFileTypeIcon = true,
                                                 variant = 'yellow',
                                                 customValidator,
                                             }) => {
    const [files, setFiles] = useState<FileInfo[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const t = uploadLanguages[locale]

    const theme = useMemo(() => UPLOAD_THEME[variant], [variant])

    const objectUrlByIdRef = useRef<Map<string, string>>(new Map())
    const revokeObjectUrlById = useCallback((id: string) => {
        const url = objectUrlByIdRef.current.get(id)
        if (url) {
            URL.revokeObjectURL(url)
            objectUrlByIdRef.current.delete(id)
        }
    }, [])

    const revokeAllObjectUrls = useCallback(() => {
        for (const url of objectUrlByIdRef.current.values()) {
            URL.revokeObjectURL(url)
        }
        objectUrlByIdRef.current.clear()
    }, [])

    useEffect(() => {
        return () => {
            revokeAllObjectUrls()
        }
    }, [revokeAllObjectUrls])

    const openPreview = useCallback((fileInfo: FileInfo) => {
        let url = objectUrlByIdRef.current.get(fileInfo.id)
        if (!url) {
            url = URL.createObjectURL(fileInfo.file)
            objectUrlByIdRef.current.set(fileInfo.id, url)

            setTimeout(() => revokeObjectUrlById(fileInfo.id), 5 * 60_000)
        }

        window.open(url, '_blank', 'noopener,noreferrer')
    }, [revokeObjectUrlById])

    const handleFilesAdd = useCallback(
        async (newFiles: FileList | File[]) => {
            const fileArray = Array.from(newFiles)
            const validFiles: FileInfo[] = []

            for (const file of fileArray) {
                if (files.length + validFiles.length >= maxFiles) {
                    alert(t.maxFilesError(maxFiles))
                    break
                }

                if (!validateFileSize(file, maxSize)) {
                    alert(t.fileSizeError(file.name, maxSize))
                    continue
                }

                if (!validateFileType(file, accept)) {
                    alert(t.fileTypeError(file.name))
                    continue
                }

                if (customValidator) {
                    const customError = customValidator(file)
                    if (customError) {
                        alert(customError)
                        continue
                    }
                }

                const preview = await createPreview(file)

                const initialStatus = onUpload ? 'uploading' : 'success'
                const initialProgress = onUpload ? 0 : 100

                validFiles.push({
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    preview,
                    progress: initialProgress,
                    status: initialStatus,
                })
            }

            if (validFiles.length > 0) {
                const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
                setFiles(updatedFiles)
                onFilesChange?.(updatedFiles.map((f) => f.file))

                if (onUpload) {
                    setIsUploading(true)
                    try {
                        const filesWithProgress = updatedFiles.map((file, index) => ({
                            ...file,
                            progress: Math.min(100, ((index + 1) / updatedFiles.length) * 100),
                        }))
                        setFiles(filesWithProgress)

                        await onUpload(filesWithProgress)
                        setFiles((prev) =>
                            prev.map((f) => ({
                                ...f,
                                status: 'success',
                                progress: 100,
                            }))
                        )
                    } catch (err) {
                        setFiles((prev) =>
                            prev.map((f) => ({
                                ...f,
                                status: 'error',
                                error: err instanceof Error ? err.message : t.uploadFailed,
                            }))
                        )
                    } finally {
                        setIsUploading(false)
                    }
                }
            }
        },
        [
            files,
            maxFiles,
            customValidator,
            t,
            accept,
            maxSize,
            multiple,
            onFilesChange,
            onUpload,
        ]
    )

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            if (!disabled) setIsDragging(true)
        },
        [disabled]
    )

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            if (disabled) return

            const droppedFiles = e.dataTransfer.files
            if (droppedFiles.length > 0) handleFilesAdd(droppedFiles)
        },
        [disabled, handleFilesAdd]
    )

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = e.target.files
            if (selectedFiles && selectedFiles.length > 0) {
                handleFilesAdd(selectedFiles)
                if (fileInputRef.current) fileInputRef.current.value = ''
            }
        },
        [handleFilesAdd]
    )

    const handleRemoveFile = useCallback(
        (id: string) => {
            revokeObjectUrlById(id)

            setFiles((prev) => {
                const updatedFiles = prev.filter((f) => f.id !== id)
                onFilesChange?.(updatedFiles.map((f) => f.file))
                return updatedFiles
            })
        },
        [onFilesChange, revokeObjectUrlById]
    )

    const handleClearAll = useCallback(() => {
        revokeAllObjectUrls()

        setFiles([])
        onFilesChange?.([])
    }, [onFilesChange, revokeAllObjectUrls])

    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    return (
        <div className={cn('w-full', className)}>
            {label && (
                <label
                    className={cn(
                        'mb-2 block text-base font-medium',
                        error ? 'text-red-600' : 'text-slate-700'
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
                    error && 'border-red-600 bg-red-50/30'
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
                    accept={accept}
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
                        {t.fileRequirements(multiple, maxFiles, maxSize, accept)}
                    </p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">
                            {t.selectedFiles} ({files.length})
                        </span>

                        {files.length > 1 && (
                            <button
                                type="button"
                                onClick={handleClearAll}
                                disabled={disabled || isUploading}
                                className="text-sm font-medium text-red-600 disabled:opacity-50"
                            >
                                {t.clearAll}
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {files.map((fileInfo) => {
                            const isImage = !!fileInfo.preview
                            const leftIconWrapClass = isImage ? theme.fileIconImg : theme.fileIconDoc
                            const previewDisabled = disabled || isUploading || fileInfo.status === 'uploading'

                            return (
                                <div
                                    key={fileInfo.id}
                                    className={cn(
                                        'flex items-center justify-between rounded-2xl border border-slate-200 p-4',
                                        fileInfo.status === 'error' && 'border-red-600'
                                    )}
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div
                                            className={cn(
                                                'flex h-14 w-14 items-center justify-center rounded-2xl',
                                                leftIconWrapClass
                                            )}
                                        >
                                            {showPreview && fileInfo.preview ? (
                                                <img
                                                    src={fileInfo.preview}
                                                    alt={fileInfo.file.name}
                                                    className="h-10 w-10 rounded-xl object-cover"
                                                />
                                            ) : showFileTypeIcon ? (
                                                getFileIcon(fileInfo.file)
                                            ) : (
                                                <File className="h-6 w-6 text-slate-500" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-lg font-semibold text-primary">
                                                {fileInfo.file.name}
                                            </p>

                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                                <span>{formatFileSize(fileInfo.file.size)}</span>

                                                {fileInfo.status === 'uploading' && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="inline-flex items-center">
                                                            <Star2 className="mr-1 h-5 w-5 animate-spin" />
                                                            {t.uploading}
                                                        </span>
                                                    </>
                                                )}

                                                {fileInfo.status === 'success' && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="font-normal text-green-600">{t.success}</span>
                                                    </>
                                                )}
                                            </div>

                                            {fileInfo.status === 'uploading' && (
                                                <div className={cn('mt-2 h-1.5 w-full rounded-full bg-slate-200')}>
                                                    <div
                                                        className={cn(
                                                            'h-1.5 rounded-full transition-all duration-300',
                                                            theme.progressFill
                                                        )}
                                                        style={{ width: `${fileInfo.progress}%` }}
                                                    />
                                                </div>
                                            )}

                                            {fileInfo.status === 'error' && fileInfo.error && (
                                                <p className="mt-2 text-sm font-normal text-red-600">
                                                    {fileInfo.error}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (!previewDisabled) openPreview(fileInfo)
                                            }}
                                            disabled={previewDisabled}
                                            className="rounded-xl p-2 hover:bg-slate-100 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={t.preview}
                                        >
                                            <Eye size={20} className="text-slate-400" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRemoveFile(fileInfo.id)
                                            }}
                                            disabled={disabled || isUploading}
                                            className="rounded-xl p-2 text-slate-base hover:bg-slate-100 disabled:opacity-50 hover:cursor-pointer"
                                            title={t.remove}
                                        >
                                            <CloseIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {error && <p className="mt-2 text-sm font-normal text-red-600">{error}</p>}
        </div>
    )
}

export default MciUpload
