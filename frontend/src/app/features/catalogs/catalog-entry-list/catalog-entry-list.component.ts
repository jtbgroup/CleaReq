import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CatalogService, CatalogEntryDto, CatalogTypeDto } from '../../../core/services/catalog.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-catalog-entry-list',
  standalone: true,
  templateUrl: './catalog-entry-list.component.html',
  styleUrl: './catalog-entry-list.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    TranslatePipe,
  ],
})
export class CatalogEntryListComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly i18n = inject(I18nService);

  typeCode = '';
  catalogLabel = '';
  entries: CatalogEntryDto[] = [];
  displayedColumns = ['label', 'enabled', 'actions'];
  error: string | null = null;

  editingEntry: CatalogEntryDto | null = null;
  entryForm = this.fb.group({
    label: ['', Validators.required],
  });

  ngOnInit() {
    this.typeCode = this.route.snapshot.paramMap.get('typeCode') ?? '';
    this.catalogService.listTypes().subscribe({
      next: (types: CatalogTypeDto[]) => {
        const type = types.find(t => t.code === this.typeCode);
        this.catalogLabel = type?.label ?? this.typeCode;
      },
    });
    this.reload();
  }

  backToTypes() {
    this.router.navigate(['/admin/catalogs']);
  }

  startCreate() {
    this.editingEntry = null;
    this.entryForm.reset({ label: '' });
  }

  startEdit(entry: CatalogEntryDto) {
    this.editingEntry = entry;
    this.entryForm.reset({ label: entry.label });
  }

  cancelEdit() {
    this.editingEntry = null;
    this.entryForm.reset({ label: '' });
  }

  onSubmit() {
    if (this.entryForm.invalid) return;
    const label = this.entryForm.value.label ?? '';

    const request = this.editingEntry
      ? this.catalogService.updateEntry(this.typeCode, this.editingEntry.id, label)
      : this.catalogService.createEntry(this.typeCode, label);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.reload();
      },
      error: () => {
        this.error = this.editingEntry
          ? this.i18n.translate('catalogEntryList.errorUpdate')
          : this.i18n.translate('catalogEntryList.errorCreate');
      },
    });
  }

  toggleEnabled(entry: CatalogEntryDto) {
    const action = entry.enabled
      ? this.catalogService.disableEntry(this.typeCode, entry.id)
      : this.catalogService.enableEntry(this.typeCode, entry.id);

    action.subscribe({
      next: () => this.reload(),
      error: () => (this.error = this.i18n.translate('catalogEntryList.errorToggle')),
    });
  }

  private reload() {
    this.catalogService.listEntries(this.typeCode).subscribe({
      next: entries => (this.entries = entries),
      error: () => (this.error = this.i18n.translate('catalogEntryList.errorLoad')),
    });
  }
}