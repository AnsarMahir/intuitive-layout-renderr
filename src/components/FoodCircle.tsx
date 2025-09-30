interface FoodCircleProps {
  image: string;
  alt: string;
  className?: string;
}

export const FoodCircle = ({ image, alt, className = "" }: FoodCircleProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-restaurant-orange shadow-orange">
        <img 
          src={image} 
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute -inset-2 rounded-full border-2 border-restaurant-gold opacity-30"></div>
    </div>
  );
};