import type { UploadLocale } from '../../lib/uploadLanguage'

/** Form / API dan kelgan allaqachon yuklangan fayl */
export interface MciUploadFileValue {
    id?: string
    name: string
    url: string
    size?: number
}

export interface FileInfo {
    id: string
    name: string
    size: number
    file?: File
    /** Serverdagi fayl URL (initial value) */
    url?: string
    preview?: string
    progress: number
    status: 'uploading' | 'success' | 'error'
    error?: string
    isRemote?: boolean
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
    /** Boshlang'ich yoki serverdan kelgan fayllar (forma edit) */
    defaultValue?: MciUploadFileValue | MciUploadFileValue[]
    /** Controlled: mavjud yuklangan fayllar ro'yxati */
    value?: MciUploadFileValue | MciUploadFileValue[]
    onValueChange?: (files: MciUploadFileValue[]) => void
    onUpload?: (files: FileInfo[]) => Promise<void>
    showPreview?: boolean
    locale?: UploadLocale
    showFileTypeIcon?: boolean
    customValidator?: (file: File) => string | null
    variant?: 'yellow' | 'blue' | 'orange'
    darkMode?: boolean
}

/** Kompakt «upload» tugmasi + fayl ro'yxati (drag-drop zonesiz) */
export interface MciUploadButtonProps extends MciUploadProps {
    /** Tugma matni (default: locale bo'yicha uploadFile) */
    buttonText?: string
    /** true bo'lsa tugma konteyner kengligini egallaydi */
    fullWidth?: boolean
}
