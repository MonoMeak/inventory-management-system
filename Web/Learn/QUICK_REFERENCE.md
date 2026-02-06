# Quick Reference: New Features

## Pagination Usage

### In Store

```typescript
import { useItemStore } from "@/stores/itemStore";

const itemStore = useItemStore();

// Fetch paginated products
await itemStore.fetchProducts(
  "search keyword", // optional
  categoryId, // optional
  {
    page: 0, // zero-based page number
    size: 12, // items per page
    sortBy: "name", // field to sort by
    sortDir: "asc", // 'asc' or 'desc'
  }
);

// Access pagination state
console.log(itemStore.productsPagination);
// {
//   currentPage: 0,
//   totalPages: 5,
//   totalElements: 57,
//   pageSize: 12
// }
```

### In Components

```vue
<template>
  <!-- Pagination Controls -->
  <div class="flex justify-center gap-2">
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0">
      Previous
    </button>
    <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage >= totalPages - 1"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useItemStore } from "@/stores/itemStore";

const itemStore = useItemStore();
const currentPage = ref(0);

async function changePage(newPage: number) {
  currentPage.value = newPage;
  await itemStore.fetchProducts(undefined, undefined, { page: newPage });
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
```

## Image Utilities

### Basic Usage

```vue
<template>
  <img
    :src="getProductImageUrl(product.imageUrl)"
    :alt="product.name"
    @error="handleImageError($event)"
    loading="lazy"
  />
</template>

<script setup lang="ts">
import { getProductImageUrl, getDefaultProductImage } from "@/utils/imageUtils";

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  if (img.src !== getDefaultProductImage()) {
    img.src = getDefaultProductImage();
  }
}
</script>
```

### Using the Composable

```vue
<script setup lang="ts">
import { useProductImage } from "@/utils/imageUtils";

const { currentImageUrl, hasError, handleImageError } = useProductImage(
  product.imageUrl
);
</script>

<template>
  <img :src="currentImageUrl" @error="handleImageError" />
</template>
```

## Environment Variables

### Setup

```bash
# .env (development)
VITE_API_BASE_URL=http://localhost:8080/api

# .env.production (production)
VITE_API_BASE_URL=https://api.example.com/api
```

### Usage in Code

```typescript
// Automatically used by api.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
```

## Path Aliases

### Old Way

```typescript
import { useItemStore } from "../../../../stores/itemStore";
import { api } from "../../../../api/api";
```

### New Way (with @ alias)

```typescript
import { useItemStore } from "@/stores/itemStore";
import { api } from "@/api/api";
```

## API Patterns

### Products

```typescript
// Get paginated products with filters
const response = await api.get<PageResponse<Product>>(
  "/products?" +
    new URLSearchParams({
      page: "0",
      size: "12",
      sortBy: "name",
      sortDir: "asc",
      keyword: "laptop",
      categoryId: "5",
    })
);

// Access data
console.log(response.content); // Product[]
console.log(response.totalPages); // number
console.log(response.totalElements); // number
console.log(response.number); // current page
```

### Categories

```typescript
// Get paginated categories
const response = await api.get<PageResponse<Category>>(
  "/categories?" +
    new URLSearchParams({
      page: "0",
      size: "10",
      sortBy: "name",
      sortDir: "asc",
    })
);
```

### Dashboard Summary

```typescript
import { reportsApi } from "@/api/reportsApi";

const summary = await reportsApi.getSummary();
// {
//   totalItems: 150,
//   lowStock: 12,
//   stockValue: 45230.50
// }
```

## Common Patterns

### Search with Pagination Reset

```typescript
const searchKeyword = ref("");
const currentPage = ref(0);

async function handleSearch() {
  currentPage.value = 0; // Reset to first page
  await itemStore.fetchProducts(searchKeyword.value, undefined, { page: 0 });
}
```

### Filter with Pagination Reset

```typescript
const selectedCategoryId = ref<number>();
const currentPage = ref(0);

async function handleCategoryFilter() {
  currentPage.value = 0; // Reset to first page
  await itemStore.fetchProducts(undefined, selectedCategoryId.value, {
    page: 0,
  });
}
```

### Debounced Search

```typescript
let searchTimeout: NodeJS.Timeout;

function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    currentPage.value = 0;
    await loadProducts();
  }, 500); // Wait 500ms after user stops typing
}
```

## Error Handling

### API Errors

```typescript
try {
  await itemStore.createProduct(productData);
  successMessage.value = "Product created successfully";
} catch (error: any) {
  errorMessage.value = error.message || "Failed to create product";
}
```

### Image Load Errors

```typescript
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  // Prevent infinite loop
  if (img.src !== getDefaultProductImage()) {
    img.src = getDefaultProductImage();
  }
}
```

## Best Practices

### 1. Always Reset Page on Filter Changes

```typescript
function handleFilter() {
  currentPage.value = 0; // ✅ Reset to first page
  loadData();
}
```

### 2. Show Pagination State to Users

```typescript
<span>
  Page {{ currentPage + 1 }} of {{ totalPages }}
  ({{ totalElements }} total items)
</span>
```

### 3. Disable Navigation at Boundaries

```typescript
<button
  :disabled="currentPage === 0" // ✅ Disable on first page
  @click="changePage(currentPage - 1)"
>
  Previous
</button>
```

### 4. Provide Loading Feedback

```vue
<div v-if="loading">
  <div class="animate-spin rounded-full h-12 w-12 border-b-2"></div>
  <p>Loading...</p>
</div>
```

### 5. Use Lazy Loading for Images

```vue
<img :src="imageUrl" loading="lazy" // ✅ Lazy load images @error="handleError"
/>
```

## Troubleshooting

### Pagination Not Working?

- Check if backend returns `PageResponse<T>` format
- Verify `page` parameter is zero-based
- Ensure `size` parameter is included in request

### Images Not Loading?

- Check if image path includes `/api/images/`
- Verify backend serves images at correct endpoint
- Check browser console for 404 errors
- Ensure fallback handler is implemented

### Environment Variables Not Working?

- Restart Vite dev server after changing `.env`
- Variables must start with `VITE_` prefix
- Use `import.meta.env.VITE_YOUR_VAR` to access

### Path Alias Not Working?

- Check `vite.config.ts` has correct alias configuration
- Restart TypeScript server in VS Code
- Verify `tsconfig.json` includes path mapping

## Performance Tips

1. **Limit Page Size**: Use reasonable page sizes (10-50 items)
2. **Debounce Search**: Wait 300-500ms before searching
3. **Lazy Load Images**: Add `loading="lazy"` attribute
4. **Cache Results**: Consider caching pagination results
5. **Optimize Queries**: Use specific fields with `sortBy`

## Migration from Old Code

### Before

```typescript
// Loaded all products at once
await itemStore.fetchProducts();
const allProducts = itemStore.products;
```

### After

```typescript
// Load paginated products
await itemStore.fetchProducts(undefined, undefined, { page: 0, size: 12 });
const currentPageProducts = itemStore.products;
const { totalPages, totalElements } = itemStore.productsPagination;
```

## Summary

Key improvements available:

- ✅ Pagination for Products and Categories
- ✅ Image fallbacks with SVG placeholders
- ✅ Environment-based API configuration
- ✅ Path aliases for cleaner imports
- ✅ Proper error handling
- ✅ Loading states
- ✅ Smooth page transitions

All following Vue 3 + TypeScript best practices!
