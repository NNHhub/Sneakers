import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISneakers } from '../model/sneaker.model';
import { SneakersResponse } from '../model/sneakersDetails.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private API_URL = 'http://localhost:3000/sneakers';
  private nextPageToken:number|null = null;
  set setNextPageToken(token:number|null){ 
    this.nextPageToken = token;
  }
  get getNextPageToken(){
    return this.nextPageToken;
  }
  constructor(private http: HttpClient) {}

  getCatalogData(pageToken?:number) {
    return this.http.get<SneakersResponse>(`${this.API_URL}/getSneaker?limit=20${pageToken ? `&pageToken=${pageToken}` : ''}`);
  }

  getSneakerById(id:number){
    return this.http.get<ISneakers[]>(`${this.API_URL}/getSneaker/${id}`);
  }

  sneakerSearch(value:string, pageToken?:number){
    const body = {name: value};
    return this.http.post<SneakersResponse>(`${this.API_URL}/sneakerSearch?limit=20${pageToken ? `&pageToken=${pageToken}` : ''}`,body);
  }

  selectNames (value:string){
    const body = {name: value};
    return this.http.post<string[]>(`${this.API_URL}/selectSearch`,body);
  }
}
