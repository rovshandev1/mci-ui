import {
    File,
    FileText,
    Gallery,
    MusicNote,
    VideoFramePlayHorizontal,
} from '@solar-icons/react'

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

export function validateFileType(file: File, accept: string) {
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
