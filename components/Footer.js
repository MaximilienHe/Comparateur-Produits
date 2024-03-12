import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faXTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faRss } from '@fortawesome/free-solid-svg-icons'

import socialData from '../utils/socialData.json'
import styles from './Footer.module.css';

const iconMap = {
  faFacebookF: faFacebookF,
  faXTwitter: faXTwitter,
  faInstagram: faInstagram,
  faRss: faRss,
};

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.logoSection}>
          <div className={styles.socialIcons}>
            {socialData.media.map((media) => (
                <a 
                  key={media.id}
                  href={media.link}
                  className={`${styles.logo} ${styles[media.label.toLowerCase() + 'Special']}`}
                  title={media.label}
                >
                  <FontAwesomeIcon icon={iconMap[media.icon]} size='lg'/>
                </a>
              ))}
          </div>
        </div>
        <div className={styles.navLinks}>
            {socialData.nav.map((nav) => (
                <a 
                  key={nav.id}
                  href={nav.link}
                  className={styles.navLink}
                >
                  {nav.label}
                </a>
              ))}
        </div>
      </div>
      <div className={styles.copyrightSection}>
        <p>
          &copy; 2024 Droidsoft
        </p>
      </div>
    </footer>
  );
};

export default Footer;