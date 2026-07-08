import {
    File,
    FileText,
    Gallery,
    MusicNote,
    VideoFramePlayHorizontal,
} from '@solar-icons/react'

import type { FileInfo, MciUploadFileValue } from '../../types/ui/upload.types'

export const SECURE_ALLOWED_EXTENSIONS = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'jpg',
    'jpeg',
    'png',
    'bmp',
    'tiff',
] as const

export const BLOCKED_EXTENSIONS = [
    'zip',
    'rar',
    '7z',
    'tar',
    'gz',
    'bz2',
    'xz',
    'tgz',
    'tbz2',
    'txz',
    'iso',
    'cab',
    'arj',
    'lz',
    'lzh',
    'z',
    'exe',
    'bat',
    'cmd',
    'com',
    'msi',
    'scr',
    'pif',
    'js',
    'mjs',
    'cjs',
    'jse',
    'vbs',
    'vbe',
    'wsf',
    'wsh',
    'ps1',
    'psm1',
    'sh',
    'bash',
    'zsh',
    'ksh',
    'csh',
    'fish',
] as const

type FileTypeValidationResult =
    | { isValid: true }
    | { isValid: false; reason: 'blocked' | 'not-allowed' }

const ALLOWED_EXTENSIONS_SET = new Set<string>(SECURE_ALLOWED_EXTENSIONS)
const BLOCKED_EXTENSIONS_SET = new Set<string>(BLOCKED_EXTENSIONS)
const DEFAULT_SECURE_ACCEPT = SECURE_ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',')

const WILDCARD_ACCEPT_TO_EXTENSIONS: Record<string, string[]> = {
    'image/*': ['jpg', 'jpeg', 'png', 'bmp', 'tiff'],
    'text/*': ['txt'],
}

const MIME_TO_EXTENSIONS: Record<string, string[]> = {
    'application/pdf': ['pdf'],
    'application/msword': ['doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
    'application/vnd.ms-excel': ['xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
    'application/vnd.ms-powerpoint': ['ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['pptx'],
    'text/plain': ['txt'],
    'image/jpg': ['jpg'],
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/bmp': ['bmp'],
    'image/tiff': ['tiff'],
}

const BLOCKED_MIME_TYPES = new Set<string>([
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/vnd.rar',
    'application/x-7z-compressed',
    'application/x-msdownload',
    'application/x-msdos-program',
    'application/x-executable',
    'application/x-bat',
    'application/x-msi',
    'application/javascript',
    'text/javascript',
    'application/x-javascript',
    'application/x-sh',
    'application/x-csh',
    'text/x-shellscript',
    'application/x-powershell',
])

function getFileExtension(fileName: string) {
    const normalized = fileName.trim().toLowerCase()
    const lastDot = normalized.lastIndexOf('.')
    if (lastDot <= 0 || lastDot === normalized.length - 1) return ''
    return normalized.slice(lastDot + 1)
}

function normalizeAcceptTokens(accept: string) {
    return accept
        .split(',')
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean)
}

function resolveExtensionsFromAccept(accept: string) {
    if (!accept || accept === '*/*') return null

    const tokens = normalizeAcceptTokens(accept)
    const resolved = new Set<string>()

    for (const token of tokens) {
        if (token === '*/*') continue

        if (token.endsWith('/*')) {
            const mapped = WILDCARD_ACCEPT_TO_EXTENSIONS[token]
            if (!mapped) continue
            for (const ext of mapped) {
                if (ALLOWED_EXTENSIONS_SET.has(ext) && !BLOCKED_EXTENSIONS_SET.has(ext)) {
                    resolved.add(ext)
                }
            }
            continue
        }

        if (token.startsWith('.')) {
            const ext = token.slice(1)
            if (ALLOWED_EXTENSIONS_SET.has(ext) && !BLOCKED_EXTENSIONS_SET.has(ext)) {
                resolved.add(ext)
            }
            continue
        }

        if (token.includes('/')) {
            const mapped = MIME_TO_EXTENSIONS[token]
            if (!mapped) continue
            for (const ext of mapped) {
                if (ALLOWED_EXTENSIONS_SET.has(ext) && !BLOCKED_EXTENSIONS_SET.has(ext)) {
                    resolved.add(ext)
                }
            }
            continue
        }

        if (ALLOWED_EXTENSIONS_SET.has(token) && !BLOCKED_EXTENSIONS_SET.has(token)) {
            resolved.add(token)
        }
    }

    return resolved.size > 0 ? resolved : null
}

export function buildSecureAccept(accept: string) {
    const restrictions = resolveExtensionsFromAccept(accept)
    if (!restrictions) return DEFAULT_SECURE_ACCEPT
    return Array.from(restrictions).map((ext) => `.${ext}`).join(',')
}

export function getAllowedFormatsHint(accept: string) {
    const restrictions = resolveExtensionsFromAccept(accept)
    if (!restrictions) return SECURE_ALLOWED_EXTENSIONS.join(', ')
    return Array.from(restrictions).join(', ')
}

export function getFileIcon(file: File) {
    const type = file.type.split('/')[0]
    switch (type) {
        case 'image':
            return <Gallery className="h-5 w-5 text-blue-500" />
        case 'video':
            return <VideoFramePlayHorizontal className="h-5 w-5 text-purple-500" />
        case 'audio':
            return <MusicNote className="h-5 w-5 text-green-500" />
        default:
            if (file.type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
            if (file.type.includes('word') || file.type.includes('document')) {
                return <FileText className="h-5 w-5 text-blue-600" />
            }
            if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
                return <FileText className="h-5 w-5 text-green-600" />
            }
            return <File className="h-5 w-5 text-gray-500" />
    }
}

export function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function validateFileSize(file: File, maxSizeMb: number) {
    const maxSizeBytes = maxSizeMb * 1024 * 1024
    return file.size <= maxSizeBytes
}

export function validateFileType(file: File, accept: string): FileTypeValidationResult {
    const extension = getFileExtension(file.name)
    const mimeType = file.type.trim().toLowerCase()

    if (mimeType && BLOCKED_MIME_TYPES.has(mimeType)) {
        return { isValid: false, reason: 'blocked' }
    }

    if (!extension) return { isValid: false, reason: 'not-allowed' }
    if (BLOCKED_EXTENSIONS_SET.has(extension)) return { isValid: false, reason: 'blocked' }
    if (!ALLOWED_EXTENSIONS_SET.has(extension)) return { isValid: false, reason: 'not-allowed' }

    const restrictions = resolveExtensionsFromAccept(accept)
    if (restrictions && !restrictions.has(extension)) {
        return { isValid: false, reason: 'not-allowed' }
    }

    return { isValid: true }
}

export function createPreview(file: File): Promise<string> {
    return new Promise((resolve) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => resolve((e.target?.result as string) ?? '')
            reader.readAsDataURL(file)
        } else {
            resolve('')
        }
    })
}

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'bmp', 'tiff'])

