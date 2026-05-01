import { useEffect, useMemo, useState } from 'react'
import { Home, Settings, Ufo3, User } from '@solar-icons/react'
import {
  MciAccordion,
  MciBreadcrumb,
  MciButton,
  MciCheck,
  MciCollapse,
  MciDrawer,
  MciIdentityInput,
  MciInput,
  MciLoader,
  MciModal,
  MciPagination,
  MciPhone,
  MciPicker,
  MciSelect,
  MciSkeleton,
  MciTable,
  MciTableColumnsPanel,
  MciTabs,
  MciTag,
  MciTextarea,
  MciToast,
  MciToggle,
  MciTooltip,
  MciUpload,
  useTableColumnSettings,
  type DateValue,
  type MciTableColumn,
  type RangeValue,
} from './index.ts'

type DemoRow = {
  id: number
  name: string
  role: string
  status: string
  age: number
  city: string
  email: string
  createdAt: string
}

const DEMO_ROWS: DemoRow[] = [
  { id: 1, name: 'Ali Valiyev', role: 'Admin', status: 'Active', age: 29, city: 'Tashkent', email: 'ali@mail.com', createdAt: '2024-12-01' },
  { id: 2, name: 'Madina Karimova', role: 'Manager', status: 'Active', age: 31, city: 'Samarkand', email: 'madina@mail.com', createdAt: '2024-12-02' },
  { id: 3, name: 'Bekzod Ergashev', role: 'Operator', status: 'Blocked', age: 25, city: 'Bukhara', email: 'bekzod@mail.com', createdAt: '2024-12-03' },
  { id: 4, name: 'Saida Murodova', role: 'Analyst', status: 'Pending', age: 27, city: 'Namangan', email: 'saida@mail.com', createdAt: '2024-12-04' },
  { id: 5, name: 'Javohir Nematov', role: 'Support', status: 'Active', age: 26, city: 'Andijan', email: 'javohir@mail.com', createdAt: '2024-12-05' },
  { id: 6, name: 'Dilnoza Akbarova', role: 'HR', status: 'Active', age: 30, city: 'Fergana', email: 'dilnoza@mail.com', createdAt: '2024-12-06' },
  { id: 7, name: 'Umid Islomov', role: 'Operator', status: 'Pending', age: 24, city: 'Nukus', email: 'umid@mail.com', createdAt: '2024-12-07' },
  { id: 8, name: 'Shahnoza Raximova', role: 'Manager', status: 'Blocked', age: 28, city: 'Qarshi', email: 'shahnoza@mail.com', createdAt: '2024-12-08' },
]

const BREADCRUMB_VARIANTS = ['blue', 'yellow'] as const
const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'danger', 'tertiary'] as const
const BUTTON_COLORS = ['blue', 'yellow'] as const
const FIELD_SIZES = ['sm', 'md', 'base'] as const
const TAG_VARIANTS = ['success', 'warning', 'error', 'gray', 'blue'] as const
const TAG_SIZES = ['sm', 'md', 'lg'] as const
const TONE_VARIANTS = ['blue', 'yellow'] as const
const SKELETON_VARIANTS = ['default', 'rounded', 'circle'] as const
const PAGINATION_VARIANTS = ['blue', 'yellow'] as const
const PAGINATION_SIZES = ['medium', 'large'] as const
const PER_PAGE_OPTIONS = ['5', '10', '15'] as const
const UPLOAD_VARIANTS = ['yellow', 'blue'] as const

function ControlSelect({
                         label,
                         value,
                         options,
                         onChange,
                       }: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
      <label className="demo-control">
        <span className="demo-control-label">{label}</span>
        <select className="demo-control-input" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
          ))}
        </select>
      </label>
  )
}

function ControlCheckbox({
                           label,
                           checked,
                           onChange,
                         }: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
      <label className="demo-control-check">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
      <section className="demo-section">
        <h2 className="demo-section-title">{title}</h2>
        {children}
      </section>
  )
}

