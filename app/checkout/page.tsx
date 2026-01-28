'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Truck, User } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { orderService } from '@/lib/services/order-service';
import { CheckoutData } from '@/lib/types';
import { formatPrice, getProductImage } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [formData, setFormData] = useState<CheckoutData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.firstName && formData.lastName && formData.address) {
      setStep('payment');
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardNumber && formData.cardExpiry && formData.cardCVC) {
      setStep('review');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const order = await orderService.createOrder(items, formData);
      clearCart();

      // إعادة التوجيه لصفحة الطلبات
      router.push(`/orders`);
    } catch (error: any) {
      console.error('Order failed:', error);
      alert(error.error || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step === 'shipping') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
              <Link href="/products">
                <Button className="flex items-center gap-2 mx-auto">
                  <ArrowLeft className="w-5 h-5" />
                  Back to Shopping
                </Button>
              </Link>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/cart">
            <Button variant="ghost" className="mb-6 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === 'shipping' || step === 'payment' || step === 'review'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  1
                </div>
                <span className={step === 'shipping' ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                  Shipping
                </span>

                <div className="flex-1 h-1 bg-muted" />

                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === 'payment' || step === 'review'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  2
                </div>
                <span className={step === 'payment' ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                  Payment
                </span>

                <div className="flex-1 h-1 bg-muted" />

                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === 'review'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  3
                </div>
                <span className={step === 'review' ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                  Review
                </span>
              </div>

              {/* Shipping Step */}
              {step === 'shipping' && (
                <form onSubmit={handleSubmitShipping} className="space-y-6 bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Shipping Address</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <form onSubmit={handleSubmitPayment} className="space-y-6 bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="4532 1234 5678 9010"
                      required
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('shipping')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </form>
              )}

              {/* Review Step */}
              {step === 'review' && (
                <form onSubmit={handlePlaceOrder} className="space-y-6 bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Order Review</h2>
                  </div>

                  <div className="space-y-4 pb-6 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Shipping Address</p>
                      <p className="text-foreground font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-foreground">{formData.address}</p>
                      <p className="text-foreground">
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground">{formData.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('payment')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
                <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={getProductImage(item)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.cartQuantity}</p>
                        <p className="text-sm font-bold text-foreground mt-1">
                          ${formatPrice((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.cartQuantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">
                      ${formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground font-medium">
                      {shipping === 0 ? 'Free' : `$${formatPrice(shipping)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground font-medium">
                      ${formatPrice(tax)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${formatPrice(total)}
                  </span>
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
