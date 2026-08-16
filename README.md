# BGP Landing

Лендинг компании "Технология-Сервис" на Next.js.

## Что внутри

- Frontend лендинга.
- Backend endpoint `/api/lead` для отправки заявок в Bitrix24.
- Прикрепление чертежей и спецификаций к таймлайну созданного лида.
- Dockerfile и docker-compose для запуска в контейнере.
- Публичная страница политики: `/privacy`.

## Важно про Bitrix24

Webhook Bitrix24 не должен храниться во frontend-коде и не входит в Docker-образ.
Его нужно передавать на сервере через переменную окружения:

```env
BITRIX24_WEBHOOK_URL=https://your-bitrix24/rest/...
```

Если webhook не задан, production вернет `503`, чтобы сайт не показывал ложное сообщение об
успешной отправке. Для локальной проверки без Bitrix24 явно включите тестовый режим:

```env
LEAD_MOCK_MODE=true
```

Входящему вебхуку достаточно права `CRM`. Сайт использует методы `crm.lead.add` и
`crm.timeline.comment.add`. Дополнительный доступ к Диску не требуется.

Поддерживаемые вложения: PDF, DOC/DOCX, XLS/XLSX, JPG/JPEG, PNG, WEBP, DWG и DXF.
Можно приложить до 5 файлов по 10 МБ, суммарно до 30 МБ. ZIP не принимается.

## Запуск из Docker-образа релиза

1. Скачать архив образа из GitHub Releases:

   https://github.com/simpleriz2/BGP/releases/tag/v1.1.0

2. Загрузить образ:

```bash
gzip -dc bgp-landing-v1.1.0.tar.gz | docker load
```

3. Запустить контейнер:

```bash
docker run -d \
  --name bgp-landing-app \
  -p 3000:3000 \
  -e BITRIX24_WEBHOOK_URL="https://your-bitrix24/rest/..." \
  bgp-landing:v1.1.0
```

После запуска сайт будет доступен на `http://localhost:3000`.

## Запуск через docker compose

Создайте `.env.local` рядом с `docker-compose.yml`:

```env
BITRIX24_WEBHOOK_URL=https://your-bitrix24/rest/...
```

Запуск:

```bash
docker compose up -d --build
```

По умолчанию compose публикует приложение на `127.0.0.1:3002`, внутри контейнера используется порт `3000`.

Проверка:

```bash
curl -I http://127.0.0.1:3002
```

## Локальная разработка

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Открыть:

```text
http://localhost:3000
```

## Проверка перед публикацией

```bash
npm run lint
npm run build
```

## Reverse proxy

Для production reverse proxy должен вести на порт приложения.

Пример для compose-запуска:

```text
127.0.0.1:3002
```

Пример для прямого `docker run` из инструкции выше:

```text
127.0.0.1:3000
```
