import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProfile } from './models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private API_URL = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  getProfileData() {
    return this.http.get<IProfile>(`${this.API_URL}/profile`);
  }

  deleteProfile(password:string){
    return this.http.request('DELETE', `${this.API_URL}/users`,{body: { password: password }})
  }
}
