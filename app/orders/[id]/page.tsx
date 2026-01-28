'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  ArrowLeft,
  MapPin,
  CreditCard,
  Calendar
} from 'lucide-react';
import { orderService } from '@/lib/services/order-service';
import { useAuth } from '@/contexts/auth-context';
import { Order } from '@/lib/types';
import { formatPrice, getProductImage } from '@/lib/utils';
import Image from 'next/image';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/orders/${orderId}`);
      return;
    }

    if (user && orderId) {
      loadOrder();
    }
  }, [user, authLoading, orderId, router]);

  const loadOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedOrder = await orderService.getOrder(orderId);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
      } else {
        setError('Order not found.');
      }
    } catch (err: any) {
      console.error('Failed to load order:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <Button
            variant="ghost"
            onClick={() => router.push('/orders')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>

          {/* Order Header */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Order #{order.id.slice(0, 12)}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.createdAt)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Download Invoice</Button>
                {order.status === 'pending' && (
                  <Button variant="destructive" size="sm">Cancel Order</Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Items & Summary */}
            <div className="md:col-span-2 space-y-6">
              {/* Items */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/50">
                  <h2 className="font-semibold text-foreground">Order Items</h2>
                </div>
                <div className="divide-y divide-border">
                  {order.items.map((item) => {
                    const itemPrice = (item as any).price || item.unitPrice || 0;
                    const itemSubtotal = (item as any).subtotal || item.totalPrice || (itemPrice * item.quantity);

                    return (
                      <div key={item.id} className="p-4 flex gap-4">
                        <div className="relative w-20 h-20 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                          <Image
                            src={getProductImage(item.product)}
                            alt={item.product?.name || 'Product'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {item.product?.name || 'Product'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${formatPrice(itemPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            ${formatPrice(itemSubtotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">${formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground font-medium">
                      {order.shipping === 0 ? 'Free' : `$${formatPrice(order.shipping)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground font-medium">${formatPrice(order.tax)}</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">${formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Shipping & Payment */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Shipping Address</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                  {order.shippingAddress ? (
                    <>
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                      <p>{order.shippingAddress.country}</p>
                    </>
                  ) : (
                    <p>Address details not available</p>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Payment Info</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span className="text-foreground font-medium">Credit Card</span>
                  </div>
                </div>
              </div>

              {/* Order Tracking */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Tracking</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${order.status !== 'cancelled' ? 'bg-primary' : 'bg-muted'}`}></div>
                      <div className="w-0.5 h-8 bg-muted"></div>
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-foreground">Order Placed</p>
                      <p className="text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-primary' : 'bg-muted'}`}></div>
                      <div className="w-0.5 h-8 bg-muted"></div>
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-foreground">Processing</p>
                      <p className="text-muted-foreground">We are preparing your order</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-primary' : 'bg-muted'}`}></div>
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-foreground">Shipped</p>
                      <p className="text-muted-foreground">Order is on its way</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
