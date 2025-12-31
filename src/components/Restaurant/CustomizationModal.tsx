import { useState } from "react";
import { Check } from "lucide-react";
import type { MenuItem, SelectedModifier, SizeOption } from "@/types/index";
import { formatCurrency } from "@/utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CustomizationModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToOrder: (
    item: MenuItem,
    size?: SizeOption,
    customizations?: SelectedModifier[],
    specialInstructions?: string
  ) => void;
}

export function CustomizationModal({ item, onClose, onAddToOrder }: CustomizationModalProps) {
  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(
    item.hasSizes ? "medium" : undefined
  );
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const toggleModifier = (modifier: SelectedModifier) => {
    setSelectedModifiers((prev) => {
      const exists = prev.find((m) => m.id === modifier.id);
      if (exists) {
        return prev.filter((m) => m.id !== modifier.id);
      }
      return [...prev, modifier];
    });
  };

  const calculatePrice = () => {
    let price = item.basePrice;

    if (selectedSize && item.sizePricing) {
      const sizePrice = item.sizePricing.find((sp) => sp.size === selectedSize);
      if (sizePrice) price = sizePrice.price;
    }

    selectedModifiers.forEach((mod) => {
      price += mod.price;
    });

    return price;
  };

  const handleAdd = () => {
    onAddToOrder(item, selectedSize, selectedModifiers, specialInstructions || undefined);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] p-0 flex flex-col'>
        {/* Item Image */}
        {item.imageUrl && (
          <div className='relative w-full h-48 bg-gray-200 overflow-hidden flex-shrink-0'>
            <img src={item.imageUrl} alt={item.name} className='w-full h-full object-cover' />
          </div>
        )}

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>{item.name}</DialogTitle>
            <DialogDescription>{item.description}</DialogDescription>
          </DialogHeader>

          <div className='space-y-6 mt-6'>
            {/* Size Selection */}
            {item.hasSizes && item.sizePricing && (
              <div>
                <Label className='text-base font-semibold mb-3 block'>Choose Size</Label>
                <div className='grid grid-cols-3 gap-3'>
                  {item.sizePricing.map((sizeOption) => (
                    <Button
                      key={sizeOption.size}
                      variant={selectedSize === sizeOption.size ? "default" : "outline"}
                      onClick={() => setSelectedSize(sizeOption.size)}
                      className='h-auto flex-col p-4'
                    >
                      <p className='font-semibold capitalize'>{sizeOption.size}</p>
                      <p className='text-sm mt-1'>{formatCurrency(sizeOption.price)}</p>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Modifiers */}
            {item.modifiers && item.modifiers.length > 0 && (
              <div>
                <Label className='text-base font-semibold mb-3 block'>Customize Your Order</Label>
                <div className='space-y-2'>
                  {item.modifiers.map((modifier) => {
                    const isSelected = selectedModifiers.some((m) => m.id === modifier.id);
                    return (
                      <Button
                        key={modifier.id}
                        variant={isSelected ? "ghost" : "outline"}
                        onClick={() => toggleModifier(modifier)}
                        className='w-full justify-between h-auto p-3'
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}
                          >
                            {isSelected && <Check className='w-3 h-3 text-primary-foreground' />}
                          </div>
                          <span className='text-sm font-medium'>{modifier.name}</span>
                        </div>
                        <span className='text-sm font-semibold'>
                          {modifier.price > 0 ? `+${formatCurrency(modifier.price)}` : "Free"}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className='pb-4'>
              <Label htmlFor='instructions' className='text-base font-semibold mb-3 block'>
                Special Instructions (Optional)
              </Label>
              <textarea
                id='instructions'
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder='e.g., Extra crispy, No pickles...'
                className='w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring'
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className='flex-shrink-0 border-t bg-gray-50 p-6'>
          <div className='flex items-center justify-between w-full mb-4'>
            <span className='text-lg font-semibold'>Total Price</span>
            <span className='text-2xl font-bold text-primary'>
              {formatCurrency(calculatePrice())}
            </span>
          </div>
          <Button onClick={handleAdd} className='w-full font-bold text-xl' size='lg'>
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
