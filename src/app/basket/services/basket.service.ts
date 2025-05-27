import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISneakers } from 'app/catalog/model/sneaker.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private API_URL = 'http://localhost:3000/basket';

  constructor(private http: HttpClient) {}

  setBasket(id: number, size: number, count: number){
    const body = { color_id : id, size: size, count: count };
    return this.http.post<number>(`${this.API_URL}/setBasket`, body);
  }
  
  getBasket(){
    return this.http.get<ISneakers[]>(`${this.API_URL}/getBasket`);
  }

  deleteFromBasket(id: number){
    const body = { id: id };
    return this.http.post<number>(`${this.API_URL}/deleteBasket`, body);
  }
}
