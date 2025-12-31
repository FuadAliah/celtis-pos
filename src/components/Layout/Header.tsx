import { useRestaurant } from "@/hooks/useRestaurant";
import { StaffSelector } from "./StaffSelector";
import { Button } from "@/components/ui/button";

export function Header() {
  const { currentView, setCurrentView } = useRestaurant();

  return (
    <header className='bg-white border-b border-gray-200 shadow-sm'>
      <div className='px-8 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-extrabold text-primary-600'>Celtis Restaurant</h1>
            <p className='text-sm text-gray-500'>Restaurant POS System</p>
          </div>

          <div className='flex items-center gap-4'>
            <StaffSelector />
            <nav className='flex gap-2'>
              <Button
                onClick={() => setCurrentView("pos")}
                variant={currentView === "pos" ? "default" : "secondary"}
                className='font-medium h-11'
              >
                POS
              </Button>
              <Button
                onClick={() => setCurrentView("history")}
                variant={currentView === "history" ? "default" : "secondary"}
                className='font-medium h-11'
              >
                Order History
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
