
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageSquare, Search, UserCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const testimonials = [
  {
    name: 'Deirdre K.',
    location: 'Dublin',
    quote: "The analysis was surprisingly accurate and helped me decide to see a doctor sooner. Incredibly helpful and gave me real peace of mind.",
    avatarHint: 'woman portrait',
  },
  {
    name: 'Liam G.',
    location: 'Cork',
    quote: "I used this for my dad when he was feeling unwell. It was simple to use and the practitioner finder was a fantastic, straightforward feature.",
    avatarHint: 'man portrait',
  },
  {
    name: 'Aoife M.',
    location: 'Galway',
    quote: "As a student, I can't always get a GP appointment quickly. This service is a lifesaver for getting initial advice and understanding my symptoms.",
    avatarHint: 'student photo',
  }
];

export default function Home() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="w-full h-screen min-h-[700px] flex items-center justify-center bg-zinc-100/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none text-foreground">
              Your Health, <br /> Understood.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              From symptom to solution. Get instant, AI-powered health insights and connect with trusted practitioners across Ireland.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/symptom-checker">Start Your Symptom Check <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1: Symptom Checker */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm font-medium">Step 1</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Describe how you feel.</h2>
            <p className="text-muted-foreground text-lg">
              Simply type your symptoms in plain language. Our system is designed to understand you, whether it's a "throbbing headache" or "shortness of breath".
            </p>
            <ul className="space-y-3 pt-2 text-muted-foreground">
              <li className="flex items-start">
                <MessageSquare className="h-6 w-6 mr-3 mt-1 text-primary shrink-0" />
                <span><strong className="text-foreground">Natural Language:</strong> Just talk to it like you would a doctor.</span>
              </li>
              <li className="flex items-start">
                <UserCheck className="h-6 w-6 mr-3 mt-1 text-primary shrink-0" />
                <span><strong className="text-foreground">AI-Powered Analysis:</strong> Get preliminary insights in seconds.</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
             <Image 
                src="https://placehold.co/600x600.png"
                alt="Symptom Checker Interface"
                width={550}
                height={550}
                className="rounded-xl shadow-2xl"
                data-ai-hint="medical app"
             />
          </div>
        </div>
      </section>

      {/* Feature Section 2: Find Practitioners */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-zinc-100/50">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center md:order-last">
             <Image 
                src="https://placehold.co/600x600.png"
                alt="Map with practitioner locations"
                width={550}
                height={550}
                className="rounded-xl shadow-2xl"
                data-ai-hint="Ireland map"
             />
          </div>
          <div className="space-y-4 md:order-first">
            <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm font-medium">Step 2</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Connect with care.</h2>
            <p className="text-muted-foreground text-lg">
              If your symptoms suggest you should see a professional, we'll help you find one. Search for GPs, specialists, and clinics near you.
            </p>
             <ul className="space-y-3 pt-2 text-muted-foreground">
              <li className="flex items-start">
                <Search className="h-6 w-6 mr-3 mt-1 text-primary shrink-0" />
                <span><strong className="text-foreground">Local Search:</strong> Find practitioners in your area.</span>
              </li>
              <li className="flex items-start">
                <UserCheck className="h-6 w-6 mr-3 mt-1 text-primary shrink-0" />
                <span><strong className="text-foreground">Plan Friendly:</strong> Filter by who accepts your health plan.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
            Trusted by users across Ireland
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-transparent shadow-none hover:bg-zinc-100/50 transition-colors">
                <CardContent className="p-8 flex flex-col justify-between h-full">
                  <blockquote className="text-lg text-muted-foreground mb-6">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="flex items-center gap-4">
                     <Image 
                        src={`https://placehold.co/48x48.png`}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                        data-ai-hint={testimonial.avatarHint}
                      />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-zinc-100/50">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl">
              Ready for clarity?
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground md:text-xl">
              Your journey to understanding your health starts here. It's fast, secure, and built for you.
            </p>
            <div className="flex justify-center pt-4">
              <Button asChild size="lg" className="font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/symptom-checker">Start Symptom Check</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
