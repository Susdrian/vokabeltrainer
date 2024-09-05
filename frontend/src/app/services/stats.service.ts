import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Stats} from "../../models/stats.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private baseUrl = environment.apiBaseUrl +'/stats';

  constructor(private http: HttpClient) {}

  createStats(stats: Stats): Observable<Stats> {
    return this.http.post<Stats>(this.baseUrl, stats);
  }

  updateStats(userId: number, cardId: number, stats: Stats): Observable<Stats> {
    return this.http.put<Stats>(`${this.baseUrl}/${userId}/${cardId}`, stats);
  }

  deleteStats(userId: number, cardId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/${cardId}`);
  }

  getStatsByIds(userId: number, cardId: number): Observable<Stats> {
    return this.http.get<Stats>(`${this.baseUrl}/${userId}/${cardId}`);
  }

  getAllStats(): Observable<Stats[]> {
    return this.http.get<Stats[]>(this.baseUrl);
  }
}
