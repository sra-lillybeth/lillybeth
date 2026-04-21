import { Metadata } from 'next';
import { AccommodationListPage } from '@/components/frontend/pages/AccommodationListPage';
import { siteConfig } from '@/config';
import { seoConfig } from '@/config/seo';

const { siteUrl } = siteConfig;

export const metadata: Metadata = {
  title: seoConfig.accommodationList.de.title,
  description: seoConfig.accommodationList.de.description,
  keywords: seoConfig.accommodationList.de.keywords,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteUrl}/unterkunft`,
    languages: {
      en: `${siteUrl}/accommodation`,
      hu: `${siteUrl}/szallas`,
      de: `${siteUrl}/unterkunft`,
      'x-default': `${siteUrl}/accommodation`,
    },
  },
  openGraph: {
    title: seoConfig.accommodationList.de.title,
    description: seoConfig.accommodationList.de.description,
    url: `${siteUrl}/unterkunft`,
    type: 'website',
    images: [{ url: `${siteUrl}/lillybeth-logo.png`, width: 400, height: 400 }],
  },
  twitter: {
    card: 'summary',
    title: seoConfig.accommodationList.de.title,
    description: seoConfig.accommodationList.de.description,
    images: [`${siteUrl}/lillybeth-logo.png`],
  },
};

export default function AccommodationListPageDE() {
  return <AccommodationListPage routeLanguage="de" />;
}
