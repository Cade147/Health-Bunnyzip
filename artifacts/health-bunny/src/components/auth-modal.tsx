import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { Mail, LogIn, Chrome, KeyRound, Eye, EyeOff } from "lucide-react";
import { Logo } from "./layout";
import { signInWithGoogle, signUpWithEmail, loginWithEmail, resetPassword } from "@/lib/firebase";
import { toast } from "sonner";

type AuthView = "main" | "signup" | "login" | "reset";

function userToProfile(firebaseUser: { uid: string; displayName: string | null; email: string | null }) {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
    email: firebaseUser.email || "",
    onboardingCompleted: false,
  };
}

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [, setLocation] = useLocation();
  const { setUser, user } = useAppStore();
  const [view, setView] = useState<AuthView>("main");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSuccess = (firebaseUser: { uid: string; displayName: string | null; email: string | null }) => {
    const existingUser = user;
    const profile = userToProfile(firebaseUser);
    if (existingUser?.id === profile.id && existingUser.onboardingCompleted) {
      profile.onboardingCompleted = true;
    }
    setUser(profile);
    onClose();
    setLocation(profile.onboardingCompleted ? "/dashboard" : "/onboarding");
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const firebaseUser = await signInWithGoogle();
      handleSuccess(firebaseUser);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      if (!msg.includes("popup-closed")) toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) return toast.error("Please fill in all fields");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const firebaseUser = await signUpWithEmail(email, password, displayName);
      handleSuccess(firebaseUser);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please fill in all fields");
    setLoading(true);
    try {
      const firebaseUser = await loginWithEmail(email, password);
      const profile = userToProfile(firebaseUser);
      profile.onboardingCompleted = true;
      setUser(profile);
      onClose();
      setLocation("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) return toast.error("Enter your email address first");
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("Password reset email sent — check your inbox");
      setView("login");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setEmail(""); setPassword(""); setDisplayName(""); setShowPassword(false);
  };

  const goTo = (v: AuthView) => { reset(); setView(v); };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 overflow-hidden shadow-2xl rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="relative">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Logo className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {view === "main" && "Welcome to Health Bunny"}
              {view === "signup" && "Create an account"}
              {view === "login" && "Welcome back"}
              {view === "reset" && "Reset your password"}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {view === "main" && "Your personal, AI-powered health companion."}
              {view === "signup" && "Sign up with your email to get started."}
              {view === "login" && "Sign in to continue your health journey."}
              {view === "reset" && "We'll send a reset link to your inbox."}
            </DialogDescription>
          </DialogHeader>

          {view === "main" && (
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium rounded-xl hover:bg-secondary border-border/50"
                onClick={handleGoogle}
                disabled={loading}
                data-testid="button-auth-google"
              >
                <Chrome className="mr-2 w-5 h-5" />
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

              <div className="flex gap-3">
                <Button className="flex-1 h-12 rounded-xl text-base" onClick={() => goTo("signup")}>
                  <Mail className="mr-2 w-4 h-4" /> Sign up
                </Button>
                <Button variant="secondary" className="flex-1 h-12 rounded-xl text-base" onClick={() => goTo("login")}>
                  <LogIn className="mr-2 w-4 h-4" /> Login
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-6 px-4">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          )}

          {view === "signup" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display name</Label>
                <Input
                  id="display-name"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    placeholder="Min. 6 characters"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                    className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button className="w-full h-12 rounded-xl text-base mt-2" onClick={handleSignUp} disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => goTo("main")}>Back</Button>
            </div>
          )}

          {view === "login" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    placeholder="Your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => goTo("reset")}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
              <Button className="w-full h-12 rounded-xl text-base" onClick={handleLogin} disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => goTo("main")}>Back</Button>
            </div>
          )}

          {view === "reset" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email address</Label>
                <Input
                  id="reset-email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background"
                />
              </div>
              <Button className="w-full h-12 rounded-xl text-base" onClick={handleReset} disabled={loading}>
                <KeyRound className="mr-2 w-4 h-4" />
                {loading ? "Sending..." : "Send reset link"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => goTo("login")}>Back to sign in</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
