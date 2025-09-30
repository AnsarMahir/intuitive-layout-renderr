import { MenuSection } from "@/components/MenuSection";
import { MenuItem } from "@/components/MenuItem";
import { FoodCircle } from "@/components/FoodCircle";

// Import food images
import burgerImage from "@/assets/burger.jpg";
import friesImage from "@/assets/fries.jpg";
import sandwichImage from "@/assets/sandwich.jpg";
import dessertImage from "@/assets/dessert.jpg";
import logo from "@/assets/logo.png";

const Screen1 = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-12 left-10 z-50">
        <FoodCircle image={burgerImage} alt="Delicious Burger" className="opacity-80" />
      </div>
      <div className="absolute top-20 right-10 z-0">
        <FoodCircle image={friesImage} alt="Golden Fries" className="opacity-80 scale-125" />
      </div>
      <div className="absolute bottom-20 left-0 z-0">
        <FoodCircle image={sandwichImage} alt="Gourmet Sandwich" className="opacity-80 scale-90" />
      </div>
      <div className="absolute bottom-0 right-0 z-0 ">
        <FoodCircle image={dessertImage} alt="Chocolate Dessert" className="opacity-80 scale-75" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <img 
              src={logo} 
              alt="Toticone Logo" 
              className="h-28 w-auto mx-auto mb-2"
            />
            <h2 className="text-3xl font-bold text-foreground uppercase tracking-widest">
              Neapolitan Food
            </h2>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-restaurant-orange"></div>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Burgers Section */}
          <MenuSection title="Burgers">
            <MenuItem 
              name="Classic Burger"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diamnonumy nibh."
              price="10"
            />
            <MenuItem 
              name="Cheese Burger"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diamnonumy nibh."
              price="10"
            />
            <MenuItem 
              name="Bacon Burger"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diamnonumy nibh."
              price="10"
            />
            <MenuItem 
              name="Deluxe Burger"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diamnonumy nibh."
              price="10"
            />
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-restaurant-orange mb-3 flex items-center">
                <span className="flex-1 h-px bg-border"></span>
                <span className="px-4">EXTRAS</span>
                <span className="flex-1 h-px bg-border"></span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Extra Cheese</span>
                  <span>$2</span>
                </div>
                <div className="flex justify-between">
                  <span>Bacon</span>
                  <span>$3</span>
                </div>
                <div className="flex justify-between">
                  <span>Avocado</span>
                  <span>$2</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Patty</span>
                  <span>$5</span>
                </div>
              </div>
            </div>
          </MenuSection>

          {/* Desserts & Drinks Section */}
          <MenuSection title="Desserts & Drinks">
            <div className="border border-restaurant-gold rounded-lg p-4 bg-restaurant-dark-card">
              <MenuItem 
                name="Chocolate Cake"
                description="Lorem ipsum dolor sit"
                price="4"
              />
              <MenuItem 
                name="Ice Cream"
                description="Lorem ipsum dolor sit"
                price="4"
              />
              <MenuItem 
                name="Fruit Tart"
                description="Lorem ipsum dolor sit"
                price="4"
              />
              <MenuItem 
                name="Cheesecake"
                description="Lorem ipsum dolor sit"
                price="4"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Coffee</span>
                  <span>$3</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tea</span>
                  <span>$2</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Soda</span>
                  <span>$2</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Juice</span>
                  <span>$3</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Water</span>
                  <span>$1</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Beer</span>
                  <span>$4</span>
                </div>
              </div>
            </div>
          </MenuSection>

          {/* Sandwiches Section */}
          <MenuSection title="Sandwiches">
            <MenuItem 
              name="Club Sandwich"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diamnonumy nibh."
              price="10"
            />
            <MenuItem 
              name="BLT Sandwich"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diamnonumy nibh."
              price="10"
            />
            <MenuItem 
              name="Grilled Chicken"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diamnonumy nibh."
              price="10"
            />
            <MenuItem 
              name="Veggie Delight"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diamnonumy nibh."
              price="10"
            />
            <MenuItem 
              name="Italian Sub"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diamnonumy nibh."
              price="10"
            />
          </MenuSection>
        </div>
      </div>
    </div>
  );
};

export default Screen1;