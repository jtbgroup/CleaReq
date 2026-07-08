import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CatalogEntryDto, CatalogService } from '../../../core/services/catalog.service';
import { PersonDto, PersonService } from '../../../core/services/person.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-person-form',
  standalone: true,
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
  ],
})
export class PersonFormComponent implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly catalogService = inject(CatalogService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  editingPerson: PersonDto | null = null;
  functions: CatalogEntryDto[] = [];
  error: string | null = null;

  personForm = this.fb.group({
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    functionId: ['', Validators.required],
  });

  ngOnInit() {
    this.loadFunctions();

    const personId = this.route.snapshot.paramMap.get('id');
    if (!personId) {
      return;
    }

    this.personService.listPersons().subscribe({
      next: persons => {
        const person = persons.find(p => p.id === personId);
        if (!person) {
          this.router.navigate(['/admin/persons']);
          return;
        }

        this.editingPerson = person;
        this.personForm.reset({
          lastName: person.lastName,
          firstName: person.firstName,
          email: person.email,
          functionId: '',
        });
        this.preselectFunction();
      },
      error: () => this.router.navigate(['/admin/persons']),
    });
  }

  get isEdit(): boolean {
    return !!this.editingPerson;
  }

  cancel() {
    this.router.navigate(['/admin/persons']);
  }

  onSubmit() {
    if (this.personForm.invalid) {
      return;
    }

    const { lastName, firstName, email, functionId } = this.personForm.value;

    if (this.editingPerson) {
      this.personService.updatePerson(this.editingPerson.id, {
        lastName: lastName ?? '',
        firstName: firstName ?? '',
        functionId: functionId ?? '',
      }).subscribe({
        next: () => this.router.navigate(['/admin/persons']),
        error: () => { this.error = this.i18n.translate('personList.errorUpdate'); },
      });
      return;
    }

    this.personService.createPerson({
      lastName: lastName ?? '',
      firstName: firstName ?? '',
      email: email ?? '',
      functionId: functionId ?? '',
    }).subscribe({
      next: () => this.router.navigate(['/admin/persons']),
      error: () => { this.error = this.i18n.translate('personList.errorCreate'); },
    });
  }

  private loadFunctions() {
    this.catalogService.listEntries('FUNCTION').subscribe({
      next: entries => {
        this.functions = entries.filter(entry => entry.enabled);
        this.preselectFunction();
      },
      error: () => {
        this.error = this.i18n.translate('personForm.errorLoadFunctions');
      },
    });
  }

  private preselectFunction() {
    if (!this.editingPerson || !this.functions.length) {
      return;
    }

    const match = this.functions.find(entry => entry.label === this.editingPerson?.functionLabel);
    if (!match) {
      return;
    }

    this.personForm.patchValue({ functionId: match.id });
  }
}
