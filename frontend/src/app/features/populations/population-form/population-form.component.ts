import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PopulationService, PopulationDto } from '../../../core/services/population.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-population-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './population-form.component.html',
  styleUrl: './population-form.component.scss',
})
export class PopulationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private populationService = inject(PopulationService);
  protected i18n = inject(I18nService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  populationForm = this.fb.group({
    name: ['', [Validators.required]],
    status: ['ACTIVE', [Validators.required]],
  });

  editingPopulation: PopulationDto | null = null;
  error: string | null = null;
  submitting = false;

  statusOptions = ['ACTIVE', 'CLOSED'];

  ngOnInit(): void {
    const populationId = this.route.snapshot.paramMap.get('id');
    if (populationId) {
      this.loadPopulation(populationId);
    }
  }

  private loadPopulation(id: string): void {
    this.populationService.listPopulations().subscribe({
      next: (populations) => {
        const population = populations.find((p) => p.id === id);
        if (population) {
          this.editingPopulation = population;
          this.populationForm.reset({
            name: population.name,
            status: population.status,
          });
        }
      },
      error: () => {
        this.error = this.i18n.translate('populationList.errorLoad');
      },
    });
  }

  get isEdit(): boolean {
    return !!this.editingPopulation;
  }

  submit(): void {
    if (this.populationForm.invalid || this.submitting) {
      return;
    }

    this.submitting = true;
    this.error = null;

    const raw = this.populationForm.getRawValue();
    const formValue = {
      name: raw.name ?? '',
      status: (raw.status ?? 'ACTIVE') as 'ACTIVE' | 'CLOSED',
    };

    if (this.isEdit && this.editingPopulation) {
      this.populationService.updatePopulation(this.editingPopulation.id, formValue).subscribe({
        next: () => {
          this.router.navigate(['/admin/populations']);
        },
        error: (err) => {
          this.submitting = false;
          this.handleError(err);
        },
      });
    } else {
      this.populationService.createPopulation(formValue).subscribe({
        next: () => {
          this.router.navigate(['/admin/populations']);
        },
        error: (err) => {
          this.submitting = false;
          this.handleError(err);
        },
      });
    }
  }

  private handleError(err: any): void {
    if (err.status === 400 && err.error?.message) {
      if (err.error.message.toLowerCase().includes('unique')) {
        this.error = this.i18n.translate('populationForm.nameUnique');
      } else {
        this.error = err.error.message;
      }
    } else {
      this.error = this.isEdit
        ? this.i18n.translate('populationList.errorUpdate')
        : this.i18n.translate('populationList.errorCreate');
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/populations']);
  }

  getPageTitle(): string {
    return this.isEdit
      ? this.i18n.translate('populationForm.editPopulation')
      : this.i18n.translate('populationForm.createPopulation');
  }
}
