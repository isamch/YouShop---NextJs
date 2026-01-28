import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config/api';
import type { Product, Category, PaginatedResponse, PaginationParams } from '@/lib/types';

export const productService = {
  /**
   * الحصول على جميع المنتجات
   * Get all products with pagination
   */
  async getAllProducts(params?: PaginationParams): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_ENDPOINTS.CATALOG.PRODUCTS}${queryParams.toString() ? `?${queryParams}` : ''}`;

      const response = await apiClient.get<any>(url, false);

      // التأكد من أن البيانات المرجعة صحيحة
      // الـ API يرجع: { products: [], total, page, limit }
      let data = response.data;

      // إذا كانت البيانات في property "products"
      if (data && typeof data === 'object' && 'products' in data) {
        data = data.products;
      }

      // التأكد من أن البيانات array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // في حالة الخطأ، نرجع array فارغ بدلاً من throw
      return [];
    }
  },

  /**
   * الحصول على المنتجات حسب الفئة
   * Get products by category
   */
  async getProductsByCategory(categoryId: string, params?: PaginationParams): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams({ categoryId });

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const url = `${API_ENDPOINTS.CATALOG.PRODUCTS}?${queryParams}`;

      const response = await apiClient.get<any>(url, false);

      // معالجة البيانات (قد تكون في products property)
      let data = response.data;
      if (data && typeof data === 'object' && 'products' in data) {
        data = data.products;
      }

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      return [];
    }
  },

  /**
   * الحصول على منتج واحد بالمعرف
   * Get single product by ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(
        API_ENDPOINTS.CATALOG.PRODUCT_BY_ID(id),
        false
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  },

  /**
   * البحث عن المنتجات
   * Search products
   */
  async searchProducts(query: string, params?: PaginationParams): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams({ search: query });

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_ENDPOINTS.CATALOG.PRODUCTS}?${queryParams}`;

      const response = await apiClient.get<Product[]>(url, false);
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  },

  /**
   * الحصول على المنتجات المميزة
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    try {
      const url = `${API_ENDPOINTS.CATALOG.PRODUCTS}?limit=${limit}&featured=true`;

      const response = await apiClient.get<Product[]>(url, false);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      // في حالة الفشل، نرجع أول المنتجات
      const allProducts = await this.getAllProducts({ limit });
      return allProducts.slice(0, limit);
    }
  },

  /**
   * الحصول على المنتجات ذات الصلة
   * Get related products
   */
  async getRelatedProducts(productId: string, limit: number = 3): Promise<Product[]> {
    try {
      // نحاول الحصول على المنتج أولاً لمعرفة الفئة
      const product = await this.getProductById(productId);

      // نجلب منتجات من نفس الفئة
      const products = await this.getProductsByCategory(product.categoryId, { limit: limit + 1 });

      // نستبعد المنتج الحالي ونأخذ العدد المطلوب
      return products
        .filter(p => p.id !== productId)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch related products:', error);
      return [];
    }
  },

  /**
   * الحصول على جميع الفئات
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<any>(
        API_ENDPOINTS.CATALOG.CATEGORIES,
        false
      );

      // الـ API يرجع array مباشرة
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return []; // إرجاع array فارغ بدلاً من throw
    }
  },

  /**
   * الحصول على فئة بالمعرف
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await apiClient.get<Category>(
        API_ENDPOINTS.CATALOG.CATEGORY_BY_ID(id),
        false
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      throw error;
    }
  },

  /**
   * إنشاء منتج جديد (Admin only)
   * Create new product
   */
  async createProduct(productData: any): Promise<Product> {
    try {
      const response = await apiClient.post<Product>(
        API_ENDPOINTS.CATALOG.PRODUCTS,
        productData,
        true // يتطلب مصادقة
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  /**
   * تحديث منتج (Admin only)
   * Update product
   */
  async updateProduct(id: string, productData: any): Promise<Product> {
    try {
      const response = await apiClient.patch<Product>(
        API_ENDPOINTS.CATALOG.PRODUCT_BY_ID(id),
        productData,
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  /**
   * حذف منتج (Admin only)
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(
        API_ENDPOINTS.CATALOG.PRODUCT_BY_ID(id),
        true
      );
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },
};
