import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Article, ArticleCategory } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { AiSearchComponent } from '../../components/ai-search/ai-search.component';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, AiSearchComponent, ArticleCardComponent, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private articleService = inject(ArticleService);

  allArticles = this.articleService.articles;
  articlesState = this.articleService.articlesState;
  
  readonly categories: ArticleCategory[] = ['All', 'Tech News', 'Ethical Hacking', 'AI Tools', 'Digital Library'];
  selectedCategory = signal<ArticleCategory>('All');
  searchQuery = signal('');

  featuredArticle = computed(() => this.allArticles()?.[0]);

  filteredArticles = computed(() => {
    const articles = this.allArticles();
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase();

    let categoryFiltered = articles;
    if (category !== 'All') {
      categoryFiltered = articles.filter(article => article.category === category);
    }
    
    if (!query) {
      return categoryFiltered;
    }

    return categoryFiltered.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.summary.toLowerCase().includes(query)
    );
  });

  selectCategory(category: ArticleCategory) {
    this.selectedCategory.set(category);
  }
}
