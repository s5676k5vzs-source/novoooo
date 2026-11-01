import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { Reactions } from "@/components/landing/Reactions";
import { Steps } from "@/components/landing/Steps";
import { Reviews } from "@/components/landing/Reviews";
import { Samples } from "@/components/landing/Samples";
import { Occasions } from "@/components/landing/Occasions";
import { Faq, FinalCta } from "@/components/landing/Faq";

export default function Landing() {
  return (
    <main data-testid="landing-page">
      <Nav />
      <Hero />
      <Marquee />
      <Reactions />
      <Steps />
      <Reviews />
      <Samples />
      <Occasions />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
