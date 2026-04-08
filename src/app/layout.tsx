import Layout from '@/components/commons/Layout';
import GlobalErrorModalProvider from '@/components/commons/Modal/GlobalErrorModalProvider';
import Toast from '@/components/commons/Toast';
import '@/styles/globals.css';
import { Metadata } from 'next';
import PreloadResources from './preload/resources';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'JAMMIT - 밴드 모임 플랫폼',
  icons: {
    icon: '/images/favicon.ico',
  },
  description:
    'JAMMIT은 밴드 모임을 위한 플랫폼입니다. 밴드원을 찾고, 모임을 만들고, 음악을 공유하세요.',
  keywords: '밴드, 모임, 음악, 밴드원 구인, 밴드원 구직, 밴드 모임',
  openGraph: {
    title: 'JAMMIT - 밴드 모임 플랫폼',
    description:
      'JAMMIT은 밴드 모임을 위한 플랫폼입니다. 밴드원을 찾고, 모임을 만들고, 음악을 공유하세요.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'JAMMIT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JAMMIT - 밴드 모임 플랫폼',
    description:
      'JAMMIT은 밴드 모임을 위한 플랫폼입니다. 밴드원을 찾고, 모임을 만들고, 음악을 공유하세요.',
  },
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <PreloadResources />
      </head>
      <body>
        <div id="modal-root">
          <GlobalErrorModalProvider />
          <Toast />
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </div>
      </body>
    </html>
  );
}
