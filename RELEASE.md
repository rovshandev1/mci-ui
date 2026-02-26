# Release Guide (Owner)

NPM publish qilish uchun qisqa checklist.

## 1. Tekshiruv

```bash
npm run lint
npm run build
```

## 2. Versiyani oshirish

```bash
npm version patch
```

## 3. Publish

```bash
npm publish --access public
```

## 4. Tekshirish

- NPM sahifada yangi versiya chiqganini tasdiqlang
- `README` consumer uchun toza ko'rinishda ekanini tekshiring
