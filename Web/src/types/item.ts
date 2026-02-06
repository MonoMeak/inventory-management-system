export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount?: number;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  quantity?: number;
  image?: string;
  category?: Category;
  categoryId?: number;
}

export interface CreateProductRequest {
  productCode: string;
  name: string;
  price: number;
  image?: File;
  categoryId?: number;
}

export interface UpdateProductRequest {
  productCode?: string;
  name?: string;
  price?: number;
  image?: File;
  categoryId?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

// Pagination interfaces matching backend response
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Legacy Item type for backward compatibility
export interface Item {
  id: number;
  sku: string;
  name: string;
  category?: string;
  unit?: string;
  quantity: number;
}
