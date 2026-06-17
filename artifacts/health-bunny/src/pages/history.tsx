import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Activity, Calendar, Clock, ChevronRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

export default function History() {
  const { history } = useAppStore();
  const [, setLocation] = useLocation();

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "severe": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200";
      case "moderate": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200";
      default: return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">History</h1>
        <p className="text-muted-foreground text-lg">Your past health checks and insights.</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-border/50 border-dashed">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No history yet</h2>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            When you check a symptom, the analysis will be saved here for your records.
          </p>
          <button 
            onClick={() => setLocation("/dashboard")}
            className="text-primary font-medium hover:underline inline-flex items-center"
          >
            Start a check <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow group overflow-hidden border-border/50">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center p-5 gap-4">
                    
                    <div className="flex-1 min-w-0 w-full space-y-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg truncate">{entry.symptomName}</h3>
                        <Badge variant="outline" className={getSeverityColor(entry.severity)}>
                          {entry.severity}
                        </Badge>
                      </div>
                      
                      <p className="text-foreground/80 line-clamp-2 pr-4">{entry.summary}</p>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-sm text-muted-foreground shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(entry.date), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:mt-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(entry.date), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
