import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (article()) {
      <a [routerLink]="['/article', article()!.id]" class="block group">
        <div class="bg-gray-900/50 backdrop-blur-md rounded-lg overflow-hidden h-full border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10">
          <div class="overflow-hidden">
            <img [src]="article()!.imageUrl" alt="Article Image" class="w-full h-48 object-cover group-hover:opacity-90 group-hover:scale-105 transition-all duration-300">
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <span class="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{{ article()!.category }}</span>
            <h3 class="font-orbitron text-xl font-bold mt-2 mb-3 text-gray-100 group-hover:text-cyan-400 transition-colors duration-300">{{ article()!.title }}</h3>
            <p class="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{{ article()!.summary }}</p>
            <div class="text-xs text-gray-500 flex items-center justify-between pt-4 border-t border-gray-800">
              <span>By {{ article()!.author.name }}</span>
              <span>{{ article()!.date }}</span>
            </div>
          </div>
        </div>
      </a>
    }
  `,
  styles: `
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;  
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCardComponent {
  article = input.required<Article>();
}