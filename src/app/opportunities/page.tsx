import { Metadata } from 'next'
import ClientPart from './ClientPart'

export const metadata: Metadata = {
  title: 'Можливості | Знайди свою наступну подію на Мотиві*',
  description: 'Шукай, використовуй фільтри та звертай увагу на сповіщення, це все допоможе тобі знайти усе включаючи події, тренінги, лекції, подорожі та багато іншого.',
  openGraph: {
    title: 'Можливості | Знайди свою наступну подію на Мотиві*',
    description: 'Шукай, використовуй фільтри та звертай увагу на сповіщення, це все допоможе тобі знайти усе включаючи події, тренінги, лекції, подорожі та багато іншого.',
    type: 'website',
    images: [{
      url: 'https://ogcdn.net/b7b31a12-d94d-42be-a045-586a9c96a459/v2/og.png',
      width: 1200,
      height: 630,
      alt: 'Мотив*'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Можливості | Знайди свою наступну подію на Мотиві*`,
    description: `Шукай, використовуй фільтри та звертай увагу на сповіщення, це все допоможе тобі знайти усе включаючи події, тренінги, лекції, подорожі та багато іншого.`,
    images: 'https://ogcdn.net/b7b31a12-d94d-42be-a045-586a9c96a459/v2/og.png'
  }

}

export default function OpportunitiesPage() {
  return <ClientPart />
}