import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Deck} from "../../models/deck.model";
import {Observable} from "rxjs";
import {Flashcard} from "../../models/flashcard.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  private apiUrl = environment.apiBaseUrl +'/deck';

  constructor(private http: HttpClient) {}

  createDeck(deck: Deck): Observable<Deck> {
    return this.http.post<Deck>(this.apiUrl, deck);
  }

  getAllDecks(): Observable<Deck[]> {
    return this.http.get<Deck[]>(this.apiUrl);
  }

  getDeckById(id: number): Observable<Deck> {
    return this.http.get<Deck>(`${this.apiUrl}/${id}`);
  }

  updateDeck(id: number, deck: Deck): Observable<Deck> {
    return this.http.put<Deck>(`${this.apiUrl}/${id}`, deck);
  }

  deleteDeck(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCardsByDeckId(deckId: number): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${this.apiUrl}/${deckId}/cards`);
  }
}
