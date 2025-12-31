import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { formatCurrency } from "@/utils/formatters";
import { OrderItemCard } from "./OrderItemCard";
import { PaymentModal } from "./PaymentModal";
import { DraftsModal } from "./DraftsModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function OrderSidebar() {
  const {
    order,
    removeFromOrder,
    updateOrderItemQuantity,
    completeSale,
    saveDraft,
    clearOrder,
    draftSales,
    loadDraft,
    currentStaff,
  } = useRestaurant();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);

  const isEmpty = order.items.length === 0;
  const canProcessOrder = !isEmpty && currentStaff !== null;

  return (
    <div className='flex flex-col h-full'>
      {/* Order Header */}
      <div className='p-5 border-b border-gray-200'>
        <h2 className='text-xl font-extrabold text-gray-900 tracking-tight'>Current Order</h2>
        <p className='text-sm text-gray-500'>
          {order.items.length} {order.items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Order Items */}
      <div className='flex-1 overflow-y-auto p-4'>
        {isEmpty ? (
          <div className='text-center flex flex-col h-full items-center justify-center'>
            <ClipboardList className='w-20 h-20 mx-auto text-gray-300 mb-4' />
            <p className='text-gray-500 font-semibold'>Order is empty</p>
            <p className='text-sm text-gray-400 mt-1'>Add menu items to start</p>

            {draftSales.length > 0 && (
              <Button variant='outline' onClick={() => setShowDrafts(true)} className='mt-4'>
                View {draftSales.length} draft {draftSales.length === 1 ? "order" : "orders"}
              </Button>
            )}
          </div>
        ) : (
          <div className='space-y-4'>
            {order.items.map((item, index) => (
              <OrderItemCard
                key={index}
                item={item}
                index={index}
                onUpdateQuantity={updateOrderItemQuantity}
                onRemove={removeFromOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Summary & Actions */}
      {!isEmpty && (
        <div className='border-t border-gray-200 p-4 bg-gray-50'>
          {/* Totals */}
          <div className='space-y-2 mb-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span className='font-medium'>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Tax (10%)</span>
              <span className='font-medium'>{formatCurrency(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className='flex justify-between text-sm text-green-600'>
                <span>Discount</span>
                <span className='font-medium'>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <Separator className='my-2' />
            <div className='flex justify-between text-xl font-extrabold'>
              <span>Total</span>
              <span className='text-primary'>{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-2'>
            {!currentStaff && (
              <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                <p className='text-sm text-amber-800 font-medium'>
                  Please select a staff member to complete or save orders
                </p>
              </div>
            )}

            <Button
              onClick={() => setShowPaymentModal(true)}
              disabled={!canProcessOrder}
              className='w-full font-semibold shadow-sm'
              size='lg'
            >
              Complete Order
            </Button>

            <div className='grid grid-cols-2 gap-2'>
              <Button onClick={saveDraft} disabled={!canProcessOrder} variant='outline'>
                Save Draft
              </Button>
              <Button onClick={clearOrder} variant='secondary'>
                Clear Order
              </Button>
            </div>

            {draftSales.length > 0 && (
              <Button
                variant='outline'
                onClick={() => setShowDrafts(!showDrafts)}
                className='w-full'
              >
                {showDrafts ? "Hide" : "Show"} drafts ({draftSales.length})
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          total={order.total}
          onComplete={completeSale}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Drafts Modal */}
      {showDrafts && (
        <DraftsModal
          drafts={draftSales}
          onLoadDraft={loadDraft}
          onClose={() => setShowDrafts(false)}
        />
      )}
    </div>
  );
}
