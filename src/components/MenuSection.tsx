import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface MenuSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const MenuSection = ({ title, children, className = "" }: MenuSectionProps) => {
  return (
    <Card className={`bg-card border-border p-6 ${className}`}>
      <div className="relative mb-6">
        <div className="bg-gradient-to-r from-restaurant-orange to-restaurant-gold px-6 py-3 rounded-lg ">
          <h2 className="text-[18px] font-bold text-restaurant-dark text-center uppercase tracking-wider">
            {title}
          </h2>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );
};