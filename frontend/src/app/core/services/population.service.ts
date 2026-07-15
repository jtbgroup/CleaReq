import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PopulationDto {
  id: string;
  name: string;
  status: 'ACTIVE' | 'CLOSED';
  memberCount: number;
}

export interface CreatePopulationRequest {
  name: string;
  status?: 'ACTIVE' | 'CLOSED';
}

export interface UpdatePopulationRequest {
  name: string;
  status: 'ACTIVE' | 'CLOSED';
}

export interface PopulationMemberDto {
  id: string;
  personId: string;
  personFullName: string;
  functionLabel: string;
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  endDate: string | null;
}

export interface AddPopulationMemberRequest {
  personId: string;
  functionId: string;
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  endDate?: string; // ISO 8601 format (YYYY-MM-DD), optional
}

export interface UpdatePopulationMemberRequest {
  functionId?: string;
  endDate?: string; // ISO 8601 format (YYYY-MM-DD)
}

@Injectable({ providedIn: 'root' })
export class PopulationService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/populations`;
  private readonly http = inject(HttpClient);

  listPopulations(): Observable<PopulationDto[]> {
    return this.http.get<PopulationDto[]>(this.apiUrl, { withCredentials: true });
  }

  createPopulation(request: CreatePopulationRequest): Observable<PopulationDto> {
    return this.http.post<PopulationDto>(this.apiUrl, request, { withCredentials: true });
  }

  updatePopulation(id: string, request: UpdatePopulationRequest): Observable<PopulationDto> {
    return this.http.put<PopulationDto>(`${this.apiUrl}/${id}`, request, { withCredentials: true });
  }

  listMembers(populationId: string): Observable<PopulationMemberDto[]> {
    return this.http.get<PopulationMemberDto[]>(`${this.apiUrl}/${populationId}/members`, {
      withCredentials: true,
    });
  }

  addMember(populationId: string, request: AddPopulationMemberRequest): Observable<PopulationMemberDto> {
    return this.http.post<PopulationMemberDto>(`${this.apiUrl}/${populationId}/members`, request, {
      withCredentials: true,
    });
  }

  updateMember(
    populationId: string,
    memberId: string,
    request: UpdatePopulationMemberRequest
  ): Observable<PopulationMemberDto> {
    return this.http.put<PopulationMemberDto>(
      `${this.apiUrl}/${populationId}/members/${memberId}`,
      request,
      { withCredentials: true }
    );
  }
}
