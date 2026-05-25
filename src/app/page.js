import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Features from '@/components/Features/Features';
import Team from '@/components/Team/Team';
import CollarSensor from '@/components/CollarSensor/CollarSensor';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Team />
        <CollarSensor />
      </main>
      <Footer />
    </>
  );
}
