"use client";

import React from 'react';
import Section from '../common/Section';
import Container from '../common/Container';
import Button from '../common/Button';
import styles from './AdvantagesSection.module.css';

type AdvantagesSectionProps = {
  onCtaTrigger: () => void;
};

export default function AdvantagesSection({ onCtaTrigger }: AdvantagesSectionProps) {
  const advantagesList = [
    {
      title: 'Собственное производство',
      desc: 'Производственная база в Новосибирске для изготовления воздуховодов и фасонных изделий с применением высокотехнологичного оборудования.',
      icon: (
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
          <path d="M22 10v6M2 10v6M12 4v16M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        </svg>
      ),
    },
    {
      title: 'Комплексный подход',
      desc: 'Оказываем услуги по расчету и изготовлению изделий, комплектации крепежными элементами и полимерной окраске.',
      icon: (
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
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Реализуемые проекты',
      desc: 'Изготавливаем типовые и нестандартные элементы в сжатые сроки.',
      icon: (
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
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: 'Контроль качества',
      desc: 'Проверяем геометрию, размеры и комплектность изделий перед отгрузкой заказа.',
      icon: (
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
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: 'Заботливый сервис',
      desc: 'Персональный менеджер сопровождает заказ от расчета спецификации до отгрузки готовой продукции.',
      icon: (
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <Section id="advantages" variant="gray">
      <Container>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>Почему выбирают нас</h2>
        </div>
        <div className={styles.grid}>
          {advantagesList.map((item, idx) => (
            <div key={idx} className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className={styles.ctaBlock}>
          <Button variant="primary" size="lg" onClick={onCtaTrigger}>
            Заказать
          </Button>
        </div>
      </Container>
    </Section>
  );
}
