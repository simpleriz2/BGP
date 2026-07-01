import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '../../data/site';
import Container from '../common/Container';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          {/* Logo & Description */}
          <div className={styles.logoCol}>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/logo-symbol-v2.png"
                alt="Технология"
                width={101}
                height={67}
                className={styles.logoImg}
              />
            </div>
            <p className={styles.desc}>
              Производство воздуховодов и фасонных элементов для вентиляционных систем любой сложности.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.title}>Навигация</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/#products">Продукция</Link>
              </li>
              <li>
                <Link href="/#stats">О нас</Link>
              </li>
              <li>
                <Link href="/#contacts">Контакты</Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className={styles.title}>Контакты</h4>
            <ul className={styles.contactsList}>
              <li className={styles.contactItem}>
                <span>📍</span>
                <div>
                  <p style={{ color: '#ffffff', fontWeight: 'bold' }}>Офис / Склад</p>
                  <p>{siteConfig.address}</p>
                </div>
              </li>
              <li className={styles.contactItem}>
                <span>📞</span>
                <a href={`tel:${siteConfig.phoneRaw}`} className={styles.contactLink}>
                  {siteConfig.phone}
                </a>
              </li>
              <li className={styles.contactItem}>
                <span>✉️</span>
                <a href={`mailto:${siteConfig.email}`} className={styles.contactLink}>
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Requisites */}
          <div>
            <h4 className={styles.title}>Реквизиты</h4>
            <div className={styles.requisites}>
              <p><strong>{siteConfig.fullName}</strong></p>
              <p>ИНН: {siteConfig.inn}</p>
              <p>КПП: {siteConfig.kpp}</p>
              <p>ОГРН: {siteConfig.ogrn} (от {siteConfig.ogrnDate})</p>
              <p>Р/с: {siteConfig.rs}</p>
              <p>К/с: {siteConfig.ks}</p>
              <p>БИК: {siteConfig.bik}</p>
              <p>Банк: {siteConfig.bank}</p>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} ООО «{siteConfig.companyName}». Все права защищены.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Политика конфиденциальности</Link>
            <Link href="/privacy">Согласие на обработку данных</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
