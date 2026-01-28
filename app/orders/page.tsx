'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Package, Clock, CheckCircle, XCircle, Truck, Loader2 } from 'lucide-react';
import { orderService } from '@/lib/services/order-service';
import { useAuth } from '@/contexts/auth-context';
import { Order } from '@/lib/types';
import { formatPrice, getProductImage } from '@/lib/utils';
import Image from 'next/image';

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // إعادة توجيه إذا لم يكن مسجل دخول
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/orders');
      return;
    }

    if (user) {
      loadOrders();
    }
  }, [user, authLoading, router]);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedOrders = await orderService.getOrders();
      setOrders(fetchedOrders);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your orders
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button onClick={() => router.push('/products')}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold text-foreground">
                            Order #{order.id.slice(0, 8)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          ${formatPrice(order.total)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {order.items?.slice(0, 3).map((item) => {
                        const itemPrice = (item as any).price || item.unitPrice || 0;
                        const itemSubtotal = (item as any).subtotal || item.totalPrice || (itemPrice * item.quantity);

                        return (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                              <Image
                                src={getProductImage(item.product)}
                                alt={item.product?.name || 'Product'}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {item.product?.name || 'Product'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ${formatPrice(itemPrice)}
                              </p>
                            </div>
                            <p className="font-semibold text-foreground">
                              ${formatPrice(itemSubtotal)}
                            </p>
                          </div>
                        );
                      })}
                      {(order.items?.length || 0) > 3 && (
                        <p className="text-sm text-muted-foreground text-center pt-2">
                          +{(order.items?.length || 0) - 3} more item{(order.items?.length || 0) - 3 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button
                          variant="default"
                          onClick={() => router.push('/products')}
                          className="flex-1"
                        >
                          Buy Again
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
