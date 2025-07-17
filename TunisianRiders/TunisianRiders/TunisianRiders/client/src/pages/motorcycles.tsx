import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MotorcycleCard } from "@/components/motorcycle-card";
import { MotorcycleDetailModal } from "@/components/motorcycle-detail-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Motorcycle } from "@shared/schema";

export default function Motorcycles() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const { data: motorcycles, isLoading } = useQuery<Motorcycle[]>({
    queryKey: ["/api/motorcycles"],
  });

  const filterButtons = [
    { key: "all", label: "All" },
    { key: "electric", label: "Electric" },
    { key: "gasoline", label: "Gasoline" },
    { key: "sport", label: "Sport" },
    { key: "naked", label: "Naked" },
    { key: "adventure", label: "Adventure" },
    { key: "classic", label: "Classic" },
    { key: "honda", label: "Honda" },
    { key: "bmw", label: "BMW" },
    { key: "ktm", label: "KTM" },
    { key: "yamaha", label: "Yamaha" },
    { key: "mash", label: "Mash" },
    { key: "orcal", label: "Orcal" },
    { key: "rieju", label: "Rieju" },
  ];

  const filteredMotorcycles = motorcycles?.filter((motorcycle) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "electric" || activeFilter === "gasoline") {
      return motorcycle.type.toLowerCase() === activeFilter;
    }
    if (activeFilter === "sport" || activeFilter === "naked" || activeFilter === "adventure" || activeFilter === "classic") {
      return motorcycle.category.toLowerCase() === activeFilter;
    }
    return motorcycle.brand.toLowerCase() === activeFilter;
  }) || [];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Motorcycle Models</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover motorcycles available in Tunisia, from electric to gasoline-powered bikes across various brands and categories.
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          {filterButtons.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.key)}
              className={activeFilter === filter.key ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredMotorcycles.length} motorcycle{filteredMotorcycles.length !== 1 ? 's' : ''}
              {activeFilter !== "all" && ` for "${filterButtons.find(f => f.key === activeFilter)?.label}"`}
            </p>
          </div>
        )}

        {/* Motorcycle Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredMotorcycles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMotorcycles.map((motorcycle) => (
              <MotorcycleCard 
                key={motorcycle.id} 
                motorcycle={motorcycle}
                onLearnMore={(moto) => {
                  setSelectedMotorcycle(moto);
                  setDetailModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No motorcycles found for the selected filter.
            </p>
            <Button
              variant="outline"
              onClick={() => setActiveFilter("all")}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
        
        <MotorcycleDetailModal
          motorcycle={selectedMotorcycle}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />
      </div>
    </div>
  );
}
