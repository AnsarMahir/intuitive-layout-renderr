// components/MenuItem.tsx
import { useUtilitySettingsContext } from "@/contexts/UtilitySettingsContext.jsx";

interface MenuItemProps {
  name: string;
  description: string;
  price: string;
}

export const MenuItem = ({ name, description, price }: MenuItemProps) => {
  const { fontTopic, fontDesc } = useUtilitySettingsContext();

  return (
    <div className="flex justify-between items-start border-b border-border pb-3 last:border-b-0">
      <div className="flex-1">
        <h3 
          className="font-semibold text-restaurant-orange mb-1"
          style={{ fontSize: `${fontTopic.size}px` }}
        >
          {name}
        </h3>
        <p 
          className="text-muted-foreground leading-relaxed text-white"
          style={{ fontSize: `${fontDesc.size}px` }}
        >
          {description}
        </p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <span className="text-2xl font-bold text-restaurant-gold">
          ${price}
        </span>
      </div>
    </div>
  );
};