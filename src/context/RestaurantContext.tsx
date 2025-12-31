import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { RestaurantContext } from "./RestaurantContextDefinition";
import type {
  Order,
  OrderItem,
  MenuItem,
  Sale,
  SaleItem,
  PaymentMethod,
  SelectedModifier,
  SizeOption,
  Staff,
} from "../types/index";

const TAX_RATE = 0.1; // 10% tax rate

const calculateItemPrice = (
  menuItem: MenuItem,
  size?: SizeOption,
  customizations?: SelectedModifier[]
): number => {
  let price = menuItem.basePrice;

  // Apply size pricing if applicable
  if (size && menuItem.sizePricing) {
    const sizePrice = menuItem.sizePricing.find((sp) => sp.size === size);
    if (sizePrice) {
      price = sizePrice.price;
    }
  }

  // Add customization costs
  if (customizations) {
    customizations.forEach((custom) => {
      price += custom.price;
    });
  }

  return price;
};

const calculateOrder = (items: OrderItem[]): Order => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * TAX_RATE;
  const discount = 0;
  const total = subtotal + tax - discount;

  return {
    items,
    subtotal,
    tax,
    discount,
    total,
  };
};

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [draftSales, setDraftSales] = useState<Sale[]>([]);
  const [currentView, setCurrentView] = useState<"pos" | "history">("pos");
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      const savedSales = localStorage.getItem("restaurant_sales");
      const savedDrafts = localStorage.getItem("restaurant_drafts");
      const savedStaff = localStorage.getItem("restaurant_current_staff");

      if (savedSales) {
        setSales(JSON.parse(savedSales) as Sale[]);
      }
      if (savedDrafts) {
        setDraftSales(JSON.parse(savedDrafts) as Sale[]);
      }
      if (savedStaff) {
        setCurrentStaff(JSON.parse(savedStaff) as Staff);
      }
    };
    loadData();
  }, []);

  // Save sales to localStorage whenever they change
  useEffect(() => {
    if (sales.length > 0) {
      localStorage.setItem("restaurant_sales", JSON.stringify(sales));
    }
  }, [sales]);

  // Save drafts to localStorage whenever they change
  useEffect(() => {
    if (draftSales.length > 0) {
      localStorage.setItem("restaurant_drafts", JSON.stringify(draftSales));
    }
  }, [draftSales]);

  // Save current staff to localStorage whenever it changes
  useEffect(() => {
    if (currentStaff) {
      localStorage.setItem("restaurant_current_staff", JSON.stringify(currentStaff));
    } else {
      localStorage.removeItem("restaurant_current_staff");
    }
  }, [currentStaff]);

  const order = calculateOrder(orderItems);

  const addToOrder = (
    menuItem: MenuItem,
    size?: SizeOption,
    customizations?: SelectedModifier[],
    specialInstructions?: string
  ) => {
    const itemPrice = calculateItemPrice(menuItem, size, customizations);
    const finalSize = menuItem.hasSizes ? size || "medium" : undefined;

    const newItem: OrderItem = {
      menuItem,
      quantity: 1,
      size: finalSize,
      customizations: customizations || [],
      specialInstructions,
      itemPrice,
      subtotal: itemPrice,
    };

    setOrderItems((prev) => [...prev, newItem]);
  };

  const removeFromOrder = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOrderItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(index);
      return;
    }

    setOrderItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.itemPrice,
            }
          : item
      )
    );
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  const completeSale = (paymentMethod: PaymentMethod, notes?: string) => {
    if (orderItems.length === 0) return;
    if (!currentStaff) return; // Require staff to complete sale

    const saleItems: SaleItem[] = orderItems.map((item) => ({
      menuItemId: item.menuItem.id,
      menuItemName: item.menuItem.name,
      menuItemSku: item.menuItem.sku,
      quantity: item.quantity,
      size: item.size,
      customizations: item.customizations,
      specialInstructions: item.specialInstructions,
      unitPrice: item.itemPrice,
      subtotal: item.subtotal,
    }));

    const now = new Date().toISOString();
    const saleNumber = `SALE-${Date.now()}`;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      saleNumber,
      items: saleItems,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      paymentMethod,
      status: "completed",
      createdAt: now,
      completedAt: now,
      staffId: currentStaff.id,
      staffName: currentStaff.name,
      staffRole: currentStaff.role,
      notes,
    };

    setSales((prev) => [newSale, ...prev]);
    clearOrder();
  };

  const saveDraft = () => {
    if (orderItems.length === 0) return;
    if (!currentStaff) return; // Require staff to save draft

    const saleItems: SaleItem[] = orderItems.map((item) => ({
      menuItemId: item.menuItem.id,
      menuItemName: item.menuItem.name,
      menuItemSku: item.menuItem.sku,
      quantity: item.quantity,
      size: item.size,
      customizations: item.customizations,
      specialInstructions: item.specialInstructions,
      unitPrice: item.itemPrice,
      subtotal: item.subtotal,
    }));

    const now = new Date().toISOString();
    const draftNumber = `DRAFT-${Date.now()}`;

    const newDraft: Sale = {
      id: `draft-${Date.now()}`,
      saleNumber: draftNumber,
      items: saleItems,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      paymentMethod: "cash",
      status: "draft",
      createdAt: now,
      staffId: currentStaff.id,
      staffName: currentStaff.name,
      staffRole: currentStaff.role,
    };

    setDraftSales((prev) => [newDraft, ...prev]);
    clearOrder();
  };

  const loadDraft = (saleId: string) => {
    const draft = draftSales.find((d) => d.id === saleId);
    if (!draft) return;

    // Note: In a real app, we'd fetch full menu item details from the menu
    // For now, we'll reconstruct basic info from the sale items
    const orderItemsFromDraft: OrderItem[] = draft.items.map((item) => ({
      menuItem: {
        id: item.menuItemId,
        name: item.menuItemName,
        basePrice: item.unitPrice,
        hasSizes: !!item.size,
        sku: item.menuItemSku,
        category: "Unknown", // Lost in conversion
        available: true,
      },
      quantity: item.quantity,
      size: item.size,
      customizations: item.customizations,
      specialInstructions: item.specialInstructions,
      itemPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));

    setOrderItems(orderItemsFromDraft);
    deleteDraft(saleId);
  };

  const deleteDraft = (saleId: string) => {
    setDraftSales((prev) => prev.filter((d) => d.id !== saleId));
  };

  return (
    <RestaurantContext.Provider
      value={{
        order,
        addToOrder,
        removeFromOrder,
        updateOrderItemQuantity,
        clearOrder,
        sales,
        completeSale,
        draftSales,
        saveDraft,
        loadDraft,
        deleteDraft,
        currentView,
        setCurrentView,
        currentStaff,
        setCurrentStaff,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}
