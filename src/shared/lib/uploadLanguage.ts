export interface UploadLanguage {
    dragAndDrop: string
    clickToUpload: string
    or: string

    dropHereTitle: string

    fileRequirements: (
        multiple: boolean,
        maxFiles: number,
        maxSize: number,
        accept: string
    ) => string

    selectedFiles: string
    clearAll: string

    uploading: string
    success: string
    error: string

    preview: string
    download: string
    remove: string

    maxFilesError: (maxFiles: number) => string
    fileSizeError: (fileName: string, maxSize: number) => string
    fileTypeError: (fileName: string) => string
    uploadFailed: string

    file: string
    image: string
    video: string
    audio: string
    document: string
}


export const uploadLanguages: Record<string, UploadLanguage> = {
    uz: {
        dragAndDrop: 'Faylni bu yerga torting',
        clickToUpload: 'yoki bosib tanlang',
        or: 'yoki',

        dropHereTitle: 'Faylni shu yerga yuklang',

        fileRequirements: (multiple, maxFiles, maxSize, accept) =>
            `${multiple ? `Maksimum ${maxFiles} ta fayl` : '1 ta fayl'} • ${maxSize}MB gacha • ${
                accept !== '*/*' ? `Format: ${accept}` : 'Barcha formatlar'
            }`,

        selectedFiles: 'Tanlangan fayllar',
        clearAll: "Barchasini o‘chirish",

        uploading: 'Yuklanmoqda...',
        success: 'Yuklandi',
        error: 'Xatolik',

        preview: 'Ko‘rish',
        download: 'Yuklab olish',
        remove: "O‘chirish",

        maxFilesError: (maxFiles) => `Maksimum ${maxFiles} ta fayl yuklash mumkin`,
        fileSizeError: (fileName, maxSize) =>
            `"${fileName}" fayl hajmi ${maxSize}MB dan kichik bo‘lishi kerak`,
        fileTypeError: (fileName) => `"${fileName}" fayl turi qabul qilinmaydi`,
        uploadFailed: 'Yuklash muvaffaqiyatsiz tugadi',

        file: 'Fayl',
        image: 'Rasm',
        video: 'Video',
        audio: 'Audio',
        document: 'Hujjat',
    },

    ru: {
        dragAndDrop: 'Перетащите файл сюда',
        clickToUpload: 'или выберите нажатием',
        or: 'или',

        dropHereTitle: 'Загрузите свой файл сюда',

        fileRequirements: (multiple, maxFiles, maxSize, accept) =>
            `${multiple ? `Максимум ${maxFiles} файлов` : '1 файл'} • До ${maxSize}MB • ${
                accept !== '*/*' ? `Формат: ${accept}` : 'Все форматы'
            }`,

        selectedFiles: 'Выбранные файлы',
        clearAll: 'Очистить все',

        uploading: 'Загружается...',
        success: 'Загружено',
        error: 'Ошибка',

        preview: 'Просмотр',
        download: 'Скачать',
        remove: 'Удалить',

        maxFilesError: (maxFiles) => `Можно загрузить максимум ${maxFiles} файлов`,
        fileSizeError: (fileName, maxSize) =>
            `Размер файла "${fileName}" должен быть меньше ${maxSize}MB`,
        fileTypeError: (fileName) => `Тип файла "${fileName}" не поддерживается`,
        uploadFailed: 'Не удалось загрузить файл',

        file: 'Файл',
        image: 'Изображение',
        video: 'Видео',
        audio: 'Аудио',
        document: 'Документ',
    },

    en: {
        dragAndDrop: 'Drag and drop a file here',
        clickToUpload: 'or click to select',
        or: 'or',

        dropHereTitle: 'Upload your file here',

        fileRequirements: (multiple, maxFiles, maxSize, accept) =>
            `${multiple ? `Up to ${maxFiles} files` : '1 file'} • Up to ${maxSize}MB • ${
                accept !== '*/*' ? `Format: ${accept}` : 'All formats'
            }`,

        selectedFiles: 'Selected files',
        clearAll: 'Clear all',

        uploading: 'Uploading...',
        success: 'Uploaded',
        error: 'Error',

        preview: 'Preview',
        download: 'Download',
        remove: 'Remove',

        maxFilesError: (maxFiles) => `You can upload up to ${maxFiles} files`,
        fileSizeError: (fileName, maxSize) =>
            `File "${fileName}" must be smaller than ${maxSize}MB`,
        fileTypeError: (fileName) => `File type "${fileName}" is not supported`,
        uploadFailed: 'Upload failed',

        file: 'File',
        image: 'Image',
        video: 'Video',
        audio: 'Audio',
        document: 'Document',
    },
}


export type UploadLocale = keyof typeof uploadLanguages
