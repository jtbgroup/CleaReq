import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PopulationService, PopulationDto } from '../../../core/services/population.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-population-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './population-list.component.html',
  styleUrl: './population-list.component.scss',
})
export class PopulationListComponent implements OnInit {
  private populationService = inject(PopulationService);
  protected i18n = inject(I18nService);
  private router = inject(Router);

  populations: PopulationDto[] = [];
  loading = true;
  error: string | null = null;

  displayedColumns: string[] = ['name', 'status', 'memberCount', 'actions'];

  ngOnInit(): void {
    this.loadPopulations();
  }

  private loadPopulations(): void {
    this.loading = true;
    this.error = null;

    this.populationService.listPopulations().subscribe({
      next: (data) => {
        this.populations = data;
        this.loading = false;
      },
      error: () => {
        this.error = this.i18n.translate('populationList.errorLoad');
        this.loading = false;
      },
    });
  }

  createPopulation(): void {
    this.router.navigate(['/admin/populations/new']);
  }

  editPopulation(id: string): void {
    this.router.navigate(['/admin/populations', id, 'edit']);
  }

  viewMembers(id: string): void {
    this.router.navigate(['/admin/populations', id]);
  }

  getStatusClass(status: string): string {
    return status === 'ACTIVE' ? 'status-badge-active' : 'status-badge-closed';
  }

  getStatusLabel(status: string): string {
    return status === 'ACTIVE'
      ? this.i18n.translate('populationList.active')
      : this.i18n.translate('populationList.closed');
  }
}
