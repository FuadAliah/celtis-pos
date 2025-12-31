import { MenuGrid } from "./MenuGrid";
import { OrderSidebar } from "./OrderSidebar";

export function RestaurantView() {
  return (
    <div className='flex h-[calc(100vh-88px)] bg-gray-50'>
      {/* Main content area - Menu Grid */}
      <div className='flex-1 overflow-y-auto'>
        <MenuGrid />
      </div>

      {/* Order Sidebar */}
      <div className='w-96 border-l border-gray-200 bg-white'>
        <OrderSidebar />
      </div>
    </div>
  );
}
