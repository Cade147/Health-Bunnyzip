import { useAppStore } from "@/lib/store";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  Plus,
  Thermometer,
  Flame,
  Activity,
  AlertCircle,
  Wind,
  ShieldAlert,
  Frown,
  Flower2
} from "lucide-react";
import { useState, useMemo } from "react";

const TEMPLATES = [
  { name: "Headache", icon: Activity, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { name: "Stomach Burn", icon: Flame, color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
  { name: "Flu", icon: Thermometer, color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" },
  { name: "Acne", icon: Flower2, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { name: "Cough", icon: Wind, color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" },
  { name: "Fever", icon: AlertCircle, color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
  { name: "Sore Throat", icon: Frown, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  { name: "Allergies", icon: ShieldAlert, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
];

export default function Dashboard() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const handleTemplateClick = (name: string) => {
    // Navigate to analyze with prefilled name
    setLocation(`/analyze?symptom=${encodeURIComponent(name)}`);
  };

  const filteredTemplates = TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-[calc(100vh-2rem)] pb-20">
      <div className="space-y-6">
        <header>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {greeting}, <span className="text-primary">{user?.name || "Friend"}</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              How are you feeling today?
            </p>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-xl"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symptoms..." 
            className="w-full pl-12 h-14 rounded-2xl bg-white dark:bg-card border-border/50 shadow-sm text-lg focus-visible:ring-primary/20"
            data-testid="input-dashboard-search"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <h2 className="text-lg font-semibold mb-4">Common Checks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredTemplates.map((template, i) => (
              <Card 
                key={template.name}
                onClick={() => handleTemplateClick(template.name)}
                className="group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-300 border-border/40 overflow-hidden bg-card/50 hover:bg-card"
                data-testid={`card-template-${template.name.toLowerCase()}`}
              >
                <div className="p-5 flex flex-col items-center text-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${template.color} transition-transform group-hover:scale-110`}>
                    <template.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-sm md:text-base text-foreground/90">{template.name}</span>
                </div>
              </Card>
            ))}
            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No templates found. Try searching something else or use the + button to enter a custom symptom.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Link href="/analyze">
        <Button 
          size="icon" 
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 z-50"
          data-testid="fab-new-analysis"
        >
          <Plus className="w-8 h-8" />
          <span className="sr-only">New Analysis</span>
        </Button>
      </Link>
    </div>
  );
}
