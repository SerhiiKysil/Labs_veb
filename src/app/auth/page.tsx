export const metadata = {
  title: 'Вхід | мотив*',
  description: 'Увійди до мотив*, щоб отримати доступ до можливостей для молоді: тренінги, курси, обміни, стажування та волонтерства. Знайди свою наступну пригоду!',
  openGraph: {
    title: 'Вхід | мотив*',
    description: 'Увійди до мотив*, щоб отримати доступ до найкращих можливостей для розвитку та нових знайомств.',
    images: ['https://motyv.space/images/default.jpg'],
    type: 'website',
  },
};

import ClientPart from './ClientPart';

export default function LoginPage() {
  return <ClientPart />;
}