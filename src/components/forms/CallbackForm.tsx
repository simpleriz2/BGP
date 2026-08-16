"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { validatePhone } from '../../lib/validation';
import Button from '../common/Button';
import { consentLabelText } from './PersonalDataConsent';
import styles from './Form.module.css';

type CallbackFormProps = {
  onSuccess?: () => void;
};

export default function CallbackForm({ onSuccess }: CallbackFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [isAgreed, setIsAgreed] = useState(true);
  
  // Anti-spam Honeypot
  const [honey, setHoney] = useState('');
  
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [agreementError, setAgreementError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setAgreementError(null);
    setSubmitError(null);

    // 1. Honeypot check
    if (honey) {
      setIsSuccess(true);
      return;
    }

    // 2. Validate phone
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    if (!isAgreed) {
      setAgreementError('Необходимо согласие на обработку персональных данных');
      return;
    }

    // 3. Submit request
    setIsLoading(true);
    try {
      const payload = {
        name: name.trim() || 'Анонимный клиент',
        phone: phone.trim(),
        message: time ? `Удобное время для звонка: ${time}` : 'Заказ обратного звонка',
        source: 'callback_modal',
      };

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Server returned error response');
      }

      setIsSuccess(true);
      setName('');
      setPhone('');
      setTime('');

      if (onSuccess) {
        setTimeout(onSuccess, 3000);
      }
    } catch (err) {
      console.error('Callback request failed:', err);
      setSubmitError('Не удалось заказать обратный звонок. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.successBanner} role="status">
        <h4 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
          Заявка принята!
        </h4>
        <p>Мы перезвоним вам в ближайшее время.</p>
      </div>
    );
  }

  return (
    <>
    <form onSubmit={handleSubmit} noValidate>
      {submitError && <div className={styles.errorBanner} role="alert">{submitError}</div>}

      {/* Honeypot field */}
      <div className={styles.honeypot}>
        <input
          type="text"
          name="email_verify"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Name (Optional) */}
      <div className={styles.formGroup}>
        <label htmlFor="callback-name" className={styles.label}>
          Ваше имя
        </label>
        <input
          type="text"
          id="callback-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          placeholder="Иван"
        />
      </div>

      {/* Phone (Required) */}
      <div className={styles.formGroup}>
        <label htmlFor="callback-phone" className={styles.label}>
          Номер телефона *
        </label>
        <input
          type="tel"
          id="callback-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`${styles.input} ${phoneError ? styles.errorInput : ''}`}
          placeholder="+7 (999) 999-99-99"
          required
        />
        {phoneError && <span className={styles.errorText}>{phoneError}</span>}
      </div>

      {/* Preferred Time (Optional) */}
      <div className={styles.formGroup}>
        <label htmlFor="callback-time" className={styles.label}>
          Удобное время для звонка (необязательно)
        </label>
        <input
          type="text"
          id="callback-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={styles.input}
          placeholder="Например, с 14:00 до 16:00"
        />
      </div>

      {/* Agreement Checkbox */}
      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="callback-agree"
          className={styles.checkbox}
          checked={isAgreed}
          onChange={(event) => {
            setIsAgreed(event.target.checked);
            setAgreementError(null);
          }}
          required
        />
        <Link
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.consentTrigger}
        >
          {consentLabelText} *
        </Link>
      </div>
      {agreementError && (
        <span className={`${styles.errorText} ${styles.agreementError}`} role="alert">
          {agreementError}
        </span>
      )}

      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        style={{ width: '100%', marginTop: '10px' }}
      >
        Заказать звонок
      </Button>
    </form>
    </>
  );
}
