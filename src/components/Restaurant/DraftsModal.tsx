import { formatCurrency } from "@/utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DraftsModalProps {
  drafts: Array<{
    id: string;
    saleNumber: string;
    items: Array<{ menuItemName: string; quantity: number }>;
    total: number;
    createdAt: string;
  }>;
  onLoadDraft: (id: string) => void;
  onClose: () => void;
}

export function DraftsModal({ drafts, onLoadDraft, onClose }: DraftsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Draft Orders</DialogTitle>
          <DialogDescription>Select a draft order to continue working on it</DialogDescription>
        </DialogHeader>

        <div className='space-y-3 mt-4'>
          {drafts.map((draft) => (
            <Card
              key={draft.id}
              className='cursor-pointer'
              onClick={() => {
                onLoadDraft(draft.id);
                onClose();
              }}
            >
              <CardContent className='p-4'>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <p className='font-semibold'>{draft.saleNumber}</p>
                    <p className='text-xs text-muted-foreground'>
                      {new Date(draft.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className='font-bold text-primary'>{formatCurrency(draft.total)}</p>
                </div>

                {/* Draft Items */}
                <div className='space-y-1 mb-2'>
                  {draft.items.map((item, index) => (
                    <div key={index} className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>
                        {item.quantity}x {item.menuItemName}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className='my-2' />

                <div className='text-xs text-muted-foreground'>
                  {draft.items.length} {draft.items.length === 1 ? "item" : "items"} total
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
