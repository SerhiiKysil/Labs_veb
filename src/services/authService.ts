// src/services/authService.ts
import { getAuth, onAuthStateChanged } from "firebase/auth";

/**
 * Клас для обробки авторизації та токенів
 */
class AuthService {
  /**
   * Отримати поточний access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  /**
   * Отримати поточний refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  /**
   * Зберегти отримані токени
   */
  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  /**
   * Видалити токени при виході з системи
   */
  clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  /**
   * Оновити access token використовуючи refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }
      
      const data = await response.json();
      this.saveTokens(data.accessToken, data.refreshToken);
      
      return data.accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Вихід з системи
   */
  async logout(): Promise<boolean> {
    try {
      const auth = getAuth();
      await auth.signOut();
      
      // Викликаємо API для логауту на сервері (опціонально)
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.getAccessToken()}`,
          },
        });
      } catch (e) {
        console.error("Backend logout failed:", e);
      }
      
      this.clearTokens();
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }

  /**
   * Перевірка чи авторизований користувач
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Підписатися на зміни стану авторизації Firebase
   */
  subscribeToAuthChanges(callback: (isAuthenticated: boolean) => void): () => void {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      callback(!!user);
    });
  }
}

// Створюємо та експортуємо єдиний екземпляр
const authService = new AuthService();
export default authService;