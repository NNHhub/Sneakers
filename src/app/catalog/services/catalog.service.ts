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
  private adminStorePageToken: number|null = null;

  set setNextPageToken(token:number|null){ 
    this.nextPageToken = token;
  }

  get getAdminNextPageToken(){
    return this.adminStorePageToken;
  }

  set setAdminNextPageToken(token:number|null){ 
    this.adminStorePageToken = token;
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
  
  //change the way of transffering data to server
  updateSneaker(id:number,details:{name: string, description:string, color: string, price: number, mainPic:string, addPic: string[]}){
    const body = {
      id:id,
      details:details
    }
    return this.http.post('http://localhost:3000/sneakers/update',body);
  }

  getPopularList (){
    return this.http.get<ISneakers[]>(`${this.API_URL}/getPopular`);
  }
}
