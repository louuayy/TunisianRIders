
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Chrome, Facebook } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Login successful!" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Login failed", variant: "destructive" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string; name: string }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Registration successful!" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Registration failed", variant: "destructive" });
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: async () => {
      // Simulate Google OAuth (in production, use Google SDK)
      const mockGoogleUser = {
        email: "user@gmail.com",
        name: "Google User",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        googleId: "google_123456789",
      };
      
      const response = await fetch("/api/auth/oauth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockGoogleUser),
      });
      
      if (!response.ok) {
        throw new Error("Google authentication failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Google login successful!" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Google login failed", variant: "destructive" });
    },
  });

  const facebookAuthMutation = useMutation({
    mutationFn: async () => {
      // Simulate Facebook OAuth (in production, use Facebook SDK)
      const mockFacebookUser = {
        email: "user@facebook.com",
        name: "Facebook User",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face",
        facebookId: "facebook_123456789",
      };
      
      const response = await fetch("/api/auth/oauth/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockFacebookUser),
      });
      
      if (!response.ok) {
        throw new Error("Facebook authentication failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Facebook login successful!" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/check"] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Facebook login failed", variant: "destructive" });
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    loginMutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    registerMutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Moto Tunisia</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => googleAuthMutation.mutate()}
                disabled={googleAuthMutation.isPending}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => facebookAuthMutation.mutate()}
                disabled={facebookAuthMutation.isPending}
              >
                <Facebook className="w-4 h-4 mr-2" />
                Continue with Facebook
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => googleAuthMutation.mutate()}
                disabled={googleAuthMutation.isPending}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => facebookAuthMutation.mutate()}
                disabled={facebookAuthMutation.isPending}
              >
                <Facebook className="w-4 h-4 mr-2" />
                Continue with Facebook
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or create account</span>
              </div>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    className="pl-10"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="pl-10"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
