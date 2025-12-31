import { useState } from "react";
import { mockMenu, categories } from "@/data/mockProducts";
import type { MenuItem } from "@/types/index";
import { useRestaurant } from "@/hooks/useRestaurant";
import { MenuItemCard } from "./MenuItemCard";
import { CustomizationModal } from "./CustomizationModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Category images mapping
const categoryImages: Record<string, string> = {
  All: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
  Burgers: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
  Pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
  Appetizers: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=600&h=400&fit=crop",
  Mains: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
  Sides: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop",
  Drinks: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=600&h=400&fit=crop",
  Desserts: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop",
};

export function MenuGrid() {
  const { addToOrder } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  const filteredMenu = mockMenu.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (item: MenuItem) => {
    if (item.hasSizes || (item.modifiers && item.modifiers.length > 0)) {
      setCustomizingItem(item);
    } else {
      addToOrder(item);
    }
  };

  return (
    <div className='p-6'>
      {/* Search and Filter Bar */}
      <div className='mb-6'>
        <div className='flex gap-4 mb-4'>
          <Input
            type='text'
            placeholder='Search menu items...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='flex-1 h-12 bg-white'
          />
        </div>

        {/* Category Filter */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3'>
          <Button
            variant={selectedCategory === "All" ? "default" : "secondary"}
            onClick={() => setSelectedCategory("All")}
            className='relative h-20 rounded-xl overflow-hidden p-0'
          >
            <img
              src={categoryImages["All"]}
              alt='All Menu'
              className='absolute inset-0 w-full h-full object-cover'
            />
            <div
              className={`absolute inset-0 ${
                selectedCategory === "All"
                  ? "bg-primary-800 bg-opacity-70"
                  : "bg-black bg-opacity-80"
              }`}
            ></div>
            <div className='relative h-full flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>All Menu</span>
            </div>
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              onClick={() => setSelectedCategory(category)}
              className='relative h-20 rounded-xl overflow-hidden p-0'
            >
              <img
                src={categoryImages[category]}
                alt={category}
                className='absolute inset-0 w-full h-full object-cover'
              />
              <div
                className={`absolute inset-0 ${
                  selectedCategory === category
                    ? "bg-primary-800 bg-opacity-70"
                    : "bg-black bg-opacity-80"
                }`}
              ></div>
              <div className='relative h-full flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>{category}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {filteredMenu.map((item) => (
          <MenuItemCard key={item.id} item={item} onAddToOrder={handleQuickAdd} />
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg font-semibold'>No menu items found</p>
          <p className='text-gray-400 text-sm mt-2'>Try adjusting your search or filter</p>
        </div>
      )}

      {/* Customization Modal */}
      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAddToOrder={addToOrder}
        />
      )}
    </div>
  );
}
