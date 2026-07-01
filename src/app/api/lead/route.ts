import { NextResponse } from 'next/server';

const BITRIX_LEAD_ADD_METHOD = 'crm.lead.add.json';

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

function getBitrixLeadAddUrl(webhookUrl: string) {
  const trimmedUrl = webhookUrl.trim();

  if (!trimmedUrl) {
    return '';
  }

  if (/\/crm\.lead\.add(?:\.json)?(?:\?|$)/i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `${trimmedUrl.replace(/\/+$/, '')}/${BITRIX_LEAD_ADD_METHOD}`;
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequestBody;

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

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Имя и телефон обязательны для заполнения.' },
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
      pageUrl: page_url || null,
    });
    console.log('==================================================');

    const bitrixWebhookUrl = getStringValue(process.env.BITRIX24_WEBHOOK_URL);
    const bitrixLeadAddUrl = getBitrixLeadAddUrl(bitrixWebhookUrl);

    if (bitrixLeadAddUrl) {
      console.log('Forwarding lead to Bitrix24 CRM...');

      const response = await fetch(bitrixLeadAddUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bitrix24Payload),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error('Bitrix24 API responded with HTTP error:', {
          status: response.status,
          body: responseText,
        });
        throw new Error(`Bitrix24 API Error: ${response.status}`);
      }

      let responseData: BitrixResponse;
      try {
        responseData = JSON.parse(responseText) as BitrixResponse;
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

      console.log('Bitrix24 lead created successfully:', {
        leadId: responseData.result ?? null,
      });

      return NextResponse.json({
        success: true,
        message: 'Заявка успешно отправлена и зафиксирована в CRM.',
        leadId: responseData.result ?? null,
      });
    }

    console.log('Bitrix24 webhook URL is not configured. Returning local mock success.');
    return NextResponse.json({
      success: true,
      message: 'Заявка успешно зафиксирована на сервере (режим симуляции Битрикс24).',
      payload: bitrix24Payload,
    });
  } catch (error) {
    console.error('Lead processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Произошла внутренняя ошибка сервера при отправке лида.' },
      { status: 500 }
    );
  }
}
