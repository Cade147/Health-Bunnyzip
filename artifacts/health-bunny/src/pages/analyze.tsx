import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAnalyzeSymptoms, SymptomInputSeverity, SymptomInputDuration, SymptomInputAgeRange } from "@workspace/api-client-react";
import { useAppStore } from "@/lib/store";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  symptomName: z.string().min(2, "Symptom name must be at least 2 characters"),
  severity: z.enum(["Mild", "Moderate", "Severe"] as const),
  duration: z.enum(["Today", "1-3 Days", "4-7 Days", "More than a Week"] as const),
  ageRange: z.enum(["Under 18", "18-24", "25-34", "35-44", "45-54", "55+"] as const),
  additionalInfo: z.string().optional(),
  emergencySymptoms: z.boolean().default(false),
});

export default function Analyze() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const prefilledSymptom = new URLSearchParams(searchString).get("symptom");
  const { user, setCurrentAnalysisInput, setCurrentAnalysisResult, addHistory } = useAppStore();
  const analyzeMutation = useAnalyzeSymptoms();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptomName: prefilledSymptom || "",
      severity: SymptomInputSeverity.Mild,
      duration: SymptomInputDuration.Today,
      ageRange: (user?.ageGroup as SymptomInputAgeRange) || SymptomInputAgeRange["25-34"],
      additionalInfo: "",
      emergencySymptoms: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setCurrentAnalysisInput(values);
    analyzeMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        setCurrentAnalysisResult(data);
        // Mock ID creation for history
        addHistory({
          id: Math.random().toString(36).substring(7),
          date: new Date().toISOString(),
          symptomName: values.symptomName,
          severity: values.severity,
          summary: data.isEmergency ? "Emergency: See a doctor immediately." : data.possibleCauses[0] || "General guidance provided.",
        });
        setLocation("/results");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <Button 
        variant="ghost" 
        onClick={() => setLocation("/dashboard")}
        className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Check a Symptom</h1>
        <p className="text-muted-foreground mb-8">Provide some details so we can give you the most accurate home-care guidance.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <FormField
              control={form.control}
              name="symptomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">What's your primary symptom?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sharp headache behind eyes" className="h-12 bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-background">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(SymptomInputSeverity).map((val) => (
                          <SelectItem key={val} value={val}>{val}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How long?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-background">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(SymptomInputDuration).map((val) => (
                          <SelectItem key={val} value={val}>{val.replace(/_/g, ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Group</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-background">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(SymptomInputAgeRange).map((val) => (
                        <SelectItem key={val} value={val}>{val.replace(/_/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any other symptoms? Medications you're taking?" 
                      className="min-h-[100px] resize-none bg-background" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mt-4">
              <FormField
                control={form.control}
                name="emergencySymptoms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-destructive font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Emergency Symptoms Present?
                      </FormLabel>
                      <p className="text-sm text-destructive/80">
                        Check this if you are experiencing trouble breathing, severe chest pain, fainting, or severe bleeding.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg rounded-xl mt-6"
              disabled={analyzeMutation.isPending}
              data-testid="button-submit-analysis"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Symptoms"
              )}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
