import {
	AlertCircle,
	CheckCircle2,
	File,
	FileText,
	Image,
	Loader2,
	Music,
	Upload,
	Video,
	X,
} from 'lucide-react'
import React, { useCallback, useRef, useState } from 'react'
import { uploadLanguages, type UploadLocale } from '../../lib/uploadLanguage'
import { cn } from '../../lib/utils'

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
	success?: string
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
	success,
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
				return <Image className='w-5 h-5 text-blue-500' />
			case 'video':
				return <Video className='w-5 h-5 text-purple-500' />
			case 'audio':
				return <Music className='w-5 h-5 text-green-500' />
			default:
				if (file.type.includes('pdf')) {
					return <FileText className='w-5 h-5 text-red-500' />
				}
				if (file.type.includes('word') || file.type.includes('document')) {
					return <FileText className='w-5 h-5 text-blue-600' />
				}
				if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
					return <FileText className='w-5 h-5 text-green-600' />
				}
				return <File className='w-5 h-5 text-gray-500' />
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
		const acceptedTypes = accept.split(',').map(type => type.trim())
		return acceptedTypes.some(type => {
			if (type.endsWith('/*')) {
				const category = type.replace('/*', '')
				return file.type.startsWith(category)
			}
			return (
				file.type === type ||
				file.name.toLowerCase().endsWith(type.replace('*.', '.'))
			)
		})
	}

	const createPreview = (file: File): Promise<string> => {
		return new Promise(resolve => {
			if (file.type.startsWith('image/')) {
				const reader = new FileReader()
				reader.onload = e => resolve(e.target?.result as string)
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
				onFilesChange?.(updatedFiles.map(f => f.file))

				if (onUpload) {
					setIsUploading(true)
					try {
						const filesWithProgress = updatedFiles.map((file, index) => ({
							...file,
							progress: Math.min(
								100,
								((index + 1) / updatedFiles.length) * 100
							),
						}))
						setFiles(filesWithProgress)

						await onUpload(filesWithProgress)
						setFiles(prev =>
							prev.map(f => ({
								...f,
								status: 'success',
								progress: 100,
							}))
						)
					} catch (err) {
						setFiles(prev =>
							prev.map(f => ({
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

	// Drag & Drop handlers
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
			setFiles(prev => {
				const updatedFiles = prev.filter(f => f.id !== id)
				onFilesChange?.(updatedFiles.map(f => f.file))
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
				<label className='block text-sm font-medium text-secondary-700 mb-2'>
					{label}
					{required && <span className='text-error-500 ml-1'>*</span>}
				</label>
			)}

			{/* Upload Area */}
			<div
				className={cn(
					'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer',
					'hover:border-secondary-400 hover:bg-secondary-50',
					isDragging && 'border-secondary-500 bg-secondary-100 border-solid',
					disabled && 'opacity-50 cursor-not-allowed bg-secondary-50',
					error && 'border-error-300 bg-error-50',
					success && 'border-success-300 bg-success-50'
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={handleUploadClick}
			>
				<input
					ref={fileInputRef}
					type='file'
					multiple={multiple}
					accept={accept}
					onChange={handleFileInput}
					disabled={disabled}
					className='hidden'
				/>

				<div className='flex flex-col items-center justify-center space-y-3'>
					<div
						className={cn(
							'p-3 rounded-full transition-colors',
							error
								? 'bg-error-100 text-error-500'
								: success
								? 'bg-success-100 text-success-500'
								: 'bg-secondary-100 text-secondary-500'
						)}
					>
						<Upload className='w-6 h-6' />
					</div>

					<div className='space-y-1'>
						<p className='text-sm font-medium text-secondary-900'>
							{t.dragAndDrop} {t.or.toLowerCase()} {t.clickToUpload}
						</p>
						<p className='text-xs text-secondary-500'>
							{t.fileRequirements(multiple, maxFiles, maxSize, accept)}
						</p>
					</div>
				</div>
			</div>

			{/* File List */}
			{files.length > 0 && (
				<div className='mt-4 space-y-3'>
					{/* Header */}
					<div className='flex items-center justify-between'>
						<span className='text-sm font-medium text-secondary-700'>
							{t.selectedFiles} ({files.length})
						</span>
						{files.length > 1 && (
							<button
								type='button'
								onClick={handleClearAll}
								disabled={disabled || isUploading}
								className='text-xs text-error-600 hover:text-error-700 disabled:opacity-50 transition-colors'
							>
								{t.clearAll}
							</button>
						)}
					</div>

					{/* Files */}
					<div className='space-y-2'>
						{files.map(fileInfo => (
							<div
								key={fileInfo.id}
								className={cn(
									'flex items-center justify-between p-3 rounded-lg border transition-all',
									fileInfo.status === 'error'
										? 'border-error-200 bg-error-50'
										: fileInfo.status === 'success'
										? 'border-success-200 bg-success-50'
										: 'border-secondary-200 bg-white'
								)}
							>
								<div className='flex items-center space-x-3 flex-1 min-w-0'>
									{/* File Icon/Preview */}
									{showPreview && fileInfo.preview ? (
										<img
											src={fileInfo.preview}
											alt={fileInfo.file.name}
											className='w-10 h-10 rounded object-cover'
										/>
									) : showFileTypeIcon ? (
										<div className='flex-shrink-0'>
											{getFileIcon(fileInfo.file)}
										</div>
									) : null}

									{/* File Info */}
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-medium text-secondary-900 truncate'>
											{fileInfo.file.name}
										</p>
										<div className='flex items-center space-x-2 text-xs text-secondary-500'>
											<span>{formatFileSize(fileInfo.file.size)}</span>
											{fileInfo.status === 'uploading' && (
												<span className='flex items-center'>
													<Loader2 className='w-3 h-3 mr-1 animate-spin' />
													{t.uploading}
												</span>
											)}
											{fileInfo.status === 'success' && (
												<span className='flex items-center text-success-600'>
													<CheckCircle2 className='w-3 h-3 mr-1' />
													{t.success}
												</span>
											)}
										</div>

										{/* Progress Bar */}
										{fileInfo.status === 'uploading' && (
											<div className='w-full bg-secondary-200 rounded-full h-1.5 mt-1'>
												<div
													className='bg-secondary-500 h-1.5 rounded-full transition-all duration-300'
													style={{ width: `${fileInfo.progress}%` }}
												/>
											</div>
										)}

										{/* Error Message */}
										{fileInfo.status === 'error' && fileInfo.error && (
											<p className='text-xs text-error-600 mt-1 flex items-center'>
												<AlertCircle className='w-3 h-3 mr-1' />
												{fileInfo.error}
											</p>
										)}
									</div>
								</div>

								{/* Remove Button */}
								<div className='flex items-center space-x-2 flex-shrink-0'>
									<button
										type='button'
										onClick={e => {
											e.stopPropagation()
											handleRemoveFile(fileInfo.id)
										}}
										disabled={disabled || isUploading}
										className='p-1 text-secondary-400 hover:text-error-500 transition-colors disabled:opacity-50'
									>
										<X className='w-4 h-4' />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<p className='mt-2 text-sm text-error-600 flex items-center'>
					<AlertCircle className='w-4 h-4 mr-1' />
					{error}
				</p>
			)}

			{/* Success Message */}
			{success && !error && (
				<p className='mt-2 text-sm text-success-600 flex items-center'>
					<CheckCircle2 className='w-4 h-4 mr-1' />
					{success}
				</p>
			)}
		</div>
	)
}

export default MciUpload
