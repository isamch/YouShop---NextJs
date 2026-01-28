import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config/api';
import { Order, CartItem, CheckoutData } from '@/lib/types';

export const orderService = {
  /**
   * إنشاء طلب جديد
   * Create new order
   */
  async createOrder(
    items: CartItem[],
    checkoutData: CheckoutData
  ): Promise<Order> {
    try {
      // تحويل CartItem إلى OrderItem للـ API
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.cartQuantity,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      }));

      // حساب المجاميع
      const subtotal = items.reduce((sum, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return sum + price * item.cartQuantity;
      }, 0);

      const tax = this.calculateTax(subtotal);
      const shipping = await this.calculateShipping(subtotal);
      const total = subtotal + tax + shipping;

      // إنشاء الطلب في الـ API
      const orderData = {
        items: orderItems,
        shippingAddress: {
          street: checkoutData.address,
          city: checkoutData.city,
          state: checkoutData.state,
          postalCode: checkoutData.zipCode,
          country: checkoutData.country,
        },
        billingAddress: {
          street: checkoutData.address,
          city: checkoutData.city,
          state: checkoutData.state,
          postalCode: checkoutData.zipCode,
          country: checkoutData.country,
        },
        subtotal,
        tax,
        shipping,
        total,
      };

      const response = await apiClient.post<Order>(
        API_ENDPOINTS.ORDERS.CREATE,
        orderData,
        true // يتطلب مصادقة
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);

      // Fallback: حفظ في localStorage
      return this.createLocalOrder(items, checkoutData);
    }
  },

  /**
   * حفظ الطلب محلياً (fallback)
   */
  async createLocalOrder(
    items: CartItem[],
    checkoutData: CheckoutData
  ): Promise<Order> {
    const subtotal = items.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return sum + price * item.cartQuantity;
    }, 0);

    const tax = this.calculateTax(subtotal);
    const shipping = await this.calculateShipping(subtotal);
    const total = subtotal + tax + shipping;

    const order: Order = {
      id: 'local-order-' + Date.now(),
      userId: 'local-user',
      items: items.map(item => ({
        id: 'item-' + Math.random(),
        productId: item.id,
        product: item as any,
        quantity: item.cartQuantity,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        subtotal: (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.cartQuantity,
      })),
      subtotal,
      tax,
      shipping,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // حفظ في localStorage
    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
    }

    return order;
  },

  /**
   * الحصول على جميع الطلبات
   * Get all orders
   */
  async getOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get<Order[]>(
        API_ENDPOINTS.ORDERS.LIST,
        true
      );

      // معالجة البيانات
      let data = response.data;
      if (data && typeof data === 'object' && 'orders' in data) {
        data = (data as any).orders;
      }

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);

      // Fallback: جلب من localStorage
      return this.getLocalOrders();
    }
  },

  /**
   * جلب الطلبات من localStorage
   */
  async getLocalOrders(): Promise<Order[]> {
    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      return orders;
    }
    return [];
  },

  /**
   * الحصول على طلب واحد
   * Get single order
   */
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await apiClient.get<Order>(
        API_ENDPOINTS.ORDERS.BY_ID(orderId),
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);

      // Fallback: البحث في localStorage
      const orders = await this.getLocalOrders();
      return orders.find(o => o.id === orderId) || null;
    }
  },

  /**
   * تحديث حالة الطلب
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const response = await apiClient.patch<Order>(
        API_ENDPOINTS.ORDERS.BY_ID(orderId),
        { status },
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  },

  /**
   * إلغاء الطلب
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'cancelled');
  },

  /**
   * حساب تكلفة الشحن
   * Calculate shipping cost
   */
  async calculateShipping(subtotal: number): Promise<number> {
    // شحن مجاني للطلبات فوق $100
    return subtotal > 100 ? 0 : 9.99;
  },

  /**
   * حساب الضريبة
   * Calculate tax
   */
  calculateTax(subtotal: number): number {
    // ضريبة 8%
    return subtotal * 0.08;
  },

  /**
   * حساب الإجمالي
   * Calculate total
   */
  async calculateTotal(items: CartItem[]): Promise<{
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  }> {
    const subtotal = items.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return sum + price * item.cartQuantity;
    }, 0);

    const tax = this.calculateTax(subtotal);
    const shipping = await this.calculateShipping(subtotal);
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
  },
};
