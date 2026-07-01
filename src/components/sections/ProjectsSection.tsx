"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Section from '../common/Section';
import Container from '../common/Container';
import { projectsList } from '../../data/projects';
import styles from './ProjectsSection.module.css';

const MOBILE_REPEATS = 3;
const mobileProjects = Array.from({ length: MOBILE_REPEATS }, () => projectsList).flat();

export default function ProjectsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const normalizeMobileScroll = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider || window.innerWidth >= 768) {
      return;
    }

    const segmentWidth = slider.scrollWidth / MOBILE_REPEATS;

    if (segmentWidth <= 0) {
      return;
    }

    if (slider.scrollLeft < segmentWidth * 0.35) {
      slider.scrollLeft += segmentWidth;
    } else if (slider.scrollLeft > segmentWidth * 1.65) {
      slider.scrollLeft -= segmentWidth;
    }
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const setMiddleSegment = () => {
      if (window.innerWidth >= 768) {
        slider.scrollLeft = 0;
        return;
      }

      const middleCard = slider.children[projectsList.length] as HTMLElement | undefined;
      slider.scrollLeft = middleCard
        ? middleCard.offsetLeft - (slider.clientWidth - middleCard.offsetWidth) / 2
        : slider.scrollWidth / MOBILE_REPEATS;
    };

    const frame = window.requestAnimationFrame(setMiddleSegment);
    window.addEventListener('resize', setMiddleSegment);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', setMiddleSegment);
    };
  }, []);

  return (
    <Section id="projects" variant="light">
      <Container>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>
            Наши воздуховоды доставляют чистый воздух на знаковых объектах Новосибирска, таких как:
          </h2>
        </div>
        <div className={styles.grid} ref={sliderRef} onScroll={normalizeMobileScroll}>
          {mobileProjects.map((project, idx) => {
            const isDuplicate = idx < projectsList.length || idx >= projectsList.length * 2;

            return (
            <div
              key={`${project.title}-${idx}`}
              className={`${styles.card} ${isDuplicate ? styles.duplicateCard : ''}`}
              aria-hidden={isDuplicate}
            >
              {project.image ? (
                <div className={styles.imageWrap}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className={styles.image}
                  />
                </div>
              ) : null}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
              </div>
            </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
