import { HeroSection } from "@/components/hero-section";
import { MotorcycleCard } from "@/components/motorcycle-card";
import { ArticleCard } from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Wrench, BookOpen, Users, TrendingUp, Bike, Zap, MapPin, Bolt } from "lucide-react";
import type { Motorcycle, Article } from "@shared/schema";

export default function Home() {
  const { data: motorcycles, isLoading: motorcyclesLoading } = useQuery<Motorcycle[]>({
    queryKey: ["/api/motorcycles"],
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", { published: "true" }],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const featuredMotorcycles = motorcycles?.slice(0, 6) || [];
  const latestArticles = articles?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Featured Motorcycles Section */}
      <section id="motorcycles" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Motorcycles</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore the latest motorcycle models available in Tunisia, from electric to gasoline-powered bikes.
            </p>
          </div>

          {motorcyclesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMotorcycles.map((motorcycle) => (
                <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/motorcycles">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                View All Motorcycles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles & Reviews</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay updated with the latest motorcycle news, reviews, and expert tips from Tunisia and around the world.
            </p>
          </div>

          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/articles">
              <Button variant="outline" size="lg">
                Read All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Engines & Parts Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Engines & Spare Parts</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive guides on motorcycle engines, maintenance procedures, and spare parts information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Engine Types</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Learn about different motorcycle engine configurations and their characteristics.
                </p>
                <Button variant="ghost" className="text-orange-500 hover:text-orange-600 text-sm">
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Wrench className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Maintenance Guide</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Step-by-step maintenance procedures for optimal motorcycle performance.
                </p>
                <Button variant="ghost" className="text-orange-500 hover:text-orange-600 text-sm">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Bolt className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Spare Parts</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Find information about genuine spare parts and compatible alternatives.
                </p>
                <Button variant="ghost" className="text-orange-500 hover:text-orange-600 text-sm">
                  Browse
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Troubleshooting</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Common motorcycle problems and their solutions for DIY repairs.
                </p>
                <Button variant="ghost" className="text-orange-500 hover:text-orange-600 text-sm">
                  Get Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Moto Tunisia by Numbers</h2>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Bike className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {stats?.motorcycles || 0}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Total Motorcycles
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {stats?.articles || 0}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                    Published Articles
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {stats?.visitors || "0"}
                  </p>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                    Monthly Visitors
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {stats?.pageviews || "0"}
                  </p>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Page Views
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-orange-500 mb-4">Moto Tunisia</h3>
              <p className="text-gray-400 mb-4">
                Your ultimate guide to motorcycles in Tunisia. Discover, learn, and ride with confidence.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Motorcycles</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500">Honda</a></li>
                <li><a href="#" className="hover:text-orange-500">BMW</a></li>
                <li><a href="#" className="hover:text-orange-500">KTM</a></li>
                <li><a href="#" className="hover:text-orange-500">Yamaha</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500">Maintenance Guide</a></li>
                <li><a href="#" className="hover:text-orange-500">Spare Parts</a></li>
                <li><a href="#" className="hover:text-orange-500">Reviews</a></li>
                <li><a href="#" className="hover:text-orange-500">News</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><MapPin className="inline w-4 h-4 mr-1" /> Tunis, Tunisia</li>
                <li>info@mototunisia.com</li>
                <li>+216 XX XXX XXX</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Moto Tunisia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