export default function App() {
  const [appDarkMode, setAppDarkMode] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)

  const [inputValue, setInputValue] = useState('')
  const [textValue, setTextValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [identityValue, setIdentityValue] = useState('')
  const [selectValue, setSelectValue] = useState<string | number>('new')
  const [dateValue, setDateValue] = useState<DateValue>(null)
  const [rangeValue, setRangeValue] = useState<RangeValue>([null, null])

  const [checked, setChecked] = useState(false)
  const [enabled, setEnabled] = useState(true)
  const [showLoader, setShowLoader] = useState(false)

  const [breadcrumbVariant, setBreadcrumbVariant] = useState<(typeof BREADCRUMB_VARIANTS)[number]>('blue')
  const [buttonVariant, setButtonVariant] = useState<(typeof BUTTON_VARIANTS)[number]>('primary')
  const [buttonColor, setButtonColor] = useState<(typeof BUTTON_COLORS)[number]>('blue')
  const [buttonSize, setButtonSize] = useState<(typeof FIELD_SIZES)[number]>('base')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [tagVariant, setTagVariant] = useState<(typeof TAG_VARIANTS)[number]>('blue')
  const [tagSize, setTagSize] = useState<(typeof TAG_SIZES)[number]>('md')
  const [tagRounded, setTagRounded] = useState(false)
  const [fieldSize, setFieldSize] = useState<(typeof FIELD_SIZES)[number]>('base')
  const [toneVariant, setToneVariant] = useState<(typeof TONE_VARIANTS)[number]>('blue')
  const [skeletonVariant, setSkeletonVariant] = useState<(typeof SKELETON_VARIANTS)[number]>('default')
  const [uploadVariant, setUploadVariant] = useState<(typeof UPLOAD_VARIANTS)[number]>('yellow')
  const [paginationVariant, setPaginationVariant] = useState<(typeof PAGINATION_VARIANTS)[number]>('yellow')
  const [paginationSize, setPaginationSize] = useState<(typeof PAGINATION_SIZES)[number]>('large')

  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string | number>>([])

  const effectiveButtonDarkMode = appDarkMode

  const totalPages = Math.max(1, Math.ceil(DEMO_ROWS.length / perPage))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pagedRows = useMemo(() => {
    const start = (page - 1) * perPage
    return DEMO_ROWS.slice(start, start + perPage)
  }, [page, perPage])

  const demoColumns = useMemo<MciTableColumn<DemoRow>[]>(() => [
    { key: 'id', title: 'ID', width: 72, sortable: true, align: 'right' },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'role', title: 'Role', sortable: true },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => {
        const status = String(value)
        if (status === 'Active') return <MciTag variant="success" size="sm" darkMode={appDarkMode}>Active</MciTag>
        if (status === 'Pending') return <MciTag variant="warning" size="sm" darkMode={appDarkMode}>Pending</MciTag>
        return <MciTag variant="error" size="sm" darkMode={appDarkMode}>Blocked</MciTag>
      },
    },
    { key: 'age', title: 'Age', sortable: true, align: 'right' },
    { key: 'city', title: 'City', sortable: true },
    { key: 'email', title: 'Email' },
    { key: 'createdAt', title: 'Created', sortable: true },
  ], [appDarkMode])

  const {
    orderedColumns,
    orderedAllColumns,
    hiddenKeys,
    toggleColumn,
    moveColumn,
    moveColumnByKey,
  } = useTableColumnSettings<DemoRow>({
    storageKey: 'mci-demo-columns',
    columns: demoColumns,
    minVisible: 5,
  })

  return (
      <div className={appDarkMode ? 'demo-root demo-root-dark' : 'demo-root'}>
        <div className="demo-shell">
          <header className="demo-header">
            <div className="demo-header-top">
              <MciBreadcrumb
                  variant={breadcrumbVariant}
                  darkMode={appDarkMode}
                  items={[
                    { label: 'Home', href: '#', icon: <Home size={18} /> },
                    { label: 'Library', href: '#' },
                    { label: 'Playground', icon: <Settings size={18} /> },
                  ]}
              />
              <MciButton
                  variant={appDarkMode ? 'secondary' : 'outline'}
                  color="blue"
                  darkMode={appDarkMode}
                  onClick={() => setAppDarkMode((prev) => !prev)}
              >
                {appDarkMode ? 'Light demo' : 'Dark demo'}
              </MciButton>
            </div>
            <div className="demo-top-gap">
              <ControlSelect
                  label="Breadcrumb variant"
                  value={breadcrumbVariant}
                  options={BREADCRUMB_VARIANTS}
                  onChange={(value) => setBreadcrumbVariant(value as (typeof BREADCRUMB_VARIANTS)[number])}
              />
            </div>
            <p className="demo-note">Bu sahifa barcha componentlarni real ishlatib ko'rish uchun demo UI.</p>
          </header>

          <Section title="Buttons, Tag, Tooltip, Toast">
            <div className="demo-controls-grid">
              <ControlSelect
                  label="Button variant"
                  value={buttonVariant}
                  options={BUTTON_VARIANTS}
                  onChange={(value) => setButtonVariant(value as (typeof BUTTON_VARIANTS)[number])}
              />
              <ControlSelect
                  label="Button color"
                  value={buttonColor}
                  options={BUTTON_COLORS}
                  onChange={(value) => setButtonColor(value as (typeof BUTTON_COLORS)[number])}
              />
              <ControlSelect
                  label="Button size"
                  value={buttonSize}
                  options={FIELD_SIZES}
                  onChange={(value) => setButtonSize(value as (typeof FIELD_SIZES)[number])}
              />
              <ControlCheckbox label="Button loading" checked={buttonLoading} onChange={setButtonLoading} />
              <ControlCheckbox label="Button disabled" checked={buttonDisabled} onChange={setButtonDisabled} />
              <ControlSelect
                  label="Tag variant"
                  value={tagVariant}
                  options={TAG_VARIANTS}
                  onChange={(value) => setTagVariant(value as (typeof TAG_VARIANTS)[number])}
              />
              <ControlSelect
                  label="Tag size"
                  value={tagSize}
                  options={TAG_SIZES}
                  onChange={(value) => setTagSize(value as (typeof TAG_SIZES)[number])}
              />
              <ControlCheckbox label="Tag rounded" checked={tagRounded} onChange={setTagRounded} />
            </div>

            <div className={effectiveButtonDarkMode ? 'demo-row demo-wrap demo-dark-preview' : 'demo-row demo-wrap'}>
              <MciButton
                  color={buttonColor}
                  variant={buttonVariant}
                  size={buttonSize}
                  darkMode={effectiveButtonDarkMode}
                  loading={buttonLoading}
                  disabled={buttonDisabled}
              >
                Button Preview
              </MciButton>
              <MciTag variant={tagVariant} size={tagSize} rounded={tagRounded} darkMode={appDarkMode}>
                Tag Preview
              </MciTag>
              <MciTooltip content="Tooltip ishlayapti">
                <span className="demo-link">Hover me</span>
              </MciTooltip>
              <MciButton
                  color="blue"
                  darkMode={effectiveButtonDarkMode}
                  onClick={() =>
                      MciToast.success({
                        title: 'Saved',
                        description: 'Component muvaffaqiyatli ishga tushdi',
                        darkMode: appDarkMode,
                      })
                  }
              >
                Toast Success
              </MciButton>
            </div>
          </Section>

          <Section title="Inputs">
            <div className="demo-controls-grid">
              <ControlSelect
                  label="Field size"
                  value={fieldSize}
                  options={FIELD_SIZES}
                  onChange={(value) => setFieldSize(value as (typeof FIELD_SIZES)[number])}
              />
            </div>

            <div className="demo-grid-2">
              <MciInput
                  label="MciInput"
                  size={fieldSize}
                  darkMode={appDarkMode}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type..."
                  showClearButton
                  onClear={() => setInputValue('')}
              />

              <MciSelect
                  label="MciSelect"
                  size={fieldSize}
                  darkMode={appDarkMode}
                  value={selectValue}
                  onChange={setSelectValue}
                  clearable
                  searchable
                  options={[
                    { value: 'new', label: 'New' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'done', label: 'Done' },
                  ]}
              />

              <MciPhone label="MciPhone" size={fieldSize} darkMode={appDarkMode} value={phoneValue} onChange={setPhoneValue} showIcon />

              <MciIdentityInput
                  label="MciIdentityInput"
                  darkMode={appDarkMode}
                  mode="passport"
                  value={identityValue}
                  onChange={(val) => setIdentityValue(val)}
              />

              <MciPicker
                  label="MciPicker Date"
                  type="date"
                  darkMode={appDarkMode}
                  value={dateValue}
                  onChange={(val) => setDateValue(val as DateValue)}
              />

              <MciPicker
                  label="MciPicker Range"
                  type="range"
                  darkMode={appDarkMode}
                  value={rangeValue}
                  onChange={(val) => setRangeValue(val as RangeValue)}
              />

              <div className="demo-span-2">
                <MciTextarea
                    label="MciTextarea"
                    darkMode={appDarkMode}
                    value={textValue}
                    onChange={setTextValue}
                    placeholder="Izoh..."
                />
              </div>
            </div>
          </Section>

          <Section title="Check, Toggle, Collapse, Skeleton, Loader">
            <div className="demo-controls-grid">
              <ControlSelect
                  label="Tone variant"
                  value={toneVariant}
                  options={TONE_VARIANTS}
                  onChange={(value) => setToneVariant(value as (typeof TONE_VARIANTS)[number])}
              />
              <ControlSelect
                  label="Skeleton variant"
                  value={skeletonVariant}
                  options={SKELETON_VARIANTS}
                  onChange={(value) => setSkeletonVariant(value as (typeof SKELETON_VARIANTS)[number])}
              />
            </div>

            <div className="demo-grid-2">
              <div className="demo-stack">
                <MciCheck
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    label="MciCheck"
                    supportText="Support text"
                    variant={toneVariant}
                    darkMode={appDarkMode}
                />
                <MciToggle
                    checked={enabled}
                    onChange={setEnabled}
                    label="MciToggle"
                    supportText="Support text"
                    variant={toneVariant}
                    darkMode={appDarkMode}
                />

                <MciCollapse title="MciCollapse" darkMode={appDarkMode}>
                  <div className="demo-note">Collapsible content ishlayapti.</div>
                </MciCollapse>

                <MciAccordion icon={<Ufo3 weight="Linear" size={30} />}>
                  <MciAccordion.Title className="flex w-full items-center justify-between px-1">
                    <p>MciAccordion</p>
                    <div className="flex items-center gap-3 text-extra-small font-normal text-slate-700">
                      <p>John Doe</p>
                      <span className="h-6 w-px bg-slate-200"></span>
                      <p>{new Date().toLocaleDateString()}</p>
                    </div>
                  </MciAccordion.Title>
                  <MciAccordion.Content>
                    <div className="demo-note">Accordion content ishlayapti.</div>
                  </MciAccordion.Content>
                </MciAccordion>
              </div>

              <div className="demo-stack">
                <div className="demo-skeleton-grid">
                  <MciSkeleton
                      variant={skeletonVariant}
                      width={skeletonVariant === 'circle' ? 40 : '100%'}
                      height={skeletonVariant === 'circle' ? 40 : 20}
                      darkMode={appDarkMode}
                  />
                  <MciSkeleton variant="rounded" height={20} darkMode={appDarkMode} />
                  <MciSkeleton variant="circle" width={40} height={40} darkMode={appDarkMode} />
                </div>

                <div className="demo-loader-box">
                  <MciLoader isLoading={showLoader} isFullPage={false} variant={toneVariant} />
                  <div className="demo-note">MciLoader container</div>
                </div>

                <MciButton
                    variant="secondary"
                    color="blue"
                    darkMode={effectiveButtonDarkMode}
                    onClick={() => setShowLoader((s) => !s)}
                >
                  Loader Toggle
                </MciButton>
              </div>
            </div>
          </Section>

          <Section title="Modal, Drawer, Upload">
            <div className="demo-controls-grid">
              <ControlSelect
                  label="Upload variant"
                  value={uploadVariant}
                  options={UPLOAD_VARIANTS}
                  onChange={(value) => setUploadVariant(value as (typeof UPLOAD_VARIANTS)[number])}
              />
            </div>

            <div className="demo-row demo-wrap">
              <MciButton color="blue" darkMode={effectiveButtonDarkMode} onClick={() => setModalOpen(true)}>Open Modal</MciButton>
              <MciButton variant="tertiary" darkMode={effectiveButtonDarkMode} onClick={() => setDrawerOpen(true)}>Open Drawer</MciButton>
            </div>

            <div className="demo-top-gap">
              <MciUpload
                  multiple
                  maxFiles={6}
                  maxSize={10}
                  showPreview
                  locale="uz"
                  variant={uploadVariant}
              />
            </div>

            <MciModal
                show={modalOpen}
                setShow={setModalOpen}
                title="Demo Modal"
                Body={<div className="demo-note">Modal kontenti.</div>}
                footer={<MciButton color="blue" darkMode={effectiveButtonDarkMode} onClick={() => setModalOpen(false)}>Close</MciButton>}
            />

            <MciDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Demo Drawer"
                footer={<MciButton color="blue" darkMode={effectiveButtonDarkMode} onClick={() => setDrawerOpen(false)}>Yopish</MciButton>}
            >
              <div className="demo-stack">
                <p className="demo-note">Drawer ichida istalgan form/ma'lumot joylashtirish mumkin.</p>
                <p className="demo-note">Yopiq holatda strip artefakt chiqmaydi.</p>
              </div>
            </MciDrawer>
          </Section>

          <Section title="Tabs">
            <MciTabs
                darkMode={appDarkMode}
                tabs={[
                  {
                    id: 'profile',
                    label: 'Profile',
                    icon: <User size={18} />,
                    content: <div className="demo-note">Profile tab content</div>,
                  },
                  {
                    id: 'settings',
                    label: 'Settings',
                    icon: <Settings size={18} />,
                    content: <div className="demo-note">Settings tab content</div>,
                  },
                ]}
            />
          </Section>

          <Section title="Table + Column Settings + Pagination">
            <div className="demo-controls-grid">
              <ControlSelect
                  label="Pagination variant"
                  value={paginationVariant}
                  options={PAGINATION_VARIANTS}
                  onChange={(value) => setPaginationVariant(value as (typeof PAGINATION_VARIANTS)[number])}
              />
              <ControlSelect
                  label="Pagination size"
                  value={paginationSize}
                  options={PAGINATION_SIZES}
                  onChange={(value) => setPaginationSize(value as (typeof PAGINATION_SIZES)[number])}
              />
              <ControlSelect
                  label="Per page"
                  value={String(perPage)}
                  options={PER_PAGE_OPTIONS}
                  onChange={(value) => {
                    setPerPage(Number(value))
                    setPage(1)
                  }}
              />
            </div>

            <div className="demo-table-head">
              <MciButton variant="tertiary" darkMode={effectiveButtonDarkMode} onClick={() => setPanelOpen((v) => !v)}>
                Columns Panel
              </MciButton>

              <MciTableColumnsPanel<DemoRow>
                  open={panelOpen}
                  onClose={() => setPanelOpen(false)}
                  columns={orderedAllColumns}
                  hidden={hiddenKeys}
                  onToggle={toggleColumn}
                  onMove={moveColumn}
                  onMoveByKey={moveColumnByKey}
                  minVisible={5}
                  locale="uz"
                  darkMode={appDarkMode}
              />
            </div>

            <MciTable<DemoRow>
                columns={orderedColumns}
                data={pagedRows}
                noDataText="No data"
                darkMode={appDarkMode}
                rowSelection={{
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                  getCheckboxProps: (row) => ({ disabled: row.status === 'Blocked' }),
                }}
            />

            <div className="demo-top-gap">
              <MciPagination
                  totalItems={DEMO_ROWS.length}
                  currentPage={page}
                  perPage={perPage}
                  darkMode={appDarkMode}
                  onPageChange={setPage}
                  onPerPageChange={(value) => {
                    setPerPage(value)
                    setPage(1)
                  }}
                  perPageOptions={[5, 10, 15]}
                  showPerPage
                  variant={paginationVariant}
                  size={paginationSize}
              />
            </div>
          </Section>
        </div>
      </div>
  )
}
