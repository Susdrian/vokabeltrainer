import {BehaviorSubject, firstValueFrom, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {UserIn} from "../models/userIn.model";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private baseUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(this.retrieveToken());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private retrieveToken(): any {
    const token = localStorage.getItem('token');
    return token ? {token} : null;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/user/login`, {username, password})
      .pipe(map(response => {
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next({token: response.token});
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  checkLogin(): Observable<boolean> {
    const isLoggedIn = !!this.currentUserSubject.value;
    return of(isLoggedIn);
  }

  async getCurrentUserValue(): Promise<UserIn> {
    const token = localStorage.getItem('token');
    if (!token) {
      await this.router.navigate(['/main']);
    }
    const headers = {'Authorization': `Bearer ${token}`};
    try {
      return await firstValueFrom(this.http.get<UserIn>(this.baseUrl + "/user/getfromjwt", {headers}));
    } catch (e) {
      await this.router.navigate(['/main']);
    }
    return {username: "", id: 0, lastlogin: new Date(), registrationdate: new Date()};
  }
}

