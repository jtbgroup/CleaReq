import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PersonDto {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  functionLabel: string;
  enabled: boolean;
}

export interface CreatePersonDto {
  lastName: string;
  firstName: string;
  email: string;
  functionId: string;
}

export interface UpdatePersonDto {
  lastName: string;
  firstName: string;
  functionId: string;
}

@Injectable({ providedIn: 'root' })
export class PersonService {

  private readonly apiUrl = `${environment.apiBaseUrl}/api/persons`;
  private readonly http = inject(HttpClient);

  listPersons(): Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(this.apiUrl, { withCredentials: true });
  }

  createPerson(payload: CreatePersonDto): Observable<PersonDto> {
    return this.http.post<PersonDto>(this.apiUrl, payload, { withCredentials: true });
  }

  updatePerson(id: string, payload: UpdatePersonDto): Observable<PersonDto> {
    return this.http.put<PersonDto>(`${this.apiUrl}/${id}`, payload, { withCredentials: true });
  }

  disablePerson(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/disable`, {}, { withCredentials: true });
  }
}
