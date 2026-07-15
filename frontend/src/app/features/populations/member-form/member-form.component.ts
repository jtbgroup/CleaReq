import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTooltipModule } from "@angular/material/tooltip";

import {
  PopulationService,
  PopulationMemberDto,
} from "../../../core/services/population.service";
import { PersonService } from "../../../core/services/person.service";
import {
  CatalogEntryDto,
  CatalogService,
} from "../../../core/services/catalog.service";
import { I18nService } from "../../../core/i18n/i18n.service";
import { TranslatePipe } from "../../../core/i18n/translate.pipe";

@Component({
  selector: "app-member-form",
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: "./member-form.component.html",
  styleUrl: "./member-form.component.scss",
})
export class MemberFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private populationService = inject(PopulationService);
  private personService = inject(PersonService);
  private catalogService = inject(CatalogService);
  protected i18n = inject(I18nService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  memberForm = this.fb.group(
    {
      personId: ["", Validators.required],
      functionId: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: [""],
    },
    { validators: [this.endDateAfterStartDate()] },
  );

  persons: Array<{
    id: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
  }> = [];
  functions: CatalogEntryDto[] = [];
  editingMember: PopulationMemberDto | null = null;
  populationId: string | null = null;
  error: string | null = null;
  submitting = false;
  loading = true;

  ngOnInit(): void {
    this.populationId = this.route.snapshot.paramMap.get("populationId");
    const memberId = this.route.snapshot.paramMap.get("memberId");

    // Load persons and functions
    Promise.all([this.loadPersons(), this.loadFunctions()]).then(() => {
      if (memberId && this.populationId) {
        this.loadMember(this.populationId, memberId);
      } else {
        this.loading = false;
      }
    });
  }

  private loadPersons(): Promise<void> {
    return new Promise((resolve) => {
      this.personService.listPersons().subscribe({
        next: (data) => {
          // Filter only enabled persons
          this.persons = data.filter((p) => p.enabled);
          resolve();
        },
        error: () => {
          this.error = this.i18n.translate("populationMembers.errorLoad");
          resolve();
        },
      });
    });
  }

  private loadFunctions(): Promise<void> {
    return new Promise((resolve) => {
      this.catalogService.listEntries("FUNCTION").subscribe({
        next: (data: CatalogEntryDto[]) => {
          // Filter only enabled functions
          this.functions = data.filter((f) => f.enabled);
          resolve();
        },
        error: () => {
          this.error = this.i18n.translate("populationMembers.errorLoad");
          resolve();
        },
      });
    });
  }

  private loadMember(populationId: string, memberId: string): void {
    this.populationService.listMembers(populationId).subscribe({
      next: (members) => {
        const member = members.find((m) => m.id === memberId);
        if (member) {
          this.editingMember = member;
          this.memberForm.reset({
            personId: member.personId,
            // The member DTO does not expose functionId; user can pick the current function explicitly.
            functionId: "",
            startDate: this.formatDateForInput(member.startDate),
            endDate: member.endDate
              ? this.formatDateForInput(member.endDate)
              : "",
          });
          // Disable personId and startDate in edit mode
          this.memberForm.get("personId")?.disable();
          this.memberForm.get("startDate")?.disable();
        }
        this.loading = false;
      },
      error: () => {
        this.error = this.i18n.translate("populationMembers.errorLoad");
        this.loading = false;
      },
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  private endDateAfterStartDate(): ValidatorFn {
    return (fg: AbstractControl) => {
      const startDate = fg.get("startDate")?.value;
      const endDate = fg.get("endDate")?.value;

      if (!startDate || !endDate) {
        return null;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      return end >= start ? null : { dateRange: true };
    };
  }

  get isEdit(): boolean {
    return !!this.editingMember;
  }

  submit(): void {
    if (this.memberForm.invalid || this.submitting) {
      return;
    }

    if (!this.populationId) {
      return;
    }

    this.submitting = true;
    this.error = null;

    const raw = this.memberForm.getRawValue();

    if (this.isEdit && this.editingMember) {
      const updatePayload = {
        functionId: raw.functionId ?? undefined,
        endDate: raw.endDate ?? undefined,
      };
      this.populationService
        .updateMember(this.populationId, this.editingMember.id, updatePayload)
        .subscribe({
          next: () => {
            this.router.navigate(["/admin/populations", this.populationId]);
          },
          error: (err) => {
            this.submitting = false;
            this.handleError(err);
          },
        });
    } else {
      const addPayload = {
        personId: raw.personId ?? "",
        functionId: raw.functionId ?? "",
        startDate: raw.startDate ?? "",
        endDate: raw.endDate ?? undefined,
      };

      this.populationService
        .addMember(this.populationId, addPayload)
        .subscribe({
          next: () => {
            this.router.navigate(["/admin/populations", this.populationId]);
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
      const message = err.error.message.toLowerCase();
      if (message.includes("disabled")) {
        this.error = this.i18n.translate("populationMembers.personDisabled");
      } else if (message.includes("function")) {
        this.error = this.i18n.translate("populationMembers.functionDisabled");
      } else {
        this.error = err.error.message;
      }
    } else {
      this.error = this.isEdit
        ? this.i18n.translate("populationMembers.errorUpdate")
        : this.i18n.translate("populationMembers.errorAdd");
    }
  }

  cancel(): void {
    if (this.populationId) {
      this.router.navigate(["/admin/populations", this.populationId]);
    }
  }

  getPageTitle(): string {
    return this.isEdit
      ? this.i18n.translate("memberForm.editMember")
      : this.i18n.translate("memberForm.addMember");
  }

  hasDateRangeError(): boolean {
    return this.memberForm.hasError("dateRange") && this.memberForm.touched;
  }
}
