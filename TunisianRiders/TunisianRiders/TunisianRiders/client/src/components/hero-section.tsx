import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Moto Tunisia</h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Your Ultimate Guide to Motorcycles in Tunisia
        </p>
        <p className="text-lg mb-10 max-w-2xl mx-auto">
          Discover the latest motorcycle models, expert reviews, maintenance tips, 
          and everything you need to know about two-wheeled adventures in Tunisia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
            onClick={() => scrollToSection("motorcycles")}
          >
            Explore Motorcycles
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3"
            onClick={() => scrollToSection("articles")}
          >
            Read Articles
          </Button>
        </div>
      </div>
    </section>
  );
}
