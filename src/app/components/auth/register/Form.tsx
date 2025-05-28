"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import GoogleSignInButton from "../common/GoogleSignInButton";
import { useRouter } from "next/navigation";
import "../../../globals.css";

const Form: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", telegram: "" });
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isPolicyChecked, setIsPolicyChecked] = useState(false);
  const [formErrors, setFormErrors] = useState({ name: "", email: "", password: "", telegram: "" });
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = { name: "", email: "", password: "", telegram: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Це поле потрібно заповнити!";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Потрібно ввести пошту!";
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      errors.email = "Неправильний формат пошти!";
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = "Пароль є обов'язковим!";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Пароль має бути довше 8 символів!";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsVerificationSent(true);
        setRegistrationError(null);
      } else {
        const errorMessage = await response.text();
        setRegistrationError(errorMessage || "Сталася помилка.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegistrationError("Сталася помилка. Спробуйте пізніше.");
    }
  };

  const handleVerify = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify?email=${formData.email}&code=${verificationCode}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      if (response.ok) {
        alert("Verification successful!");
        setVerificationError("");
        router.push("/auth");
      } else {
        setVerificationError("Неправильний код або email.");
      }
    } catch {
      console.error("Verification error");
      setVerificationError("Сталася помилка. Спробуйте пізніше.");
    }
  };

  const handleRequestCodeAgain = async () => {
    if (cooldown > 0) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/request-code?email=${formData.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("Код повторно надіслано!");
        setCooldown(60); // Встановити таймер на 60 секунд
      } else {
        alert("Зачекайте перед повторним запитом.");
      }
    } catch (error) {
      console.error("Error requesting code:", error);
      alert("Сталася помилка при запиті коду.");
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  return (
    <section className="bg-white text-dark-blue py-12" style={{ margin: "auto", maxWidth: "1200px", fontFamily: "Montserrat Alternates, sans-serif" }}>
      <div className="container mx-auto grid grid-cols-1 gap-8">
        <div style={{ maxWidth: "1000px", marginLeft: "10%", marginRight: "10%", width: "-webkit-fill-available" }}>
          <h2 className="text-2xl font-bold mb-2" style={{ textAlign: "center" }}>Створити акаунт</h2>
          <h5 className="text-xl mb-6" style={{ textAlign: "center" }}>Ми раді, що ти тут! Залишилося кілька кроків</h5>

          {/* Form Fields 
          Ми раді, що ти тут! Залишилося кілька кроків
          */}
          <p className="mb-1">Ім&apos;я</p>
          <input
            type="text"
            name="name"
            placeholder="Твоє ім'я"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[10px]"
          />
          {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}

          <p className="mb-1">Електронна пошта</p>
          <input
            type="email"
            name="email"
            placeholder="Писатимемо тільки про найважливіше"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[10px]"
          />
          {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}

          <p className="mb-1">Пароль</p>
          <input
            type="password"
            name="password"
            placeholder="Бажано запам’ятати"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[10px]"
          />
          {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}

          <div className="mb-4">
            <input
              type="checkbox"
              id="policy"
              className="ml-1"
              checked={isPolicyChecked}
              onChange={(e) => setIsPolicyChecked(e.target.checked)}
            />
            <label htmlFor="policy" className="ml-2">
              Я приймаю <a href="/policy" className="text-blue-500 underline">умови та політику конфіденційності</a>
            </label>
          </div>

          <button 
            onClick={handleRegister} 
            className="bg-dark-blue text-white px-4 py-2" 
            style={{ borderRadius: '32px', height: '56px', fontSize: '20px' }} 
            disabled={!isPolicyChecked}
          >
            Створити акаунт
          </button>
          {registrationError && (
            <p className="text-red-500 mt-4">{registrationError}</p>
          )}

          <div className="mt-4 mb-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-4 bg-white text-gray-500">або</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
          </div>

          <GoogleSignInButton />
          <div className="mb-4" style={{ marginTop: "12px" }}>
            <label htmlFor="policy" className="ml-2">
              Ввійдіть <a href="/auth" className="text-blue-500 underline">якщо вже зареєстровані</a>
            </label>
          </div>
          <div className="mb-4" style={{ marginTop: "12px" }}>
            <label htmlFor="policy" className="ml-2">
              Забули пароль? <a href="/restore" className="text-blue-500 underline">Відновіть його тут.</a>
            </label>
          </div>

        {isVerificationSent && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">Підтвердження пошти</h3>
              <input type="text" placeholder="Введіть код" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="border p-2 mb-2 w-full rounded-[10px]" />
              <button onClick={handleVerify} className="bg-dark-blue text-white px-4 py-2 mt-4 w-full text-lg rounded-[32px]">Підтвердити</button>
              {verificationError && <p className="text-red-500 mt-2">{verificationError}</p>}

              <button onClick={handleRequestCodeAgain} className="text-blue-500 mt-4 underline" disabled={cooldown > 0}>
                {cooldown > 0 ? `Запросити повторно (${cooldown}s)` : "Запросити код повторно"}
              </button>
            </div>
          )}
                  </div>

      </div>
    </section>
  );
};

export default Form;
