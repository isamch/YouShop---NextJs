'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCart();
  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  // تحويل السعر من string إلى number
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">Shopping Cart</h1>
              <div className="py-12">
                <svg
                  className="mx-auto h-12 w-12 text-muted-foreground mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-muted-foreground text-lg mb-8">Your cart is empty</p>
                <Link href="/products">
                  <Button size="lg" className="flex items-center gap-2 mx-auto">
                    Continue Shopping
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-card border border-border rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {typeof item.category === 'object' && item.category !== null
                            ? (item.category as any).name
                            : item.category}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">
                          ${formatPrice(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.cartQuantity - 1)
                          }
                          className="p-1 hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4 text-foreground" />
                        </button>
                        <span className="px-3 py-1 text-foreground font-medium w-8 text-center">
                          {item.cartQuantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.cartQuantity + 1)
                          }
                          className="p-1 hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4 text-foreground" />
                        </button>
                      </div>

                      <span className="font-bold text-foreground">
                        ${formatPrice((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.cartQuantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <Link href="/products">
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="h-fit">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground font-medium">
                      {shipping === 0 ? (
                        <span className="text-primary">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="text-foreground font-medium">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>

                {subtotal <= 100 && (
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Free shipping on orders over $100
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
