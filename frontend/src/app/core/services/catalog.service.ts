import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CatalogTypeDto {
  id: string;
  code: string;
  label: string;
}

export interface CatalogEntryDto {
  id: string;
  label: string;
  enabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {

  private readonly apiUrl = `${environment.apiBaseUrl}/api/catalogs`;
  private readonly http = inject(HttpClient);

  listTypes(): Observable<CatalogTypeDto[]> {
    return this.http.get<CatalogTypeDto[]>(this.apiUrl, { withCredentials: true });
  }

  listEntries(typeCode: string): Observable<CatalogEntryDto[]> {
    return this.http.get<CatalogEntryDto[]>(`${this.apiUrl}/${typeCode}/entries`, { withCredentials: true });
  }

  createEntry(typeCode: string, label: string): Observable<CatalogEntryDto> {
    return this.http.post<CatalogEntryDto>(`${this.apiUrl}/${typeCode}/entries`, { label }, { withCredentials: true });
  }

  updateEntry(typeCode: string, id: string, label: string): Observable<CatalogEntryDto> {
    return this.http.put<CatalogEntryDto>(`${this.apiUrl}/${typeCode}/entries/${id}`, { label }, { withCredentials: true });
  }

  disableEntry(typeCode: string, id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${typeCode}/entries/${id}/disable`, {}, { withCredentials: true });
  }

  enableEntry(typeCode: string, id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${typeCode}/entries/${id}/enable`, {}, { withCredentials: true });
  }
}