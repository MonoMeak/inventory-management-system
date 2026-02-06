import { defineStore } from "pinia";
import type {
  Product,
  Category,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  PageResponse,
} from "../types/item";
import api, { API_BASE_URL } from "../api/api";

interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export const useItemStore = defineStore("item", {
  state: () => ({
    products: [] as Product[],
    categories: [] as Category[],
    selectedProduct: null as Product | null,
    loading: false,
    // Pagination state
    productsPagination: {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      pageSize: 12,
    },
    categoriesPagination: {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      pageSize: 10,
    },
  }),

  actions: {
    // Product actions with pagination
    async fetchProducts(
      keyword?: string,
      categoryId?: number,
      pagination?: PaginationParams
    ) {
      this.loading = true;
      try {
        const params = new URLSearchParams({
          page: (pagination?.page ?? 0).toString(),
          size: (
            pagination?.size ?? this.productsPagination.pageSize
          ).toString(),
          sortBy: pagination?.sortBy ?? "name",
          sortDir: pagination?.sortDir ?? "asc",
        });

        if (keyword) params.append("keyword", keyword);
        if (categoryId) params.append("categoryId", categoryId.toString());

        const response = await api.get<PageResponse<Product>>(
          `/products?${params}`
        );
        this.products = response.content;
        this.productsPagination = {
          currentPage: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          pageSize: pagination?.size
            ? this.productsPagination.pageSize
            : response.size,
        };
      } finally {
        this.loading = false;
      }
    },

    async fetchProductByCode(code: string) {
      this.loading = true;
      try {
        const product = await api.get<Product>(`/products/${code}`);
        this.selectedProduct = product;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(productData: CreateProductRequest) {
      const formData = new FormData();
      formData.append("productCode", productData.productCode);
      formData.append("name", productData.name);
      formData.append("price", productData.price.toString());
      if (productData.image) {
        formData.append("image", productData.image);
      }
      if (productData.categoryId) {
        formData.append("categoryId", productData.categoryId.toString());
      }

      await api.post<string>("/products", formData);
      await this.fetchProducts();
    },

    async updateProduct(code: string, productData: UpdateProductRequest) {
      const formData = new FormData();
      if (productData.productCode)
        formData.append("productCode", productData.productCode);
      if (productData.name) formData.append("name", productData.name);
      if (productData.price)
        formData.append("price", productData.price.toString());
      if (productData.image) formData.append("image", productData.image);
      if (productData.categoryId)
        formData.append("categoryId", productData.categoryId.toString());

      await api.put<string>(`/products/${code}`, formData);
      await this.fetchProducts();
    },

    async deleteProduct(code: string) {
      await api.delete<string>(`/products/${code}`);
      await this.fetchProducts();
    },

    getImageUrl(filename: string) {
      return `${API_BASE_URL}/images/${filename}`;
    },

    // Category actions with pagination
    async fetchCategories(keyword?: string, pagination?: PaginationParams) {
      this.loading = true;
      try {
        const params = new URLSearchParams({
          page: (pagination?.page ?? 0).toString(),
          size: (
            pagination?.size ?? this.categoriesPagination.pageSize
          ).toString(),
          sortBy: pagination?.sortBy ?? "name",
          sortDir: pagination?.sortDir ?? "asc",
        });

        if (keyword) params.append("keyword", keyword);

        const response = await api.get<PageResponse<Category>>(
          `/categories?${params}`
        );
        this.categories = response.content;
        this.categoriesPagination = {
          currentPage: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          pageSize: pagination?.size
            ? this.categoriesPagination.pageSize
            : response.size,
        };
      } finally {
        this.loading = false;
      }
    },

    async createCategory(categoryData: CreateCategoryRequest) {
      await api.post<string>("/categories", categoryData);
      await this.fetchCategories();
    },

    async updateCategory(id: number, categoryData: UpdateCategoryRequest) {
      await api.put<string>(`/categories/${id}`, categoryData);
      await this.fetchCategories();
    },

    async deleteCategory(id: number) {
      await api.delete<string>(`/categories/${id}`);
      await this.fetchCategories();
    },
  },
});
