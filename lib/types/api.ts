// API Response Types

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: Category;
  categoryId: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  quantity?: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  categoryId: string;
  quantity?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// Cart Types
export interface CartItem extends Product {
  cartQuantity: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  id: string;
  skuId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CreateOrderRequest {
  userId: string;
  items: {
    skuId: string;
    quantity: number;
    unitPrice: number;
  }[];
  shippingAddress: Omit<Address, 'id' | 'type' | 'isDefault'>;
  billingAddress: Omit<Address, 'id' | 'type' | 'isDefault'>;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

// Payment Types
export interface PaymentIntent {
  id: string;
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  orderId: string;
  createdAt: string;
}

export type PaymentStatus = 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  orderId: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  paymentMethodId: string;
}

// Inventory Types
export interface SKU {
  id: string;
  code: string;
  productId: string;
  product?: Product;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Stock {
  id: string;
  skuId: string;
  sku?: SKU;
  quantity: number;
  reserved: number;
  available: number;
  updatedAt: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error Types
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error: string;
  details?: any;
}