import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { Mail, Github, LogIn } from "lucide-react";
import { Logo } from "./layout";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [, setLocation] = useLocation();
  const { setUser } = useAppStore();
  const [email, setEmail] = useState("");

  const handleAuth = (type: "google" | "email" | "login") => {
    // Mock authentication
    setUser({
      id: Math.random().toString(36).substring(7),
      name: email.split("@")[0] || "Guest",
      email: email || "demo@example.com",
      onboardingCompleted: false,
    });
    onClose();
    setLocation("/onboarding");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 overflow-hidden shadow-2xl rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="relative">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Logo className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Welcome to Health Bunny</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Your personal, AI-powered health companion.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-12 text-base font-medium rounded-xl hover:bg-secondary border-border/50"
              onClick={() => handleAuth("google")}
              data-testid="button-auth-google"
            >
              <Github className="mr-2 w-5 h-5" />
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background transition-colors"
                  data-testid="input-auth-email"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  className="flex-1 h-12 rounded-xl text-base" 
                  onClick={() => handleAuth("email")}
                  data-testid="button-auth-signup"
                >
                  <Mail className="mr-2 w-4 h-4" /> Sign up
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 h-12 rounded-xl text-base"
                  onClick={() => handleAuth("login")}
                  data-testid="button-auth-login"
                >
                  <LogIn className="mr-2 w-4 h-4" /> Login
                </Button>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-6 px-4">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
