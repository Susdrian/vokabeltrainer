import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Flashcard} from "../../models/flashcard.model";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private baseUrl = environment.apiBaseUrl + '/flashcard';

  constructor(private http: HttpClient) {}

  getAllFlashcards(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${this.baseUrl}`);
  }

  getById(id: number): Observable<Flashcard> {
    return this.http.get<Flashcard>(`${this.baseUrl}/${id}`);
  }

  create(flashcard: Flashcard): Observable<Flashcard> {
    return this.http.post<Flashcard>(`${this.baseUrl}`, flashcard);
  }

  bulkCreate(flashcards: Flashcard[]): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/bulk`, flashcards);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  update(flashcard: Flashcard): Observable<Flashcard> {
    return this.http.put<Flashcard>(`${this.baseUrl}`, flashcard);
  }
}
