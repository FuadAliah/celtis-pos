import { Plus } from "lucide-react";
import type { MenuItem } from "@/types/index";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onAddToOrder }: MenuItemCardProps) {
  const handleClick = () => {
    if (item.available) {
      onAddToOrder(item);
    }
  };

  return (
    <Card
      className={`overflow-hidden text-left flex flex-col cursor-pointer transition-shadow hover:shadow-md ${
        !item.available ? "opacity-50" : ""
      }`}
      onClick={handleClick}
    >
      {/* Image */}
      {item.imageUrl && (
        <div className='relative w-full h-40 bg-gray-200 flex-shrink-0'>
          <img
            src={item.imageUrl}
            alt={item.name}
            className='w-full h-full object-cover'
            loading='lazy'
          />
          {!item.available && (
            <div className='absolute top-2 right-2'>
              <Badge variant='destructive'>Unavailable</Badge>
            </div>
          )}
        </div>
      )}

      <CardContent className='p-5'>
        <div className='mb-2'>
          <h3 className='font-semibold text-lg leading-tight mb-1'>{item.name}</h3>
          <p className='text-xs text-gray-500'>{item.sku}</p>
        </div>

        {item.description && (
          <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{item.description}</p>
        )}

        <div className='flex items-center justify-between mt-auto'>
          <div>
            <p className='text-2xl font-extrabold text-primary-600'>
              {formatCurrency(item.basePrice)}
            </p>
            {item.hasSizes && <p className='text-xs text-gray-500'>Starting at</p>}
          </div>

          <Button size='icon' className='rounded-full' disabled={!item.available}>
            <Plus className='w-5 h-5' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
