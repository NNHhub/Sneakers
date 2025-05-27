import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISneakers } from 'app/catalog/model/sneaker.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { basketSelector } from 'app/store/selectors/basket.selector';
import { deleteBasketItem, getBasket } from 'app/store/actions/basket.action';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent {
  basket$:Observable<ISneakers[]> = this.store.select(basketSelector);
  basketSubj = new BehaviorSubject<ISneakers[]>([]);
  totalBasketCurr:number = 0;
  constructor(private store: Store){
    this.store.dispatch(getBasket());
    this.basket$.subscribe({
      next:(basket)=>{
        this.totalBasketCurr = 0;
        basket.map(sneaker => this.totalBasketCurr += Number(sneaker.price));
        this.basketSubj.next(basket);
        console.log(this.totalBasketCurr);
        console.log(basket);
      }
    })
  }

  deleteItem(id:number){
    this.store.dispatch(deleteBasketItem({id}));
  }

  increment(){
    
  }

  decrement(){
    
  }
}
