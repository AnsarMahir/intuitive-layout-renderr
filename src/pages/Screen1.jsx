import { useMenuData } from "@/hooks/useMenuData";
import { MenuSection } from "@/components/MenuSection";
import { MenuItem } from "@/components/MenuItem";
import { FoodCircle } from "@/components/FoodCircle";
import burgerImage from "@/assets/burger.jpg";
import friesImage from "@/assets/fries.jpg";
import sandwichImage from "@/assets/sandwich.jpg";
import meatImage from "@/assets/meat.jpg";
import logo from "@/assets/logo.png";

const Screen1 = () => {
  const { menuData, loading, error } = useMenuData(['Burgers', 'Sandwiches']);

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
        <FoodCircle image={burgerImage} alt="Delicious Burger" className="opacity-80" />
      </div>
      <div className="absolute top-20 right-10 z-0">
        <FoodCircle image={friesImage} alt="Golden Fries" className="opacity-80 scale-125" />
      </div>
      <div className="absolute bottom-20 left-0 z-0">
        <FoodCircle image={sandwichImage} alt="Gourmet Sandwich" className="opacity-80 scale-90" />
      </div>
      <div className="absolute bottom-0 right-0 z-0">
        <FoodCircle image={meatImage} alt="Chocolate Dessert" className="opacity-80 scale-75" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-0">
        <div className="text-center mb-12">
          <div className="inline-block">
            <img src={logo} alt="Toticone Logo" className="h-28 w-auto mx-auto mb-2" />
            <h2 className="text-4xl font-bold text-foreground uppercase tracking-widest">
              Neapolitan Food
            </h2>
          </div>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">GLI SPECIAL DI</p>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto">
          <MenuSection title="Burgers">
            {menuData.Burgers?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                {menuData.Burgers.map((item) => (
                  <MenuItem 
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price.toFixed(2)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No burgers available</p>
            )}
          </MenuSection>

          
        </div>

        


      </div>
    </div>
  );
};

export default Screen1;