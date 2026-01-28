import { Order, CartItem, CheckoutData } from '@/lib/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  // Create order from cart
  async createOrder(
    items: CartItem[],
    checkoutData: CheckoutData
  ): Promise<Order> {
    await delay(1000);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    const order: Order = {
      id: 'order-' + Date.now(),
      items,
      subtotal,
      tax,
      shipping,
      total,
      status: 'pending',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    // Store order in localStorage
    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
    }

    return order;
  },

  // Get orders
  async getOrders(): Promise<Order[]> {
    await delay(400);
    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      return orders.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
      }));
    }
    return [];
  },

  // Get single order
  async getOrder(orderId: string): Promise<Order | null> {
    await delay(300);
    const orders = await this.getOrders();
    return orders.find(o => o.id === orderId) || null;
  },

  // Calculate shipping
  async calculateShipping(subtotal: number): Promise<number> {
    await delay(200);
    return subtotal > 100 ? 0 : 9.99;
  },

  // Calculate tax
  calculateTax(subtotal: number): number {
    return subtotal * 0.08;
  },
};
