import { useMenuData, useScreenImages, useLogo, useUtilitySettings } from "@/hooks/useMenuData";
import { MenuSection } from "@/components/MenuSection";
import { MenuItem } from "@/components/MenuItem";
import { FoodCircle } from "@/components/FoodCircle";
import defaultLogo from "@/assets/logo.png";

const Screen1 = () => {
  // Use category IDs instead of names
  const categoryIds = [1, 2]; // 1 for Burgers, 2 for Sandwiches
  const { menuData, loading: menuLoading, error: menuError, categoryNames } = useMenuData(categoryIds);
  const { images, loading: imagesLoading, error: imagesError } = useScreenImages(1, 4);
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
  const burgerCategoryName = categoryNames[1] || "Burgers";
  const sandwichCategoryName = categoryNames[2] || "Sandwiches";

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: bgColor.color }}
    >
      {/* Background decorative elements with dynamic images */}
      {/* {images.S1I1 && (
        <div className="absolute top-12 left-10 z-0">
          <FoodCircle image={images.S1I1} alt="Delicious Burger" className="opacity-80" />
        </div>
      )}
      {images.S1I2 && (
        <div className="absolute top-20 right-10 z-0">
          <FoodCircle image={images.S1I2} alt="Golden Fries" className="opacity-80 scale-125" />
        </div>
      )}
      {images.S1I3 && (
        <div className="absolute bottom-20 left-0 z-0">
          <FoodCircle image={images.S1I3} alt="Gourmet Sandwich" className="opacity-80 scale-90" />
        </div>
      )}
      {images.S1I4 && (
        <div className="absolute bottom-0 right-0 z-0">
          <FoodCircle image={images.S1I4} alt="Chocolate Dessert" className="opacity-80 scale-75" />
        </div>
      )} */}

      <div className="relative z-10 container mx-auto px-4 py-0">
        <div className="text-center mb-2">
          <div className="inline-block">
            <img 
              src={logoUrl || defaultLogo} 
              alt="Logo" 
              className="h-28 w-auto mx-auto mb-2" 
            />
          </div>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">GLI SPECIAL DI</p>
        </div>

        <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="col-span-1 space-y-8">
            <MenuSection title={burgerCategoryName}>
              {menuData[burgerCategoryName]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6">
                  {menuData[burgerCategoryName].map((item) => (
                    <MenuItem 
                      key={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price.toFixed(2)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No items available</p>
              )}
            </MenuSection>
          </div>
          <div className="space-y-8 grid-cols-1">
            <MenuSection title={sandwichCategoryName}>
              {menuData[sandwichCategoryName]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  {menuData[sandwichCategoryName].map((item) => (
                    <MenuItem 
                      key={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price.toFixed(2)}
                    />
                  ))}
                </div>
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

export default Screen1;
