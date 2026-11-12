import FinalCta from '@/components/sections/FinalCta';
import Hero from '@/components/sections/Hero';
import MarketsSection from '@/components/sections/MarketsSection';
import ProcessSection from '@/components/sections/ProcessSection';
import QualityBand from '@/components/sections/QualityBand';
import SeafoodLinesSection from '@/components/sections/SeafoodLinesSection';
import WhyZivahSection from '@/components/sections/WhyZivahSection';
import EvidenceBar from '@/components/site/EvidenceBar';

export default function HomePage() {
  return (
    <>
      <Hero />
      <EvidenceBar />
      <SeafoodLinesSection />
      <WhyZivahSection />
      <QualityBand />
      <ProcessSection />
      <MarketsSection />
      <FinalCta />
    </>
  );
}
