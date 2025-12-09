import {Star2, Gallery, VideoFramePlayHorizontal, MusicNote, FileText, File, Upload} from '@solar-icons/react'
import CloseIcon from "../../../assets/icons/close.svg?react"
import React, {useCallback, useRef, useState} from 'react'
import {uploadLanguages, type UploadLocale} from '../../lib/uploadLanguage'
import {cn} from '../../lib/utils'

interface FileInfo {
    id: string
    file: File
    preview?: string
    progress: number
    status: 'uploading' | 'success' | 'error'
    error?: string
}

interface MciUploadProps {
    multiple?: boolean
    accept?: string
    maxSize?: number
    maxFiles?: number
    disabled?: boolean
    label?: string
    required?: boolean
    error?: string
    className?: string
    onFilesChange?: (files: File[]) => void
    onUpload?: (files: FileInfo[]) => Promise<void>
    showPreview?: boolean
    locale?: UploadLocale
    showFileTypeIcon?: boolean
    customValidator?: (file: File) => string | null
}

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
                                                 customValidator,
                                             }) => {
    const [files, setFiles] = useState<FileInfo[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const t = uploadLanguages[locale]

    const getFileIcon = (file: File) => {
        const type = file.type.split('/')[0]
        switch (type) {
            case 'image':
                return <Gallery className="h-5 w-5 text-blue-500"/>
            case 'video':
                return <VideoFramePlayHorizontal className="h-5 w-5 text-purple-500"/>
            case 'audio':
                return <MusicNote className="h-5 w-5 text-green-500"/>
            default:
                if (file.type.includes('pdf')) {
                    return <FileText className="h-5 w-5 text-red-500"/>
                }
                if (file.type.includes('word') || file.type.includes('document')) {
                    return <FileText className="h-5 w-5 text-blue-600"/>
                }
                if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
                    return <FileText className="h-5 w-5 text-green-600"/>
                }
                return <File className="h-5 w-5 text-gray-500"/>
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const validateFileSize = (file: File) => {
        const maxSizeBytes = maxSize * 1024 * 1024
        return file.size <= maxSizeBytes
    }

    const validateFileType = (file: File) => {
        if (accept === '*/*') return true
        const acceptedTypes = accept.split(',').map((type) => type.trim())
        return acceptedTypes.some((type) => {
            if (type.endsWith('/*')) {
                const category = type.replace('/*', '')
                return file.type.startsWith(category)
            }
            return file.type === type || file.name.toLowerCase().endsWith(type.replace('*.', '.'))
        })
    }

    const createPreview = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onload = (e) => resolve(e.target?.result as string)
                reader.readAsDataURL(file)
            } else {
                resolve('')
            }
        })
    }

    const handleFilesAdd = useCallback(
        async (newFiles: FileList | File[]) => {
            const fileArray = Array.from(newFiles)
            const validFiles: FileInfo[] = []

            for (const file of fileArray) {
                if (files.length + validFiles.length >= maxFiles) {
                    alert(t.maxFilesError(maxFiles))
                    break
                }

                if (!validateFileSize(file)) {
                    alert(t.fileSizeError(file.name, maxSize))
                    continue
                }

                if (!validateFileType(file)) {
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
                validFiles.push({
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    preview,
                    progress: 0,
                    status: 'uploading',
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
            validateFileSize,
            validateFileType,
            customValidator,
            t,
            maxSize,
            multiple,
            onFilesChange,
            onUpload,
        ]
    )

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            if (!disabled) {
                setIsDragging(true)
            }
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
            if (droppedFiles.length > 0) {
                handleFilesAdd(droppedFiles)
            }
        },
        [disabled, handleFilesAdd]
    )

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = e.target.files
            if (selectedFiles && selectedFiles.length > 0) {
                handleFilesAdd(selectedFiles)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }
        },
        [handleFilesAdd]
    )

    const handleRemoveFile = useCallback(
        (id: string) => {
            setFiles((prev) => {
                const updatedFiles = prev.filter((f) => f.id !== id)
                onFilesChange?.(updatedFiles.map((f) => f.file))
                return updatedFiles
            })
        },
        [onFilesChange]
    )

    const handleClearAll = useCallback(() => {
        setFiles([])
        onFilesChange?.([])
    }, [onFilesChange])

    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    return (
        <div className={cn('w-full', className)}>
            {/* Label */}
            {label && (
                <label
                    className={cn(`mb-2 block text-base font-medium text-slate-700`, error ? 'text-red-600' : 'text-slate-700')}>
                    {label}
                    {required && <span className="text-extra-small text-red-600 ml-1">*</span>}
                </label>
            )}

            {/* Upload Area */}
            <div
                className={cn(
                    'cursor-pointer border border-dashed rounded-2xl p-6 text-center transition-all duration-300',
                    'border-slate-200 hover:border-slate-400 focus:shadow-blue focus:border-blue-600',
                    isDragging && 'border-solid border-slate-600 bg-slate-100',
                    'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
                    error && 'border-red-600 focus:border-red-600 shadow-red',
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

                <div className="flex flex-col items-center justify-center space-y-3">
                    <div
                        className={cn(
                            'rounded-full p-3 transition-colors',
                            error
                                ? 'bg-red-100 text-red-600'
                                : 'bg-slate-100 text-slate-400'
                        )}
                    >
                        <Upload className="h-6 w-6"/>
                    </div>

                    <div className="space-y-1">
                        <p className="text-small font-medium text-slate-700">
                            {t.dragAndDrop} {t.or.toLowerCase()} {t.clickToUpload}
                        </p>

                        <p className="text-small font-normal text-slate-700">
                            {t.fileRequirements(multiple, maxFiles, maxSize, accept)}
                        </p>
                    </div>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                  <span className="text-small font-medium text-slate-700">
                     {t.selectedFiles} ({files.length})
                  </span>
                        {files.length > 1 && (
                            <button
                                type="button"
                                onClick={handleClearAll}
                                disabled={disabled || isUploading}
                                className="text-small text-red-600 disabled:opacity-50"
                            >
                                {t.clearAll}
                            </button>
                        )}
                    </div>

                    {/* Files */}
                    <div className="space-y-2">
                        {files.map((fileInfo) => (
                            <div
                                key={fileInfo.id}
                                className={cn(
                                    'flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-all',
                                    fileInfo.status === 'error' && 'border-red-600'
                                )}
                            >
                                <div className="flex min-w-0 flex-1 items-center space-x-3">
                                    {/* File Icon/Preview */}
                                    {showPreview && fileInfo.preview ? (
                                        <img
                                            src={fileInfo.preview}
                                            alt={fileInfo.file.name}
                                            className="h-10 w-10 rounded object-cover"
                                        />
                                    ) : showFileTypeIcon ? (
                                        <div className="flex-shrink-0">{getFileIcon(fileInfo.file)}</div>
                                    ) : null}

                                    {/* File Info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-small font-medium text-slate-700">
                                            {fileInfo.file.name}
                                        </p>

                                        <div className="flex items-center space-x-2 text-small text-slate-400">
                                            <span>{formatFileSize(fileInfo.file.size)}</span>
                                            {fileInfo.status === 'uploading' && (
                                                <span className="flex items-center">
                                                    <Star2 className="h-5 w-5 mr-1 animate-spin"/>
                                                    {t.uploading}
                                                </span>
                                            )}

                                            {fileInfo.status === 'success' && (
                                                <span
                                                    className="flex items-center text-small font-normal text-green-600">
                                                    {t.success}
                                                </span>
                                            )}

                                        </div>

                                        {/* Progress Bar */}
                                        {fileInfo.status === 'uploading' && (
                                            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
                                                <div
                                                    className="h-1.5 rounded-full bg-slate-400 transition-all duration-300"
                                                    style={{width: `${fileInfo.progress}%`}}
                                                />
                                            </div>
                                        )}

                                        {/* Error Message */}
                                        {fileInfo.status === 'error' && fileInfo.error && (
                                            <p className="mt-2 flex items-center text-small font-normal text-red-600">
                                                {fileInfo.error}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Remove MciButton */}
                                <div className="flex flex-shrink-0 items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveFile(fileInfo.id)
                                        }}
                                        disabled={disabled || isUploading}
                                        className="text-slate-base transition-colors active:rotate-180 hover:cursor-pointer disabled:opacity-50"
                                    >
                                        <CloseIcon className="h-6 w-6"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-2 flex items-center text-small font-normal text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}

export default MciUpload
