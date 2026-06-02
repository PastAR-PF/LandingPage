import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Features from '@/components/Features/Features';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import CollarSensor from '@/components/CollarSensor/CollarSensor';
import Team from '@/components/Team/Team';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CollarSensor />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
