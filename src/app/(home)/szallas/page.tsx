import { Metadata } from 'next';
import { AccommodationListPage } from '@/components/frontend/pages/AccommodationListPage';
import { siteConfig } from '@/config';
import { seoConfig } from '@/config/seo';

const { siteUrl } = siteConfig;

export const metadata: Metadata = {
  title: seoConfig.accommodationList.hu.title,
  description: seoConfig.accommodationList.hu.description,
  keywords: seoConfig.accommodationList.hu.keywords,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteUrl}/szallas`,
    languages: {
      en: `${siteUrl}/accommodation`,
      hu: `${siteUrl}/szallas`,
      de: `${siteUrl}/unterkunft`,
      'x-default': `${siteUrl}/accommodation`,
    },
  },
  openGraph: {
    title: seoConfig.accommodationList.hu.title,
    description: seoConfig.accommodationList.hu.description,
    url: `${siteUrl}/szallas`,
    type: 'website',
    images: [{ url: `${siteUrl}/lillybeth-logo.png`, width: 400, height: 400 }],
  },
  twitter: {
    card: 'summary',
    title: seoConfig.accommodationList.hu.title,
    description: seoConfig.accommodationList.hu.description,
    images: [`${siteUrl}/lillybeth-logo.png`],
  },
};

export default function AccommodationListPageHU() {
  return <AccommodationListPage routeLanguage="hu" />;
}
