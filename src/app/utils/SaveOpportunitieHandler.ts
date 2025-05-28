import Cookies from 'js-cookie';

interface SavedEvent {
  eventId: number | string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface SaveEventResponse {
  status: 'success' | 'error';
  message: string;
  isSaved: boolean;
}

export const SAVED_EVENTS_COOKIE = 'saved_events';
const COOKIE_EXPIRY = 7; // days
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export class SavedEventsManager {
  private static instance: SavedEventsManager;
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startSync();
  }

  public static getInstance(): SavedEventsManager {
    if (!SavedEventsManager.instance) {
      SavedEventsManager.instance = new SavedEventsManager();
    }
    return SavedEventsManager.instance;
  }

  private startSync(): void {
    this.syncInterval = setInterval(() => {
      this.syncWithServer();
    }, SYNC_INTERVAL);
  }

  private async syncWithServer(): Promise<void> {
    const token = this.getUserToken();
    if (!token) return;

    try {
      const savedEvents = await this.fetchSavedEvents(token);
      this.updateCookie(savedEvents);
    } catch (error) {
      console.error('Error syncing with server:', error);
    }
  }

  private getUserToken(): string | null {
    // Implement your token retrieval logic here
    return localStorage.getItem('userToken');
  }

  private async fetchSavedEvents(token: string): Promise<SavedEvent[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saved-events`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved events');
    }

    return response.json();
  }

  private updateCookie(savedEvents: SavedEvent[]): void {
    const eventIds = savedEvents.map(event => event.eventId);
    Cookies.set(SAVED_EVENTS_COOKIE, JSON.stringify(eventIds), {
      expires: COOKIE_EXPIRY,
      sameSite: 'strict'
    });
  }

  public isEventSaved(eventId: string | number): boolean {
    const savedEvents = this.getSavedEventsFromCookie();
    return savedEvents.some(id => id.toString() === eventId.toString());
  }

  private getSavedEventsFromCookie(): (string | number)[] {
    const cookieData = Cookies.get(SAVED_EVENTS_COOKIE);
    return cookieData ? JSON.parse(cookieData) : [];
  }

  public async toggleSaveEvent(eventId: string | number): Promise<SaveEventResponse> {
    const token = this.getUserToken();
    if (!token) {
      return {
        status: 'error',
        message: 'Для збереження треба ввійти',
        isSaved: false
      };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saved-events/${eventId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle save event');
      }

      const result = await response.text();
      const isSaved = result.includes('Event saved successfully');

      // Update cookie immediately after successful server response
      await this.syncWithServer();

      return {
        status: 'success',
        message: isSaved ? 'Збережено успішно' : 'Видалено зі збережених',
        isSaved
      };
    } catch (error) {
      console.error('Error toggling save event:', error);
      return {
        status: 'error',
        message: 'Помилка при збереженні',
        isSaved: this.isEventSaved(eventId)
      };
    }
  }

  public cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}
