import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  onReadMore?: (article: Article) => void;
}

export function ArticleCard({ article, onReadMore }: ArticleCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "maintenance":
        return "bg-orange-500 text-white";
      case "review":
        return "bg-green-500 text-white";
      case "travel":
        return "bg-blue-500 text-white";
      case "news":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-video overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getCategoryColor(article.category)}>
            {article.category}
          </Badge>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 hover:text-orange-500 cursor-pointer transition-colors">
          {article.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full mr-2 flex items-center justify-center">
              <span className="text-xs font-medium">
                {article.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {article.author}
            </span>
          </div>
          <Button
            variant="ghost"
            className="text-orange-500 hover:text-orange-600 text-sm p-0"
            onClick={() => onReadMore?.(article)}
          >
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
