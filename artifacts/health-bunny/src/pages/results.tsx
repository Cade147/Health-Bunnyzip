import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  ArrowLeft, 
  RefreshCw, 
  Coffee, 
  CheckCircle2, 
  HeartPulse, 
  Ban, 
  Stethoscope, 
  Info 
} from "lucide-react";

export default function Results() {
  const [, setLocation] = useLocation();
  const { currentAnalysisInput, currentAnalysisResult, setCurrentAnalysisInput, setCurrentAnalysisResult } = useAppStore();

  useEffect(() => {
    // If accessed directly without an analysis, redirect back
    if (!currentAnalysisResult) {
      setLocation("/dashboard");
    }
  }, [currentAnalysisResult, setLocation]);

  if (!currentAnalysisResult) return null;

  const handleNewAnalysis = () => {
    setCurrentAnalysisInput(null);
    setCurrentAnalysisResult(null);
    setLocation("/analyze");
  };

  const {
    isEmergency,
    emergencyMessage,
    recommendedFoods,
    thingsToDo,
    possibleCauses,
    thingsToAvoid,
    whenToSeeDoctor,
    disclaimer
  } = currentAnalysisResult;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/dashboard")}
          className="-ml-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
        </Button>
        <Button onClick={handleNewAnalysis} variant="outline" className="rounded-full">
          <RefreshCw className="w-4 h-4 mr-2" /> New Check
        </Button>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        
        {/* Header Summary */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Analysis Results</h1>
          {currentAnalysisInput && (
            <p className="text-muted-foreground text-lg">
              For your symptom: <span className="font-semibold text-foreground">{currentAnalysisInput.symptomName}</span> 
              {" "}({currentAnalysisInput.severity})
            </p>
          )}
        </motion.div>

        {/* Emergency Banner */}
        {isEmergency && (
          <motion.div variants={itemVariants}>
            <div className="bg-destructive/15 border-2 border-destructive text-destructive p-6 rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-1">Seek Medical Attention</h3>
                <p className="font-medium text-destructive/90">
                  {emergencyMessage || "Your symptoms indicate a possible medical emergency. Please visit an emergency room or contact emergency services immediately."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Possible Causes */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-primary/20 bg-primary/5">
              <CardHeader className="pb-3 flex flex-row items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg"><HeartPulse className="w-5 h-5 text-primary" /></div>
                <div>
                  <CardTitle className="text-lg">Possible Causes</CardTitle>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Not a diagnosis</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {possibleCauses.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-foreground/80 leading-relaxed">{cause}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Things to Do */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader className="pb-3 flex flex-row items-center gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
                <CardTitle className="text-lg">Things You Can Do</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {thingsToDo.map((thing, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span className="text-foreground/80 leading-relaxed">{thing}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Foods */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader className="pb-3 flex flex-row items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg"><Coffee className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                <CardTitle className="text-lg">Recommended Foods & Drinks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recommendedFoods.map((food, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span className="text-foreground/80 leading-relaxed">{food}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Things to Avoid */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader className="pb-3 flex flex-row items-center gap-3">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg"><Ban className="w-5 h-5 text-orange-600 dark:text-orange-400" /></div>
                <CardTitle className="text-lg">Things To Avoid</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {thingsToAvoid.map((thing, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Ban className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                      <span className="text-foreground/80 leading-relaxed">{thing}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* When to See a Doctor */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
              <CardHeader className="pb-3 flex flex-row items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-lg"><Stethoscope className="w-5 h-5 text-red-600 dark:text-red-400" /></div>
                <CardTitle className="text-lg text-red-700 dark:text-red-400">When To See A Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {whenToSeeDoctor.map((warning, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span className="text-red-900/80 dark:text-red-200/80 font-medium leading-relaxed">{warning}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Medical Disclaimer */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl text-sm text-muted-foreground">
              <Info className="w-5 h-5 shrink-0" />
              <p>{disclaimer}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
