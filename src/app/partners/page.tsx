"use client";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function ValidationRules() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Правила валідації організацій та публікації подій</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Про Мотив</h2>
          <p className="text-gray-700">Мотив — це платформа для молодіжних ініціатив, яка допомагає організаціям доносити свої події до широкої аудиторії. Ми забезпечуємо якість контенту та гарантуємо, що учасники отримують лише перевірену інформацію про події. Публікуючи події у нас, ви отримуєте більший охоплення, доступ до зацікавленої спільноти та підтримку у просуванні ваших ініціатив.</p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Реєстрація</h2>
          <p className="text-gray-700">Щоб мати можливість публікувати молодіжні події, вам необхідно зареєструватися на платформі. Використовуйте дійсну електронну пошту для створення облікового запису.</p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Створення організації</h2>
          <p className="text-gray-700">Після реєстрації перейдіть у розділ &quot;Профіль&quot; та створіть організацію. Вам потрібно вказати назву, контактні дані та опис діяльності.</p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Валідація організації</h2>
          <p className="text-gray-700">Щоб уникнути фейкових подій та забезпечити якість контенту, всі організації проходять валідацію. Адміністрація перевіряє ваші дані та може зв&apos;язатися для додаткової інформації. Після успішної перевірки ви отримаєте підтвердження.</p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Публікація подій</h2>
          <p className="text-gray-700">Після валідації організації ви можете створювати та публікувати події. Вказуйте коректну інформацію про дату, місце проведення та інші деталі. Адміністрація залишає за собою право приховати події, які порушують правила платформи.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
