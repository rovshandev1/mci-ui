import { Eye, File, Star2 } from '@solar-icons/react'
import CloseIcon from '../../../assets/icons/close.svg?react'
import type { UploadLanguage } from '../../lib/uploadLanguage'
import { cn } from '../../lib/utils'
import type { FileInfo } from '../../types/ui/upload.types'
import type { UploadThemeTokens } from './mci-upload.theme'
import { formatFileSize, getFileIcon, getFileIconByName } from './mci-upload.utils'

export interface MciUploadFileListProps {
    files: FileInfo[]
    theme: UploadThemeTokens
    t: UploadLanguage
    darkMode?: boolean
    showPreview?: boolean
    showFileTypeIcon?: boolean
    disabled?: boolean
    isUploading?: boolean
    onPreview: (fileInfo: FileInfo) => void
    onRemove: (id: string) => void
    onClearAll: () => void
    className?: string
}

export function MciUploadFileList({
    files,
    theme,
    t,
    darkMode = false,
    showPreview = true,
    showFileTypeIcon = true,
    disabled = false,
    isUploading = false,
    onPreview,
    onRemove,
    onClearAll,
    className,
}: MciUploadFileListProps) {
    if (files.length === 0) return null

    return (
        <div className={cn('mt-4 space-y-3', className)}>
            <div className="flex items-center justify-between">
                <span className={cn('text-sm font-medium', darkMode ? 'text-slate-300' : 'text-slate-700')}>
                    {t.selectedFiles} ({files.length})
                </span>

                {files.length > 1 && (
                    <button
                        type="button"
                        onClick={onClearAll}
                        disabled={disabled || isUploading}
                        className="cursor-pointer text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                                'flex items-center justify-between rounded-2xl border p-4',
                                darkMode ? 'border-neutral-700' : 'border-slate-200',
                                fileInfo.status === 'error' && (darkMode ? 'border-red-500' : 'border-red-600')
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
                                            alt={fileInfo.name}
                                            className="h-10 w-10 rounded-xl object-cover"
                                        />
                                    ) : showFileTypeIcon ? (
                                        fileInfo.file
                                            ? getFileIcon(fileInfo.file)
                                            : getFileIconByName(fileInfo.name)
                                    ) : (
                                        <File className="h-6 w-6 text-slate-500" />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className={cn(
                                            'truncate text-lg font-semibold',
                                            darkMode ? 'text-slate-100' : 'text-primary'
                                        )}
                                    >
                                        {fileInfo.name}
                                    </p>

                                    <div
                                        className={cn(
                                            'mt-1 flex flex-wrap items-center gap-2 text-sm',
                                            darkMode ? 'text-slate-400' : 'text-slate-500'
                                        )}
                                    >
                                        <span>{formatFileSize(fileInfo.size)}</span>

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
                                        <div
                                            className={cn(
                                                'mt-2 h-1.5 w-full rounded-full',
                                                darkMode ? 'bg-neutral-700' : 'bg-slate-200'
                                            )}
                                        >
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
                                        <p className="mt-2 text-sm font-normal text-red-600">{fileInfo.error}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (!previewDisabled) onPreview(fileInfo)
                                    }}
                                    disabled={previewDisabled}
                                    className={cn(
                                        'cursor-pointer rounded-xl p-2 disabled:cursor-not-allowed disabled:opacity-50',
                                        darkMode ? 'hover:bg-neutral-800' : 'hover:bg-slate-100'
                                    )}
                                    title={t.preview}
                                >
                                    <Eye size={20} className="text-slate-400" />
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemove(fileInfo.id)
                                    }}
                                    disabled={disabled || isUploading}
                                    className={cn(
                                        'cursor-pointer rounded-xl p-2 disabled:cursor-not-allowed disabled:opacity-50',
                                        darkMode
                                            ? 'text-slate-400 hover:bg-neutral-800'
                                            : 'text-slate-base hover:bg-slate-100'
                                    )}
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
    )
}
