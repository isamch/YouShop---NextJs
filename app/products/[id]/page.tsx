'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Share2, Loader2, AlertCircle } from 'lucide-react';
import { productService } from '@/lib/services/product-service';
import { useCart } from '@/contexts/cart-context';
import { Product } from '@/lib/types';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params?.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const [productData, related] = await Promise.all([
          productService.getProductById(id),
          productService.getRelatedProducts(id).catch(() => []),
        ]);

        setProduct(productData);
        setRelatedProducts(related);
      } catch (err: any) {
        console.error('Failed to load product:', err);
        setError(err.error || 'Failed to load product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // يمكن إضافة toast notification هنا
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && (!product?.quantity || newQuantity <= product.quantity)) {
      setQuantity(newQuantity);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'The product you are looking for does not exist or has been removed.'}
            </p>
            <Button onClick={() => router.push('/products')}>
              Browse Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // تحويل السعر من string إلى number
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  // حساب نسبة الخصم
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPrice = product.originalPrice
    ? (typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice)
    : null;

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Get category name
  const categoryName = typeof product.category === 'object' && product.category !== null
    ? (product.category as any).name
    : product.category;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Product Image */}
            <div className="flex flex-col gap-4">
              <div className="relative h-96 sm:h-full rounded-lg overflow-hidden bg-muted border border-border">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold">
                    -{discountPercentage}%
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {categoryName}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-border'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-foreground">
                      ${formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        ${formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground text-lg leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-foreground">
                        In Stock {product.quantity && `(${product.quantity} available)`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm font-medium text-foreground">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        if (val >= 1 && (!product.quantity || val <= product.quantity)) {
                          setQuantity(val);
                        }
                      }}
                      className="w-12 text-center border-l border-r border-border bg-background text-foreground outline-none"
                      min="1"
                      max={product.quantity || undefined}
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={!product.quantity || quantity >= product.quantity}
                      className="px-4 py-2 text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="outline" className="flex items-center justify-center gap-2 bg-transparent">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="flex items-center justify-center gap-2 bg-transparent">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Benefits */}
                <div className="border-t border-border pt-6 space-y-3">
                  <div className="flex gap-3">
                    <div className="text-primary">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Free shipping on orders over $100</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">1-year warranty included</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
