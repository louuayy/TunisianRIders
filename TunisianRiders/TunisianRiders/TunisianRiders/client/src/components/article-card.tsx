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
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{article.category}</Badge>
          <span className="text-sm text-gray-500">
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
              <span className="text-sm font-medium">{article.author.charAt(0)}</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{article.author}</span>
          </div>
          {onReadMore && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReadMore(article)}
            >
              Read More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}