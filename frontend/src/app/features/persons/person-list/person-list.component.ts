import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PersonDto, PersonService } from '../../../core/services/person.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-person-list',
  standalone: true,
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.scss',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
  ],
})
export class PersonListComponent implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  persons: PersonDto[] = [];
  displayedColumns = ['lastName', 'firstName', 'email', 'function', 'enabled', 'actions'];
  error: string | null = null;

  ngOnInit() {
    this.reload();
  }

  goToCreate() {
    this.router.navigate(['/admin/persons/new']);
  }

  goToEdit(person: PersonDto) {
    this.router.navigate(['/admin/persons', person.id, 'edit']);
  }

  disable(person: PersonDto) {
    this.personService.disablePerson(person.id).subscribe({
      next: () => this.reload(),
      error: () => (this.error = this.i18n.translate('personList.errorDisable')),
    });
  }

  private reload() {
    this.personService.listPersons().subscribe({
      next: persons => (this.persons = persons),
      error: () => (this.error = this.i18n.translate('personList.errorLoad')),
    });
  }
}
