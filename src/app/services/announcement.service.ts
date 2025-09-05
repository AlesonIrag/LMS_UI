import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Announcement {
  id?: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'students' | 'faculty';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface NewsItem {
  id?: number;
  text: string;
  type: 'info' | 'warning' | 'event';
  color: 'red' | 'green' | 'blue' | 'yellow' | 'purple';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private announcementsSubject = new BehaviorSubject<Announcement[]>([]);
  private newsSubject = new BehaviorSubject<NewsItem[]>([]);

  public announcements$ = this.announcementsSubject.asObservable();
  public news$ = this.newsSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load initial data from localStorage or set default data
    const savedAnnouncements = localStorage.getItem('library_announcements');
    const savedNews = localStorage.getItem('library_news');

    if (savedAnnouncements) {
      this.announcementsSubject.next(JSON.parse(savedAnnouncements));
    } else {
      // Default announcements
      const defaultAnnouncements: Announcement[] = [
        {
          id: 1,
          title: 'Library Hours Update',
          content: 'Return books by July 10 to avoid fees.',
          type: 'warning',
          priority: 'high',
          targetAudience: 'all',
          isActive: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          createdBy: 'Admin'
        },
        {
          id: 2,
          title: 'New Database Access',
          content: 'New research database access available for faculty members.',
          type: 'info',
          priority: 'medium',
          targetAudience: 'faculty',
          isActive: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          createdBy: 'Admin'
        }
      ];
      this.announcementsSubject.next(defaultAnnouncements);
      this.saveToLocalStorage('announcements', defaultAnnouncements);
    }

    if (savedNews) {
      this.newsSubject.next(JSON.parse(savedNews));
    } else {
      // Default news items
      const defaultNews: NewsItem[] = [
        {
          id: 1,
          text: 'Library closed on July 12.',
          type: 'warning',
          color: 'red',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          text: 'New Science books available!',
          type: 'info',
          color: 'green',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          text: 'Join the Reading Challenge.',
          type: 'event',
          color: 'blue',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      this.newsSubject.next(defaultNews);
      this.saveToLocalStorage('news', defaultNews);
    }
  }

  // Announcement CRUD operations
  getAnnouncements(): Observable<Announcement[]> {
    return this.announcements$;
  }

  getActiveAnnouncements(): Observable<Announcement[]> {
    return new Observable(observer => {
      this.announcements$.subscribe(announcements => {
        observer.next(announcements.filter(a => a.isActive));
      });
    });
  }

  getAnnouncementsByAudience(audience: 'all' | 'students' | 'faculty'): Observable<Announcement[]> {
    return new Observable(observer => {
      this.announcements$.subscribe(announcements => {
        observer.next(announcements.filter(a => 
          a.isActive && (a.targetAudience === 'all' || a.targetAudience === audience)
        ));
      });
    });
  }

  addAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): void {
    const currentAnnouncements = this.announcementsSubject.value;
    const newId = Math.max(...currentAnnouncements.map(a => a.id || 0), 0) + 1;
    
    const newAnnouncement: Announcement = {
      ...announcement,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedAnnouncements = [newAnnouncement, ...currentAnnouncements];
    this.announcementsSubject.next(updatedAnnouncements);
    this.saveToLocalStorage('announcements', updatedAnnouncements);
  }

  updateAnnouncement(id: number, updates: Partial<Announcement>): void {
    const currentAnnouncements = this.announcementsSubject.value;
    const updatedAnnouncements = currentAnnouncements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, ...updates, updatedAt: new Date().toISOString() }
        : announcement
    );
    
    this.announcementsSubject.next(updatedAnnouncements);
    this.saveToLocalStorage('announcements', updatedAnnouncements);
  }

  deleteAnnouncement(id: number): void {
    const currentAnnouncements = this.announcementsSubject.value;
    const updatedAnnouncements = currentAnnouncements.filter(a => a.id !== id);
    
    this.announcementsSubject.next(updatedAnnouncements);
    this.saveToLocalStorage('announcements', updatedAnnouncements);
  }

  // News CRUD operations
  getNews(): Observable<NewsItem[]> {
    return this.news$;
  }

  getActiveNews(): Observable<NewsItem[]> {
    return new Observable(observer => {
      this.news$.subscribe(news => {
        observer.next(news.filter(n => n.isActive));
      });
    });
  }

  addNews(newsItem: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>): void {
    const currentNews = this.newsSubject.value;
    const newId = Math.max(...currentNews.map(n => n.id || 0), 0) + 1;
    
    const newNewsItem: NewsItem = {
      ...newsItem,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedNews = [newNewsItem, ...currentNews];
    this.newsSubject.next(updatedNews);
    this.saveToLocalStorage('news', updatedNews);
  }

  updateNews(id: number, updates: Partial<NewsItem>): void {
    const currentNews = this.newsSubject.value;
    const updatedNews = currentNews.map(newsItem => 
      newsItem.id === id 
        ? { ...newsItem, ...updates, updatedAt: new Date().toISOString() }
        : newsItem
    );
    
    this.newsSubject.next(updatedNews);
    this.saveToLocalStorage('news', updatedNews);
  }

  deleteNews(id: number): void {
    const currentNews = this.newsSubject.value;
    const updatedNews = currentNews.filter(n => n.id !== id);
    
    this.newsSubject.next(updatedNews);
    this.saveToLocalStorage('news', updatedNews);
  }

  private saveToLocalStorage(type: 'announcements' | 'news', data: any[]): void {
    const key = type === 'announcements' ? 'library_announcements' : 'library_news';
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Utility methods
  getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
}
