import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react'
import { uploadLanguages, type UploadLocale } from '../../lib/uploadLanguage'
import type { FileInfo, MciUploadFileValue } from '../../types/ui/upload.types'
import { UPLOAD_THEME, UPLOAD_THEME_DARK } from './mci-upload.theme'
import {
    buildSecureAccept,
    createFileInfoFromFile,
    createFileInfoFromValue,
    createPreview,
    fileInfoToUploadValue,
    getAllowedFormatsHint,
    normalizeUploadFileValues,
    validateFileSize,
    validateFileType,
} from './mci-upload.utils'

export interface UseMciUploadOptions {
    multiple?: boolean
    accept?: string
    maxSize?: number
    maxFiles?: number
    disabled?: boolean
    defaultValue?: MciUploadFileValue | MciUploadFileValue[]
    value?: MciUploadFileValue | MciUploadFileValue[]
    onFilesChange?: (files: File[]) => void
    onValueChange?: (files: MciUploadFileValue[]) => void
    onUpload?: (files: FileInfo[]) => Promise<void>
    locale?: UploadLocale
    variant?: 'yellow' | 'blue' | 'orange' | 'amber'
    darkMode?: boolean
    customValidator?: (file: File) => string | null
}

export function useMciUpload({
    multiple = false,
    accept = '*/*',
    maxSize = 10,
    maxFiles = 5,
    disabled = false,
    defaultValue,
    value,
    onFilesChange,
    onValueChange,
    onUpload,
    locale = 'uz',
    variant = 'orange',
    darkMode = false,
    customValidator,
}: UseMciUploadOptions) {
    const isControlled = value !== undefined

    const [files, setFiles] = useState<FileInfo[]>(() =>
        normalizeUploadFileValues(defaultValue).map(createFileInfoFromValue)
    )
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const t = uploadLanguages[locale]
    const theme = useMemo(
        () => (darkMode ? UPLOAD_THEME_DARK[variant] : UPLOAD_THEME[variant]),
        [variant, darkMode]
    )
    const secureAccept = useMemo(() => buildSecureAccept(accept), [accept])
    const allowedFormatsHint = useMemo(() => getAllowedFormatsHint(accept), [accept])

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

    useEffect(() => {
        if (!isControlled) return
        setFiles(normalizeUploadFileValues(value).map(createFileInfoFromValue))
    }, [isControlled, value])

    const emitValueChange = useCallback(
        (next: FileInfo[]) => {
            onValueChange?.(next.map(fileInfoToUploadValue))
            onFilesChange?.(next.map((f) => f.file).filter((f): f is File => !!f))
        },
        [onFilesChange, onValueChange]
    )

    const openPreview = useCallback(
        (fileInfo: FileInfo) => {
            if (fileInfo.url) {
                window.open(fileInfo.url, '_blank', 'noopener,noreferrer')
                return
            }

            if (!fileInfo.file) return

            let url = objectUrlByIdRef.current.get(fileInfo.id)
            if (!url) {
                url = URL.createObjectURL(fileInfo.file)
                objectUrlByIdRef.current.set(fileInfo.id, url)
                setTimeout(() => revokeObjectUrlById(fileInfo.id), 5 * 60_000)
            }

            window.open(url, '_blank', 'noopener,noreferrer')
        },
        [revokeObjectUrlById]
    )

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

                const fileTypeValidation = validateFileType(file, accept)
                if (!fileTypeValidation.isValid) {
                    if (fileTypeValidation.reason === 'blocked') {
                        alert(t.blockedFileTypeError(file.name))
                    } else {
                        alert(t.fileTypeError(file.name))
                    }
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

                validFiles.push(
                    createFileInfoFromFile(file, preview, initialStatus, initialProgress)
                )
            }

            if (validFiles.length > 0) {
                const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
                setFiles(updatedFiles)
                emitValueChange(updatedFiles)

                if (onUpload) {
                    setIsUploading(true)
                    try {
                        const filesWithProgress = updatedFiles.map((file, index) => ({
                            ...file,
                            progress: Math.min(100, ((index + 1) / updatedFiles.length) * 100),
                        }))
                        setFiles(filesWithProgress)

                        await onUpload(filesWithProgress)
                        const succeeded = updatedFiles.map((f) => ({
                            ...f,
                            status: 'success' as const,
                            progress: 100,
                        }))
                        setFiles(succeeded)
                        emitValueChange(succeeded)
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
            emitValueChange,
            onUpload,
        ]
    )

    const handleDragOver = useCallback(
        (e: DragEvent) => {
            e.preventDefault()
            if (!disabled) setIsDragging(true)
        },
        [disabled]
    )

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: DragEvent) => {
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
                emitValueChange(updatedFiles)
                return updatedFiles
            })
        },
        [emitValueChange, revokeObjectUrlById]
    )

    const handleClearAll = useCallback(() => {
        revokeAllObjectUrls()
        setFiles([])
        emitValueChange([])
    }, [emitValueChange, revokeAllObjectUrls])

    const handleUploadClick = useCallback(() => {
        if (!disabled && !isUploading) fileInputRef.current?.click()
    }, [disabled, isUploading])

    return {
        files,
        isDragging,
        isUploading,
        fileInputRef,
        t,
        theme,
        secureAccept,
        allowedFormatsHint,
        multiple,
        maxFiles,
        maxSize,
        disabled,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileInput,
        handleRemoveFile,
        handleClearAll,
        handleUploadClick,
        openPreview,
    }
}
