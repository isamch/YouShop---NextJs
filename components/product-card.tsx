'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      addItem(product, 1);
      // Could add toast notification here
    } finally {
      setIsAdding(false);
    }
  };

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

  // الحصول على الصورة الأولى من images array أو استخدام image
  const getProductImage = (): string => {
    // إذا كان هناك images array
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // تنظيف الصورة الأولى من الأقواس المعقوفة إذا وجدت
      let firstImage = product.images[0];
      if (firstImage.startsWith('{')) {
        firstImage = firstImage.substring(1);
      }
      if (firstImage.endsWith('}')) {
        firstImage = firstImage.substring(0, firstImage.length - 1);
      }
      return firstImage;
    }
    // استخدام image المفرد
    return product.image || '/placeholder.svg';
  };

  const productImage = getProductImage();

  // التحقق من توفر المنتج (يدعم inStock و isActive)
  const isProductInStock = (): boolean => {
    // إذا كان inStock موجود، استخدمه
    if (typeof product.inStock === 'boolean') {
      return product.inStock;
    }
    // وإلا استخدم isActive (من الـ API)
    if (typeof (product as any).isActive === 'boolean') {
      return (product as any).isActive;
    }
    // افتراضياً، المنتج متوفر
    return true;
  };

  const inStock = isProductInStock();

  if (compact) {
    return (
      <Link href={`/products/${product.id}`}>
        <div className="group rounded-lg overflow-hidden bg-card border border-border hover:shadow-md transition-shadow duration-200">
          <div className="relative h-40 w-full overflow-hidden bg-muted">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-bold">
                -{discountPercentage}%
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm truncate text-foreground">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1 mb-2">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-xs text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-bold text-lg text-foreground">${formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group rounded-lg overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300">
        <div className="relative h-64 w-full overflow-hidden bg-muted">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercentage}%
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-base truncate text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
          <div className="flex items-center gap-1 mt-3 mb-3">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="text-xl font-bold text-foreground">${formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ${formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              disabled={!inStock || isAdding}
              onClick={handleAddToCart}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAdding ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
