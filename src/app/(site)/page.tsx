import { Hero } from "@/components/home/Hero";
import { Agents, Featured, Neighbourhoods, Reviews, Stats, ValuationCta, Why } from "@/components/home/Sections";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Stats />
      <Featured />
      <Neighbourhoods />
      <Why />
      <Agents />
      <Reviews />
      <ValuationCta />
    </main>
  );
}
