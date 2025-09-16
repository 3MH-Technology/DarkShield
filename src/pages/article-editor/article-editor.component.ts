import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// FIX: Added ParamMap to imports for explicit typing.
import { ActivatedRoute, Router, RouterLink, ParamMap } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article, ArticleCategory } from '../../models/article.model';
// FIX: Changed import path for RxJS operators to fix type inference issue.
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);

  isSaving = signal(false);
  editingArticleId: number | null = null;
  pageTitle = 'Create New Dispatch';

  readonly categories: (Omit<ArticleCategory, 'All'>)[] = ['Tech News', 'Ethical Hacking', 'AI Tools', 'Digital Library'];

  articleForm = this.fb.group({
    title: ['', Validators.required],
    summary: ['', Validators.required],
    category: ['Tech News' as Omit<ArticleCategory, 'All'>, Validators.required],
    content: ['', [Validators.required, Validators.minLength(200)]],
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      // FIX: Explicitly typed 'params' to resolve 'unknown' type error on 'get'.
      map((params: ParamMap) => params.get('id')),
      filter(id => id !== null && !isNaN(Number(id))),
      map(id => Number(id)),
      switchMap(id => this.articleService.getArticleById(id))
    ).subscribe(article => {
      if (article) {
        this.editingArticleId = article.id;
        this.pageTitle = 'Edit Dispatch';
        this.articleForm.patchValue({
          title: article.title,
          summary: article.summary,
          category: article.category,
          content: article.content
        });
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    
    try {
      const formData = this.articleForm.getRawValue();

      if (this.editingArticleId) {
        // Update existing article
        await this.articleService.updateArticle({
          id: this.editingArticleId,
          title: formData.title!,
          summary: formData.summary!,
          category: formData.category!,
          content: formData.content!,
        });
      } else {
        // Add new article
        await this.articleService.addArticle({
          title: formData.title!,
          summary: formData.summary!,
          category: formData.category!,
          content: formData.content!,
        });
      }

      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error saving article:', error);
      // In a real app, you'd show a user-facing error message here.
    } finally {
      this.isSaving.set(false);
    }
  }
}
