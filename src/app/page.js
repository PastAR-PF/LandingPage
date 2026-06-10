import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Features from '@/components/Features/Features';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import CollarSensor from '@/components/CollarSensor/CollarSensor';
import Team from '@/components/Team/Team';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import StackSection from '@/components/StackSection/StackSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Sticky stacking: cada pane se pega y la siguiente lo tapa.
            CollarSensor queda como interludio normal (tiene su pin 3D propio). */}
        <StackSection><Hero /></StackSection>
        <StackSection><Features /></StackSection>
        <StackSection><HowItWorks /></StackSection>
        <CollarSensor />
        <StackSection><Team /></StackSection>
        <StackSection><Contact /></StackSection>
      </main>
      <Footer />
    </>
  );
}
