import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ISneakers } from 'app/catalog/model/sneaker.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { basketSelector } from 'app/store/selectors/basket.selector';
import { deleteBasketItem, deleteBasketItemSuccess, getBasket, updateBasketItem } from 'app/store/actions/basket.action';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { BasketService } from '../services/basket.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule, 
    MatIconModule, 
    ReactiveFormsModule, 
    MatInputModule,
    NgxMaskDirective
    ],
  providers:[provideNgxMask()],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnDestroy{
  private subscriptions: Subscription[] = [];

  showMessageSbj = new BehaviorSubject<boolean> (false);
  showMessage$:Observable<boolean> = this.showMessageSbj.asObservable();

  basketForm:FormGroup = this.fb.group({
    firstName: [
      '',
      [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
    ],

    lastName: [
      '',
      [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
    ],

    phone: [
      '',
      [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
    ],

    city: [
      '',
      [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
    ],

    street: [
      '',
      [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
    ],

    house: [
      '',
      [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
    ],

    apartment: [
      '',
      [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
    ],

    entrance: [
      '',
      [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)],
    ],

    comments: [
      ''
    ],
  });

  errorMassage : (string|null)[] = [];

  basketGroup = new FormGroup({
    counts: new FormArray([])
  });

  basket$:Observable<ISneakers[]> = this.store.select(basketSelector);
  basketSubj = new BehaviorSubject<ISneakers[]>([]);
  totalBasketCurr:number = 0;
  constructor(private store: Store, public fb: FormBuilder, private basketService: BasketService){
    this.store.dispatch(getBasket());
    this.subscriptions.push(
      this.basket$.subscribe({
        next:(basket)=>{
          this.totalBasketCurr = 0;
          basket.map(sneaker => {
            const checkVal = sneaker.sizes?.find(obj=> obj.size == sneaker.size)?.count as number;
            if(checkVal < (sneaker.count as number)){
              if(checkVal == 0){
                this.errorMassage.push('There is no item on storage');
              } else {
                this.errorMassage.push('There isn\'t that much item on storage');
              }
            } else {
              this.errorMassage.push(null);
            }
            this.addToCounts(sneaker.count as number);
            const subtotal = Number(sneaker.price) * Number(sneaker.count);
            this.totalBasketCurr = Math.round((this.totalBasketCurr + subtotal) * 100) / 100;
          });
          this.basketSubj.next(basket);
        }
      })
    )
  }

  addToCounts(value:number){
    const control = this.basketGroup.get('counts') as FormArray;
    control.push(new FormControl(value));
  }

  deleteItem(id:number, size?:number){
    const delSize = size as number;
    this.store.dispatch(deleteBasketItem({id, size: delSize}));
  }
  
  increment(index:number, size?:number){
    const checkVal = this.basketSubj.getValue().at(index)?.sizes?.find(obj=> obj.size == size)?.count;
    const control = this.basketGroup.get('counts') as FormArray;
    if(control.at(index).value + 1< (checkVal as number)){
      const newValue = control.at(index).value + 1;
      control.at(index).patchValue(newValue);
      const newItem = {...this.basketSubj.getValue().at(index),count:newValue } as ISneakers;
      this.store.dispatch(updateBasketItem({ item:newItem }));
      this.errorMassage[index] = null;
    } else {
      if(checkVal==0){
          this.errorMassage[index] = 'There is no item on storage';
        }
    } 
  }

  decrement(index:number, size?:number){
    const checkVal = this.basketSubj.getValue().at(index)?.sizes?.find(obj=> obj.size == size)?.count;
    const control = this.basketGroup.get('counts') as FormArray;
    if(control.at(index).value - 1 > 0){
      const newValue = control.at(index).value - 1;
      control.at(index).patchValue(newValue);
      const newItem = {...this.basketSubj.getValue().at(index),count:newValue} as ISneakers;
      this.store.dispatch(updateBasketItem({ item:newItem }));
      if(control.at(index).value > (checkVal as number)){
        if(checkVal==0){
          this.errorMassage[index] = 'There is no item on storage';
        } else {
          this.errorMassage[index] = 'There isn\'t that much item on storage';
        } 
      } else {
        this.errorMassage[index] = null;
      }    
    } 
  }

  purchase () {
    this.subscriptions.push(
      this.basketService.buyItems(this.basketSubj.getValue()).subscribe({
        next:(value)=>{
          console.log('All done!', value);
          this.basketSubj.getValue().forEach((value)=>{
            this.store.dispatch(deleteBasketItemSuccess({id:value.id,size:value.size as number}));
          })
          this.triggerSuccessMessage();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error:(error)=>{
          console.log('Can not buy items', error);
        }
      })
    )
  }

  triggerSuccessMessage() {
    this.showMessageSbj.next(true);
    setTimeout(() => {
      this.showMessageSbj.next(false);
    }, 1000); 
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if(sub) {
        sub.unsubscribe();
      }
    })
  }
}
