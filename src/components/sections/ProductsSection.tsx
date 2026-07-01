"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Section from '../common/Section';
import Container from '../common/Container';
import { productsList, fittingsList, fittingsData } from '../../data/products';
import styles from './ProductsSection.module.css';

const FITTINGS_REPEAT = 15;
const FITTINGS_LENGTH = fittingsList.length;
const FITTINGS_START = Math.floor(FITTINGS_REPEAT / 2) * FITTINGS_LENGTH;
const FITTINGS_ITEMS = Array.from({ length: FITTINGS_REPEAT }, () => fittingsList).flat();

export default function ProductsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(FITTINGS_START);
  const [animated, setAnimated] = useState(true);

  const measureSlider = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const width = slider.offsetWidth;
    const viewportWidth = window.innerWidth;
    const visibleCards = viewportWidth < 640 ? 1 : viewportWidth < 1024 ? 2 : 4;
    setCardWidth(Math.max(Math.floor(width / visibleCards), 220));
  }, []);

  useEffect(() => {
    measureSlider();
    const resizeObserver = new ResizeObserver(measureSlider);

    if (sliderRef.current) {
      resizeObserver.observe(sliderRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [measureSlider]);

  useEffect(() => {
    if (!animated) {
      const timer = window.setTimeout(() => setAnimated(true), 20);
      return () => window.clearTimeout(timer);
    }
  }, [animated]);

  useEffect(() => {
    if (!animated) {
      return;
    }

    if (activeIndex >= FITTINGS_LENGTH && activeIndex < FITTINGS_LENGTH * (FITTINGS_REPEAT - 1)) {
      return;
    }

    const normalizedIndex =
      FITTINGS_LENGTH + ((activeIndex % FITTINGS_LENGTH) + FITTINGS_LENGTH) % FITTINGS_LENGTH;
    const timer = window.setTimeout(() => {
      setAnimated(false);
      setActiveIndex(normalizedIndex);
    }, 460);

    return () => window.clearTimeout(timer);
  }, [activeIndex, animated]);

  const goPrev = useCallback(() => {
    setAnimated(true);
    setActiveIndex((index) => index - 1);
  }, []);

  const goNext = useCallback(() => {
    setAnimated(true);
    setActiveIndex((index) => index + 1);
  }, []);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;

    if (!start || !touch) {
      return;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) {
      return;
    }

    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
  }, [goNext, goPrev]);

  const translateX = cardWidth > 0 ? -(activeIndex * cardWidth) : 0;

  return (
    <Section id="products" variant="light">
      <Container>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>ИЗГОТОВЛЕНИЕ ВОЗДУХОВОДОВ ПОД ВАШИ ЗАДАЧИ</h2>
        </div>

        {/* Duct Types List */}
        <div className={styles.productsGrid}>
          {productsList.map((product) => (
            <div key={product.id} className={styles.productRow}>
              {/* Product Image */}
              <div className={styles.productImgCol}>
                <Image
                  src={product.image}
                  alt={product.title}
                  width={500}
                  height={350}
                  className={styles.productImg}
                />
              </div>

              {/* Product Info */}
              <div className={styles.productTextCol}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                {product.description && (
                  <p className={styles.productDesc} style={{ whiteSpace: 'pre-wrap' }}>
                    {product.description}
                  </p>
                )}

                {/* Advantages */}
                {product.advantages && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 className={styles.listTitle}>Преимущества:</h4>
                    <ul className={styles.benefitList}>
                      {product.advantages.map((adv, idx) => (
                        <li key={idx} className={styles.benefitItem}>
                          <span className={styles.checkIcon}>✓</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disadvantages */}
                {product.disadvantages && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 className={styles.listTitle}>Недостатки:</h4>
                    <ul className={styles.benefitList}>
                      {product.disadvantages.map((dis, idx) => (
                        <li key={idx} className={styles.benefitItem}>
                          <span className={styles.crossIcon}>✕</span>
                          <span>{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Applications for Stainless Steel */}
                {product.applications && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 className={styles.listTitle}>Сферы применения:</h4>
                    <ul className={styles.benefitList}>
                      {product.applications.map((app, idx) => (
                        <li key={idx} className={styles.benefitItem}>
                          <span className={styles.checkIcon}>•</span>
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </Container>

      {/* Fittings / Shaped Elements shelf */}
      <div className={styles.fittingsBlock}>
        <Container>
          <div className={styles.fittingsInner}>
            <div className={styles.fittingsInfo}>
              <h3 className={styles.fittingsTitle}>{fittingsData.title}</h3>
              <p className={styles.fittingsDesc}>{fittingsData.description}</p>
            </div>

            <div className={styles.fittingsSliderShell}>
              <button
                type="button"
                className={`${styles.sliderArrow} ${styles.sliderArrowPrev}`}
                onClick={goPrev}
                aria-label="Предыдущий элемент"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={styles.sliderArrowIcon}
                >
                  <path d="M15 18 9 12l6-6" />
                </svg>
              </button>

              <div
                className={styles.fittingsViewport}
                ref={sliderRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {cardWidth > 0 && (
                  <div
                    className={styles.fittingsTrack}
                    style={{
                      transform: `translateX(${translateX}px)`,
                      transition: animated
                        ? 'transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)'
                        : 'none',
                    }}
                  >
                    {FITTINGS_ITEMS.map((fitting, index) => (
                    <article
                      className={`${styles.fittingSlide} ${fitting.id === 'plug_round' ? styles.fittingSlideCompactImage : ''}`}
                        key={`${fitting.id}-${index}`}
                        style={{ width: cardWidth }}
                      >
                        <div className={styles.fittingSlideImage}>
                          <Image
                            src={fitting.image}
                            alt={fitting.title}
                            fill
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                            className={styles.fittingImg}
                            priority={index >= FITTINGS_START && index < FITTINGS_START + 4}
                            unoptimized
                          />
                        </div>
                        <h4 className={styles.fittingCardTitle}>{fitting.title}</h4>
                        {fitting.desc ? <p className={styles.fittingCardDesc}>{fitting.desc}</p> : null}
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`${styles.sliderArrow} ${styles.sliderArrowNext}`}
                onClick={goNext}
                aria-label="Следующий элемент"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={styles.sliderArrowIcon}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
