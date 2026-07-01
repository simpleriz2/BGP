"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { validateEmail, validateName, validatePhone } from '../../lib/validation';
import Button from '../common/Button';
import { consentLabelText } from './PersonalDataConsent';
import styles from './Form.module.css';

type LeadFormProps = {
  source: string; // Tells backend where the form was submitted from
  productContext?: string; // Optional name of the product being ordered
  onSuccess?: () => void; // Optional callback on successful submit
  theme?: 'light' | 'dark';
  submitLabel?: string;
  commentLabel?: string;
  commentPlaceholder?: string;
};

function getTrackingParams() {
  if (typeof window === 'undefined') {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  utmKeys.forEach((key) => {
    const val = searchParams.get(key);
    if (val) {
      params[key] = val;
    }
  });

  params.referrer = document.referrer || '';
  params.page_url = window.location.href;

  return params;
}

export default function LeadForm({
  source,
  productContext,
  onSuccess,
  theme = 'light',
  submitLabel = 'Отправить заявку',
  commentLabel = 'Комментарий / Объект (необязательно)',
  commentPlaceholder = 'Укажите количество, сечение или особенности вашего объекта',
}: LeadFormProps) {
  // Input fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  
  // Anti-spam Honeypot
  const [honey, setHoney] = useState('');

  // Field validation errors
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  // Submission lifecycle states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    // 1. Honeypot check (prevent automated bots)
    if (honey) {
      // Fail silently to the bot
      setIsSuccess(true);
      return;
    }

    // 2. Validate inputs
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const emailErr = validateEmail(email);

    if (nameErr || phoneErr || emailErr) {
      setErrors({
        name: nameErr || undefined,
        phone: phoneErr || undefined,
        email: emailErr || undefined,
      });
      return;
    }

    // 3. Perform submission
    setIsLoading(true);
    try {
      const payload = {
        name,
        phone,
        email,
        message: comment,
        source,
        product: productContext || '',
        ...getTrackingParams(),
      };

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Server returned an error response');
      }

      setIsSuccess(true);
      
      // Reset form fields
      setName('');
      setPhone('');
      setEmail('');
      setComment('');

      // Trigger success callback
      if (onSuccess) {
        setTimeout(onSuccess, 3000);
      }
    } catch (err) {
      console.error('Lead submission failed:', err);
      setSubmitError(
        'Не удалось отправить заявку. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую по телефону.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.successBanner}>
        <h4 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
          Спасибо за заявку!
        </h4>
        <p>Наши инженеры свяжутся с вами в ближайшее время для уточнения деталей и точного расчета спецификации.</p>
      </div>
    );
  }

  return (
    <>
    <form
      onSubmit={handleSubmit}
      className={theme === 'dark' ? styles.darkForm : ''}
      noValidate
    >
      {submitError && <div className={styles.errorBanner}>{submitError}</div>}

      {/* Honeypot anti-spam field */}
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

      {/* Name Field */}
      <div className={styles.formGroup}>
        <label htmlFor={`name-${source}`} className={styles.label}>
          Ваше имя *
        </label>
        <input
          type="text"
          id={`name-${source}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
          placeholder="Иван Иванов"
          required
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      {/* Phone Field */}
      <div className={styles.formGroup}>
        <label htmlFor={`phone-${source}`} className={styles.label}>
          Номер телефона *
        </label>
        <input
          type="tel"
          id={`phone-${source}`}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
          placeholder="+7 (999) 999-99-99"
          required
        />
        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
      </div>

      {/* Email Field */}
      <div className={styles.formGroup}>
        <label htmlFor={`email-${source}`} className={styles.label}>
          E-mail
        </label>
        <input
          type="email"
          id={`email-${source}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
          placeholder="mail@example.ru"
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      {/* Comment Field */}
      <div className={styles.formGroup}>
        <label htmlFor={`comment-${source}`} className={styles.label}>
          {commentLabel}
        </label>
        <textarea
          id={`comment-${source}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={styles.textarea}
          placeholder={commentPlaceholder}
          rows={3}
        />
      </div>

      {/* Agreement Checkbox */}
      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id={`agree-${source}`}
          className={styles.checkbox}
          defaultChecked
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

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        style={{ width: '100%' }}
      >
        {submitLabel}
      </Button>
    </form>
    </>
  );
}
