import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare var marked: {
  parse(markdown: string): string;
};

@Component({
  selector: 'app-ai-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ai-search.component.html',
  styleUrls: ['./ai-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSearchComponent {
  geminiService = inject(GeminiService);
  private sanitizer = inject(DomSanitizer);
  
  query = signal('');
  copied = signal(false);

  parsedResponse = computed<SafeHtml>(() => {
    const responseText = this.geminiService.response();
    if (responseText) {
      const html = marked.parse(responseText);
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    return '';
  });

  search(prompt?: string) {
    const queryToSearch = prompt || this.query();
    if (queryToSearch.trim()) {
      if (!prompt) {
        this.query.set(queryToSearch);
      }
      this.geminiService.generateContent(queryToSearch);
    }
  }

  setQueryAndSearch(p: string) {
    this.query.set(p);
    this.search(p);
  }

  copyToClipboard() {
    const responseText = this.geminiService.response();
    if (responseText) {
      navigator.clipboard.writeText(responseText).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }
}
