import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { updateUser } = useAppStore();
  const [step, setStep] = useState(1);

  // Form State
  const [source, setSource] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateUser({
        onboardingCompleted: true,
        source,
        ageGroup,
        interests,
      });
      setLocation("/dashboard");
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const steps = [
    {
      title: "How did you find us?",
      options: ["YouTube", "ChatGPT", "Instagram", "Facebook", "WhatsApp", "LinkedIn", "X (Twitter)", "Friend", "Other"],
      value: source,
      setValue: setSource,
      isMulti: false
    },
    {
      title: "What age group are you in?",
      options: ["Under 18", "18-24", "25-34", "35-44", "45-54", "55+"],
      value: ageGroup,
      setValue: setAgeGroup,
      isMulti: false
    },
    {
      title: "What health topics interest you?",
      options: ["General Health", "Nutrition", "Fitness", "Mental Wellness", "Skin Care", "Women's Health", "Men's Health"],
      value: interests,
      setValue: toggleInterest,
      isMulti: true
    }
  ];

  const currentStep = steps[step - 1];
  const isNextDisabled = currentStep.isMulti 
    ? (currentStep.value as string[]).length === 0 
    : !(currentStep.value as string);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full h-1 bg-secondary">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-in-out" 
          style={{ width: `${(step / 3) * 100}%` }} 
        />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-10">
              <span className="text-sm font-medium text-primary mb-2 block">Step {step} of 3</span>
              <h2 className="text-3xl font-bold">{currentStep.title}</h2>
              {currentStep.isMulti && <p className="text-muted-foreground mt-2">Select all that apply</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentStep.options.map((opt) => {
                const isSelected = currentStep.isMulti 
                  ? (currentStep.value as string[]).includes(opt)
                  : currentStep.value === opt;

                return (
                  <Card
                    key={opt}
                    onClick={() => currentStep.setValue(opt as any)}
                    className={`p-4 cursor-pointer flex flex-col items-center justify-center min-h-[100px] text-center transition-all border-2 ${
                      isSelected 
                        ? "border-primary bg-primary/5 text-primary shadow-sm" 
                        : "border-transparent bg-secondary/50 hover:bg-secondary hover:border-primary/20"
                    }`}
                    data-testid={`option-${opt.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {isSelected && <CheckCircle2 className="w-5 h-5 mb-2 text-primary" />}
                    <span className={`font-medium ${isSelected ? "" : "text-muted-foreground"}`}>{opt}</span>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between w-full">
          <Button 
            variant="ghost" 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={step === 1 ? "invisible" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          <Button 
            size="lg" 
            onClick={handleNext} 
            disabled={isNextDisabled}
            className="px-8 rounded-full"
            data-testid="button-onboarding-next"
          >
            {step === 3 ? "Complete" : "Continue"} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
