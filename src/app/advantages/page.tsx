export const metadata = {
  title: 'Наші переваги | мотив*',
  description: 'Дізнайтеся про переваги платформи мотив*: доступ до молодіжної аудиторії, перевірена якість подій, безкоштовне просування та підтримка організаторів.',
  openGraph: {
    title: 'Наші переваги | мотив*',
    description: 'Дізнайтеся про переваги платформи мотив*: доступ до молодіжної аудиторії, перевірена якість подій, безкоштовне просування та підтримка організаторів.',
    images: ['/images/default.jpg'], // Update with your image path
    type: 'website',
  },
};

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Advantages() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Наші переваги 🚀</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">🌍 Широка аудиторія</h2>
          <p className="text-gray-700">Публікуючи події у нас, ви отримуєте доступ до великої молодіжної спільноти, яка шукає цікаві заходи та можливості.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">✅ Перевірена якість</h2>
          <p className="text-gray-700">Ми ретельно перевіряємо кожну організацію, щоб забезпечити довіру та надійність заходів, що публікуються на платформі.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">📣 Безкоштовне просування</h2>
          <p className="text-gray-700">Ваша подія може отримати додаткове висвітлення через наші соціальні мережі та партнерські канали.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">💡 Підтримка та допомога</h2>
          <p className="text-gray-700">Ми допомагаємо організаторам на всіх етапах: від реєстрації до успішного проведення заходу.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
