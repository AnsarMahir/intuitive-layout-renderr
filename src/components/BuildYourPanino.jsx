import { useBuildYourOwn } from "@/hooks/useMenuData";
import { MenuSection } from "@/components/MenuSection";

const BuildYourPanino = () => {
  const { data: paninoData, groupedExtras, loading, error } = useBuildYourOwn();

  if (loading) {
    return (
      <div className="lg:col-span-3">
        <MenuSection title="Componi il tuo Panino">
          <div className="bg-restaurant-dark-card border border-restaurant-gold rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restaurant-orange mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading...</p>
          </div>
        </MenuSection>
      </div>
    );
  }

  if (error || !paninoData) {
    return (
      <div className="lg:col-span-3">
        <MenuSection title="Componi il tuo Panino">
          <div className="bg-restaurant-dark-card border border-restaurant-gold rounded-lg p-6 text-center">
            <p className="text-red-500">Error loading data: {error}</p>
          </div>
        </MenuSection>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <MenuSection title="Componi il tuo Panino">
        <div className="bg-restaurant-dark-card border border-restaurant-gold rounded-lg p-6">
          {/* Base Price */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-restaurant-orange mb-2">
              €{paninoData.price.toFixed(2)}
            </div>
            <div className="text-lg text-foreground font-semibold mb-1">
              Carne + Formaggio + Contorno
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Per ogni aggiunta contorno e formaggi €1.00</div>
              <div>Per ogni aggiunta di carne €3.00</div>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-3 gap-6 mt-8 space-x-4">
            {/* Carne (Meat) */}
            {groupedExtras.CARNE && (
              <div className="border border-restaurant-orange/30 rounded-lg p-4 bg-background/50">
                <h3 className="text-xl font-bold text-restaurant-orange mb-4 text-center uppercase">
                  Carne
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-foreground">
                  {groupedExtras.CARNE.map((item) => (
                    <div key={item.id} className="py-1 text-sm">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formaggi (Cheese) */}
            {groupedExtras.FORMAGGI && (
              <div className="border border-restaurant-orange/30 rounded-lg p-4 bg-background/50">
                <h3 className="text-xl font-bold text-restaurant-orange mb-4 text-center uppercase">
                  Formaggi
                </h3>
                <div className="space-y-2 text-foreground">
                  {groupedExtras.FORMAGGI.map((item) => (
                    <div key={item.id} className="py-1 text-sm">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contorno (Sides) */}
            {groupedExtras.CONTORNO && (
              <div className="border border-restaurant-orange/30 rounded-lg p-4 bg-background/50">
                <h3 className="text-xl font-bold text-restaurant-orange mb-4 text-center uppercase">
                  Contorno
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-foreground">
                  {groupedExtras.CONTORNO.map((item) => (
                    <div key={item.id} className="py-1 text-sm">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </MenuSection>
    </div>
  );
};

export default BuildYourPanino;