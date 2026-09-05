import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
  slug?: string;
  stock?: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      
      addItem: (newItem) => {
        const qtyToAdd = newItem.quantity || 1;
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          if (existingItem) {
            const maxStock = existingItem.stock ?? 20;
            const newQty = Math.min(maxStock, existingItem.quantity + qtyToAdd);
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { 
                      ...item, 
                      quantity: newQty,
                      // Preserve/update image if previous was empty
                      image: item.image || newItem.image || '/sarees/cat-pattu.jpg'
                    }
                  : item
              ),
            };
          }
          return { 
            items: [
              ...state.items, 
              { 
                ...newItem, 
                quantity: qtyToAdd,
                image: newItem.image || '/sarees/cat-pattu.jpg'
              }
            ] 
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const maxStock = item.stock ?? 20;
              const validQuantity = Math.max(1, Math.min(maxStock, quantity));
              return { ...item, quantity: validQuantity };
            }
            return item;
          }),
        }));
      },

      increaseQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (item) {
          get().updateQuantity(id, item.quantity + 1);
        }
      },

      decreaseQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (item) {
          get().updateQuantity(id, item.quantity - 1);
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'dl-handlooms-cart',
    }
  )
);
