import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { Navigation } from "@/components/navigation";
import { useState } from "react";
import Home from "@/pages/home";
import Motorcycles from "@/pages/motorcycles";
import Articles from "@/pages/articles";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/motorcycles" component={Motorcycles} />
        <Route path="/articles" component={Articles} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
