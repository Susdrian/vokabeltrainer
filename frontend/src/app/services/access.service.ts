import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Access} from "../../models/access.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private baseUrl = environment.apiBaseUrl + '/access';

  constructor(private http: HttpClient) {}

  getAllAccess(): Observable<Access[]> {
    return this.http.get<Access[]>(`${this.baseUrl}/`);
  }

  getAccessFromUserId(id: number): Observable<Access[]> {
    return this.http.get<Access[]>(`${this.baseUrl}/fromUserID/${id}`);
  }

  getAccessFromDeckId(id: number): Observable<Access[]> {
    return this.http.get<Access[]>(`${this.baseUrl}/fromDeckId/${id}`);
  }

  deleteAccess(access: Access): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete`, { body: access });
  }

  approveAccess(access: Access): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/approve`, access);
  }

  createAccess(access: Access): Observable<Access> {
    return this.http.post<Access>(`${this.baseUrl}/`, access);
  }
}
