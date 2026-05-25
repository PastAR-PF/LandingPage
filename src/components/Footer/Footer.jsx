import styles from './Footer.module.css';
import { HiHeart } from 'react-icons/hi';

const footerLinks = {
  Producto: [
    { label: 'Módulos', href: '#features' },
    { label: 'Hardware IoT', href: '#collar' },
  ],
  Empresa: [
    { label: 'Quiénes Somos', href: '#team' },
    { label: 'Contacto', href: '#contact' },
    { label: 'UTN FRC', href: 'https://www.frc.utn.edu.ar/', external: true },
  ],
  Legal: [
    { label: 'Política de Privacidad', href: '#' },
    { label: 'Términos de Uso', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="#hero" className={styles.logo}>
              <img src="/images/logo.svg" alt="PastAR Logo" className={styles.logoIcon} />
              <span className={styles.logoText}>
                Past<span className={styles.logoAccent}>AR</span>
              </span>
            </a>
            <p className={styles.brandDesc}>
              Plataforma inteligente de gestión, monitoreo y trazabilidad bovina
              con tecnología IoT para el campo argentino.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>{category}</h4>
              <ul>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={styles.footerLink}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2025 PastAR — Proyecto de Tesis Final, UTN Facultad Regional Córdoba.
          </p>
          <p className={styles.madeWith}>
            Hecho con <HiHeart className={styles.heart} /> en Córdoba, Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
