# Future Plans for Class

## 🧠 Utility Class Plans

---

### 1. **`Validator`**

A class to handle schema-less validations (complementary to Zod/Valibot/Yup). Useful for quick, custom rules.

```ts
const isValidEmail = Validator.email('test@example.com');
const isValidUrl = Validator.url('https://site.dev');
```

---

### 2. **`Currency`**

Handles formatting, parsing, and conversion of currencies across locales.

```ts
const currency = new Currency(1025.5, 'USD');
currency.format('de-DE'); // 1.025,50 $
currency.convert('EUR', 0.93); // Converted value
```

---

### 3. **`UnitConverter`**

Converts between measurement units (length, weight, temperature, etc.).

```ts
UnitConverter.kgToLbs(75); // 165.35
UnitConverter.celsiusToFahrenheit(20); // 68
```

---

### 4. **`UUID`**

Generates, parses, and validates UUIDs (v4, v1, etc.).

```ts
UUID.v4(); // "123e4567-e89b-12d3-a456-426614174000"
UUID.isValid('123e4567...'); // true
```

---

### 5. **`SecureStorage`**

Abstracts `localStorage`/`sessionStorage` with optional encryption using `crypto.subtle`.

```ts
SecureStorage.set('token', 'jwt...', true); // encrypted
SecureStorage.get('token'); // decrypted
```

---

### 6. **`Logger`**

Provides logging utilities with levels (`info`, `debug`, `error`, etc.), stack traces, and colored console output.

```ts
Logger.info('App started');
Logger.error('DB connection failed', { trace: error.stack });
```

---

### 7. **`QueryParams`**

Handles query string parsing and manipulation in both client and server contexts.

```ts
const qp = new QueryParams('?page=2&limit=10');
qp.get('page'); // "2"
qp.set('sort', 'asc'); // ?page=2&limit=10&sort=asc
```

---

### 8. **`Paginator`**

Generates pagination logic, offsets, and meta data for APIs and UIs.

```ts
const page = new Paginator({ totalItems: 100, perPage: 10, currentPage: 3 });
page.offset(); // 20
page.totalPages(); // 10
```

---

### 9. **`Slugify`**

Converts strings to URL-safe slugs, optionally with transliteration.

```ts
Slugify.generate('This is a Title!'); // "this-is-a-title"
```

---

### 10. **`Debouncer` / `Throttler`**

Class-based utilities to debounce or throttle function execution.

```ts
const searchDebouncer = new Debouncer(300);
searchDebouncer.run(() => fetchData(input));
```

---

### 11. **`HttpClient`**

Axios-wrapped HTTP handler with interceptors, error normalization, retry logic, etc.

```ts
const http = new HttpClient();
const data = await http.get('/api/data');
```

---

### 12. **`Color`** (already have this)

Handling all things color manipulation, like conversions, tints/shades, contrast ratios, etc.

---

## ⚙ Advanced Suggestions (Domain-Specific)

### 🛒 `CartManager` (for ecommerce)

- Add/update/remove items
- Compute total/discount/tax
- Handle coupon application

### 📅 `Calendar` (date-based UI component logic)

- Manage events, availability
- Generate weekly/monthly grid data
- Support recurring rules (RFC 5545)

### 📁 `FileManager`

- Format file sizes, MIME type parsing
- Generate file previews
- Upload chunked files

### 🌐 `I18n` / `LocaleHelper`

- Handle text translations
- Number/date formatting per locale
- Language detection and switching
