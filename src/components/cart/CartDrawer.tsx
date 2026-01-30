import React from 'react';
import { Cart } from '../../types/cart.types';
/**
 * REVISION NOTE: Why Heroicons over others?
 * 1. TAILWIND NATIVE: Built by the same team that made Tailwind. No fighting with custom CSS.
 * 2. SVG vs ICON FONTS: Unlike FontAwesome (which uses fonts), this uses pure SVGs. 
 * SVGs are more accessible, sharper, and don't suffer from "flickering" when the page loads.
 * 3. TREE SHAKING: You only import the "X". Other libraries often make you 
 * load the whole library (slowing down the app).
 * 4. CLEANER LOOK: Heroicons has a very "Apple-like" or modern look compared 
 * to the "chunkier" look of older libraries.
 */
import { XMarkIcon } from '@heroicons/react/24/outline';
import CartItem from './CartItem';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: Cart | null;
  onCheckout?: () => void;
  onRemove?: (merchantProductId: string) => void;
  onUpdateQuantity?: (merchantProductId: string, quantity: number) => void;
}
/**
 * REVISION NOTE: React.FC<CartDrawerProps>
 * * 1. WHAT: 'React.FC' stands for "Function Component." It's a TypeScript type.
 * 2. WHY USE IT: It tells TypeScript that this function returns a UI (JSX) 
 * and provides automatic autocomplete for things like 'children'.
 * 3. PROPS (<CartDrawerProps>): This is a "Generic." It links this component 
 * to a specific list of data (the Interface) it expects to receive.
 * 4. DESTRUCTURING ({ open }): Instead of writing 'props.open', we pull 'open' 
 * directly out of the box so we can use it immediately.
 */
const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  cart,
  onCheckout,
  onRemove,
  onUpdateQuantity,
}) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!cart || cart.items.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty</p>
          ) : (
            cart.items.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onRemove={() => onRemove?.(item.merchantProductId)}
                onQuantityChange={(qty) =>
                  onUpdateQuantity?.(item.merchantProductId, qty)
                }
              />
            ))
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">${Number(cart.totalValue).toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;