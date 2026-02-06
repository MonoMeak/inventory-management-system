# Inventory Management System - Frontend

A modern Vue 3 + TypeScript frontend for managing inventory, products, and categories with session-based authentication.

## Features

- 🔐 **JWT Authentication** - Secure login with JWT tokens in localStorage
- 📦 **Product Management** - CRUD operations with image upload support
- 🏷️ **Category Management** - Organize products by categories
- 📄 **Pagination** - Efficient data loading with page navigation
- 🖼️ **Image Handling** - Smart image loading with SVG fallbacks
- 👥 **User Management** - Admin panel for user administration
- 🔍 **Search & Filter** - Real-time search with category filtering
- 📊 **Dashboard** - Summary statistics and recent products
- 📱 **Responsive Design** - Built with Tailwind CSS
- 🎯 **Type Safety** - Full TypeScript support
- 🚀 **Modern Stack** - Vue 3, Vite, Pinia
- ⚙️ **Environment Config** - Easy deployment configuration

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Vue Router** - Routing with route guards
- **Tailwind CSS** - Utility-first CSS framework
- **Fetch API** - Native HTTP client with JWT token injection

## Prerequisites

- Node.js 18+ and npm
- Backend API running (default: `http://localhost:8080`)

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set your API URL
# VITE_API_BASE_URL=http://localhost:8080/api

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API client and services
│   ├── api.ts        # Core fetch-based API client with JWT injection
│   ├── authApi.ts    # Authentication endpoints
│   ├── reportsApi.ts # Dashboard reports API
│   └── utils.ts      # API utilities
├── stores/           # Pinia stores
│   ├── authStore.ts  # Authentication state with JWT
│   └── itemStore.ts  # Product/category state with pagination
├── types/            # TypeScript types
│   ├── auth.ts       # Auth types
│   ├── item.ts       # Product/category types + pagination
│   └── stock.ts      # Stock movement types
├── utils/            # Utility functions
│   └── imageUtils.ts # Image handling with fallbacks
├── pages/            # Route components
│   ├── Login.vue     # Login page
│   ├── Dashboard.vue # Dashboard with stats
│   ├── Items.vue     # Products page with pagination
│   ├── Categories.vue# Categories page with pagination
│   └── ItemDetail.vue# Product details
├── router/           # Vue Router configuration
│   └── index.ts      # Routes with auth guards
├── components/       # Reusable components
├── assets/           # Static assets
├── App.vue           # Root component
└── main.ts           # Application entry
```

## API Integration

### Base Configuration

- **Base URL**: Configured via `.env` file (`VITE_API_BASE_URL`)
- **Authentication**: JWT token in localStorage
- **Authorization Header**: `Bearer {token}` automatically added

### Authentication Flow

```typescript
import { useAuthStore } from "@/stores/authStore";

const auth = useAuthStore();

// Login (token stored in localStorage)
await auth.login("admin", "admin123");

// Check token validity
await auth.checkSession();

// Logout (clears token)
await auth.logout();
```

### Product Management with Pagination

```typescript
import { useItemStore } from "@/stores/itemStore";

const items = useItemStore();

