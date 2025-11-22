import { useMenuData, useScreenImages, useLogo, useUtilitySettings } from "@/hooks/useMenuData";
import { MenuSection } from "@/components/MenuSection";
import { MenuItem } from "@/components/MenuItem";
import { FoodCircle } from "@/components/FoodCircle";
import defaultLogo from "@/assets/logo.png";

const Screen2 = () => {
  // Use category IDs: 3 for Porzioni, 6 for Piadine, 7 for LInsalatone
  const categoryIds = [3, 6, 7];
  const { menuData, loading: menuLoading, error: menuError, categoryNames } = useMenuData(categoryIds);
  const { images, loading: imagesLoading, error: imagesError } = useScreenImages(2, 4);
  const { logoUrl, loading: logoLoading, error: logoError } = useLogo();
  const { bgColor, loading: utilityLoading, error: utilityError } = useUtilitySettings();

  const loading = menuLoading || imagesLoading || logoLoading || utilityLoading;
  const error = menuError || imagesError || logoError || utilityError;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-restaurant-orange mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading menu: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-restaurant-orange text-white rounded hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get category names from the mapping
  const porzioniCategoryName = categoryNames[3] || "Porzioni";
  const piadineCategoryName = categoryNames[6] || "Piadine";
  const insalatoneCategoryName = categoryNames[7] || "LInsalatone";

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: bgColor.color }}
    >
      {/* Background decorative elements */}
      {images.S2I1 && (
        <div className="absolute top-12 left-10 z-0">
          <FoodCircle image={images.S2I1} alt="Delicious Burger" className="opacity-80" />
        </div>
      )}
      {images.S2I2 && (
        <div className="absolute top-20 right-10 z-0">
          <FoodCircle image={images.S2I2} alt="Golden Fries" className="opacity-80 scale-125" />
        </div>
      )}
      
      {images.S2I3 && (
        <div className="absolute bottom-20 left-0 z-0">
          <FoodCircle image={images.S2I3} alt="Gourmet Sandwich" className="opacity-80 scale-90" />
        </div>
      )}
      {images.S2I4 && (
        <div className="absolute bottom-0 right-0 z-0 ">
          <FoodCircle image={images.S2I4} alt="Chocolate Dessert" className="opacity-80 scale-75" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-0">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <img 
              src={logoUrl || defaultLogo} 
              alt="Logo" 
              className="h-28 w-auto mx-auto mb-2"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* First Two Columns - Porzioni */}
          <div className="lg:col-span-2 space-y-8">
            <MenuSection title={porzioniCategoryName}>
              {menuData[porzioniCategoryName]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  {menuData[porzioniCategoryName].map((item) => (
                    <MenuItem
                      key={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price.toFixed(2)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No food items available
                </p>
              )}
            </MenuSection>
          </div>

          {/* Third Column - Piadine & L'Insalatone */}
          <div className="space-y-8">
            <MenuSection title={piadineCategoryName}>
              {menuData[piadineCategoryName]?.length > 0 ? (
                menuData[piadineCategoryName].map((item) => (
                  <MenuItem 
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price.toFixed(2)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No items available</p>
              )}
            </MenuSection>
            
            <MenuSection title={insalatoneCategoryName}>
              {menuData[insalatoneCategoryName]?.length > 0 ? (
                menuData[insalatoneCategoryName].map((item) => (
                  <MenuItem 
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price.toFixed(2)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No items available</p>
              )}
            </MenuSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen2;