import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Технология-Сервис — производство воздуховодов',
    short_name: 'Технология-Сервис',
    description: 'Производство воздуховодов и фасонных изделий в Новосибирске.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f1f5f9',
    theme_color: '#172554',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
