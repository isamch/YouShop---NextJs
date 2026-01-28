// Re-export API types for backward compatibility
export type {
  Product,
  CartItem,
  Order,
  User,
  Address,
  AuthResponse,
  Category,
  OrderStatus,
  PaymentStatus,
  SKU,
  Stock,
  PaginatedResponse,
  PaginationParams,
} from './types/api';

export interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
}
