import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, ParamMap } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { map, switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { of } from 'rxjs';
import { GeminiService } from '../../services/gemini.service';
import { Article } from '../../models/article.model';

// To render markdown
declare var marked: {
  parse(markdown: string): string;
};

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articleService = inject(ArticleService);
  private sanitizer = inject(DomSanitizer);
  private geminiService = inject(GeminiService);

  private allArticles = this.articleService.articles;

  // FIX: Refactored the observable pipe to be more robust and to fix a type inference issue.
  // Using parseInt and explicitly checking for null/NaN ensures the 'id' is correctly typed as a number.
  private article$ = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get('id')),
    switchMap(idString => {
      // Use parseInt for a more robust conversion and check for invalid/missing IDs.
      const id = idString ? parseInt(idString, 10) : NaN;
      if (isNaN(id)) {
        this.router.navigate(['/']);
        return of(undefined);
      }
      return this.articleService.getArticleById(id);
    })
  );

  article = toSignal(this.article$);
  
  contentState = signal<'processing' | 'processed' | 'idle'>('idle');
  processedMarkdown = signal('');

  constructor() {
    effect(async () => {
      const art = this.article();
      // FIX: Use a `typeof` check to explicitly narrow the type of `art.content` to string,
      // resolving an issue where it was being inferred as 'unknown' inside the async effect.
      if (art && typeof art.content === 'string') {
        this.contentState.set('processing');
        const processed = await this.processContentForImages(art.content);
        this.processedMarkdown.set(processed);
        this.contentState.set('processed');
      }
    }, { allowSignalWrites: true });
  }

  parsedContent = computed<SafeHtml>(() => {
    const content = this.processedMarkdown();
    if (content) {
      const html = marked.parse(content);
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    return '';
  });

  private async processContentForImages(content: string): Promise<string> {
    const imageGenRegex = /!\[gen-image:\s*(.*?)\]/g;
    let processedContent = content;
    const matches = Array.from(content.matchAll(imageGenRegex));

    for (const match of matches) {
      const fullTag = match[0];
      const prompt = match[1];
      try {
        const imageUrl = await this.geminiService.generateInContentImage(prompt);
        const imageMarkdown = `![${prompt}](${imageUrl})`;
        processedContent = processedContent.replace(fullTag, imageMarkdown);
      } catch (error) {
        console.error(`Failed to generate image for prompt: "${prompt}"`, error);
        // Replace tag with an error message or leave it as is
        processedContent = processedContent.replace(fullTag, `*[Failed to generate image for: "${prompt}"]*`);
      }
    }
    return processedContent;
  }

  // --- Navigation ---
  private currentArticleIndex = computed(() => {
    const id = this.article()?.id;
    if (!id) return -1;
    return this.allArticles().findIndex(a => a.id === id);
  });
  
  previousArticle = computed<Article | null>(() => {
    const index = this.currentArticleIndex();
    if (index > 0) {
      return this.allArticles()[index - 1];
    }
    return null;
  });

  nextArticle = computed<Article | null>(() => {
    const articles = this.allArticles();
    const index = this.currentArticleIndex();
    if (index > -1 && index < articles.length - 1) {
      return this.allArticles()[index + 1];
    }
    return null;
  });

}