export function isImageFileName(fileName: string) {
    return IMAGE_EXTENSIONS.has(getFileExtension(fileName))
}

export function getFileIconByName(fileName: string) {
    const ext = getFileExtension(fileName)
    if (IMAGE_EXTENSIONS.has(ext)) {
        return <Gallery className="h-5 w-5 text-blue-500" />
    }
    if (ext === 'pdf') return <FileText className="h-5 w-5 text-red-500" />
    if (ext === 'doc' || ext === 'docx') {
        return <FileText className="h-5 w-5 text-blue-600" />
    }
    if (ext === 'xls' || ext === 'xlsx') {
        return <FileText className="h-5 w-5 text-green-600" />
    }
    if (ext === 'ppt' || ext === 'pptx') {
        return <FileText className="h-5 w-5 text-orange-600" />
    }
    return <File className="h-5 w-5 text-gray-500" />
}

export function normalizeUploadFileValues(
    value?: MciUploadFileValue | MciUploadFileValue[]
): MciUploadFileValue[] {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
}

export function createFileInfoFromValue(value: MciUploadFileValue): FileInfo {
    const id = value.id ?? Math.random().toString(36).slice(2, 11)
    const preview = isImageFileName(value.name) ? value.url : undefined

    return {
        id,
        name: value.name,
        size: value.size ?? 0,
        url: value.url,
        preview,
        progress: 100,
        status: 'success',
        isRemote: true,
    }
}

export function fileInfoToUploadValue(fileInfo: FileInfo): MciUploadFileValue {
    return {
        id: fileInfo.id,
        name: fileInfo.name,
        url: fileInfo.url ?? '',
        size: fileInfo.size,
    }
}

export function createFileInfoFromFile(file: File, preview: string, status: FileInfo['status'], progress: number): FileInfo {
    return {
        id: Math.random().toString(36).slice(2, 11),
        file,
        name: file.name,
        size: file.size,
        preview,
        progress,
        status,
    }
}
