'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { productService } from '@/lib/services/product-service';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل المنتجات والفئات
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // تحميل المنتجات والفئات بالتوازي
        const [allProducts, allCategories] = await Promise.all([
          productService.getAllProducts(),
          productService.getAllCategories().catch(() => []), // في حالة فشل الفئات، نستخدم array فارغ
        ]);

        // التأكد من أن allProducts هو array
        const productsArray = Array.isArray(allProducts) ? allProducts : [];
        setProducts(productsArray);

        // إضافة "All" للفئات
        if (Array.isArray(allCategories) && allCategories.length > 0) {
          const categoryNames = allCategories.map(cat => cat.name);
          setCategories(['All', ...categoryNames]);
        }
      } catch (err: any) {
        console.error('Failed to load products:', err);
        setError(err.error || 'Failed to load products. Please try again.');
        setProducts([]); // تعيين array فارغ في حالة الخطأ
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // التأكد من أن products هو array
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products]; // نسخة من المنتجات

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => {
        // إذا كانت p.category من نوع Category object
        if (typeof p.category === 'object' && p.category !== null) {
          return (p.category as any).name === selectedCategory;
        }
        // إذا كانت p.category من نوع string
        return p.category === selectedCategory;
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Our Products</h1>
            <p className="text-muted-foreground">
              Browse our curated collection of premium products
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-48 flex-shrink-0">
              <div className="space-y-6 sticky top-20">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-foreground'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">Under $50</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">$50 - $100</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">$100 - $200</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">Over $200</span>
                    </label>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Availability</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-foreground">In Stock Only</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort Controls */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-md bg-muted text-foreground border border-border appearance-none pr-10 cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-muted-foreground">Loading products...</div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-muted-foreground text-lg">No products found</p>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory('All')}
                    className="mt-4"
                  >
                    View All Products
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
