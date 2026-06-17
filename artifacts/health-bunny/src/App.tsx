import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/layout";
import { useAppStore } from "@/lib/store";
import { auth, onAuthStateChanged } from "@/lib/firebase";

import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Analyze from "@/pages/analyze";
import Results from "@/pages/results";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useAppStore();
  const [location, setLocation] = useLocation();

  if (!user) {
    setLocation("/");
    return null;
  }

  if (user && !user.onboardingCompleted && location !== "/onboarding") {
    setLocation("/onboarding");
    return null;
  }

  if (location === "/onboarding") {
    return <Component />;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function PublicOnlyRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation(user.onboardingCompleted ? "/dashboard" : "/onboarding");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => <PublicOnlyRoute component={Landing} />}
      </Route>
      <Route path="/onboarding">
        {() => <ProtectedRoute component={Onboarding} />}
      </Route>
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/analyze">
        {() => <ProtectedRoute component={Analyze} />}
      </Route>
      <Route path="/results">
        {() => <ProtectedRoute component={Results} />}
      </Route>
      <Route path="/history">
        {() => <ProtectedRoute component={History} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function FirebaseAuthSync() {
  const { user, setUser, logout } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const currentOnboarding = user?.id === firebaseUser.uid ? user?.onboardingCompleted ?? false : false;
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email || "",
          onboardingCompleted: currentOnboarding,
        });
      } else {
        logout();
      }
    });
    return () => unsubscribe();
  }, []);

  return null;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="health-bunny-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <FirebaseAuthSync />
            <Router />
          </WouterRouter>
          <Toaster position="top-center" />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
