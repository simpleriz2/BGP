# BGP Landing

Landing page for ООО "Технология-Сервис" built with Next.js.

## Requirements

- Node.js 22+
- Docker and Docker Compose plugin

## Local Development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` locally or provide the same variable in the server environment:

```env
BITRIX24_WEBHOOK_URL=https://your-bitrix24/rest/...
```

The webhook URL must stay on the backend only. Do not expose it in frontend code.

If `BITRIX24_WEBHOOK_URL` is not set, `/api/lead` returns a mock success and does not send leads to Bitrix24.

## Docker

Build and run:

```bash
docker compose up -d --build
```

The app listens on `127.0.0.1:3002` on the host and port `3000` inside the container.

Check:

```bash
curl -I http://127.0.0.1:3002
```

## Production Notes

- Store `.env.local` or equivalent env file outside the repository.
- Keep `BITRIX24_WEBHOOK_URL` secret.
- Reverse proxy should point to `127.0.0.1:3002`.
- `/api/lead` accepts form submissions and forwards them to Bitrix24 via `crm.lead.add.json`.

## Scripts

```bash
npm run lint
npm run build
npm run start
```
