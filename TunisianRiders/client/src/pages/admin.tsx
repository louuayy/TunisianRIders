import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/login-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Bike, Plus, Edit, Trash2, Users, TrendingUp, BookOpen, Shield } from "lucide-react";
import type { Motorcycle as MotorcycleType, Article, InsertMotorcycle, InsertArticle } from "@shared/schema";

export default function Admin() {
  const [addMotorcycleOpen, setAddMotorcycleOpen] = useState(false);
  const [addArticleOpen, setAddArticleOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check authentication status
  const { data: authData } = useQuery({
    queryKey: ["/api/auth/check"],
    retry: false,
  });

  // All queries must be declared before any conditional returns
  const { data: motorcycles, isLoading: motorcyclesLoading } = useQuery<MotorcycleType[]>({
    queryKey: ["/api/motorcycles"],
    enabled: !!authData?.authenticated,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    enabled: !!authData?.authenticated,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!authData?.authenticated,
  });

  const addMotorcycleMutation = useMutation({
    mutationFn: async (data: InsertMotorcycle) => {
      await apiRequest("POST", "/api/motorcycles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/motorcycles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setAddMotorcycleOpen(false);
      toast({
        title: "Success",
        description: "Bike added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add motorcycle",
        variant: "destructive",
      });
    },
  });

  const addArticleMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      await apiRequest("POST", "/api/articles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setAddArticleOpen(false);
      toast({
        title: "Success",
        description: "Article added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add article",
        variant: "destructive",
      });
    },
  });

  const deleteMotorcycleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/motorcycles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/motorcycles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Motorcycle deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete motorcycle",
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (authData?.authenticated) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [authData]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      setIsAuthenticated(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  // Show login screen if not authenticated
  if (!authData?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Admin Dashboard</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please login to access the admin panel
            </p>
          </div>
          <Button
            onClick={() => setLoginOpen(true)}
            className="w-full bg-orange-500 hover:bg-orange-600"
            size="lg"
          >
            Login
          </Button>
          <LoginDialog
            open={loginOpen}
            onOpenChange={setLoginOpen}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </div>
    );
  }

  const handleAddMotorcycle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertMotorcycle = {
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      year: parseInt(formData.get("year") as string),
      engineSize: formData.get("engineSize") as string,
      horsepower: formData.get("horsepower") as string,
      type: formData.get("type") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      available: true,
    };
    addMotorcycleMutation.mutate(data);
  };

  const handleAddArticle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertArticle = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      published: formData.get("published") === "true",
    };
    addArticleMutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your motorcycle magazine content</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="font-medium">Admin User</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Bike className="text-blue-500 text-2xl mr-4" />
                    <div>
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Motorcycles</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {stats?.motorcycles || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BookOpen className="text-green-500 text-2xl mr-4" />
                    <div>
                      <p className="text-green-600 dark:text-green-400 text-sm font-medium">Published Articles</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {stats?.articles || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="text-orange-500 text-2xl mr-4" />
                    <div>
                      <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Monthly Visitors</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        {stats?.visitors || "0"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="text-purple-500 text-2xl mr-4" />
                    <div>
                      <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Page Views</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {stats?.pageviews || "0"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Plus className="text-orange-500 text-3xl mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Add Bike</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add a new motorcycle model to the database with specifications and images.
              </p>
              <Dialog open={addMotorcycleOpen} onOpenChange={setAddMotorcycleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Bike</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddMotorcycle} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Select name="brand" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="honda">Honda</SelectItem>
                            <SelectItem value="bmw">BMW</SelectItem>
                            <SelectItem value="ktm">KTM</SelectItem>
                            <SelectItem value="yamaha">Yamaha</SelectItem>
                            <SelectItem value="mash">Mash</SelectItem>
                            <SelectItem value="orcal">Orcal</SelectItem>
                            <SelectItem value="rieju">Rieju</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input id="model" name="model" required />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" min="2020" max="2025" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="engineSize">Engine Size</Label>
                        <Input id="engineSize" name="engineSize" placeholder="e.g., 649cc" required />
                      </div>
                      <div>
                        <Label htmlFor="horsepower">Horsepower</Label>
                        <Input id="horsepower" name="horsepower" placeholder="e.g., 95 HP" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select name="type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="gasoline">Gasoline</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="naked">Naked</SelectItem>
                            <SelectItem value="sport">Sport</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="touring">Touring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input id="imageUrl" name="imageUrl" type="url" required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" rows={3} required />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={addMotorcycleMutation.isPending}
                    >
                      {addMotorcycleMutation.isPending ? "Adding..." : "Add Bike"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Edit className="text-orange-500 text-3xl mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Publish Article</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create and publish new articles, reviews, or maintenance guides.
              </p>
              <Dialog open={addArticleOpen} onOpenChange={setAddArticleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Write Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Write New Article</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddArticle} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" required />
                    </div>
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input id="author" name="author" required />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input id="imageUrl" name="imageUrl" type="url" required />
                    </div>
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea id="excerpt" name="excerpt" rows={2} required />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea id="content" name="content" rows={8} required />
                    </div>
                    <div>
                      <Label htmlFor="published">Status</Label>
                      <Select name="published" defaultValue="false">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">Draft</SelectItem>
                          <SelectItem value="true">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={addArticleMutation.isPending}
                    >
                      {addArticleMutation.isPending ? "Saving..." : "Save Article"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Shield className="text-orange-500 text-3xl mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Moderate Content</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Review and moderate user comments and content submissions.
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Open Panel
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Motorcycles Management */}
          <Card>
            <CardHeader>
              <CardTitle>Motorcycles</CardTitle>
            </CardHeader>
            <CardContent>
              {motorcyclesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {motorcycles?.map((motorcycle) => (
                    <div key={motorcycle.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{motorcycle.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{motorcycle.brand}</Badge>
                          <Badge variant="outline">{motorcycle.type}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMotorcycleMutation.mutate(motorcycle.id)}
                        disabled={deleteMotorcycleMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Articles Management */}
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
            </CardHeader>
            <CardContent>
              {articlesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {articles?.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{article.title}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{article.category}</Badge>
                          <Badge variant={article.published ? "default" : "secondary"}>
                            {article.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteArticleMutation.mutate(article.id)}
                        disabled={deleteArticleMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
