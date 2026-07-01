"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '../../data/site';
import Container from '../common/Container';
import Button from '../common/Button';
import styles from './Header.module.css';

type HeaderProps = {
  onCallbackTrigger: () => void;
};

export default function Header({ onCallbackTrigger }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const scrollToTarget = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId?: string
  ) => {
    e.preventDefault();
    closeMenu();

    if (!targetId) {
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const headerHeight = document.querySelector('header')?.clientHeight ?? 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.history.pushState(null, '', `#${targetId}`);
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  };

  // Monitor scroll for additional sticky UI effects (optional)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <header className={styles.header}>
      {/* Main Sticky Navigation */}
      <div className={`${styles.stickyNav} ${isSticky ? styles.scrolled : ''}`}>
        <Container>
          <div className={styles.navbar}>
            {/* Logo */}
            <Link href="/" className={styles.logoLink} onClick={(e) => scrollToTarget(e)}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/images/logo-symbol-v2.png"
                  alt="Технология"
                  width={101}
                  height={67}
                  className={styles.logoImg}
                  priority
                />
                <span className={styles.logoText}>Технология</span>
              </div>
            </Link>

            {/* Navigation Links (Desktop) */}
            <nav className={styles.navLinks}>
              <Link href="#products" onClick={(e) => scrollToTarget(e, 'products')}>
                Продукция
              </Link>
              <Link href="#stats" onClick={(e) => scrollToTarget(e, 'stats')}>
                О нас
              </Link>
              <Link href="#contacts" onClick={(e) => scrollToTarget(e, 'contacts')}>
                Контакты
              </Link>
            </nav>

            {/* Callback / Phone (Desktop) */}
            <div className={styles.navAction}>
              <Button
                variant="primary"
                size="sm"
                className={styles.callbackButton}
                onClick={() => {
                  closeMenu();
                  onCallbackTrigger();
                }}
              >
                Обратный звонок
              </Button>
              <div className={styles.contactStack}>
                <a href={`tel:${siteConfig.phoneRaw}`} className={styles.phoneLink}>
                  {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className={styles.emailLink}>
                  {siteConfig.email}
                </a>
              </div>
            </div>

            {/* Hamburger Trigger for Mobile */}
            <button
              type="button"
              className={`${styles.burger} ${isOpen ? styles.open : ''}`}
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-label="Открыть меню навигации"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile Drawer Menu */}
      <button
        type="button"
        className={`${styles.mobileBackdrop} ${isOpen ? styles.open : ''}`}
        onClick={closeMenu}
        aria-label="Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ"
        tabIndex={isOpen ? 0 : -1}
      />
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <button
          type="button"
          className={styles.mobileClose}
          onClick={closeMenu}
          aria-label="Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ"
        >
          ×
        </button>
        <nav className={styles.mobileMenuLinks}>
          <Link href="#products" onClick={(e) => scrollToTarget(e, 'products')}>
            Продукция
          </Link>
          <Link href="#stats" onClick={(e) => scrollToTarget(e, 'stats')}>
            О нас
          </Link>
          <Link href="#contacts" onClick={(e) => scrollToTarget(e, 'contacts')}>
            Контакты
          </Link>
        </nav>
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <a
            href={`tel:${siteConfig.phoneRaw}`}
            style={{ fontWeight: 'bold', fontSize: '18px' }}
          >
            {siteConfig.phone}
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            style={{ fontWeight: 'bold', fontSize: '16px' }}
          >
            {siteConfig.email}
          </a>
          <Button
            variant="primary"
            size="md"
            style={{ width: '100%' }}
            onClick={() => {
              closeMenu();
              onCallbackTrigger();
            }}
          >
            Обратный звонок
          </Button>
        </div>
      </div>
    </header>
  );
}
