
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { findPractitioners, FindPractitionersOutput } from "@/ai/flows/find-practitioners";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Stethoscope, Hospital, User, MapPin, Phone, Search, Loader2, AlertCircle } from "lucide-react";

const searchSchema = z.object({
  location: z.string().min(3, {
    message: "Please enter a location, Eircode, or address (at least 3 characters).",
  }),
});

type SearchFormValues = z.infer<typeof searchSchema>;
type Practitioner = FindPractitionersOutput['practitioners'][0];

const getIconForSpecialty = (practitioner: Practitioner) => {
    if (practitioner.isHospital) {
        return <Hospital className="h-6 w-6 text-primary" />;
    }
    if (practitioner.specialty.toLowerCase().includes('gp') || practitioner.specialty.toLowerCase().includes('general practitioner')) {
        return <Stethoscope className="h-6 w-6 text-primary" />;
    }
    return <User className="h-6 w-6 text-primary" />;
}

export default function FindPractitionerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<FindPractitionersOutput | null>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: "",
    },
  });

  const handleSearch = async (locationQuery: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await findPractitioners({ locationQuery });
      setResults(response);
    } catch (e) {
      console.error(e);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse-geocode these coordinates.
          // For this demo, we'll just tell the AI to use the current location.
          handleSearch("my current location based on browser geolocation");
        },
        (error) => {
          setError("Could not access your location. Please enable location permissions in your browser settings.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  function onSubmit(data: SearchFormValues) {
    handleSearch(data.location);
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Find Local Care</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enter an address, Eircode, or city to find healthcare practitioners near you.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="e.g., 'D02 F205' or 'Galway City'"
                            className="pl-10 h-12 text-base"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto flex-grow h-12 text-base">
                        <Search className="mr-2 h-5 w-5" />
                        Search
                    </Button>
                    <Button type="button" variant="outline" onClick={handleFindNearMe} disabled={isLoading} className="w-full sm:w-auto flex-grow h-12 text-base">
                        Use My Location
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Searching for practitioners...</p>
          </div>
        )}
        {error && (
            <Alert variant="destructive" className="my-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Search Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Found {results.practitioners.length} practitioners
            </h2>
            {results.practitioners.map((p, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                           {getIconForSpecialty(p)}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{p.name}</CardTitle>
                            <CardDescription>{p.specialty}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm pl-16">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{p.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{p.phone}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
