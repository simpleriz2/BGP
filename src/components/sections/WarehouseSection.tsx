"use client";

import React from 'react';
import Image from 'next/image';
import Section from '../common/Section';
import Container from '../common/Container';
import Button from '../common/Button';
import { warehouseData, relatedGoodsData } from '../../data/products';
import styles from './WarehouseSection.module.css';

type WarehouseSectionProps = {
  onCtaTrigger: (subject?: string) => void;
};

export default function WarehouseSection({ onCtaTrigger }: WarehouseSectionProps) {
  return (
    <Section id="warehouse" variant="light">
      <Container>
        <div className={styles.grid}>
          {/* Warehouse Card */}
          <div className={styles.card}>
            <div className={styles.imgWrapper}>
              <Image
                src={warehouseData.image}
                alt={warehouseData.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.img}
              />
            </div>
            <h3 className={styles.cardTitle}>{warehouseData.title}</h3>
            <p className={styles.cardDesc} style={{ whiteSpace: 'pre-wrap' }}>{warehouseData.description}</p>
          </div>

          {/* Related Goods Card */}
          <div className={styles.card}>
            <div className={styles.imgWrapper}>
              <Image
                src={relatedGoodsData.image}
                alt={relatedGoodsData.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.img}
              />
            </div>
            <h3 className={styles.cardTitle}>{relatedGoodsData.title}</h3>
            <p className={styles.cardDesc} style={{ whiteSpace: 'pre-wrap' }}>{relatedGoodsData.description}</p>
          </div>
        </div>

        <div className={styles.action}>
          <Button
            className={styles.warehouseButton}
            onClick={() => onCtaTrigger('Склад готовой продукции и сопутствующие товары')}
          >
            Заказать
          </Button>
        </div>
      </Container>
    </Section>
  );
}
