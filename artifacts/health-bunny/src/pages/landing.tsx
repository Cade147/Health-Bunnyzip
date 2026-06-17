import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { Logo } from "@/components/layout";
import { ShieldCheck, Zap, HeartPulse } from "lucide-react";

export default function Landing() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3faf2] dark:bg-background relative overflow-hidden flex flex-col">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/15 to-transparent pointer-events-none" />
      
      <header className="relative z-10 px-6 py-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">Health Bunny AI</span>
        </div>
        <Button variant="ghost" onClick={() => setIsAuthOpen(true)} className="rounded-full font-medium" data-testid="button-login-header">
          Login
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-secondary text-sm font-medium text-primary shadow-sm mb-4 border border-primary/10">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Your AI Health Companion
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Fast AI-powered <br className="hidden md:block" />
            <span className="text-primary">health guidance</span> <br className="hidden md:block" />
            for common symptoms.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get instant, reliable insights on what might be causing your symptoms and safe home-care steps you can take today. Calm, reassuring, and always here for you.
          </p>
          
          <div className="pt-8 pb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => setIsAuthOpen(true)}
              data-testid="button-get-started"
            >
              Get Started
            </Button>
            <p className="text-sm text-muted-foreground sm:hidden">Free & secure forever</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-border/50 max-w-4xl mx-auto text-left">
            <div className="bg-white/60 dark:bg-card/50 p-6 rounded-2xl backdrop-blur-sm border border-border/50">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Instant Analysis</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Get answers in seconds, not hours. Don't wait wondering what your symptoms mean.</p>
            </div>
            <div className="bg-white/60 dark:bg-card/50 p-6 rounded-2xl backdrop-blur-sm border border-border/50">
              <ShieldCheck className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Safe & Reliable</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Evidence-based home-care guidance with clear red flags on when to see a doctor.</p>
            </div>
            <div className="bg-white/60 dark:bg-card/50 p-6 rounded-2xl backdrop-blur-sm border border-border/50">
              <HeartPulse className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Private by Design</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Your health data is yours alone. We use secure state management to protect your privacy.</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 py-8 text-center text-sm text-muted-foreground">
        © 2026 Health Bunny AI. All Rights Reserved. Not a medical diagnosis tool.
      </footer>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
