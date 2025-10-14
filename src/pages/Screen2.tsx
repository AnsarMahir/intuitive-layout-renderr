import { useMenuData } from "@/hooks/useMenuData";
import { MenuSection } from "@/components/MenuSection";
import { MenuItem } from "@/components/MenuItem";
import { FoodCircle } from "@/components/FoodCircle";


// Import food images
import Porzioni from "@/assets/porzioni.jpg";
import Fritture from "@/assets/fritture.jpg";
import Beef from "@/assets/beef.jpg";
import dessertImage from "@/assets/dessert.jpg";
import logo from "@/assets/logo.png";


const Screen2 = () => {
  const { menuData, loading, error } = useMenuData(['Porzioni', 'Fritture', 'Crostoni', 'Piadine', "LInsalatone"]);
  
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
      <div className="absolute top-12 left-10 z-0">
        <FoodCircle image={Porzioni} alt="Delicious Burger" className="opacity-80" />
      </div>
      <div className="absolute top-20 right-10 z-0">
        <FoodCircle image={Fritture} alt="Golden Fries" className="opacity-80 scale-125" />
      </div>
      <div className="absolute bottom-20 left-0 z-0">
        <FoodCircle image={Beef} alt="Gourmet Sandwich" className="opacity-80 scale-90" />
      </div>
      <div className="absolute bottom-0 right-0 z-0 ">
        <FoodCircle image={dessertImage} alt="Chocolate Dessert" className="opacity-80 scale-75" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-0">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <img 
              src={logo} 
              alt="Toticone Logo" 
              className="h-28 w-auto mx-auto mb-2"
            />
            <h2 className="text-4xl font-bold text-foreground uppercase tracking-widest">
              Neapolitan Food
            </h2>
          </div>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            GLI SPECIAL DI
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* First Two Columns - Porzioni */}
          <div className="lg:col-span-2 space-y-8">
            <MenuSection title="Porzioni">
            {menuData.Porzioni?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                {menuData.Porzioni.map((item) => (
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


            {/* Fritture Section */}
            <MenuSection title="Fritture">
              {menuData.Fritture?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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

          

          {/* Third Column - Crostoni, Piadine & L'Insalatone */}
          <div className="space-y-8">
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
            <MenuSection title="Piadine">
              {menuData.Piadine?.length > 0 ? (
              menuData.Piadine.map((item) => (
                <MenuItem 
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price.toFixed(2)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No Piadine available</p>
            )}
            </MenuSection>
            <MenuSection title="L'Insalatone">
              {menuData.LInsalatone?.length > 0 ? (
              menuData.LInsalatone.map((item) => (
                <MenuItem 
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price.toFixed(2)}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No L'Insalatone available</p>
            )}
            </MenuSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen2;