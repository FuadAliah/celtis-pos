import { useState } from "react";
import type { PaymentMethod } from "@/types/index";
import { formatCurrency } from "@/utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PaymentModalProps {
  total: number;
  onComplete: (paymentMethod: PaymentMethod, notes?: string) => void;
  onClose: () => void;
}

export function PaymentModal({ total, onComplete, onClose }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [notes, setNotes] = useState("");

  const handleComplete = () => {
    onComplete(paymentMethod, notes || undefined);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Complete Order</DialogTitle>
          <DialogDescription>Select payment method and confirm the order</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='py-8 mt-4'>
            <p className='text-4xl font-bold text-primary-400 text-center'>
              {formatCurrency(total)}
            </p>
          </div>

          <div>
            <Label className='mb-2 block'>Payment Method</Label>
            <div className='grid grid-cols-2 gap-2'>
              {(["cash", "card"] as PaymentMethod[]).map((method) => (
                <Button
                  key={method}
                  variant={paymentMethod === method ? "default" : "outline"}
                  onClick={() => setPaymentMethod(method)}
                  className='capitalize'
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor='notes' className='mb-2 block'>
              Notes (Optional)
            </Label>
            <textarea
              id='notes'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Add any notes...'
              className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring'
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className='flex justify-end gap-4 mt-2'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleComplete}>Confirm Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
