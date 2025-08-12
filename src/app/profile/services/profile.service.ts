import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProfile } from '../models/profile.model';
import { ProfileSecurity } from '../models/profile-security';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private API_URL = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  getProfileData() {
    return this.http.get<IProfile>(`${this.API_URL}/getProfile`);
  }
  
  updateProfile(body:{first_name:string, last_name:string, phone: string, email: string}){
    return this.http.put(`${this.API_URL}/profileUdate`, body);
  }

  deleteProfile(password:string){
    return this.http.request('DELETE', `${this.API_URL}/deleteUser`,{body: { password: password }})
  }

  getProfileSecurity() {
    return this.http.get<ProfileSecurity>(`${this.API_URL}/getProfileSecurity`);
  }
  
  updateProfileSecurity(body:ProfileSecurity){
    return this.http.put(`${this.API_URL}/updateUserSecurity`, body);
  }
}
