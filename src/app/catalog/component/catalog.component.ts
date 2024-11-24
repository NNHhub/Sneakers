import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject} from 'rxjs';
import { ISneakers } from '../model/sneaker.model';


@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  sneakersSubj = new BehaviorSubject<ISneakers|null>(null);
  sneakers = this.sneakersSubj.asObservable();
  constructor(private http:HttpClient){
    this.http.get('http://localhost:3000/sneakers/getSneaker').subscribe({
      next:(val) => {
        this.sneakersSubj.next(val as ISneakers);
      },
      error:(error)=>{
        console.log('Something wrong', error);
      }
    })
  }
  isFavorite = new BehaviorSubject<boolean[]>([]);

  changeFavorite(index?:number){
    let arr:boolean[] = [];

    if(index || index === 0){
      arr = this.isFavorite.getValue();
      arr[index] = arr[index] ? false : true;
      this.isFavorite.next(arr);
    } else {
      this.sneakersSubj.getValue()?.details.forEach(()=>{
        arr.push(false);
      })
      this.isFavorite.next(arr);
    }
  }


}
