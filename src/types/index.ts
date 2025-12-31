// Core data types for the Restaurant POS system

export type SizeOption = "small" | "medium" | "large";

export interface SizePrice {
  size: SizeOption;
  price: number;
}

export interface Modifier {
  id: string;
  name: string;
  price: number; // 0 for free modifiers
  category: "add" | "remove" | "extra";
}

export interface MenuItem {
  id: string;
  name: string;
  basePrice: number; // Price for regular/medium size
  sizePricing?: SizePrice[]; // Optional size-based pricing
  hasSizes: boolean; // Whether this item has size options
  sku: string;
  category: string;
  description?: string;
  imageUrl?: string;
  available: boolean;
  modifiers?: Modifier[]; // Available modifiers for this item
}

export interface SelectedModifier {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  size?: SizeOption; // Selected size if applicable
  customizations: SelectedModifier[]; // Selected modifiers
  specialInstructions?: string;
  itemPrice: number; // Price including size and modifiers
  subtotal: number; // itemPrice * quantity
}

export interface Order {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export type PaymentMethod = "cash" | "card";

export type SaleStatus = "completed" | "draft" | "parked" | "refunded" | "cancelled";

export interface SaleItem {
  menuItemId: string;
  menuItemName: string;
  menuItemSku: string;
  quantity: number;
  size?: SizeOption;
  customizations: SelectedModifier[];
  specialInstructions?: string;
  unitPrice: number; // Price per item including customizations
  subtotal: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  createdAt: string;
  completedAt?: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  notes?: string;
}

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "converted";

export interface Quote {
  id: string;
  quoteNumber: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: QuoteStatus;
  createdAt: string;
  expiresAt: string;
  customerName?: string;
  customerEmail?: string;
  notes?: string;
  convertedToSaleId?: string;
}

export interface Refund {
  id: string;
  refundNumber: string;
  originalSaleId: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  reason: string;
  createdAt: string;
  processedAt?: string;
  status: "pending" | "processed" | "rejected";
}

export interface Staff {
  id: string;
  name: string;
  role: "manager" | "cashier" | "server";
  employeeId: string;
  active: boolean;
}

export interface Session {
  id: string;
  staffId: string;
  startTime: string;
  endTime?: string;
  totalSales: number;
  totalAmount: number;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  notes?: string;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  estimatedDelivery?: string;
}

export interface SaleWithDelivery extends Sale {
  delivery?: DeliveryInfo;
}
