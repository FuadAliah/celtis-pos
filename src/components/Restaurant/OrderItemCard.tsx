import { X, Minus, Plus } from "lucide-react";
import type { OrderItem } from "../../types/index";
import { formatCurrency } from "../../utils/formatters";

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
}

export function OrderItemCard({ item, index, onUpdateQuantity, onRemove }: OrderItemCardProps) {
  return (
    <div className='bg-white rounded-lg p-4 border border-gray-200'>
      <div className='flex justify-between items-start mb-2'>
        <div className='flex-1'>
          <h4 className='font-medium text-gray-900'>{item.menuItem.name}</h4>
          {item.size && <p className='text-xs text-gray-500 capitalize'>Size: {item.size}</p>}
          {item.customizations.length > 0 && (
            <div className='mt-1'>
              {item.customizations.map((custom) => (
                <p key={custom.id} className='text-xs text-gray-600'>
                  + {custom.name}
                  {custom.price > 0 && (
                    <span className='text-primary-600'> ({formatCurrency(custom.price)})</span>
                  )}
                </p>
              ))}
            </div>
          )}
          {item.specialInstructions && (
            <p className='text-xs text-gray-600 mt-1 italic'>
              &quot;{item.specialInstructions}&quot;
            </p>
          )}
        </div>
        <button onClick={() => onRemove(index)} className='text-red-500 ml-2'>
          <X className='w-5 h-5' />
        </button>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
            className='w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 transition-colors'
          >
            <Minus className='w-4 h-4' />
          </button>
          <span className='w-10 text-center font-semibold'>{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
            className='w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 transition-colors'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>

        <div className='text-right'>
          <p className='text-xs text-gray-500'>{formatCurrency(item.itemPrice)} each</p>
          <p className='font-bold text-gray-900'>{formatCurrency(item.subtotal)}</p>
        </div>
      </div>
    </div>
  );
}
