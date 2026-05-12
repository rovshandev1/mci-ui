export interface NoteItem {
   id: number
   ticketId: number
   note: string
   employeeId?: number
   employeeUsername?: string
   employeeFirstName?: string
   employeeLastName?: string
   extUserId?: number
   extUserUsername?: string
   extUserFirstName?: string
   extUserLastName?: string
   isPublic: boolean
   createdDate: string
   createdBy?: string
   lastModifiedDate?: string
}
