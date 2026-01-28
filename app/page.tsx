'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Package, TrendingUp } from 'lucide-react';
import { productService } from '@/lib/services/product-service';
import { Product } from '@/lib/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await productService.getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 text-pretty">
                Discover Premium Products
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-balance">
                Curated selection of high-quality products designed for modern living. Fast shipping, exceptional quality, guaranteed satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">Fast Shipping</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Free shipping on orders over $100. Standard delivery in 5-7 business days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                    <Package className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">Quality Guaranteed</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    All products are carefully selected and verified for quality standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">Best Prices</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Competitive pricing with regular discounts and exclusive offers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Featured Products</h2>
              <Link href="/products">
                <Button variant="outline">
                  View All
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-64 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No featured products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-8 opacity-90 text-balance">
              Subscribe to our newsletter and get exclusive deals delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-primary-foreground text-primary placeholder:text-primary/50"
              />
              <Button variant="secondary" className="text-primary-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
