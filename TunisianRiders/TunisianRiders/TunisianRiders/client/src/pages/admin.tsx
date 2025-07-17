
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Bike, Edit, Users, TrendingUp, BookOpen, LogOut, Plus, Trash2 } from "lucide-react";
import type { Motorcycle as MotorcycleType, Article, InsertMotorcycle, InsertArticle } from "@shared/schema";

interface LoginCredentials {
  username: string;
  password: string;
}

export default function Admin() {
  const [editMotorcycleOpen, setEditMotorcycleOpen] = useState(false);
  const [editArticleOpen, setEditArticleOpen] = useState(false);
  const [addMotorcycleOpen, setAddMotorcycleOpen] = useState(false);
  const [addArticleOpen, setAddArticleOpen] = useState(false);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<MotorcycleType | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({ username: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check authentication status
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/check"],
    retry: false,
  });

  const { data: motorcycles, isLoading: motorcyclesLoading } = useQuery<MotorcycleType[]>({
    queryKey: ["/api/motorcycles"],
    enabled: !!authData?.authenticated,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
      queryKey: ["/api/articles", { published: "true" }], // Fetch only published articles
      enabled: !!authData?.authenticated,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!authData?.authenticated,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await apiRequest("POST", "/api/auth/login", credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
      toast({
        title: "Success",
        description: "Login successful",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const createMotorcycleMutation = useMutation({
    mutationFn: async (data: InsertMotorcycle) => {
      return await apiRequest("POST", "/api/motorcycles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/motorcycles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setAddMotorcycleOpen(false);
      toast({
        title: "Success",
        description: "Motorcycle created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create motorcycle",
        variant: "destructive",
      });
    },
  });

  const updateMotorcycleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertMotorcycle> }) => {
      return await apiRequest("PUT", `/api/motorcycles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/motorcycles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setEditMotorcycleOpen(false);
      setSelectedMotorcycle(null);
      toast({
        title: "Success",
        description: "Motorcycle updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update motorcycle",
        variant: "destructive",
      });
    },
  });

  const deleteMotorcycleMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/motorcycles/${id}`);
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

  const createArticleMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      return await apiRequest("POST", "/api/articles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setAddArticleOpen(false);
      toast({
        title: "Success",
        description: "Article created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertArticle> }) => {
      return await apiRequest("PUT", `/api/articles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setEditArticleOpen(false);
      setSelectedArticle(null);
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/articles/${id}`);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await loginMutation.mutateAsync(loginCredentials);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
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

  const handleEditMotorcycle = (motorcycle: MotorcycleType) => {
    setSelectedMotorcycle(motorcycle);
    setEditMotorcycleOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setEditArticleOpen(true);
  };

  const handleDeleteMotorcycle = async (motorcycle: MotorcycleType) => {
    if (confirm(`Are you sure you want to delete "${motorcycle.name}"?`)) {
      deleteMotorcycleMutation.mutate(motorcycle.id);
    }
  };

  const handleDeleteArticle = async (article: Article) => {
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      deleteArticleMutation.mutate(article.id);
    }
  };

  const handleCreateMotorcycle = (e: React.FormEvent<HTMLFormElement>) => {
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
    createMotorcycleMutation.mutate(data);
  };

  const handleUpdateMotorcycle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMotorcycle) return;

    const formData = new FormData(e.currentTarget);
    const data: Partial<InsertMotorcycle> = {
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
    };

    updateMotorcycleMutation.mutate({ id: selectedMotorcycle.id, data });
  };

  const handleCreateArticle = (e: React.FormEvent<HTMLFormElement>) => {
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
    createArticleMutation.mutate(data);
  };

  const handleUpdateArticle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedArticle) return;

    const formData = new FormData(e.currentTarget);
    const data: Partial<InsertArticle> = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      published: formData.get("published") === "true",
    };

    updateArticleMutation.mutate({ id: selectedArticle.id, data });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-32 w-64" />
      </div>
    );
  }

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
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={loginCredentials.username}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              size="lg"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="text-center text-sm text-gray-500">
            Demo credentials: admin / admin123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Manage your motorcycle magazine content</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">Admin User</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))
          ) : (
            <>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-1">Total Motorcycles</p>
                      <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                        {stats?.motorcycles || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Bike className="text-white text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 dark:text-green-400 text-sm font-semibold mb-1">Published Articles</p>
                      <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                        {stats?.articles || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="text-white text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 dark:text-orange-400 text-sm font-semibold mb-1">Monthly Visitors</p>
                      <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                        {stats?.visitors || "0"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Users className="text-white text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold mb-1">Page Views</p>
                      <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                        {stats?.pageviews || "0"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="text-white text-xl" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Content Management Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Motorcycles Management */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-lg border-b border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  <Bike className="h-5 w-5" />
                  Motorcycles Management
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setAddMotorcycleOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Motorcycle
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {motorcyclesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {motorcycles?.map((motorcycle) => (
                    <div key={motorcycle.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{motorcycle.name}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">{motorcycle.brand}</Badge>
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">{motorcycle.type}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMotorcycle(motorcycle)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMotorcycle(motorcycle)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Articles Management */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-t-lg border-b border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Articles Management
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setAddArticleOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {articlesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {articles?.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{article.title}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">{article.category}</Badge>
                          <Badge variant={article.published ? "default" : "secondary"} className={article.published ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" : ""}>
                            {article.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditArticle(article)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteArticle(article)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Motorcycle Dialog */}
        <Dialog open={addMotorcycleOpen} onOpenChange={setAddMotorcycleOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Motorcycle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateMotorcycle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" name="brand" required />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" required />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" name="year" type="number" required />
                </div>
                <div>
                  <Label htmlFor="engineSize">Engine Size</Label>
                  <Input id="engineSize" name="engineSize" required />
                </div>
                <div>
                  <Label htmlFor="horsepower">Horsepower</Label>
                  <Input id="horsepower" name="horsepower" required />
                </div>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} required />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setAddMotorcycleOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMotorcycleMutation.isPending}>
                  {createMotorcycleMutation.isPending ? "Creating..." : "Create Motorcycle"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Motorcycle Dialog */}
        <Dialog open={editMotorcycleOpen} onOpenChange={setEditMotorcycleOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Motorcycle</DialogTitle>
            </DialogHeader>
            {selectedMotorcycle && (
              <form onSubmit={handleUpdateMotorcycle} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={selectedMotorcycle.name}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      defaultValue={selectedMotorcycle.brand}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      name="model"
                      defaultValue={selectedMotorcycle.model}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      defaultValue={selectedMotorcycle.year}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="engineSize">Engine Size</Label>
                    <Input
                      id="engineSize"
                      name="engineSize"
                      defaultValue={selectedMotorcycle.engineSize}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="horsepower">Horsepower</Label>
                    <Input
                      id="horsepower"
                      name="horsepower"
                      defaultValue={selectedMotorcycle.horsepower}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue={selectedMotorcycle.type}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Select name="category" defaultValue={selectedMotorcycle.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="naked">Naked</SelectItem>
                        <SelectItem value="sport">Sport</SelectItem>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    defaultValue={selectedMotorcycle.imageUrl}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={selectedMotorcycle.description}
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setEditMotorcycleOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateMotorcycleMutation.isPending}>
                    {updateMotorcycleMutation.isPending ? "Updating..." : "Update Motorcycle"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Article Dialog */}
        <Dialog open={addArticleOpen} onOpenChange={setAddArticleOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Article</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateArticle} className="space-y-4">
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
                <Input id="imageUrl" name="imageUrl" required />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" name="excerpt" rows={3} required />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" name="content" rows={10} required />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  value="true"
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setAddArticleOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createArticleMutation.isPending}>
                  {createArticleMutation.isPending ? "Creating..." : "Create Article"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Article Dialog */}
        <Dialog open={editArticleOpen} onOpenChange={setEditArticleOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
            </DialogHeader>
            {selectedArticle && (
              <form onSubmit={handleUpdateArticle} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={selectedArticle.title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    defaultValue={selectedArticle.author}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={selectedArticle.category}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    defaultValue={selectedArticle.imageUrl}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    defaultValue={selectedArticle.excerpt}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={selectedArticle.content}
                    rows={10}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    value="true"
                    defaultChecked={selectedArticle.published}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setEditArticleOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateArticleMutation.isPending}>
                    {updateArticleMutation.isPending ? "Updating..." : "Update Article"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
