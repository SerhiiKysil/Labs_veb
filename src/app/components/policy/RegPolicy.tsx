
"use client";
import React from "react";
import styles from "../../styles/Policy.module.css"; 


const RegPolicy: React.FC = () => {
    return (
        <div className={styles.policyContainer}>
            <h2 className={styles.title}>Політика реєстрації</h2>
            <p className={styles.intro}>
                Вітаємо вас на нашій платформі! Ми цінуємо вашу довіру та докладаємо всіх зусиль, щоб захистити ваші персональні дані.
            </p>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Захист даних</h3>
                <p className={styles.paragraph}>
                    Ми ніколи не продаємо, не обмінюємо та не передаємо ваші особисті дані третім особам без вашої згоди. Уся інформація, яку ви надаєте, використовується виключно для забезпечення вашого досвіду на платформі та поліпшення наших послуг.
                </p>
            </div>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Зручність користування</h3>
                <p className={styles.paragraph}>
                    Ми прагнемо створити безпечне та зручне середовище для всіх користувачів. Якщо у вас виникнуть питання або пропозиції щодо нашої платформи, будь ласка, зв&apos;яжіться з нами.
                </p>
            </div>

            <div className={styles.section}>
                <h3 className={styles.subtitle}>Прозорість та відповідальність</h3>
                <p className={styles.paragraph}>
                    Ми завжди готові відповісти на будь-які питання, що стосуються ваших даних та їх обробки. Наша мета — забезпечити прозорість процесів та відповідальне ставлення до кожного користувача.
                </p>
            </div>

            <p className={styles.closing}>
                Дякуємо, що обрали нас!
            </p>
        </div>
    );
};

export default RegPolicy;
