import './globals.css';

export default function NotFound() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white px-4 text-center relative overflow-hidden">
        {/* Glowing blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-indigo-500 rounded-full filter blur-3xl opacity-30 animate-pulse" />
  
        <div className="relative z-10 max-w-xl bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-xl">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl mb-3">Шлях загублено, але можливість — ні.</p>
          <p className="mb-6 text-white/80">
            Ця сторінка ще чекає на свою ідею. Повернись і знайди щось надихаюче.
          </p>
          <a
            href="/"
            className="inline-block mt-2 px-6 py-3 bg-white text-purple-700 font-semibold rounded-full shadow hover:scale-105 transition-transform"
          >
            Повернутись на головну
          </a>
        </div>
      </div>
    );
  }