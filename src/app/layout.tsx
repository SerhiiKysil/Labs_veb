import Script from 'next/script';
import { UserProvider } from '../app/context/UserContext';

export const metadata = {
  title: 'Мотив* можливості',
  description: 'Знаходь найкрутіші можливості для молоді з Мотивом* Відтепер тренінги, курси, міжнародні обміни, стажування й волонтерства на одній платформі. Усе для того, щоб ти отримував новий досвід і знайомства',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white">
        <UserProvider>
          {children}
        </UserProvider>
        
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-LSTNGVCH7F" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LSTNGVCH7F');
          `}
        </Script>

        {/* Plerdy */}
        <Script id="plerdy" strategy="afterInteractive">
          {`
            var _protocol = "https:" == document.location.protocol ? "https://" : "http://";
            _site_hash_code = "e7bc1f55dea29c5860c6be8ba0e562a8";
            _suid = 56530;
            var plerdyScript = document.createElement("script");
            plerdyScript.setAttribute("defer", "");
            plerdyScript.dataset.plerdymainscript = "plerdymainscript";
            plerdyScript.src = "https://a.plerdy.com/public/js/click/main.js?v=" + Math.random();
            var plerdymainscript = document.querySelector("[data-plerdymainscript='plerdymainscript']");
            if (plerdymainscript) {
              plerdymainscript.parentNode.removeChild(plerdymainscript);
            }
            try {
              document.head.appendChild(plerdyScript);
            } catch (t) {
              console.log(t, "unable add script tag");
            }
          `}
        </Script>
      </body>
    </html>
  );
}
