import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISneakers } from 'app/catalog/model/sneaker.model';

@Injectable({
  providedIn: 'root'
})



export class MainPageService {
  private api_Url = 'http://localhost:3000/sneakers';
  constructor(private http: HttpClient) {}

  getNewAddedSneakers(){
    return this.http.get<ISneakers[]>(`${this.api_Url}/getNewAdded`);
  }
}
