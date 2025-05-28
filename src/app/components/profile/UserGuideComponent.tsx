import React, { useState } from "react";
import { 
  BookOpen, 
  Calendar, 
  ChevronDown, 
  Heart, 
  Users, 
  MessageCircle, 
  Clock,
  X
} from "lucide-react";

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps?: string[];
  imageSrc?: string;
}

const UserGuideComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>("events");
  
  const guideContent: Record<string, GuideStep> = {
    "events": {
      id: "events",
      title: "Пошук та участь у подіях",
      description: "Знаходьте цікаві події та долучайтеся до них у кілька кліків",
      icon: <Calendar className="text-blue-500" />,
      steps: [
        "Знайдіть події на головній сторінці або у розділі 'Можливості'",
        "Використовуйте фільтри для пошуку за категоріями, датами або місцем проведення",
        "Натисніть на картку події, щоб дізнатися більше деталей",
        "Натисніть кнопку 'Зареєструватися', щоб перейти на сторінку реєстрації на подію"
      ],
      imageSrc: "/images/events.png"
    },
    "save": {
      id: "save",
      title: "Збереження подій та сповіщення",
      description: "Зберігайте цікаві події та отримуйте нагадування про них",
      icon: <Heart className="text-rose-500" />,
      steps: [
        "Натисніть на іконку збереження на картці події, щоб додати її до збережених",
        "Перегляньте всі збережені події у розділі 'Збережене' сторінки каталогу",
        "Сповіщення про дедлайн реєстрації на подію прийде на пошту за 24 години до нього",
        "Скасувати збереження можна повторним натисканням на іконку збереження"
      ],
      imageSrc: "/images/save.png"
    },
    "organizations": {
      id: "organizations",
      title: "Управління організаціями",
      description: "Створюйте власні організації та керуйте їх діяльністю",
      icon: <Users className="text-indigo-500" />,
      steps: [
        "Створіть нову організацію через кнопку 'Створити організацію'",
        "Заповніть профіль організації: додайте логотип, опис та контактні дані",
        "Запросіть інших користувачів стати учасниками вашої організації",
        "Створюйте і публікуйте події від імені вашої організації"
      ],
      imageSrc: "/images/organizations.png"
    },
  };

  const toggleGuide = () => {
    setIsOpen(!isOpen);
  };

  const setSection = (section: string) => {
    setActiveSection(section);
  };

  const activeGuide = activeSection ? guideContent[activeSection] : null;

  return (
    <div className="relative z-10">
      {/* Кнопка відкриття інструкції */}
      <button 
        onClick={toggleGuide}
        className={` flex items-center gap-2 rounded-full px-6 py-3 shadow-lg transition-all duration-300 ${
          isOpen ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
        }`}
      >
        {isOpen ? (
          <>
            <X size={18} />
            <span className="font-medium">Закрити</span>
          </>
        ) : (
          <>
            <BookOpen size={18} />
            <span className="font-medium">Як користуватися</span>
          </>
        )}
      </button>

      {/* Панель інструкцій */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Інструкція користування платформою
                </h2>
                <button onClick={toggleGuide} className="text-gray-500 hover:text-red-500">
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Отримайте максимум від нашої платформи з цим детальним гідом
              </p>
            </div>

            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              {/* Бічне меню */}
              <div className="w-full md:w-1/3 bg-gray-50 p-4 overflow-y-auto">
                {Object.values(guideContent).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSection(section.id)}
                    className={`w-full text-left p-4 mb-2 rounded-xl flex items-center gap-3 transition-all ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{section.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {section.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Основний контент */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeGuide && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                        {activeGuide.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {activeGuide.title}
                        </h2>
                        <p className="text-gray-600">{activeGuide.description}</p>
                      </div>
                    </div>

                    {activeGuide.imageSrc && (
                      <div className="rounded-xl overflow-hidden border border-gray-200">
                        <img
                          src={activeGuide.imageSrc}
                          alt={`Приклад: ${activeGuide.title}`}
                          className="w-full h-auto"
                        />
                      </div>
                    )}

                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="font-medium text-blue-800 mb-4 flex items-center gap-2">
                        <Clock size={18} />
                        <span>Покрокова інструкція</span>
                      </h3>
                      <ol className="space-y-4">
                        {activeGuide.steps?.map((step, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <p>{step}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex justify-between border-t border-gray-100 pt-4">
                      <button
                        onClick={() => {
                          const keys = Object.keys(guideContent);
                          const currentIndex = keys.indexOf(activeSection!);
                          const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
                          setActiveSection(keys[prevIndex]);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <ChevronDown className="rotate-90 w-5 h-5" />
                        <span>Попередній розділ</span>
                      </button>
                      <button
                        onClick={() => {
                          const keys = Object.keys(guideContent);
                          const currentIndex = keys.indexOf(activeSection!);
                          const nextIndex = (currentIndex + 1) % keys.length;
                          setActiveSection(keys[nextIndex]);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <span>Наступний розділ</span>
                        <ChevronDown className="-rotate-90 w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Маєте запитання? Зв&apos;яжіться з нашою службою підтримки
              </p>
                <a 
                href="mailto:motyv.space@gmail.com"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                <MessageCircle size={16} />
                <span>Підтримка</span>
                </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGuideComponent;