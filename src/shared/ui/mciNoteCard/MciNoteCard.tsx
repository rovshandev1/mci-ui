import { Pen2, TrashBinTrash, User } from '@solar-icons/react'
import { NoteItem } from '../../types/ui/note.types'
import { cn } from '../../lib/utils'
import { formatDateByPattern } from '../mciPicker/mci-picker.utils'
import MciButton from '../mciButton/MciButton'
import { useEffect, useState } from 'react'

const MciNoteCard = ({
   note,
   className,
   canManage,
   disabled,
   onDelete,
   onSave,
   subtitle,
   activeEditId,
   onEditStart,
   locale = 'ru',
}: {
   note: NoteItem
   className?: string
   canManage?: boolean
   disabled?: boolean
   onDelete?: () => void
   onSave?: (text: string) => void
   subtitle?: string
   activeEditId?: number | null
   onEditStart?: (id: number | null) => void
   locale?: 'uz' | 'ru'
}) => {
   const [isEditing, setIsEditing] = useState(false)
   const [editingText, setEditingText] = useState(note.note)
   const createdDate = new Date(note.createdDate)
   const date = formatDateByPattern(createdDate, 'DD.MM.YYYY')
   const time = `${createdDate.getHours().toString().padStart(2, '0')}:${createdDate.getMinutes().toString().padStart(2, '0')}`

   useEffect(() => {
      if (activeEditId !== undefined && activeEditId !== note.id && isEditing) {
         setIsEditing(false)
         setEditingText(note.note)
      }
   }, [activeEditId, note.id, note.note])

   const handleStartEdit = () => {
      setIsEditing(true)
      onEditStart?.(note.id)
   }

   const handleCancelEdit = () => {
      setIsEditing(false)
      setEditingText(note.note)
      onEditStart?.(null)
   }

   const handleSave = () => {
      onSave?.(editingText)
      setIsEditing(false)
      onEditStart?.(null)
   }

   return (
      <div className={cn('flex items-start gap-3', className)}>
         <div className="flex aspect-square w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <User size={20} />
         </div>
         <div className="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
               <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                     {getTitle({ note })}
                     {subtitle && (
                        <>
                           <span>·</span>
                           <span className="text-xs text-slate-400">{subtitle}</span>
                        </>
                     )}
                  </div>

                  <time dateTime={date} className="m-0 text-xs text-slate-400">
                     {date} {time}
                  </time>
               </div>
               {canManage && !isEditing && (
                  <div className="flex shrink-0 items-center gap-4">
                     <button
                        type="button"
                        onClick={handleStartEdit}
                        disabled={disabled}
                        className="cursor-pointer text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                        <Pen2 size={20} />
                     </button>
                     <button
                        type="button"
                        onClick={onDelete}
                        disabled={disabled}
                        className="cursor-pointer text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                        <TrashBinTrash size={20} />
                     </button>
                  </div>
               )}
            </div>
            <hr className="text-slate-200" />
            {isEditing ? (
               <div className="space-y-2">
                  <textarea
                     rows={4}
                     value={editingText}
                     onChange={(e) => setEditingText(e.target.value)}
                     className="text-primary w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                     placeholder="Enter note text"
                  />
                  <div className="flex justify-end gap-2">
                     <MciButton
                        variant="tertiary"
                        text={locale === 'ru' ? 'Отмена' : 'Bekor qilish'}
                        onClick={handleCancelEdit}
                        disabled={disabled}
                     />
                     <MciButton
                        color="blue"
                        text={locale === 'ru' ? 'Сохранить' : 'Saqlash'}
                        onClick={handleSave}
                        disabled={disabled}
                     />
                  </div>
               </div>
            ) : (
               <p className="text-primary text-sm">{note?.note}</p>
            )}
         </div>
      </div>
   )
}

const getTitle = ({ note }: { note: NoteItem }) => {
   const employeeName = note?.employeeFirstName || note?.employeeLastName || note?.employeeUsername
   const extName = note?.extUserFirstName || note?.extUserLastName || note?.extUserUsername
   if (employeeName) {
      return (
         <span>
            {note.employeeFirstName} {note.employeeLastName}
         </span>
      )
   } else if (extName) {
      return (
         <span>
            {note.extUserFirstName} {note.extUserLastName}
         </span>
      )
   } else {
      return <span>{note?.createdBy}</span>
   }
}

export default MciNoteCard
