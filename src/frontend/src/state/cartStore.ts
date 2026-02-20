import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  priceINR: number;
  availableInventory: number;
  quantity: number;
}

export interface GiftCardPurchase {
  amount: number;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  message: string;
  deliveryTime: number | null;
}

interface CartStore {
  items: CartItem[];
  giftCard: GiftCardPurchase | null;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => { success: boolean; message: string };
  addItemBulk: (items: Array<{ item: Omit<CartItem, 'quantity'>; quantity?: number }>) => Array<{ success: boolean; message: string }>;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => { success: boolean; message: string };
  setGiftCard: (giftCard: GiftCardPurchase) => void;
  removeGiftCard: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      giftCard: null,

      addItem: (item, quantity = 1) => {
        const state = get();
        
        // Ensure quantity is valid (at least 1, clamped to inventory)
        const validQuantity = Math.max(1, Math.min(Math.floor(quantity || 1), item.availableInventory));
        
        const existingItem = state.items.find((i) => i.productId === item.productId);

        if (item.availableInventory === 0) {
          return { success: false, message: 'This product is out of stock' };
        }

        if (existingItem) {
          const newQuantity = existingItem.quantity + validQuantity;
          if (newQuantity > item.availableInventory) {
            return {
              success: false,
              message: `Only ${item.availableInventory} items available in stock`,
            };
          }
          set({
            items: state.items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: newQuantity } : i
            ),
          });
          return { success: true, message: 'Item quantity updated in cart' };
        } else {
          if (validQuantity > item.availableInventory) {
            return {
              success: false,
              message: `Only ${item.availableInventory} items available in stock`,
            };
          }
          set({ items: [...state.items, { ...item, quantity: validQuantity }] });
          return { success: true, message: 'Item added to cart' };
        }
      },

      addItemBulk: (items) => {
        const results: Array<{ success: boolean; message: string }> = [];
        
        for (const { item, quantity = 1 } of items) {
          const result = get().addItem(item, quantity);
          results.push(result);
        }
        
        return results;
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },

      setQuantity: (productId, quantity) => {
        const state = get();
        const item = state.items.find((i) => i.productId === productId);

        if (!item) {
          return { success: false, message: 'Item not found in cart' };
        }

        if (quantity < 1) {
          return { success: false, message: 'Quantity must be at least 1' };
        }

        if (quantity > item.availableInventory) {
          return {
            success: false,
            message: `Only ${item.availableInventory} items available in stock`,
          };
        }

        set({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
        return { success: true, message: 'Quantity updated' };
      },

      setGiftCard: (giftCard) => {
        set({ giftCard });
      },

      removeGiftCard: () => {
        set({ giftCard: null });
      },

      clearCart: () => {
        set({ items: [], giftCard: null });
      },

      getSubtotal: () => {
        const state = get();
        const itemsTotal = state.items.reduce((sum, item) => sum + item.priceINR * item.quantity, 0);
        const giftCardTotal = state.giftCard ? state.giftCard.amount : 0;
        return itemsTotal + giftCardTotal;
      },

      getItemCount: () => {
        const state = get();
        const itemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const giftCardCount = state.giftCard ? 1 : 0;
        return itemsCount + giftCardCount;
      },
    }),
    {
      name: 'sajavathub-cart',
    }
  )
);
