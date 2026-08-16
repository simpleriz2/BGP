import { NextResponse } from 'next/server';
import {
  MAX_LEAD_FILES,
  MAX_LEAD_FILE_SIZE,
  MAX_LEAD_FILES_TOTAL_SIZE,
  formatFileSize,
  isAllowedLeadFile,
} from '../../../lib/file-upload';
import { validateEmail, validateName, validatePhone } from '../../../lib/validation';

export const runtime = 'nodejs';

const MAX_REQUEST_SIZE = 32 * 1024 * 1024;

type LeadRequestBody = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  source?: string;
  product?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  page_url?: string;
};

type BitrixResponse = {
  result?: number;
  error?: string;
  error_description?: string;
};

type ParsedLeadRequest = LeadRequestBody & {
  files: File[];
};

class LeadRequestError extends Error {
  constructor(
    message: string,
    readonly status = 400
  ) {
    super(message);
  }
}

function getBitrixMethodUrl(webhookUrl: string, method: string) {
  const trimmedUrl = webhookUrl.trim();

  if (!trimmedUrl) {
    return '';
  }

  const webhookBaseUrl = trimmedUrl
    .replace(/\/crm\.lead\.add(?:\.json)?(?:\?.*)?$/i, '')
    .replace(/\/+$/, '');

  return `${webhookBaseUrl}/${method}.json`;
}

function getStringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function getLeadTitle(source: string, product: string) {
  if (source === 'callback_modal') {
    return 'Запрос обратного звонка с сайта';
  }

  if (source === 'quick_message') {
    return 'Сообщение с сайта';
  }

  if (product) {
    return `Заявка с сайта: ${product}`;
  }

  return 'Заявка с сайта';
}

function sanitizeFileName(fileName: string) {
  const baseName = fileName.split(/[\\/]/).pop() || 'file';
  return baseName.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 150) || 'file';
}

function validateFiles(files: File[]) {
  if (files.length > MAX_LEAD_FILES) {
    throw new LeadRequestError(`Можно прикрепить не более ${MAX_LEAD_FILES} файлов.`);
  }

  let totalSize = 0;

  files.forEach((file) => {
    if (!file.size) {
      throw new LeadRequestError(`Файл «${sanitizeFileName(file.name)}» пустой.`);
    }

    if (!isAllowedLeadFile(file.name)) {
      throw new LeadRequestError(`Формат файла «${sanitizeFileName(file.name)}» не поддерживается.`);
    }

    if (file.size > MAX_LEAD_FILE_SIZE) {
      throw new LeadRequestError(
        `Файл «${sanitizeFileName(file.name)}» больше ${formatFileSize(MAX_LEAD_FILE_SIZE)}.`,
        413
      );
    }

    totalSize += file.size;
  });

  if (totalSize > MAX_LEAD_FILES_TOTAL_SIZE) {
    throw new LeadRequestError(
      `Общий размер файлов не должен превышать ${formatFileSize(MAX_LEAD_FILES_TOTAL_SIZE)}.`,
      413
    );
  }
}

async function parseLeadRequest(request: Request): Promise<ParsedLeadRequest> {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_SIZE) {
    throw new LeadRequestError('Размер запроса превышает допустимый лимит.', 413);
  }

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const files = formData
      .getAll('files')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    validateFiles(files);

    return {
      name: getStringValue(formData.get('name')),
      phone: getStringValue(formData.get('phone')),
      email: getStringValue(formData.get('email')),
      message: getStringValue(formData.get('message')),
      source: getStringValue(formData.get('source')),
      product: getStringValue(formData.get('product')),
      utm_source: getStringValue(formData.get('utm_source')),
      utm_medium: getStringValue(formData.get('utm_medium')),
      utm_campaign: getStringValue(formData.get('utm_campaign')),
      utm_content: getStringValue(formData.get('utm_content')),
      utm_term: getStringValue(formData.get('utm_term')),
      referrer: getStringValue(formData.get('referrer')),
      page_url: getStringValue(formData.get('page_url')),
      files,
    };
  }

  if (!contentType.includes('application/json')) {
    throw new LeadRequestError('Неподдерживаемый формат запроса.', 415);
  }

  const body = (await request.json()) as LeadRequestBody;
  return { ...body, files: [] };
}

async function callBitrix<T extends BitrixResponse>(
  url: string,
  payload: unknown
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error('Bitrix24 API responded with HTTP error:', {
      status: response.status,
      body: responseText,
    });
    throw new Error(`Bitrix24 API Error: ${response.status}`);
  }

  let responseData: T;
  try {
    responseData = JSON.parse(responseText) as T;
  } catch {
    console.error('Bitrix24 API returned non-JSON response.');
    throw new Error('Bitrix24 API returned non-JSON response');
  }

  if (responseData.error) {
    console.error('Bitrix24 API returned application error:', {
      error: responseData.error,
      description: responseData.error_description,
    });
    throw new Error('Bitrix24 API returned an error');
  }

  return responseData;
}

