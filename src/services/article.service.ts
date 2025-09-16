import { Injectable, inject, signal } from '@angular/core';
import { Article } from '../models/article.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs';
import { GeminiService } from './gemini.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private geminiService = inject(GeminiService);
  private authService = inject(AuthService);

  private articlesSignal = signal<Article[]>([]);
  private state = signal<'loading' | 'loaded' | 'error'>('loaded'); // Default to loaded as it starts empty
  private nextId = signal(1);

  readonly articles = this.articlesSignal.asReadonly();
  readonly articlesState = this.state.asReadonly();
  
  constructor() {
    // No longer initializing articles from Gemini on startup.
    // The blog will start empty.
  }

  getArticles(): Observable<Article[]> {
    return toObservable(this.articlesSignal);
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return toObservable(this.articlesSignal).pipe(
      // Fix: Explicitly type `articles` to resolve type inference issue.
      map((articles: Article[]) => articles.find(article => article.id === id))
    );
  }

  async addArticle(articleData: Omit<Article, 'id' | 'imageUrl' | 'author' | 'date'>): Promise<void> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to create an article.');
    }

    const imageUrl = await this.geminiService.generateArticleImage(articleData.title);
    const newArticle: Article = {
      ...articleData,
      id: this.nextId(),
      imageUrl: imageUrl,
      author: {
        id: currentUser.id,
        name: currentUser.name,
      },
      date: new Date().toISOString().split('T')[0],
    };
    this.articlesSignal.update(articles => [newArticle, ...articles]);
    this.nextId.update(id => id + 1);
  }

  async updateArticle(updatedArticle: Omit<Article, 'imageUrl' | 'author' | 'date'>): Promise<void> {
    this.articlesSignal.update(articles => {
      const index = articles.findIndex(a => a.id === updatedArticle.id);
      if (index > -1) {
        const existingArticle = articles[index];
        // Merge updates, but keep original author, date, and image
        articles[index] = { 
          ...existingArticle,
          title: updatedArticle.title,
          summary: updatedArticle.summary,
          category: updatedArticle.category,
          content: updatedArticle.content
        };
      }
      return [...articles];
    });
  }

  deleteArticle(id: number): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'Owner')) {
        console.error('Unauthorized attempt to delete an article.');
        return;
    }
    this.articlesSignal.update(articles => 
        articles.filter(article => article.id !== id)
    );
  }
}