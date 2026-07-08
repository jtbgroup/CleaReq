import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CatalogService, CatalogTypeDto } from '../../../core/services/catalog.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-catalog-type-list',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  template: `
    <div class="page-header">
      <h2 class="page-title">{{ 'catalogTypeList.title' | translate }}</h2>
    </div>

    @if (error) {
      <div class="list-error">{{ error }}</div>
    }

    <div class="type-grid">
      @for (type of types; track type.id) {
        <button class="type-card" (click)="goToEntries(type)">
          <mat-icon class="type-icon">list_alt</mat-icon>
          <span class="type-label">{{ type.label }}</span>
          <mat-icon class="type-arrow">chevron_right</mat-icon>
        </button>
      } @empty {
        <div class="empty-state">
          <mat-icon class="empty-icon">category</mat-icon>
          <p>{{ 'catalogTypeList.noTypes' | translate }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .page-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a237e;
    }

    .list-error {
      color: #c62828;
      margin-bottom: 16px;
    }

    .type-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 480px;
    }

    .type-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
      border: 1px solid rgba(57, 73, 171, 0.15);
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(26, 35, 126, 0.06);
      padding: 16px 20px;
      cursor: pointer;
      font-size: 0.95rem;
      text-align: left;
      transition: background 0.12s ease, box-shadow 0.12s ease;

      &:hover {
        background: #f5f6ff;
        box-shadow: 0 4px 16px rgba(26, 35, 126, 0.1);
      }
    }

    .type-icon {
      color: #3949ab;
    }

    .type-label {
      flex: 1;
      font-weight: 600;
      color: #1a1a2e;
    }

    .type-arrow {
      color: rgba(0, 0, 0, 0.3);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      color: rgba(0, 0, 0, 0.4);

      .empty-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        opacity: 0.35;
      }

      p {
        margin: 0;
        font-size: 0.95rem;
      }
    }
  `]
})
export class CatalogTypeListComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  types: CatalogTypeDto[] = [];
  error: string | null = null;

  ngOnInit() {
    this.catalogService.listTypes().subscribe({
      next: types => (this.types = types),
      error: () => (this.error = this.i18n.translate('catalogTypeList.errorLoad')),
    });
  }

  goToEntries(type: CatalogTypeDto) {
    this.router.navigate(['/admin/catalogs', type.code]);
  }
}
