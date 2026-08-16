import type { Metadata } from "next";
import { Roboto, Open_Sans } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "cyrillic"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tt.hare.ge"),
  applicationName: "Технология-Сервис",
  title: "Производство воздуховодов в Новосибирске — ООО «Технология-Сервис»",
  description: "Изготовление оцинкованных и нержавеющих воздуховодов круглого и прямоугольного сечения, фасонных изделий и сопутствующих вентиляционных товаров. Быстрый расчет цены под объект.",
  keywords: ["воздуховоды", "производство воздуховодов", "вентиляция", "Новосибирск", "круглые воздуховоды", "прямоугольные воздуховоды", "фасонные изделия"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Технология-Сервис",
    title: "Производство воздуховодов в Новосибирске",
    description: "Воздуховоды и фасонные изделия собственного производства для объектов любой сложности.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Технология-Сервис",
    description: "Производство воздуховодов и фасонных изделий в Новосибирске.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${roboto.variable} ${openSans.variable}`}>
      <body style={{ fontFamily: "var(--font-open-sans), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
