import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../types/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  link = "http://localhost:3000/";
  loginUser(user: User): Observable<User> {
    console.log(user);
    return this.http.post<User>(this.link + 'user/login', user);
  }
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.link + 'user/register', user);
  }
}
