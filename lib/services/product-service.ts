import { Product } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    await delay(500);
    return MOCK_PRODUCTS;
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    await delay(400);
    if (category === 'All') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => p.category === category);
  },

  // Get single product by ID
  async getProductById(id: string): Promise<Product | null> {
    await delay(300);
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  },

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    await delay(400);
    const lowerQuery = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    await delay(400);
    return MOCK_PRODUCTS.slice(0, 4);
  },

  // Get related products
  async getRelatedProducts(productId: string, limit: number = 3): Promise<Product[]> {
    await delay(300);
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return [];
    
    return MOCK_PRODUCTS
      .filter(p => p.category === product.category && p.id !== productId)
      .slice(0, limit);
  },
};
