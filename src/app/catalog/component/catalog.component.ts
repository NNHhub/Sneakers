import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable } from 'rxjs';

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
  sneakers = new BehaviorSubject<string[]>([]);
  constructor(private http:HttpClient){
  }
  isFavorite = new BehaviorSubject<boolean[]>([]);

  changeFavorite(index?:number){
    let arr:boolean[] = [];

    if(index || index === 0){
      arr = this.isFavorite.getValue();
      arr[index] = arr[index] ? false : true;
      this.isFavorite.next(arr);
    } else {
      this.sneakers.getValue().forEach(()=>{
        arr.push(false);
      })
      this.isFavorite.next(arr);
    }
  }

  
}
