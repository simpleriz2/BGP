"use client";

import React from 'react';
import Section from '../common/Section';
import Container from '../common/Container';
import { statsList } from '../../data/stats';
import styles from './StatsSection.module.css';

export default function StatsSection() {
  return (
    <Section id="stats" variant="gray" className={styles.statsSection}>
      <Container>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>«Технология-Сервис» в цифрах</h2>
        </div>
        <div className={styles.grid}>
          {statsList.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <div className={styles.num}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
