import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article, ArticleCategory } from '../../models/article.model';
import { ChartComponent, ChartData } from '../../components/chart/chart.component';
import { GeminiService } from '../../services/gemini.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private articleService = inject(ArticleService);
  private modalService = inject(ModalService);
  private toastService = inject(ToastService);
  authService = inject(AuthService);
  geminiService = inject(GeminiService);

  activeTab = signal<'admin' | 'users' | 'lair'>('admin');
  
  // A signal to track loading state for specific user actions
  userActionLoading = signal<Record<number, boolean>>({});

  // Article-related signals
  articles = this.articleService.articles;
  articleCount = computed(() => this.articles().length);
  
  // User-related signals
  usersForManagement = this.authService.usersForManagement;

  lastUpdated = computed(() => {
    const articles = this.articles();
    if (articles.length === 0) return 'N/A';
    return articles[0].date; // Assuming newest is first
  });

  categoryCounts = computed(() => {
    const counts = new Map<ArticleCategory, number>();
    this.articles().forEach(article => {
      counts.set(article.category, (counts.get(article.category) || 0) + 1);
    });
    return counts;
  });

  mostPopulatedCategory = computed(() => {
    const counts = this.categoryCounts();
    if (counts.size === 0) return 'N/A';
    
    let maxCount = 0;
    let maxCategory: ArticleCategory | string = 'N/A';
    
    counts.forEach((count, category) => {
        if (count > maxCount) {
            maxCount = count;
            maxCategory = category;
        }
    });
    return maxCategory;
  });
  
  chartData = computed<ChartData>(() => {
    const counts = this.categoryCounts();
    const labels = Array.from(counts.keys());
    const data = Array.from(counts.values());

    return {
      labels: labels,
      datasets: [
        {
          label: 'Articles per Category',
          data: data,
          backgroundColor: [
            'rgba(34, 211, 238, 0.5)', // cyan
            'rgba(139, 92, 246, 0.5)', // violet
            'rgba(236, 72, 153, 0.5)', // pink
            'rgba(52, 211, 153, 0.5)'  // emerald
          ],
          borderColor: [
            '#06b6d4',
            '#8b5cf6',
            '#ec4899',
            '#10b981'
          ],
          borderWidth: 1,
        },
      ],
    };
  });

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: '#9ca3af' }, // text-gray-400
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { display: false }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };


  async deleteArticle(id: number): Promise<void> {
    const confirmed = await this.modalService.open({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this article? This action cannot be undone.'
    });

    if (confirmed) {
      this.articleService.deleteArticle(id);
      this.toastService.show({ message: 'Article deleted successfully.', type: 'success' });
    }
  }

  generateReport(): void {
    this.geminiService.generateSecurityReport();
  }

  // --- User Management Methods ---
  private async performUserAction(userId: number, action: () => void, successMessage: string): Promise<void> {
    this.userActionLoading.update(loading => ({ ...loading, [userId]: true }));
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500)); 
    action();
    this.userActionLoading.update(loading => ({ ...loading, [userId]: false }));
    this.toastService.show({ message: successMessage, type: 'success' });
  }

  async promoteUser(user: User): Promise<void> {
    const confirmed = await this.modalService.open({
      title: 'Promote User',
      message: `Are you sure you want to promote ${user.name} to Admin?`
    });
    if (confirmed) {
      await this.performUserAction(
        user.id,
        () => this.authService.promoteUser(user.id),
        `${user.name} has been promoted to Admin.`
      );
    }
  }
  
  async demoteUser(user: User): Promise<void> {
    const confirmed = await this.modalService.open({
      title: 'Demote User',
      message: `Are you sure you want to demote ${user.name} to User?`
    });
     if (confirmed) {
      await this.performUserAction(
        user.id,
        () => this.authService.demoteUser(user.id),
        `${user.name} has been demoted to User.`
      );
    }
  }

  async deleteUser(user: User): Promise<void> {
    const confirmed = await this.modalService.open({
      title: 'Delete User',
      message: `Are you sure you want to PERMANENTLY DELETE ${user.name}? This action cannot be undone.`
    });
    if (confirmed) {
       await this.performUserAction(
        user.id,
        () => this.authService.deleteUser(user.id),
        `${user.name} has been deleted.`
      );
    }
  }
}
