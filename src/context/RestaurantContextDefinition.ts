import { createContext } from "react";
import type {
  Order,
  MenuItem,
  Sale,
  PaymentMethod,
  SelectedModifier,
  SizeOption,
  Staff,
} from "../types/index";

export interface RestaurantContextType {
  // Order state
  order: Order;
  addToOrder: (
    menuItem: MenuItem,
    size?: SizeOption,
    customizations?: SelectedModifier[],
    specialInstructions?: string
  ) => void;
  removeFromOrder: (index: number) => void;
  updateOrderItemQuantity: (index: number, quantity: number) => void;
  clearOrder: () => void;

  // Sales state
  sales: Sale[];
  completeSale: (paymentMethod: PaymentMethod, notes?: string) => void;

  // Draft sales
  draftSales: Sale[];
  saveDraft: () => void;
  loadDraft: (saleId: string) => void;
  deleteDraft: (saleId: string) => void;

  // View state
  currentView: "pos" | "history";
  setCurrentView: (view: "pos" | "history") => void;

  // Staff state
  currentStaff: Staff | null;
  setCurrentStaff: (staff: Staff | null) => void;
}

export const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);