export async function POST(request: Request) {
  try {
    const body = await parseLeadRequest(request);
    const files = body.files;

    const name = getStringValue(body.name);
    const phone = getStringValue(body.phone);
    const email = getStringValue(body.email);
    const message = getStringValue(body.message);
    const source = getStringValue(body.source) || 'direct';
    const product = getStringValue(body.product);
    const utm_source = getStringValue(body.utm_source);
    const utm_medium = getStringValue(body.utm_medium);
    const utm_campaign = getStringValue(body.utm_campaign);
    const utm_content = getStringValue(body.utm_content);
    const utm_term = getStringValue(body.utm_term);
    const referrer = getStringValue(body.referrer);
    const page_url = getStringValue(body.page_url);

    const validationError = validateName(name) || validatePhone(phone) || validateEmail(email);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    let leadComments = message;
    if (product) {
      leadComments += `\nИнтересующий продукт/раздел: ${product}`;
    }
    if (email) {
      leadComments += `\nE-mail: ${email}`;
    }
    leadComments += '\n\n--- Дополнительная информация ---';
    leadComments += `\nИсточник формы на странице: ${source}`;
    if (page_url) leadComments += `\nСтраница отправки: ${page_url}`;
    if (referrer) leadComments += `\nРеферер: ${referrer}`;

    const bitrix24Payload = {
      fields: {
        TITLE: getLeadTitle(source, product),
        NAME: name,
        SOURCE_ID: 'WEB',
        PHONE: [
          {
            VALUE: phone,
            VALUE_TYPE: 'WORK',
          },
        ],
        ...(email
          ? {
              EMAIL: [
                {
                  VALUE: email,
                  VALUE_TYPE: 'WORK',
                },
              ],
            }
          : {}),
        COMMENTS: leadComments.trim(),
        UTM_SOURCE: utm_source,
        UTM_MEDIUM: utm_medium,
        UTM_CAMPAIGN: utm_campaign,
        UTM_CONTENT: utm_content,
        UTM_TERM: utm_term,
      },
    };

    console.log('==================================================');
    console.log('NEW LEAD RECEIVED (OOO "Technologiya-Service")');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Lead meta:', {
      source,
      product: product || null,
      hasEmail: Boolean(email),
      hasMessage: Boolean(message),
      fileCount: files.length,
      pageUrl: page_url || null,
    });
    console.log('==================================================');

    const bitrixWebhookUrl = getStringValue(process.env.BITRIX24_WEBHOOK_URL);
    const bitrixLeadAddUrl = getBitrixMethodUrl(bitrixWebhookUrl, 'crm.lead.add');

    if (bitrixLeadAddUrl) {
      console.log('Forwarding lead to Bitrix24 CRM...');

      const responseData = await callBitrix<BitrixResponse>(bitrixLeadAddUrl, bitrix24Payload);
      const leadId = responseData.result;

      console.log('Bitrix24 lead created successfully:', {
        leadId: leadId ?? null,
      });

      let attachmentWarning: string | undefined;

      if (files.length && leadId) {
        try {
          const preparedFiles = await Promise.all(
            files.map(async (file) => [
              sanitizeFileName(file.name),
              Buffer.from(await file.arrayBuffer()).toString('base64'),
            ])
          );

          await callBitrix(
            getBitrixMethodUrl(bitrixWebhookUrl, 'crm.timeline.comment.add'),
            {
              fields: {
                ENTITY_ID: leadId,
                ENTITY_TYPE: 'lead',
                COMMENT: 'Файлы, прикреплённые к заявке с сайта',
                FILES: preparedFiles,
              },
            }
          );

          console.log('Lead files attached successfully:', { leadId, fileCount: files.length });
        } catch (attachmentError) {
          console.error('Lead was created, but file attachment failed:', attachmentError);
          attachmentWarning =
            'Заявка создана, но файлы не удалось прикрепить. Менеджер свяжется с вами для уточнения.';
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Заявка успешно отправлена и зафиксирована в CRM.',
        leadId: leadId ?? null,
        attachmentWarning,
      });
    }

    if (process.env.LEAD_MOCK_MODE === 'true') {
      console.log('Bitrix24 webhook URL is not configured. Returning explicit mock success.');
      return NextResponse.json({
        success: true,
        message: 'Заявка успешно зафиксирована на сервере (режим симуляции Битрикс24).',
        payload: bitrix24Payload,
        files: files.map((file) => ({ name: sanitizeFileName(file.name), size: file.size })),
      });
    }

    console.error('Bitrix24 webhook URL is not configured. Lead was not sent.');
    return NextResponse.json(
      {
        success: false,
        error: 'Сервис отправки заявок временно недоступен. Пожалуйста, свяжитесь с нами по телефону.',
      },
      { status: 503 }
    );
  } catch (error) {
    if (error instanceof LeadRequestError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }

    console.error('Lead processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Произошла внутренняя ошибка сервера при отправке лида.' },
      { status: 500 }
    );
  }
}
