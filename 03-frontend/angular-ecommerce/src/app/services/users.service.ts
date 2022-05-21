import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../common/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = environment.luv2shopApiUrl + '/users';

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<Users[]> {

    return this.httpClient.get<Users[]>(this.baseUrl);
  }

  // ! why not Users instead of Object?
  createUser(user: Users): Observable<Object> {
    // will be converted from plain object to json and sent to the server
    // ! but why we do not need a generic type just like get()?
    return this.httpClient.post(this.baseUrl, user);
  }

  updateUser(id: number, user: Users): Observable<Object> {

    return this.httpClient.put(`${this.baseUrl}/${id}`, user);

  }

  deleteUser(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  getUserById(id: number): Observable<Users> {
    return this.httpClient.get<Users>(`${this.baseUrl}/${id}`);
  }
  
}
