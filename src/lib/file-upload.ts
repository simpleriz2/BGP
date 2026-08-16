export const MAX_LEAD_FILES = 5;
export const MAX_LEAD_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_LEAD_FILES_TOTAL_SIZE = 30 * 1024 * 1024;

export const ALLOWED_LEAD_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.dwg',
  '.dxf',
] as const;

export const LEAD_FILE_ACCEPT = ALLOWED_LEAD_FILE_EXTENSIONS.join(',');

export function getFileExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
}

export function isAllowedLeadFile(fileName: string) {
  return ALLOWED_LEAD_FILE_EXTENSIONS.includes(
    getFileExtension(fileName) as (typeof ALLOWED_LEAD_FILE_EXTENSIONS)[number]
  );
}

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} КБ`;
  }

  return `${(size / (1024 * 1024)).toFixed(1).replace('.0', '')} МБ`;
}
