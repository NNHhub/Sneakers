import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISneakers } from '../model/sneaker.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private API_URL = 'http://localhost:3000/sneakers';
  constructor(private http: HttpClient) {}

  getCatalogData() {
    return this.http.get<ISneakers[]>(`${this.API_URL}/getSneaker`);
  }
}
