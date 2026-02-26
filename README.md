# @mci-ui/mci-ui

React 19 uchun tayyor UI component kutubxonasi.

## Local Playground (Barcha Component Demo)

Repo ichida barcha componentlar ishlaydigan demo UI bor (`src/App.tsx`).

```bash
npm i
npm run dev
```

Eslatma:
- Demo UI library build bundle'iga qo'shilmaydi.
- `vite-plugin-dts` dan `src/App.tsx` va `src/main.tsx` exclude qilingan, shuning uchun npm paket hajmi ortib ketmaydi.

## 1. O'rnatish

```bash
npm i @mci-ui/mci-ui
```

Agar loyihangizda yo'q bo'lsa, peer dependency'larni ham o'rnating:

```bash
npm i @solar-icons/react clsx tailwind-merge
```

## 2. Style ulash (majburiy)

```tsx
import '@mci-ui/mci-ui/style.css'
```

## 3. Tez start

```tsx
import {
  MciButton,
  MciInput,
  MciModal,
  MciToast,
} from '@mci-ui/mci-ui'
import '@mci-ui/mci-ui/style.css'
import { useState } from 'react'

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6 space-y-4">
      <MciInput label="Login" placeholder="username" />

      <MciButton color="blue" onClick={() => setOpen(true)}>
        Modal ochish
      </MciButton>

      <MciButton variant="tertiary" onClick={() => MciToast.success('Saved')}>
        Toast
      </MciButton>

      <MciModal
        show={open}
        setShow={setOpen}
        title="Sarlavha"
        Body={<div>Modal body</div>}
      />
    </div>
  )
}
```

## 4. Componentlar bo'yicha qisqa qo'llanma

### MciButton

```tsx
<MciButton color="blue" variant="primary">Saqlash</MciButton>
<MciButton variant="outline" loading>Yuklanmoqda</MciButton>
```

### MciInput / MciTextarea / MciPhone / MciIdentityInput

```tsx
<MciInput label="Parol" type="password" showClearButton />
<MciTextarea label="Izoh" rows={4} />
<MciPhone label="Telefon" value={phone} onChange={setPhone} />
<MciIdentityInput mode="passport" value={doc} onChange={(v) => setDoc(v)} />
```

### MciSelect

```tsx
<MciSelect
  label="Status"
  value={status}
  onChange={setStatus}
  options={[
    { value: 'new', label: 'New' },
    { value: 'done', label: 'Done' },
  ]}
  clearable
  searchable
/>
```

### MciPicker (date/range)

```tsx
<MciPicker type="date" value={date} onChange={setDate} />
<MciPicker type="range" value={range} onChange={setRange} />
```

### MciCheck / MciToggle

```tsx
<MciCheck checked={checked} onChange={(e) => setChecked(e.target.checked)} />
<MciToggle checked={enabled} onChange={setEnabled} />
```

### MciUpload

```tsx
<MciUpload
  multiple
  accept="image/*,.pdf"
  maxFiles={10}
  maxSize={20}
  onFilesChange={(files) => console.log(files)}
/>
```

### MciTable + useTableColumnSettings + MciTableColumnsPanel

```tsx
import {
  MciTable,
  MciTableColumnsPanel,
  useTableColumnSettings,
  type MciTableColumn,
} from '@mci-ui/mci-ui'

type Row = { id: number; name: string; age: number }

const allColumns: MciTableColumn<Row>[] = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: 'Name', sortable: true },
  { key: 'age', title: 'Age', sortable: true, align: 'right' },
]

function DemoTable({ data }: { data: Row[] }) {
  const [panelOpen, setPanelOpen] = useState(false)

  const {
    orderedColumns,
    orderedAllColumns,
    hiddenKeys,
    toggleColumn,
    moveColumn,
    moveColumnByKey,
  } = useTableColumnSettings<Row>({
    storageKey: 'users-table-cols',
    columns: allColumns,
    minVisible: 5,
  })

  return (
    <div className="relative">
      <MciButton onClick={() => setPanelOpen((p) => !p)}>Columns</MciButton>

      <MciTable<Row>
        columns={orderedColumns}
        data={data}
        noDataText="Ma'lumot topilmadi"
      />

      <MciTableColumnsPanel<Row>
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        columns={orderedAllColumns}
        hidden={hiddenKeys}
        onToggle={toggleColumn}
        onMove={moveColumn}
        onMoveByKey={moveColumnByKey}
        minVisible={5}
      />
    </div>
  )
}
```

### MciModal / MciDrawer

```tsx
<MciModal
  show={isModalOpen}
  setShow={setModalOpen}
  title="Tasdiqlash"
  Body={<div>Body</div>}
  footer={<MciButton>OK</MciButton>}
/>

<MciDrawer
  isOpen={isDrawerOpen}
  onClose={() => setDrawerOpen(false)}
  title="Drawer"
  footer={<MciButton color="blue">Yuborish</MciButton>}
>
  <div>Kontent</div>
</MciDrawer>
```

### MciToast

```tsx
MciToast.success('Saved')
MciToast.error('Xatolik yuz berdi')
const loading = MciToast.loading('Yuklanmoqda...')
loading.close()
```

### MciTabs / MciBreadcrumb / MciPagination / MciCollapse

```tsx
<MciBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Users' }]} />

<MciTabs
  tabs={[
    { id: 'a', label: 'Tab A', content: <div>A</div> },
    { id: 'b', label: 'Tab B', content: <div>B</div> },
  ]}
/>

<MciPagination
  totalItems={300}
  currentPage={page}
  perPage={20}
  onPageChange={setPage}
/>

<MciCollapse title="Batafsil">
  <div>Cont</div>
</MciCollapse>
```

### MciTag / MciTooltip / MciSkeleton / MciLoader

```tsx
<MciTag variant="success">Active</MciTag>
<MciTooltip content="Info"><span>Hover</span></MciTooltip>
<MciSkeleton height={24} />
<MciLoader isLoading isFullPage={false} />
```

## 5. Export qilinadiganlar

- Componentlar: `MciButton`, `MciInput`, `MciSelect`, `MciPicker`, `MciTable`, ...
- Hook: `useTableColumnSettings`
- Type'lar: `MciTableColumn`, `MciTableProps`, `ColumnKey` va boshqa UI type'lar

## 6. NPM publish (Owner uchun)

```bash
npm run lint
npm run build
npm version patch
npm publish --access public
```

## 7. Consumer loyiha uchun minimal tekshiruv

1. `npm i @mci-ui/mci-ui`
2. `import '@mci-ui/mci-ui/style.css'`
3. React 19 ishlatayotganiga ishonch hosil qiling
4. Peer deps (`@solar-icons/react`, `clsx`, `tailwind-merge`) o'rnatilgan bo'lsin
