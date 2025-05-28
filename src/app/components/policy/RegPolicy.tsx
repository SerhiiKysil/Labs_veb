"use client";
import React, { useState } from "react";
import styles from "../../styles/Policy.module.css";

const RegPolicy: React.FC = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [meme, setMeme] = useState<{ title: string; url: string } | null>(null);

    const handleGetWeather = async () => {
        setError(null);
        setWeather(null);

        try {
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
            );
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                setError("Місто не знайдено.");
                return;
            }

            const { latitude, longitude } = geoData.results[0];

            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherData = await weatherRes.json();

            if (weatherData.current_weather) {
                const temp = weatherData.current_weather.temperature;
                const wind = weatherData.current_weather.windspeed;
                setWeather(`Температура: ${temp}°C, Вітер: ${wind} км/год`);
            } else {
                setError("Не вдалося отримати погоду.");
            }
        } catch (err) {
            console.error("Помилка:", err);
            setError("Сталася помилка при завантаженні погоди.");
        }
    };

    const handleGetMeme = async () => {
        setError(null);
        setMeme(null);

        try {
            const res = await fetch("https://meme-api.com/gimme");
            const data = await res.json();

            if (data && data.url && data.title) {
                setMeme({ title: data.title, url: data.url });
            } else {
                setError("Не вдалося завантажити мем.");
            }
        } catch (err) {
            console.error("Помилка:", err);
            setError("Сталася помилка при завантаженні мема.");
        }
    };

    return (
        <div className={styles.policyContainer}>
            <h2 className={styles.title}>Політика реєстрації</h2>
            <p className={styles.intro}>
                Вітаємо вас на нашій платформі! Ми цінуємо вашу довіру та докладаємо всіх зусиль, щоб захистити ваші персональні дані.
            </p>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Погода у вашому місті</h3>
                <input
                    type="text"
                    placeholder="Введіть місто"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleGetWeather} className={styles.button}>
                    Отримати погоду
                </button>
                {weather && <p className={styles.paragraph}>{weather}</p>}
                {error && <p className={styles.paragraph} style={{ color: "red" }}>{error}</p>}
            </div>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Смішний мем :)</h3>
                <button onClick={handleGetMeme} className={styles.button}>
                    Показати мем
                </button>
                {meme && (
                    <div className={styles.meme}>
                        <p className={styles.paragraph}><strong>{meme.title}</strong></p>
                        <img src={meme.url} alt={meme.title} className={styles.memeImage} />
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Захист даних</h3>
                <p className={styles.paragraph}>
                    Ми ніколи не продаємо, не обмінюємо та не передаємо ваші особисті дані третім особам без вашої згоди.
                </p>
            </div>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Зручність користування</h3>
                <p className={styles.paragraph}>
                    Ми прагнемо створити безпечне та зручне середовище для всіх користувачів.
                </p>
            </div>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Прозорість та відповідальність</h3>
                <p className={styles.paragraph}>
                    Ми завжди готові відповісти на будь-які питання, що стосуються ваших даних.
                </p>
            </div>

            <p className={styles.closing}>
                Дякуємо, що обрали нас!
            </p>
        </div>
    );
};

export default RegPolicy;
