import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Clock, User, Eye, Share2 } from "lucide-react";
import type { Article } from "@shared/schema";

interface ArticleDetailModalProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticleDetailModal({ article, open, onOpenChange }: ArticleDetailModalProps) {
  if (!article) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="aspect-video overflow-hidden rounded-lg -mt-6 -mx-6 mb-6">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <Badge className={getCategoryColor(article.category)}>
              {article.category}
            </Badge>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
            </div>
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight">
            {article.title}
          </DialogTitle>
        </DialogHeader>
        
        {/* Author Info */}
        <div className="flex items-center gap-3 py-4 border-b">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold">{article.author}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Article Author</p>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="py-6">
          {/* Excerpt */}
          <div className="text-lg text-gray-700 dark:text-gray-300 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-orange-500">
            {article.excerpt}
          </div>
          
          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">
              {article.content}
            </div>
          </div>
        </div>
        
        {/* Article Stats */}
        <div className="flex items-center gap-6 py-4 border-t text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Published {article.published ? 'Yes' : 'Draft'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>~5 min read</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            onClick={() => onOpenChange(false)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Article
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