import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './PrivacyPage.module.css';

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных — ООО «Технология-Сервис»',
  description: 'Политика ООО «Технология-Сервис» в отношении обработки персональных данных.',
};

function getPrivacyPolicyText() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'privacy-policy.txt');
  return fs.readFileSync(filePath, 'utf8').trim();
}

function renderPolicyBody(lines: string[]) {
  const sectionSixStart = lines.findIndex((line) =>
    line.startsWith('6. Цели обработки персональных данных')
  );
  const sectionSevenStart = lines.findIndex((line) =>
    line.startsWith('7. Условия обработки персональных данных')
  );

  if (sectionSixStart === -1 || sectionSevenStart === -1) {
    return lines.map((line, index) => (
      line.trim() ? <p key={index}>{line}</p> : <br key={index} />
    ));
  }

  const beforeSectionSix = lines.slice(0, sectionSixStart);
  const afterSectionSix = lines.slice(sectionSevenStart);

  return (
    <>
      {beforeSectionSix.map((line, index) => (
        line.trim() ? <p key={`before-${index}`}>{line}</p> : <br key={`before-${index}`} />
      ))}

      <section className={styles.processingGoals}>
        <h2>6. Цели обработки персональных данных</h2>
        <div className={styles.tableWrap}>
          <table className={styles.goalsTable}>
            <tbody>
              <tr>
                <th scope="row">Цель обработки</th>
                <td>информирование Пользователя посредством отправки электронных писем</td>
              </tr>
              <tr>
                <th scope="row">Персональные данные</th>
                <td>
                  <ul>
                    <li>фамилия, имя, отчество</li>
                    <li>электронный адрес</li>
                    <li>номера телефонов</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th scope="row">Правовые основания</th>
                <td>
                  <ul>
                    <li>
                      Федеральный закон «Об информации, информационных технологиях и о защите
                      информации» от 27.07.2006 N 149-ФЗ
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th scope="row">Виды обработки персональных данных</th>
                <td>
                  <ul>
                    <li>
                      Сбор, запись, систематизация, накопление, хранение, уничтожение и
                      обезличивание персональных данных
                    </li>
                    <li>Отправка информационных писем на адрес электронной почты</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {afterSectionSix.map((line, index) => (
        line.trim() ? <p key={`after-${index}`}>{line}</p> : <br key={`after-${index}`} />
      ))}
    </>
  );
}

export default function PrivacyPage() {
  const policyText = getPrivacyPolicyText();
  const [title, ...bodyLines] = policyText.split(/\r?\n/);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topbar}>
          <Link href="/" className={styles.logoLink}>
            Технология
          </Link>
          <Link href="/" className={styles.backLink}>
            На главную
          </Link>
        </div>

        <article className={styles.document}>
          <h1>{title}</h1>
          <div className={styles.text}>{renderPolicyBody(bodyLines)}</div>
        </article>
      </div>
    </main>
  );
}
