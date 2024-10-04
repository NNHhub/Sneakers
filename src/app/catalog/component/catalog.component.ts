import { CommonModule } from '@angular/common';
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
  listing = [
    {name:'Nike "What the Duck" dunk', price:500, image:'assets/nike-what-the-duck-dunk.jpg'},
    {name:'Nike Travis Scott Jordan 1 low', price:600, image:'assets/travis-scott-jordan-1-low-medium-olive.jpg'}
  ]
  isFavorite = new BehaviorSubject<boolean[]>([]);

  constructor(){
    this.changeFavorite();
  }

  changeFavorite(index?:number){
    let arr:boolean[] = [];

    if(index || index === 0){
      arr = this.isFavorite.getValue();
      arr[index] = arr[index] ? false : true;
      this.isFavorite.next(arr);
    } else {
      this.listing.forEach(()=>{
        arr.push(false);
      })
      this.isFavorite.next(arr);
    }
  }

  
}
