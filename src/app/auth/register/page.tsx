export const metadata = {
  title: 'Реєстрація | мотив*',
  description: 'Приєднуйся до мотив* та відкрий для себе нові можливості! Реєструйся зараз, щоб брати участь у тренінгах, курсах, міжнародних обмінах, стажуваннях та волонтерствах.',
  openGraph: {
    title: 'Реєстрація | мотив*',
    description: 'Приєднуйся до мотив* та відкрий для себе нові можливості! Реєструйся зараз, щоб не пропустити цікаві заходи та програми.',
    images: ['https://motyv.space/images/default.jpg'], // Path confirmed
    type: 'website',
  },
};

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Form from '../../components/auth/register/Form'

export default function Register() {
    return (
        <div className="bg-white">
          <Navbar />
          <Form/>
          <Footer/>
        </div>
      );
}