"use client";

import React, { useState, useEffect } from 'react';
import styles from './FloatingContactWidget.module.css';

type FloatingContactWidgetProps = {
  onCallbackTrigger: () => void;
  onMessageTrigger: () => void;
};

export default function FloatingContactWidget({
  onCallbackTrigger,
  onMessageTrigger,
}: FloatingContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrollVisible, setIsScrollVisible] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrollVisible(true);
      } else {
        setIsScrollVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.widgetContainer}>
      {/* Expanded Actions Dock */}
      <div className={`${styles.dock} ${isOpen ? styles.open : ''}`}>
        {/* Email Shortcut */}
        <div className={styles.fabContainer}>
          <button
            type="button"
            className={`${styles.fab} ${styles.mailBtn}`}
            onClick={() => {
              onMessageTrigger();
              setIsOpen(false);
            }}
            aria-label="Написать на email"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </button>
          <span className={styles.tooltip}>Написать письмо</span>
        </div>

        {/* Callback Trigger */}
        <div className={styles.fabContainer}>
          <button
            type="button"
            className={`${styles.fab} ${styles.phoneBtn}`}
            onClick={() => {
              onCallbackTrigger();
              setIsOpen(false);
            }}
            aria-label="Заказать обратный звонок"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
          <span className={styles.tooltip}>Обратный звонок</span>
        </div>
      </div>

      {/* Main Persistent Float Trigger */}
      <button
        type="button"
        className={`${styles.fab} ${styles.triggerBtn} ${isOpen ? styles.open : ''}`}
        onClick={toggleOpen}
        aria-label="Контакты быстрого доступа"
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <span className={styles.triggerIcon}>
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
        )}
      </button>

      {/* Scroll to Top */}
      <button
        type="button"
        className={`${styles.fab} ${styles.scrollTopBtn} ${isScrollVisible ? styles.visible : ''}`}
        onClick={scrollToTop}
        aria-label="Вверх страницы"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}
