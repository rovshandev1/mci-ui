import { SortFromBottomToTop, SortFromTopToBottom, SortVertical } from '@solar-icons/react'
import { type ChangeEvent, type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MciCheck, MciEmpty, MciSkeleton } from '../../../index.ts'
import { cn } from '../../lib/utils'
import type { MciTableColumn, MciTableProps, MciTableSort } from '../../types/mci-table.types.ts'
import MciTableClamp2 from './MciTableClamp2'
import { normalizeColWidth, sortRows } from './mci-table.utils'

const DEFAULT_COLUMN_MIN_WIDTH = 160
const ACTION_COLUMN_MIN_WIDTH = 72
const SELECTION_COLUMN_WIDTH = 48

const isActionColumn = <T extends Record<string, unknown>>(col: MciTableColumn<T>) => {
   const key = String(col.key).toLowerCase()
   const title = col.title.toLowerCase()

   return (
      key === 'action' ||
      key === 'actions' ||
      key.includes('action') ||
      title === 'action' ||
      title === 'actions' ||
      title.includes('action')
   )
}

const getColumnMinWidth = <T extends Record<string, unknown>>(col: MciTableColumn<T>) => {
   if (typeof col.width === 'number') return col.width
   if (typeof col.width === 'string' && col.width.endsWith('px')) {
      const value = Number.parseFloat(col.width)
      if (Number.isFinite(value)) return value
   }

   return isActionColumn(col) ? ACTION_COLUMN_MIN_WIDTH : DEFAULT_COLUMN_MIN_WIDTH
}

