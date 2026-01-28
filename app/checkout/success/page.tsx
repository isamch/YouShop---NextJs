import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your purchase. Your order has been successfully placed and is being processed.
            </p>

            {/* Order Info Card */}
            <div className="bg-card border border-border rounded-lg p-8 mb-8 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Order Number
                  </p>
                  <p className="text-xl font-bold text-foreground">#ORD-20250128001</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Order Date
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Total
                  </p>
                  <p className="text-xl font-bold text-primary">$XXX.XX</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">What's Next?</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Order Confirmation</p>
                      <p className="text-sm text-muted-foreground">
                        A confirmation email has been sent to your email address.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Shipment Tracking</p>
                      <p className="text-sm text-muted-foreground">
                        You'll receive a tracking number once your order ships (5-7 business days).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="outline" size="lg">
                  Continue Shopping
                </Button>
              </Link>
              <Button size="lg">
                View Order Details
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 p-6 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Have questions? Check your email for order details or{' '}
                <Link href="#" className="text-primary hover:underline font-medium">
                  contact our support team
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
