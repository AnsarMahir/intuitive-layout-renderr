import { useMenuData, useScreenImages } from "@/hooks/useMenuData";
import { MenuSection } from "@/components/MenuSection";
import { MenuItem } from "@/components/MenuItem";
import { FoodCircle } from "@/components/FoodCircle";
import BuildYourPanino from "@/components/BuildYourPanino";


import logo from "@/assets/logo.png";

const Screen3 = () => {
    const { menuData, menuLoading, menuError } = useMenuData(['Porzioni', "Hotdog"]);
    const { images, loading: imagesLoading, error: imagesError } = useScreenImages(3, 4);

    const loading = menuLoading || imagesLoading;
    const error = menuError || imagesError;

      
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      {images.S3I1 && (
        <div className="absolute top-12 left-10 z-0">
          <FoodCircle image={images.S3I1} alt="Delicious Burger" className="opacity-80" />
        </div>
      )}
      {images.S3I2 && (
        <div className="absolute top-20 right-10 z-0">
          <FoodCircle image={images.S3I2} alt="Golden Fries" className="opacity-80 scale-125" />
        </div>
      )}
      {images.S3I3 && (
        <div className="absolute bottom-20 left-0 z-0">
          <FoodCircle image={images.S3I3} alt="Gourmet Sandwich" className="opacity-80 scale-90" />
      </div>
      )}
      {images.S3I4 && (
      <div className="absolute bottom-0 right-0 z-0 ">
        <FoodCircle image={images.S3I4} alt="Chocolate Dessert" className="opacity-80 scale-75" />
      </div>
      )}
      <div className="relative z-10 container mx-auto px-4 py-0">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <img 
              src={logo} 
              alt="Toticone Logo" 
              className="h-28 w-auto mx-auto mb-2"
            />
            
          </div>
          
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Build Your Panino Section */}
          <div className="lg:col-span-3 space-y-8">
            <BuildYourPanino />

            <MenuSection title="Hot Dog">
              {menuData.Hotdog?.length > 0 ? (
              menuData.Hotdog.map((item) => (
                <MenuItem 
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price.toFixed(2)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No Hot Dog available</p>
            )}
            </MenuSection>
          </div>

          {/* You can add more product sections here in the future */}
          {/* Example structure for future products:
          <div className="lg:col-span-3">
            <MenuSection title="Your New Product Name">
              // Product content here
            </MenuSection>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default Screen3;