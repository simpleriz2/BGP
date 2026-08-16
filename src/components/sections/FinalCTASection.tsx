"use client";

import React from 'react';
import { siteConfig } from '../../data/site';
import Container from '../common/Container';
import LeadForm from '../forms/LeadForm';
import styles from './FinalCTASection.module.css';

export default function FinalCTASection() {
  return (
    <section id="contacts" className={styles.section}>
      <Container>
        <div className={styles.content}>
          {/* Left Column: Contact Cards */}
          <div className={styles.infoCol}>
            <h2 className={styles.mainTitle}>Свяжитесь с нами</h2>
            <p className={styles.desc}>
              Мы всегда готовы помочь в выборе воздуховодов, которые идеально подойдут для вашего проекта. Оставьте заявку, и наши специалисты свяжутся с вами в ближайшее время.
            </p>

            <div className={styles.contactCards}>
              {/* Address Card */}
              <div className={styles.contactCard}>
                <div className={styles.cardIcon}>📍</div>
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>Производство и склад</span>
                  <span className={styles.cardValue}>{siteConfig.address}</span>
                </div>
              </div>

              {/* Phone Card */}
              <div className={styles.contactCard}>
                <div className={styles.cardIcon}>📞</div>
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>Телефон отдела продаж</span>
                  <span className={styles.cardValue}>
                    <a href={`tel:${siteConfig.phoneRaw}`}>{siteConfig.phone}</a>
                  </span>
                </div>
              </div>

              {/* Email Card */}
              <div className={styles.contactCard}>
                <div className={styles.cardIcon}>✉️</div>
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>Email для заявок и спецификаций</span>
                  <span className={styles.cardValue}>
                    <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inline Lead Form */}
          <div className={styles.formCol}>
            <h3 className={styles.formTitle}>Отправить заявку</h3>
            <LeadForm source="footer_cta" theme="light" />
          </div>
        </div>
      </Container>
    </section>
  );
}
