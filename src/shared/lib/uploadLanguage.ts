export interface UploadLanguage {
   dragAndDrop: string
   clickToUpload: string
   or: string
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
      clickToUpload: 'yoki bosish orqali tanlang',
      or: 'yoki',
      fileRequirements: (multiple, maxFiles, maxSize, accept) =>
         `${
            multiple ? `Maksimum ${maxFiles} ta fayl` : '1 ta fayl'
         } • Hajmi ${maxSize}MB dan kichik • ${
            accept !== '*/*' ? `Format: ${accept}` : 'Barcha formatlar'
         }`,

      selectedFiles: 'Tanlangan fayllar',
      clearAll: "Barchasini o'chirish",

      uploading: 'Yuklanmoqda...',
      success: 'Muvaffaqiyatli yuklandi',
      error: 'Xatolik',

      maxFilesError: (maxFiles) => `Maksimum ${maxFiles} ta fayl yuklash mumkin`,
      fileSizeError: (fileName, maxSize) =>
         `"${fileName}" fayli hajmi ${maxSize}MB dan kichik bo'lishi kerak`,
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
      fileRequirements: (multiple, maxFiles, maxSize, accept) =>
         `${multiple ? `Максимум ${maxFiles} файлов` : '1 файл'} • Размер до ${maxSize}MB • ${
            accept !== '*/*' ? `Формат: ${accept}` : 'Все форматы'
         }`,

      selectedFiles: 'Выбранные файлы',
      clearAll: 'Очистить все',

      uploading: 'Загружается...',
      success: 'Успешно загружено',
      error: 'Ошибка',

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
      dragAndDrop: 'Drag and drop file here',
      clickToUpload: 'or click to select',
      or: 'or',
      fileRequirements: (multiple, maxFiles, maxSize, accept) =>
         `${multiple ? `Maximum ${maxFiles} files` : '1 file'} • Size up to ${maxSize}MB • ${
            accept !== '*/*' ? `Format: ${accept}` : 'All formats'
         }`,

      selectedFiles: 'Selected files',
      clearAll: 'Clear all',

      uploading: 'Uploading...',
      success: 'Successfully uploaded',
      error: 'Error',

      maxFilesError: (maxFiles) => `Maximum ${maxFiles} files can be uploaded`,
      fileSizeError: (fileName, maxSize) =>
         `File "${fileName}" size must be less than ${maxSize}MB`,
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
