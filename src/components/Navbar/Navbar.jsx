'use client';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Módulos', href: '#features' },
  { label: 'Quiénes Somos', href: '#team' },
  { label: 'Hardware IoT', href: '#collar' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} id="navbar">
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo}>
          <img src="/images/logo.svg" alt="PastAR Logo" className={styles.logoIcon} />
          <span className={styles.logoText}>
            Past<span className={styles.logoAccent}>AR</span>
          </span>
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link} onClick={handleLinkClick}>
                {link.label}
              </a>
            </li>
          ))}
          <li className={styles.ctaMobile}>
            <a href="#contact" className="btn btn-primary" onClick={handleLinkClick}>
              Solicitar Demo
            </a>
          </li>
        </ul>

        <a href="#contact" className={`btn btn-primary ${styles.ctaDesktop}`}>
          Solicitar Demo
        </a>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
}
