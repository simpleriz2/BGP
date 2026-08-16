"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Paperclip, X } from 'lucide-react';
import { validateEmail, validateName, validatePhone } from '../../lib/validation';
import {
  LEAD_FILE_ACCEPT,
  MAX_LEAD_FILES,
  MAX_LEAD_FILE_SIZE,
  MAX_LEAD_FILES_TOTAL_SIZE,
  formatFileSize,
  isAllowedLeadFile,
} from '../../lib/file-upload';
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

type LeadApiResponse = {
  success?: boolean;
  error?: string;
  attachmentWarning?: string;
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
  const [files, setFiles] = useState<File[]>([]);
  const [isAgreed, setIsAgreed] = useState(true);
  
  // Anti-spam Honeypot
  const [honey, setHoney] = useState('');

  // Field validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    agreement?: string;
  }>({});
  const [fileError, setFileError] = useState<string | null>(null);

  // Submission lifecycle states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successWarning, setSuccessWarning] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = '';

    const nextFiles = [...files];
    selectedFiles.forEach((file) => {
      const isDuplicate = nextFiles.some(
        (currentFile) => currentFile.name === file.name && currentFile.size === file.size
      );
      if (!isDuplicate) {
        nextFiles.push(file);
      }
    });

    if (nextFiles.length > MAX_LEAD_FILES) {
      setFileError(`Можно прикрепить не более ${MAX_LEAD_FILES} файлов.`);
      return;
    }

    const unsupportedFile = nextFiles.find((file) => !isAllowedLeadFile(file.name));
    if (unsupportedFile) {
      setFileError(`Формат файла «${unsupportedFile.name}» не поддерживается.`);
      return;
    }

    const oversizedFile = nextFiles.find((file) => file.size > MAX_LEAD_FILE_SIZE);
    if (oversizedFile) {
      setFileError(
        `Файл «${oversizedFile.name}» больше ${formatFileSize(MAX_LEAD_FILE_SIZE)}.`
      );
      return;
    }

    const totalSize = nextFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_LEAD_FILES_TOTAL_SIZE) {
      setFileError(
        `Общий размер файлов не должен превышать ${formatFileSize(MAX_LEAD_FILES_TOTAL_SIZE)}.`
      );
      return;
    }

    setFileError(null);
    setFiles(nextFiles);
  };

  const removeFile = (fileIndex: number) => {
    setFiles((currentFiles) => currentFiles.filter((_, index) => index !== fileIndex));
    setFileError(null);
  };

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
    const agreementErr = isAgreed ? null : 'Необходимо согласие на обработку персональных данных';

    if (nameErr || phoneErr || emailErr || agreementErr || fileError) {
      setErrors({
        name: nameErr || undefined,
        phone: phoneErr || undefined,
        email: emailErr || undefined,
        agreement: agreementErr || undefined,
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

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });
      files.forEach((file) => formData.append('files', file, file.name));

      const response = await fetch('/api/lead', {
        method: 'POST',
        body: formData,
      });

      const responseData = (await response.json().catch(() => null)) as LeadApiResponse | null;

      if (!response.ok) {
        throw new Error(responseData?.error || 'Server returned an error response');
      }

      setSuccessWarning(responseData?.attachmentWarning || null);
      setIsSuccess(true);
      
      // Reset form fields
      setName('');
      setPhone('');
      setEmail('');
      setComment('');
      setFiles([]);

      // Trigger success callback
      if (onSuccess) {
        setTimeout(onSuccess, 3000);
      }
    } catch (err) {
      console.error('Lead submission failed:', err);
      setSubmitError(
        err instanceof Error && !err.message.startsWith('Server returned')
          ? err.message
          : 'Не удалось отправить заявку. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую по телефону.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.successBanner} role="status">
        <h4 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
          Спасибо за заявку!
        </h4>
        <p>Наш менеджер свяжется с вами в ближайшее время для уточнения деталей и точного расчета спецификации.</p>
        {successWarning && <p className={styles.successWarning}>{successWarning}</p>}
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
      {submitError && <div className={styles.errorBanner} role="alert">{submitError}</div>}

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

      {/* Attachments */}
      <div className={styles.attachmentGroup}>
        <input
          type="file"
          id={`files-${source}`}
          className={styles.fileInput}
          accept={LEAD_FILE_ACCEPT}
          multiple
          onChange={handleFileChange}
          aria-label="Прикрепить файлы"
        />
        <label
          htmlFor={`files-${source}`}
          className={styles.attachButton}
          title="Прикрепить файлы"
        >
          <Paperclip size={19} strokeWidth={2} aria-hidden="true" />
          <span className={styles.srOnly}>Прикрепить файлы</span>
        </label>
        {files.length > 0 && (
          <ul className={styles.fileList} aria-label="Выбранные файлы">
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}`} className={styles.fileItem}>
                <span className={styles.fileName} title={file.name}>
                  {file.name}
                </span>
                <button
                  type="button"
                  className={styles.removeFileButton}
                  onClick={() => removeFile(index)}
                  aria-label={`Удалить файл ${file.name}`}
                  title="Удалить файл"
                >
                  <X size={15} strokeWidth={2} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {fileError && (
          <span className={`${styles.errorText} ${styles.attachmentError}`} role="alert">
            {fileError}
          </span>
        )}
      </div>

      {/* Agreement Checkbox */}
      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id={`agree-${source}`}
          className={styles.checkbox}
          checked={isAgreed}
          onChange={(event) => {
            setIsAgreed(event.target.checked);
            setErrors((currentErrors) => ({ ...currentErrors, agreement: undefined }));
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
      {errors.agreement && (
        <span className={`${styles.errorText} ${styles.agreementError}`} role="alert">
          {errors.agreement}
        </span>
      )}

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
