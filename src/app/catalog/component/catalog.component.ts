import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, take} from 'rxjs';
import { ISneakers } from '../model/sneaker.model';
import { Store } from '@ngrx/store';
import { CatalogStoreSelector} from 'app/store/selectors/catalog.selector';
import { getCatalog } from 'app/store/actions/catalog.action';


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
  sneakersSubj = new BehaviorSubject<{
    name:string,
    color:string,
    mainPic:string,
    price:number
  }[]|null>(null);
  sneakers = this.sneakersSubj.asObservable();
  constructor(private store:Store){
    this.store.select(CatalogStoreSelector).pipe(take(2)).subscribe(data=>{
      if(!data){
        this.store.dispatch(getCatalog());
      }else{
        this.sneakersSubj.next(data);
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
      this.sneakersSubj.getValue()?.map(()=>{
        arr.push(false);
      });
      this.isFavorite.next(arr);
    }
  }


}
