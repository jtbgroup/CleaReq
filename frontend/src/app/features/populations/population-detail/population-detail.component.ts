import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PopulationService, PopulationDto, PopulationMemberDto } from '../../../core/services/population.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-population-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './population-detail.component.html',
  styleUrl: './population-detail.component.scss',
})
export class PopulationDetailComponent implements OnInit {
  private populationService = inject(PopulationService);
  protected i18n = inject(I18nService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  population: PopulationDto | null = null;
  members: PopulationMemberDto[] = [];
  loading = true;
  error: string | null = null;

  displayedColumns: string[] = ['personName', 'function', 'startDate', 'endDate', 'actions'];

  ngOnInit(): void {
    const populationId = this.route.snapshot.paramMap.get('id');
    if (populationId) {
      this.loadPopulation(populationId);
      this.loadMembers(populationId);
    }
  }

  private loadPopulation(id: string): void {
    this.populationService.listPopulations().subscribe({
      next: (populations) => {
        this.population = populations.find((p) => p.id === id) || null;
      },
      error: () => {
        this.error = this.i18n.translate('populationList.errorLoad');
        this.loading = false;
      },
    });
  }

  private loadMembers(populationId: string): void {
    this.populationService.listMembers(populationId).subscribe({
      next: (data) => {
        this.members = data;
        this.loading = false;
      },
      error: () => {
        this.error = this.i18n.translate('populationMembers.errorLoad');
        this.loading = false;
      },
    });
  }

  addMember(): void {
    if (this.population) {
      this.router.navigate(['/admin/populations', this.population.id, 'members', 'new']);
    }
  }

  editMember(memberId: string): void {
    if (this.population) {
      this.router.navigate(['/admin/populations', this.population.id, 'members', memberId, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/populations']);
  }

  getStatusLabel(status: string): string {
    return status === 'ACTIVE'
      ? this.i18n.translate('populationList.active')
      : this.i18n.translate('populationList.closed');
  }

  getStatusClass(status: string): string {
    return status === 'ACTIVE' ? 'status-badge-active' : 'status-badge-closed';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  }
}
