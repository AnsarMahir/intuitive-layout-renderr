import { useMenuData, useScreenImages } from "@/hooks/useMenuData";
import { MenuSection } from "@/components/MenuSection";
import { MenuItem } from "@/components/MenuItem";
import { FoodCircle } from "@/components/FoodCircle";
import platterImage from "@/assets/platter.jpg";
import seafoodPlatterImage from "@/assets/seafoodPlatter.jpg";
import beefSandwichImage from "@/assets/beef-sandwich.jpg";
import platter2Image from "@/assets/platter2.jpg";
import logo from "@/assets/logo.png";

const Screen4 = () => {
  const { menuData, menuLoading, menuError } = useMenuData(['Fritture', 'Platters','Crostoni']);
  const { images, loading: imagesLoading, error: imagesError } = useScreenImages(4, 4);

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
      {images.S4I1 && (
        <div className="absolute top-12 left-10 z-0">
          <FoodCircle image={images.S4I1} alt="Delicious Burger" className="opacity-80" />
        </div>
      )}
      {images.S4I2 && (
      <div className="absolute top-20 right-10 z-0">
        <FoodCircle image={images.S4I2} alt="Golden Fries" className="opacity-80 scale-125" />
      </div>
      )}
      {images.S4I3 && (
      <div className="absolute bottom-20 left-0 z-0">
        <FoodCircle image={images.S4I3} alt="Gourmet Sandwich" className="opacity-80 scale-90" />
      </div>
      )}
      {images.S4I4 && (
      <div className="absolute bottom-0 right-0 z-0">
        <FoodCircle image={images.S4I4} alt="Chocolate Dessert" className="opacity-80 scale-75" />
      </div>
      )}
      <div className="relative z-10 container mx-auto px-4 py-0">
        <div className="text-center mb-12">
          <div className="inline-block">
            <img src={logo} alt="Toticone Logo" className="h-28 w-auto mx-auto mb-2" />
            
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <MenuSection title="Burgers">
            {menuData.Burgers?.length > 0 ? (
              menuData.Burgers.map((item) => (
                <MenuItem 
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price.toFixed(2)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No burgers available</p>
            )}
          </MenuSection>

          <MenuSection title="Sandwiches">
            {menuData.Sandwiches?.length > 0 ? (
              menuData.Sandwiches.map((item) => (
                <MenuItem 
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price.toFixed(2)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No sandwiches available</p>
            )}
          </MenuSection>
        </div> */}

        {/* Menu Grid */}
                <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {/* First Two Columns - Porzioni */}

                  <div className="lg:col-span-1 space-y-8">
                    
                      <MenuSection title="Platters">
                        {menuData.Platters?.length > 0 ? (
                          menuData.Platters.map((item) => (
                            <MenuItem 
                              key={item.id}
                              name={item.name}
                              description={item.description}
                              price={item.price.toFixed(2)}
                            />
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">No Platters available</p>
                        )}
                      </MenuSection>
                   </div>
                  
                    <div className="space-y-8">
                  {/* Fritture Section */}
                    <MenuSection title="Fritture">
                      {menuData.Fritture?.length > 0 ? (
                      <div className="grid   gap-x-6">
                        {menuData.Fritture.map((item) => (
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
                  <div>
                    <MenuSection title="Crostoni">
                      {menuData.Crostoni?.length > 0 ? (
                      menuData.Crostoni.map((item) => (
                        <MenuItem 
                          key={item.id}
                          name={item.name}
                          description={item.description}
                          price={item.price.toFixed(2)}
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No burgers available</p>
                    )}
                    </MenuSection>
                  </div>
                  
                </div>


      </div>
    </div>
  );
};

export default Screen4;