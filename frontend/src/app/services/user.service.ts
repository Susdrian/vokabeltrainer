import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserIn} from "../../models/userIn.model";
import {Deck} from "../../models/deck.model";
import {UserOut} from "../../models/userOut.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiBaseUrl + '/user';

  constructor(private http: HttpClient) { }

  createUser(username: string, password: string): Observable<UserIn> {
    return this.http.post<UserOut>(`${this.apiUrl}/`, { username, password });
  }

  updateUser(id: number, user: UserIn): Observable<UserIn> {
    return this.http.put<UserOut>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserById(id: number): Observable<UserIn> {
    return this.http.get<UserIn>(`${this.apiUrl}/${id}`);
  }

  getAllUsers(): Observable<UserIn[]> {
    return this.http.get<UserIn[]>(`${this.apiUrl}/`);
  }

  getUserDecks(userId: number): Observable<Deck[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/decks`);
  }

  getUserByName(username: string): Observable<UserIn> {
    return this.http.get<UserIn>(`${this.apiUrl}/byname/${username}`);
  }
}
