import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Motorcycle } from "@shared/schema";

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onLearnMore?: (motorcycle: Motorcycle) => void;
}

export function MotorcycleCard({ motorcycle, onLearnMore }: MotorcycleCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "electric":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "gasoline":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "adventure":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "sport":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "naked":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "classic":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
      default:
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-video overflow-hidden">
        <img
          src={motorcycle.imageUrl}
          alt={motorcycle.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{motorcycle.name}</h3>
          <div className="flex gap-2">
            <Badge className={getTypeColor(motorcycle.type)}>
              {motorcycle.type}
            </Badge>
            <Badge className={getCategoryColor(motorcycle.category)}>
              {motorcycle.category}
            </Badge>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {motorcycle.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {motorcycle.engineSize} • {motorcycle.horsepower}
          </span>
          <Button
            variant="ghost"
            className="text-orange-500 hover:text-orange-600 p-0"
            onClick={() => onLearnMore?.(motorcycle)}
          >
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
