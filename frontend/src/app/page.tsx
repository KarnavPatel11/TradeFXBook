import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Community } from "@/components/landing/Community";
import { AllFree } from "@/components/landing/AllFree";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col relative">
      <Navbar />
      
      <div className="flex-1">
        <Hero />
        <Features />
        <Community />
        <AllFree />
        <FAQ />
        <Contact />
      </div>

      <Footer />
    </main>
  );
}
