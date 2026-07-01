"use client";

import React from 'react';
import Container from '../common/Container';
import Button from '../common/Button';
import styles from './HeroSection.module.css';

type HeroSectionProps = {
  onCtaTrigger: () => void;
};

export default function HeroSection({ onCtaTrigger }: HeroSectionProps) {
  const leadBullet = 'когда важен не каталог, а решение';
  const bullets = ['точно в срок', 'по честным ценам', 'без бюрократии'];

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url('/images/label-bg.webp')` }}
    >
      <div className={styles.overlay} />
      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Производим воздуховоды для ваших объектов
          </h1>
          <div className={styles.bullets}>
            <div className={styles.leadBullet}>{leadBullet}</div>
            <div className={styles.bulletGroup}>
              {bullets.map((bullet, idx) => (
                <div key={idx} className={styles.bullet}>
                  <span className={styles.checkMark} aria-hidden="true">✓</span>
                  {bullet}
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            className={styles.ctaBtn}
            onClick={onCtaTrigger}
          >
            Рассчитать стоимость
          </Button>
        </div>
      </Container>
    </section>
  );
}
