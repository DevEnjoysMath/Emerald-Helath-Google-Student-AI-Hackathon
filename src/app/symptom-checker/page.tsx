"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, AlertTriangle, CheckCircle, ArrowRight, Stethoscope, Clock, Shield, Activity, Search, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { analyzeSymptoms, type SymptomAnalysisOutput } from "@/lib/ai-helpers";
import ReactMarkdown from 'react-markdown';

const symptomCheckerSchema = z.object({
  symptoms: z.string().min(10, {
    message: "Please describe your symptoms in at least 10 characters.",
  }),
});

type SymptomCheckerFormValues = z.infer<typeof symptomCheckerSchema>;

export default function SymptomCheckerPage() {
  const [analysis, setAnalysis] = useState<SymptomAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<SymptomCheckerFormValues>({
    resolver: zodResolver(symptomCheckerSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: SymptomCheckerFormValues) {
    setIsLoading(true);
    setAnalysis(null);

    try {
      const result = await analyzeSymptoms({ 
        symptoms: data.symptoms,
        photoDataUri: imagePreview || undefined,
      });
      setAnalysis(result);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing symptoms. Please try again later.",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const parseExplanation = (explanation: string) => {
    try {
      // Remove any JSON-like content from the start of the explanation
      const markdownStart = explanation.indexOf('# Likely Cause');
      if (markdownStart !== -1) {
        return explanation.substring(markdownStart);
      }
      return explanation;
    } catch (e) {
      return explanation;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-card rounded-2xl shadow-lg mb-8 border border-border">
              <Stethoscope className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-foreground mb-4 sm:text-5xl md:text-6xl">
              Symptom Analysis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get instant preliminary analysis using advanced AI. 
              This tool provides guidance but should not replace professional medical advice.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* Input Form */}
            <div className="xl:col-span-1">
              <Card className="shadow-lg border border-border bg-card">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold tracking-tighter text-foreground">
                    <Activity className="w-6 h-6 text-primary" />
                    Describe Symptoms
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-lg">
                    Be as detailed as possible for accurate analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-foreground">
                              What symptoms are you experiencing?
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g., 'I have a persistent cough, fever of 101°F, and feel very tired. The cough is worse at night and I have some chest tightness.'"
                                className="min-h-[120px] resize-none text-base border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-background text-foreground"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <FormLabel className="text-base font-medium text-foreground">
                          Upload a photo (optional)
                        </FormLabel>
                        <div className="relative">
                          <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-3 border border-input rounded-lg hover:border-primary transition-colors cursor-pointer bg-background text-foreground text-sm"
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            Photos can help provide more accurate analysis
                          </p>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-lg hover:shadow-xl rounded-full"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-5 w-5" />
                            Analyze Symptoms
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <Button variant="outline" className="w-full justify-start h-11 text-base border-border text-foreground hover:bg-secondary font-medium">
                  <User className="mr-2 h-4 w-4" />
                  Find Healthcare Provider
                </Button>
                <Button variant="outline" className="w-full justify-start h-11 text-base border-border text-foreground hover:bg-secondary font-medium">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="xl:col-span-1 xl:col-start-2 xl:col-end-4">
              {analysis && (
                <div className="space-y-6">
                  <Card className={`shadow-lg border ${
                    analysis.isSerious 
                      ? 'border-destructive/50 bg-destructive/5' 
                      : 'border-primary/50 bg-primary/5'
                  }`}>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tighter">
                        {analysis.isSerious ? (
                          <>
                            <div className="p-2 bg-destructive/10 rounded-lg">
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <span className="text-destructive">Medical Attention Recommended</span>
                          </>
                        ) : (
                          <>
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-primary">Likely Not Serious</span>
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {analysis.suggestImmediateAction && (
                        <div className="bg-destructive text-destructive-foreground rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-bold text-base mb-1">Seek Medical Care</h4>
                              <p className="text-destructive-foreground/90 text-sm">
                                Based on your symptoms, we recommend consulting a healthcare provider promptly.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-card rounded-lg p-6 border border-border">
                        <div className="prose prose-base max-w-none">
                          <ReactMarkdown
                            components={{
                              h1: ({children}) => (
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <Shield className="h-4 w-4 text-primary" />
                                  </div>
                                  <h1 className="text-lg font-bold text-foreground m-0 tracking-tighter">
                                    {children}
                                  </h1>
                                </div>
                              ),
                              h2: ({children}) => (
                                <div className="flex items-center gap-3 mb-3 mt-6">
                                  <div className="p-1.5 bg-accent/10 rounded-lg">
                                    <Clock className="h-3 w-3 text-accent" />
                                  </div>
                                  <h2 className="text-base font-semibold text-foreground m-0 tracking-tighter">
                                    {children}
                                  </h2>
                                </div>
                              ),
                              ul: ({children}) => (
                                <ul className="space-y-2 mt-3 ml-6">
                                  {children}
                                </ul>
                              ),
                              li: ({children}) => (
                                <li className="text-muted-foreground leading-relaxed text-base">
                                  {children}
                                </li>
                              ),
                              p: ({children}) => (
                                <p className="text-muted-foreground leading-relaxed mb-3 text-base">
                                  {children}
                                </p>
                              )
                            }}
                          >
                            {parseExplanation(analysis.explanation)}
                          </ReactMarkdown>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button 
                          variant="outline" 
                          className="h-11 text-base font-medium border-border text-foreground hover:bg-secondary"
                        >
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Find Provider
                          <ArrowRight className="ml-auto h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-11 text-base font-medium border-border text-foreground hover:bg-secondary"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Contact GP
                          <ArrowRight className="ml-auto h-4 w-4" />
                        </Button>
                      </div>

                      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                        <div className="flex items-start gap-3">
                          <Shield className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="font-semibold text-primary mb-1 text-sm">
                              Important Notice
                            </p>
                            <p className="text-muted-foreground text-sm">
                              This is an AI-powered preliminary analysis and should not replace professional medical advice. 
                              If you're experiencing severe symptoms or are unsure, always consult a healthcare provider.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <Card className="shadow-lg border border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                      <div className="w-12 h-12 border-3 border-muted border-t-primary rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mt-6 mb-2 tracking-tighter text-foreground">
                      Analyzing Your Symptoms
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md text-base">
                      Our AI is carefully reviewing your symptoms to provide the most accurate analysis possible.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar: How it works, Testimonial, Privacy */}
            <div className="hidden xl:flex flex-col gap-8 h-full sticky top-32">
              {/* How it works */}
              <Card className="bg-card border border-border shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
                    <Shield className="h-5 w-5 text-primary" /> How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground text-base">
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Describe your symptoms in your own words.</li>
                    <li>Our AI analyzes your input for possible causes.</li>
                    <li>Get a clear, actionable summary and next steps.</li>
                  </ol>
                  <div className="pt-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Note:</span> This tool does not replace professional medical advice.
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial */}
              <Card className="bg-card border border-border shadow-md">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <img src="https://placehold.co/48x48.png" alt="Deirdre K." className="rounded-full w-12 h-12" />
                    <div>
                      <p className="font-semibold text-foreground">Deirdre K.</p>
                      <p className="text-xs text-muted-foreground">Dublin</p>
                    </div>
                  </div>
                  <blockquote className="italic text-muted-foreground text-base">“The analysis was surprisingly accurate and helped me decide to see a doctor sooner. Incredibly helpful and gave me real peace of mind.”</blockquote>
                </CardContent>
              </Card>

              {/* Privacy Reassurance */}
              <Card className="bg-card border border-border shadow-md">
                <CardContent className="flex items-center gap-3 p-4">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">Your privacy is protected</p>
                    <p className="text-xs text-muted-foreground">We never store your personal health data. All analysis is confidential and secure.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
