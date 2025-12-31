import type { Sale } from "@/types/index";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SaleDetailsModalProps {
  sale: Sale;
  onClose: () => void;
}

export function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Complete information about this order</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 mt-4'>
          {/* Order Info */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Order Number</p>
              <p className='font-semibold'>{sale.saleNumber}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Date</p>
              <p className='font-semibold'>{formatDate(sale.createdAt)}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Payment Method</p>
              <Badge variant='outline' className='capitalize mt-1'>
                {sale.paymentMethod}
              </Badge>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Status</p>
              <Badge
                variant={
                  sale.status === "completed"
                    ? "success"
                    : sale.status === "refunded"
                    ? "destructive"
                    : "secondary"
                }
                className='capitalize mt-1'
              >
                {sale.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Staff Info */}
          <Card className='bg-primary-50 border-primary-100'>
            <CardContent className='p-4'>
              <h4 className='font-semibold text-primary-900 mb-2'>Staff Member</h4>
              <div className='space-y-1'>
                <p className='text-sm'>
                  <span className='text-muted-foreground'>Name: </span>
                  <span className='font-medium'>{sale.staffName}</span>
                </p>
                <p className='text-sm'>
                  <span className='text-muted-foreground'>Role: </span>
                  <span className='font-medium capitalize'>{sale.staffRole}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <div>
            <h4 className='font-semibold mb-3'>Order Items</h4>
            <div className='space-y-2'>
              {sale.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className='p-3 flex justify-between items-start'>
                    <div className='flex-1'>
                      <p className='font-medium'>{item.menuItemName}</p>
                      {item.size && (
                        <p className='text-xs text-muted-foreground capitalize'>
                          Size: {item.size}
                        </p>
                      )}
                      {item.customizations && item.customizations.length > 0 && (
                        <div className='mt-1'>
                          {item.customizations.map((custom) => (
                            <p key={custom.id} className='text-xs text-muted-foreground'>
                              + {custom.name}
                              {custom.price > 0 && (
                                <span className='text-primary'>
                                  {" "}
                                  ({formatCurrency(custom.price)})
                                </span>
                              )}
                            </p>
                          ))}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <p className='text-xs text-muted-foreground mt-1 italic'>
                          &quot;{item.specialInstructions}&quot;
                        </p>
                      )}
                      <p className='text-sm text-muted-foreground mt-1'>
                        {item.menuItemSku} • {formatCurrency(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <p className='font-semibold'>{formatCurrency(item.subtotal)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span className='font-medium'>{formatCurrency(sale.subtotal)}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Tax</span>
              <span className='font-medium'>{formatCurrency(sale.tax)}</span>
            </div>
            {sale.discount > 0 && (
              <div className='flex justify-between text-sm text-green-600'>
                <span>Discount</span>
                <span className='font-medium'>-{formatCurrency(sale.discount)}</span>
              </div>
            )}
            <Separator />
            <div className='flex justify-between text-lg font-bold'>
              <span>Total</span>
              <span className='text-primary'>{formatCurrency(sale.total)}</span>
            </div>
          </div>

          {/* Notes */}
          {sale.notes && (
            <>
              <Separator />
              <div>
                <p className='text-sm text-muted-foreground mb-1'>Notes</p>
                <p>{sale.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
