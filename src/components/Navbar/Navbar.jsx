'use client';
import { useState, useEffect, useCallback } from 'react';
import { useLenis } from 'lenis/react';
import styles from './Navbar.module.css';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Funcionalidades', href: '#features'},
  { label: 'Cómo funciona', href: '#how' },
  { label: 'Hardware IoT', href: '#collar' },
  { label: 'Equipo', href: '#team' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');
  const lenis = useLenis();

  // Detectar sección activa usando getBoundingClientRect (funciona con sticky/Lenis)
  const updateActiveSection = useCallback(() => {
    const triggerY = window.innerHeight * 0.35;
    let current = '#hero';

    for (const link of navLinks) {
      const id = link.href.replace('#', '');
      const el = document.getElementById(id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      // Si el top de la sección ya pasó el punto de trigger, es la activa
      if (rect.top <= triggerY) {
        current = link.href;
      }
    }

    setActiveSection(current);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      updateActiveSection();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Calcular estado inicial
    updateActiveSection();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateActiveSection]);

  const handleLinkClick = (e, href) => {
    setMenuOpen(false);
    // Scroll suave con Lenis hacia el ancla; fallback al salto nativo.
    if (lenis && href?.startsWith('#')) {
      e.preventDefault();
      lenis.scrollTo(href, { offset: 0, duration: 1.2 });
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} id="navbar">
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo} onClick={(e) => handleLinkClick(e, '#hero')}>
          <div className={styles.logoImgWrap}>
            <img src="/images/pastar-mark-reverse.svg" alt="PastAR" className={`${styles.logoIcon} ${styles.logoIconDark}`} />
            <img src="/images/pastar-mark.svg" alt="PastAR" className={`${styles.logoIcon} ${styles.logoIconLight}`} />
          </div>
          <span className={styles.logoText}>PastAR</span>
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`${styles.link} ${activeSection === link.href ? styles.linkActive : ''}`}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.rightSlot}>
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