export default function MciTable<T extends Record<string, unknown>>({
   columns,
   data = [],
   loading = false,
   skeletonRows = 5,
   noDataText = '',
   noDataImage,
   noDataImageSrc,
   noDataInfo,
   acceptLanguage = 'uz',
   sort: externalSort,
   onSortChange,
   className,
   headerClassName,
   bodyClassName,
   darkMode = false,
   variant = 'orange',
   size,
   rowKey = 'id' as keyof T,
   rowSelection,
}: MciTableProps<T>) {
   const headerScrollRef = useRef<HTMLDivElement>(null)
   const bodyScrollRef = useRef<HTMLDivElement>(null)
   const isSyncingScrollRef = useRef(false)
   const [localSort, setLocalSort] = useState<MciTableSort<T> | null>(null)

   const activeSort = externalSort ?? localSort
   const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data])

   const sortedData = useMemo(() => {
      return sortRows(safeData, activeSort, Boolean(externalSort))
   }, [safeData, activeSort, externalSort])

   useEffect(() => {
      if (externalSort !== undefined) setLocalSort(null)
   }, [externalSort])

   const displayData = useMemo(
      () => (loading ? [] : externalSort ? safeData : sortedData),
      [loading, externalSort, safeData, sortedData]
   )

   const tableMinWidth = useMemo(
      () =>
         columns.reduce(
            (total, col) => total + getColumnMinWidth(col),
            rowSelection ? SELECTION_COLUMN_WIDTH : 0
         ),
      [columns, rowSelection]
   )

   const updateSectionScrollState = useCallback((source?: HTMLDivElement | null) => {
      const headerScroll = headerScrollRef.current
      const bodyScroll = bodyScrollRef.current
      if (!headerScroll && !bodyScroll) return

      const scrollLeft =
         source?.scrollLeft ?? bodyScroll?.scrollLeft ?? headerScroll?.scrollLeft ?? 0

      const maxScrollLeft = Math.max(
         headerScroll ? headerScroll.scrollWidth - headerScroll.clientWidth : 0,
         bodyScroll ? bodyScroll.scrollWidth - bodyScroll.clientWidth : 0
      )

      const showStickyScrollShadow =
         maxScrollLeft > 1 && scrollLeft < maxScrollLeft - 1

      for (const element of [headerScroll, bodyScroll]) {
         if (!element) continue
         element.classList.toggle('mci-table-sticky-scrolled', showStickyScrollShadow)
      }
   }, [])

   const syncScrollPosition = useCallback(
      (source: HTMLDivElement) => {
         if (isSyncingScrollRef.current) return

         isSyncingScrollRef.current = true
         const { scrollLeft } = source

         for (const element of [headerScrollRef.current, bodyScrollRef.current]) {
            if (!element || element === source) continue
            element.scrollLeft = scrollLeft
         }

         updateSectionScrollState(source)
         requestAnimationFrame(() => {
            isSyncingScrollRef.current = false
         })
      },
      [updateSectionScrollState]
   )

   useEffect(() => {
      const headerScroll = headerScrollRef.current
      const bodyScroll = bodyScrollRef.current
      if (!headerScroll && !bodyScroll) return

      const onHeaderScroll = () => {
         if (headerScrollRef.current) syncScrollPosition(headerScrollRef.current)
      }
      const onBodyScroll = () => {
         if (bodyScrollRef.current) syncScrollPosition(bodyScrollRef.current)
      }

      const updateOverflow = () => {
         const headerScroll = headerScrollRef.current
         const bodyScroll = bodyScrollRef.current
         const anchor = bodyScroll ?? headerScroll
         if (!anchor) return

         const { scrollLeft } = anchor
         if (headerScroll) headerScroll.scrollLeft = scrollLeft
         if (bodyScroll) bodyScroll.scrollLeft = scrollLeft

         updateSectionScrollState(anchor)
      }

      updateOverflow()
      headerScroll?.addEventListener('scroll', onHeaderScroll, { passive: true })
      bodyScroll?.addEventListener('scroll', onBodyScroll, { passive: true })

      if (typeof ResizeObserver === 'undefined') {
         window.addEventListener('resize', updateOverflow)
         return () => {
            window.removeEventListener('resize', updateOverflow)
            headerScroll?.removeEventListener('scroll', onHeaderScroll)
            bodyScroll?.removeEventListener('scroll', onBodyScroll)
         }
      }

      const resizeObserver = new ResizeObserver(updateOverflow)
      if (headerScroll) resizeObserver.observe(headerScroll)
      if (bodyScroll) resizeObserver.observe(bodyScroll)

      return () => {
         resizeObserver.disconnect()
         headerScroll?.removeEventListener('scroll', onHeaderScroll)
         bodyScroll?.removeEventListener('scroll', onBodyScroll)
      }
   }, [tableMinWidth, columns.length, displayData.length, syncScrollPosition, updateSectionScrollState])

   const handleSort = useCallback(
      (col: MciTableColumn<T>) => {
         if (!col.sortable) return

         let nextSort: MciTableSort<T> | null = null

         if (activeSort?.key !== col.key) nextSort = { key: col.key, direction: 'asc' }
         else if (activeSort.direction === 'asc') nextSort = { key: col.key, direction: 'desc' }

         if (externalSort !== undefined) onSortChange?.(nextSort)
         else setLocalSort(nextSort)
      },
      [activeSort, externalSort, onSortChange]
   )

   const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
      if (!rowSelection) return

      const { onChange, getCheckboxProps } = rowSelection
      const checked = e.target.checked

      if (checked) {
         const selectableRows = displayData.filter((row) => !getCheckboxProps?.(row)?.disabled)
         const newSelectedKeys = selectableRows.map((row) => row[rowKey] as string | number)
         onChange(newSelectedKeys)
      } else {
         onChange([])
      }
   }

   const handleSelectRow = (row: T, checked: boolean) => {
      if (!rowSelection) return
      const { selectedRowKeys, onChange } = rowSelection
      const key = row[rowKey] as string | number

      const next = checked ? [...selectedRowKeys, key] : selectedRowKeys.filter((k) => k !== key)
      onChange(next)
   }

   const isAllSelected = useMemo(() => {
      if (!rowSelection || displayData.length === 0) return false
      const selectableRows = displayData.filter(
         (row) => !rowSelection.getCheckboxProps?.(row)?.disabled
      )
      if (selectableRows.length === 0) return false
      return selectableRows.every((row) =>
         rowSelection.selectedRowKeys.includes(row[rowKey] as string | number)
      )
   }, [rowSelection, displayData, rowKey])

   const getSortIcon = (col: MciTableColumn<T>) => {
      const iconClassName = cn(darkMode ? 'text-neutral-100' : 'text-slate-base', 'shrink-0')
      if (!col.sortable) return null
      if (!activeSort || activeSort.key !== col.key) {
         return <SortVertical weight="Linear" size={20} className={iconClassName} />
      }
      return activeSort.direction === 'asc' ? (
         <SortFromTopToBottom weight="Linear" size={20} className={iconClassName} />
      ) : (
         <SortFromBottomToTop weight="Linear" size={20} className={iconClassName} />
      )
   }

   const lastColumnMinWidth = useMemo(
      () => (columns.length > 0 ? getColumnMinWidth(columns[columns.length - 1]!) : 0),
      [columns]
   )

   const renderColGroup = () => (
      <colgroup>
         {rowSelection && <col style={{ width: 48 }} />}
         {columns.map((col, colIndex) => (
            <col
               key={col.key}
               style={{
                  width: normalizeColWidth(col.width) ?? (isActionColumn(col) ? '1%' : 'auto'),
                  ...(colIndex === columns.length - 1
                     ? { minWidth: lastColumnMinWidth }
                     : undefined),
               }}
            />
         ))}
      </colgroup>
   )

   const rowBorderClass = darkMode ? 'border-neutral-200' : 'border-slate-200'

   const getStickyLastColumnClass = (
      index: number,
      section: 'header' | 'body',
      options?: { isLastRow?: boolean }
   ) => {
      if (index !== columns.length - 1) return undefined

      return cn(
         'sticky right-0 box-border min-w-[var(--mci-table-sticky-last-min-width)] transition-shadow duration-150',
         section === 'header' ? 'z-30 rounded-tr-xl' : 'z-20',
         options?.isLastRow && 'rounded-br-xl',
         section === 'header'
            ? darkMode
               ? 'bg-neutral-300'
               : 'bg-slate-100'
            : darkMode
              ? 'bg-neutral-300 group-hover:bg-neutral-100/35'
              : 'bg-white group-hover:bg-slate-50'
      )
   }

   const stickyLastColumnShadowClass =
      '[&.mci-table-sticky-scrolled_th:last-child]:shadow-md [&.mci-table-sticky-scrolled_td:last-child]:shadow-md'

   const borderClass = darkMode ? 'border-neutral-200' : 'border-slate-200'

   const headerCardClass = cn(
      'relative z-0 overflow-hidden rounded-xl border',
      borderClass,
      darkMode ? 'bg-neutral-300' : 'bg-slate-100'
   )

   const bodyCardClass = cn(
      'relative z-[1] -mt-px overflow-hidden rounded-xl border',
      borderClass,
      darkMode ? 'bg-neutral-300' : 'bg-white'
   )

   const sectionScrollClass = cn(
      'w-full min-w-0 overflow-x-auto',
      stickyLastColumnShadowClass,
      '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
   )

   const tableClass = 'w-full table-fixed border-separate border-spacing-0'
   const bodyCellSizeClass = size === 'md' ? 'h-12 py-1' : 'h-16 py-3'

   return (
      <div className={cn('relative w-full min-w-0', className)}>
         <div
            style={
               {
                  '--mci-table-sticky-last-min-width': `${lastColumnMinWidth}px`,
               } as CSSProperties
            }
         >
            <div className="flex flex-col gap-0">
               <div className={headerCardClass}>
                  <div ref={headerScrollRef} className={sectionScrollClass}>
                     <table className={tableClass} style={{ minWidth: tableMinWidth }}>
                        {renderColGroup()}
                        <thead>
                           <tr>
                                 {rowSelection && (
                                    <th
                                       className={cn(
                                          'w-12 px-4 py-3 align-middle',
                                          headerClassName
                                       )}
                                    >
                                    <div className="flex items-center justify-center">
                                       <MciCheck
                                          checked={isAllSelected}
                                          onChange={handleSelectAll}
                                          variant={variant}
                                          darkMode={darkMode}
                                          disabled={loading || displayData.length === 0}
                                       />
                                    </div>
                                 </th>
                              )}

                              {columns.map((col, colIndex) => (
                                 <th
                                    key={col.key}
                                    onClick={() => handleSort(col)}
                                    className={cn(
                                       'px-4 py-3 text-left text-sm font-medium transition-colors align-middle',
                                       darkMode ? 'text-neutral-50' : 'text-slate-700',
                                       'overflow-hidden text-ellipsis whitespace-nowrap',
                                       colIndex === columns.length - 1 && 'overflow-visible',
                                       isActionColumn(col) && 'w-px',
                                       col.align === 'center' && 'text-center',
                                       col.align === 'right' && 'text-right',
                                       col.sortable
                                          ? darkMode
                                             ? 'cursor-pointer hover:bg-neutral-200'
                                             : 'cursor-pointer hover:bg-slate-200'
                                          : 'cursor-default',
                                       getStickyLastColumnClass(colIndex, 'header'),
                                       headerClassName
                                    )}
                                 >
                                    <div
                                       className={cn(
                                          'flex min-w-0 items-center gap-1',
                                          col.align === 'center' && 'justify-center',
                                          col.align === 'right' && 'justify-end'
                                       )}
                                    >
                                       <span className="min-w-0 truncate" title={col.title}>
                                          {col.title}
                                       </span>
                                       {getSortIcon(col)}
                                    </div>
                                 </th>
                              ))}
                           </tr>
                        </thead>
                     </table>
                  </div>
               </div>

               <div className={bodyCardClass}>
                  <div ref={bodyScrollRef} className={sectionScrollClass}>
                     <table className={tableClass} style={{ minWidth: tableMinWidth }}>
                        {renderColGroup()}
                        <tbody>
                        {loading ? (
                           Array.from({ length: skeletonRows }).map((_, idx) => (
                              <tr key={idx}>
                                 {rowSelection && (
                                    <td
                                       className={cn(
                                          'w-12 border-b px-4 align-middle',
                                          bodyCellSizeClass,
                                          rowBorderClass,
                                          idx === skeletonRows - 1 && 'rounded-bl-xl',
                                          idx === skeletonRows - 1 && 'border-b-0'
                                       )}
                                    >
                                       <MciSkeleton height={20} width={20} variant="rounded" />
                                    </td>
                                 )}
                                 {columns.map((c, colIndex) => (
                                    <td
                                       key={c.key}
                                       className={cn(
                                          'border-b px-4 align-middle',
                                          bodyCellSizeClass,
                                          rowBorderClass,
                                          !rowSelection &&
                                             colIndex === 0 &&
                                             idx === skeletonRows - 1 &&
                                             'rounded-bl-xl',
                                          getStickyLastColumnClass(colIndex, 'body', {
                                             isLastRow: idx === skeletonRows - 1,
                                          }),
                                          colIndex === columns.length - 1 &&
                                             idx === skeletonRows - 1 &&
                                             'rounded-br-xl',
                                          idx === skeletonRows - 1 && 'border-b-0'
                                       )}
                                    >
                                       <MciSkeleton height={30} variant="rounded" />
                                    </td>
                                 ))}
                              </tr>
                           ))
                        ) : displayData.length === 0 ? (
                           <tr>
                              <td
                                 colSpan={columns.length + (rowSelection ? 1 : 0)}
                                 className="py-20 align-middle"
                              >
                                 <MciEmpty
                                    title={noDataText || undefined}
                                    image={noDataImage}
                                    imageSrc={noDataImageSrc}
                                    description={noDataInfo}
                                    locale={acceptLanguage}
                                 />
                              </td>
                           </tr>
                        ) : (
                           displayData.map((row, idx) => {
                              const key = row[rowKey] as string | number
                              const isSelected = rowSelection?.selectedRowKeys.includes(key)
                              const isDisabled = rowSelection?.getCheckboxProps?.(row)?.disabled
                              const isLastRow = idx === displayData.length - 1

                              return (
                                 <tr
                                    key={idx}
                                    className={cn(
                                       'group transition-colors',
                                       darkMode ? 'hover:bg-neutral-100/35' : 'hover:bg-slate-50'
                                    )}
                                 >
                                    {rowSelection && (
                                       <td
                                          className={cn(
                                             'w-12 border-b px-4 align-middle',
                                             bodyCellSizeClass,
                                             rowBorderClass,
                                             isLastRow && 'rounded-bl-xl',
                                             isLastRow && 'border-b-0',
                                             bodyClassName
                                          )}
                                       >
                                          <div className="flex items-center justify-center">
                                             <MciCheck
                                                checked={isSelected}
                                                disabled={isDisabled}
                                                variant={variant}
                                                darkMode={darkMode}
                                                onChange={(e) =>
                                                   handleSelectRow(row, e.target.checked)
                                                }
                                             />
                                          </div>
                                       </td>
                                    )}

                                    {columns.map((col, colIndex) => {
                                       const cellValue = row[col.key]
                                       const raw = col.render
                                          ? col.render(cellValue as T[Extract<keyof T, string>], row)
                                          : String(cellValue ?? '-')

                                       return (
                                          <td
                                             key={col.key}
                                             className={cn(
                                                'overflow-hidden border-b px-4 text-sm font-normal align-middle',
                                                bodyCellSizeClass,
                                                rowBorderClass,
                                                darkMode ? 'text-neutral-50' : 'text-black',
                                                'min-w-0 whitespace-normal',
                                                isActionColumn(col) && 'w-px whitespace-nowrap',
                                                col.align === 'center' && 'text-center',
                                                col.align === 'right' && 'text-right',
                                                !rowSelection && colIndex === 0 && isLastRow && 'rounded-bl-xl',
                                                getStickyLastColumnClass(colIndex, 'body', {
                                                   isLastRow,
                                                }),
                                                colIndex === columns.length - 1 && isLastRow && 'rounded-br-xl',
                                                isLastRow && 'border-b-0',
                                                bodyClassName,
                                                col.className
                                             )}
                                          >
                                             <div
                                                className={cn(
                                                   'flex min-w-0 items-center',
                                                   col.align === 'center' && 'justify-center',
                                                   col.align === 'right' && 'justify-end'
                                                )}
                                             >
                                                <MciTableClamp2
                                                   title={typeof raw === 'string' ? raw : undefined}
                                                >
                                                   {raw}
                                                </MciTableClamp2>
                                             </div>
                                          </td>
                                       )
                                    })}
                                 </tr>
                              )
                           })
                        )}
                     </tbody>
                  </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
