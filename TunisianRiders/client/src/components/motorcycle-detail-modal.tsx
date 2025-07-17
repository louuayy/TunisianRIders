import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Gauge, Zap, Fuel, Star } from "lucide-react";
import type { Motorcycle } from "@shared/schema";

interface MotorcycleDetailModalProps {
  motorcycle: Motorcycle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MotorcycleDetailModal({ motorcycle, open, onOpenChange }: MotorcycleDetailModalProps) {
  if (!motorcycle) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{motorcycle.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={motorcycle.imageUrl}
              alt={motorcycle.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Details */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <Badge className={getTypeColor(motorcycle.type)}>
                {motorcycle.type}
              </Badge>
              <Badge className={getCategoryColor(motorcycle.category)}>
                {motorcycle.category}
              </Badge>
              {motorcycle.available && (
                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Available in Tunisia
                </Badge>
              )}
            </div>
            
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Model Year</p>
                  <p className="font-semibold">{motorcycle.year}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Engine Size</p>
                  <p className="font-semibold">{motorcycle.engineSize}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  {motorcycle.type === "electric" ? (
                    <Zap className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Fuel className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {motorcycle.type === "electric" ? "Power" : "Horsepower"}
                  </p>
                  <p className="font-semibold">{motorcycle.horsepower}</p>
                </div>
              </div>
            </div>
            
            {/* Brand & Model */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Brand:</span>
                  <span className="ml-2 font-medium">{motorcycle.brand}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Model:</span>
                  <span className="ml-2 font-medium">{motorcycle.model}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">About This Motorcycle</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {motorcycle.description}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <Button 
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            onClick={() => onOpenChange(false)}
          >
            <Star className="w-4 h-4 mr-2" />
            Add to Favorites
          </Button>
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}