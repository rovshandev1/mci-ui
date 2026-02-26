import type { UploadLocale } from '../../lib/uploadLanguage'

export interface FileInfo {
    id: string
    file: File
    preview?: string
    progress: number
    status: 'uploading' | 'success' | 'error'
    error?: string
}

export interface MciUploadProps {
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
    variant?: 'yellow' | 'blue'
}
