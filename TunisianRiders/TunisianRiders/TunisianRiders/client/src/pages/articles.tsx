import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArticleCard } from "@/components/article-card";
import { ArticleDetailModal } from "@/components/article-detail-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from "@shared/schema";

export default function Articles() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", { published: "true" }],
  });

  const filterButtons = [
    { key: "all", label: "All Articles" },
    { key: "maintenance", label: "Maintenance" },
    { key: "review", label: "Reviews" },
    { key: "travel", label: "Travel" },
    { key: "news", label: "News" },
  ];

  const filteredArticles = articles?.filter((article) => {
    if (activeFilter === "all") return true;
    return article.category.toLowerCase() === activeFilter;
  }) || [];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Articles & Reviews</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Read the latest motorcycle articles, maintenance guides, travel stories, and expert reviews from Tunisia and beyond.
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
              Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              {activeFilter !== "all" && ` in "${filterButtons.find(f => f.key === activeFilter)?.label}"`}
            </p>
          </div>
        )}

        {/* Articles Grid */}
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
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article}
                onReadMore={(article) => {
                  setSelectedArticle(article);
                  setDetailModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No articles found for the selected category.
            </p>
            <Button
              variant="outline"
              onClick={() => setActiveFilter("all")}
              className="mt-4"
            >
              Show All Articles
            </Button>
          </div>
        )}
        
        <ArticleDetailModal
          article={selectedArticle}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />
      </div>
    </div>
  );
}