// Fetch paginated products
await items.fetchProducts(
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
console.log(items.productsPagination);
// { currentPage: 0, totalPages: 5, totalElements: 57, pageSize: 12 }

// Create product with image
await items.createProduct({
  productCode: "P001",
  name: "Apple",
  price: 1.99,
  image: file,
  categoryId: 1,
});

// Update product
await items.updateProduct(code, { name, price, image });

// Delete product
await items.deleteProduct(code);

// Get image URL with fallback support
import { getProductImageUrl } from "@/utils/imageUtils";
const imageUrl = getProductImageUrl(product.imageUrl);
```

### Image Handling

```vue
<template>
  <!-- Image with automatic fallback -->
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

### Category Management

```typescript
// Fetch categories
await items.fetchCategories();

// Create category
await items.createCategory({ name, description });

// Update category
await items.updateCategory(id, { name, description });

// Delete category
await items.deleteCategory(id);
```

## New Features & Improvements

### 📄 Pagination System

- **Products Page**: Navigate through products with page controls (12 per page)
- **Categories Page**: Browse categories with pagination (10 per page)
- **Dashboard**: Shows 5 most recent products
- **Smart Navigation**: Auto-reset to page 1 on search/filter
- **User Feedback**: Shows "Page X of Y (Z total items)"

### 🖼️ Image Handling

- **Automatic Fallbacks**: SVG placeholder for missing/broken images
- **Smart Loading**: Lazy loading with `loading="lazy"` attribute
- **Error Recovery**: Graceful degradation when images fail to load
- **Optimized URLs**: Proper image serving via `/api/images/{filename}`

### ⚙️ Environment Configuration

- **Flexible Setup**: Configure API URL via `.env` file
- **Multiple Environments**: Support for dev/staging/production
- **Easy Deployment**: Change API URL without code changes
- **Template Provided**: `.env.example` for quick setup

### 🎯 Developer Experience

- **Path Aliases**: Use `@/` instead of relative paths (`../../../`)
- **Type Safety**: Full pagination types with `PageResponse<T>`
- **Better Imports**: Cleaner, more maintainable code structure
- **Documentation**: Comprehensive guides and quick references

## Authentication

### Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

### Route Protection

Routes with `meta: { requiresAuth: true }` are automatically protected. Unauthenticated users are redirected to the login page.

### JWT Token Management

- JWT tokens stored in localStorage
- Token automatically included in Authorization header
- Token validation on route navigation
- Automatic redirect on token expiration (401)
- Secure logout clears token

## 📚 Documentation

### Comprehensive Guides Available

1. **[SYSTEM_IMPROVEMENTS.md](./SYSTEM_IMPROVEMENTS.md)** - Complete overview of all improvements

   - Pagination implementation details
   - Image handling system
   - Environment configuration
   - Performance benefits

2. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference guide

   - Pagination usage examples
   - Image utilities usage
   - API patterns
   - Common code snippets
   - Troubleshooting tips

3. **[guilde-frontend.md](./guilde-frontend.md)** - Backend API contract

   - All API endpoints documentation
   - Request/response formats
   - Vue 3 component examples
   - Authentication patterns

4. **[JWT_TOKEN_GUIDE.md](./JWT_TOKEN_GUIDE.md)** - JWT token management

   - Token storage in localStorage
   - Token injection in requests
   - Authentication flow

5. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation details
   - System architecture
   - Feature documentation
   - Code organization

### Backend API

- Swagger UI: http://localhost:8080/swagger-ui.html
- API Base URL: http://localhost:8080/api

## Development

### Type Definitions

All API types are defined in `src/types/`:

- `auth.ts` - User, LoginResponse, CreateUserRequest, etc.
- `item.ts` - Product, Category, Create/Update requests
- `stock.ts` - Stock movement types (legacy)

### API Services

Modular API services in `src/api/`:

- `authApi` - Authentication and user management
- `productApi` - Product CRUD with image upload
- `categoryApi` - Category CRUD

### Utilities

Helper functions in `src/api/utils.ts`:

- `formatPrice()` - Format currency
- `handleApiError()` - Consistent error handling
- `validateFileSize()` - File validation
- `debounce()` - Debounce function for search
- `buildQueryString()` - Build URL query strings

## Backend Requirements

The backend must:

1. Run on `http://localhost:8080`
2. Enable CORS with credentials: `allowCredentials = "true"`
3. Support session cookies
4. Implement the API contract (see API_INTEGRATION.md)

## Environment Variables

Create `.env` file if needed:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Support

For issues or questions:

- Check the [API Integration Guide](./API_INTEGRATION.md)
- Review the [Migration Guide](./MIGRATION_GUIDE.md)
- Open an issue on GitHub
