export function validateName(name: string): string | null {
  if (!name.trim()) {
    return 'Пожалуйста, введите ваше имя';
  }
  if (name.trim().length < 2) {
    return 'Имя должно содержать не менее 2 символов';
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) {
    return 'Пожалуйста, введите номер телефона';
  }
  
  // Basic validation for Russian phone format: fits +7 (xxx) xxx-xx-xx, 8xxx..., +7xxx...
  // Clean all characters except digits and plus sign
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Minimum length of digits (Russian numbers usually have 11 digits: e.g. 8913... or +7913...)
  const digitCount = cleanPhone.replace(/\D/g, '').length;
  
  if (digitCount < 10 || digitCount > 12) {
    return 'Некорректный формат телефона. Пример: +7 (999) 999-99-99';
  }
  
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return null;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmedEmail)) {
    return 'Некорректный формат e-mail';
  }

  return null;
}
