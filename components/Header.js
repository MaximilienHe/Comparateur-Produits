import React, { useState } from 'react';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faXTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faRss } from '@fortawesome/free-solid-svg-icons'

import styles from './Header.module.css';
import headerMenuData from '../utils/headerMenuData.json'
import socialData from '../utils/socialData.json'

const iconMap = {
  faFacebookF: faFacebookF,
  faXTwitter: faXTwitter,
  faInstagram: faInstagram,
  faRss: faRss,
};

const Header = ({}) => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState(null);

  const toggleMobileSubMenu = (id) => {
    if (openSubMenuId === id) {
      setOpenSubMenuId(null);
    } else {
      setOpenSubMenuId(id);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`${styles.header} ${styles.bgGradient}`}>
      {/* Mobile Version */}
      <div className={styles.headerMobile}>
        <div className={styles.mobileHeaderContainer}>
          <div className={styles.burgerMenu} onClick={toggleMobileMenu}>
            <div className={`${styles.top} ${styles.bar}`}></div>
            <div className={`${styles.middle} ${styles.bar}`}></div>
            <div className={`${styles.bottom} ${styles.bar}`}></div>
          </div>
          <div className={styles.logoCenter}>
          <img src="https://droidsoft.fr/wp-content/uploads/2022/05/Droidsoft-logo-mobile.png" alt="Logo DroidSoft"/>
          </div>
        </div>
      </div>
      <div className={`${styles.whiteBack} ${isMobileMenuOpen ? styles.whiteBackActive : ''}`} onClick={toggleMobileMenu}>
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles["active"] : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className={styles.logoSection}>
        <div className={styles.closeButton} onClick={toggleMobileMenu}>
          <Image
            src="/xmark.png"
            alt="Fermer"
            width={20}
            height={20}
            className={styles.image}
          />
        </div>
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
          <div className={styles.mobileNav}>
            <nav>
              <ul className={`${styles.mobileMainMenu} ${styles.mobileUnderlineOnCurrent}`}>
                {headerMenuData.menu.map((parent) => (
                  <li key={parent.id} className={styles.menuItem}>
                    <div className={styles.mobileLinkWrap}>
                    <a href={parent.link} className={`${styles.menuLink} ${openSubMenuId === parent.id ? styles.menuLinkActive : ''}`}>
                  <span>{parent.name}</span>
                </a>
                        {parent.has_children && (
                          <div onClick={(event) => {event.stopPropagation(); toggleMobileSubMenu(parent.id);}} className={styles.subMenuToggle}>
                            <div className={styles.mobileSmallArrow}>

                            </div>
                          </div>
                        )}
                    </div>
                    {parent.has_children && (
                      <ul className={`${styles.mobileSubMenu} ${openSubMenuId === parent.id ? styles.subMenuOpen : ''}`}>
                        {parent.children.map((child) => (
                          <li key={child.id}>
                            <a href={child.link} className={styles.mobileAnimationSubMenu}>
                              <span>{child.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* End */}
      <div className={styles.containerWeb}>
        <div className={styles.navbarInner}>
          <div className={styles.logoSide}>
            <div className={styles.logoWrap}>
              <a className={styles.logoLink} href="https://droidsoft.fr" title="DroidSoft">
                <Image
                  src="/logoDroidSoft-60.png"
                  alt="Logo DroidSoft"
                  width={123}
                  height={56}
                  className={styles.logo}
                />
              </a>

            </div>
          </div>
          <div className={styles.navbarRightOuter}>
            <nav id={styles.navigation} className={styles.mainMenuWrap}>
            <ul className={`${styles.mainMenu} ${styles.underlineOnHover}`}>
                {headerMenuData.menu.map((parent) => (
                  <li key={parent.id}>
                    <a href={parent.link} className={parent.has_children ? styles["hasChildren"] : ''}>
                      <span>{parent.name}</span>
                    </a>
                    {parent.has_children && (
                      <ul className={`${styles.subMenu} ${styles.underlineOnHover} ${styles.bgGradient}`}>
                        {parent.children.map((child) => (
                          <li key={child.id}>
                            <a className={styles.animationSubMenu} href={child.link}>
                              <span>{child.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;