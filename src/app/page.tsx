import React from 'react'; 
import Navbar from './components/layout/Navbar';
import Banner from './components/index/Banner';
import MainContent from './components/index/MainContent';
import SupportSection from './components/index/SupportSection';
import Footer from './components/layout/Footer';
import PartnersSection from './components/index/PartnerSection';
export const metadata = {
  title: 'Мотив* можливості | мотив*',
  description: 'Знаходь найкрутіші можливості для молоді з Мотивом* Відтепер тренінги, курси, міжнародні обміни, стажування й волонтерства на одній платформі. Усе для того, щоб ти отримував новий досвід і знайомства',
  openGraph: {
    title: 'Мотив* можливості | мотив*',
    description: 'находь найкрутіші можливості для молоді з Мотивом* Відтепер тренінги, курси, міжнародні обміни, стажування й волонтерства на одній платформі. Усе для того, щоб ти отримував новий досвід і знайомства.',
    images: ['https://ogcdn.net/85210861-0b1e-4318-a9f8-c59150dc58d2/v1/og.png'], // Update with your image path
    type: 'website',
  },
};
export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <Banner/>
      <MainContent/>
      <PartnersSection/>
      <SupportSection/>
      <Footer />
    </div>
  );
}
