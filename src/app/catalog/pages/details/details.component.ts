import { CommonModule } from '@angular/common';
import { AfterViewInit, Component} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ISneakers } from 'app/catalog/model/sneaker.model';
import { CatalogService } from 'app/catalog/services/catalog.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarouselComponent } from "../../carousel/carousel.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addBasketItem, getBasket } from 'app/store/actions/basket.action';
import { MatIconModule } from '@angular/material/icon';
import { basketSelector } from 'app/store/selectors/basket.selector';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, CarouselComponent, ReactiveFormsModule, RouterModule, MatIconModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements AfterViewInit{
  sneakerCount = new FormControl(1);
  hoveredItem: string = '';
  sneaksId!:number;
  activeIndex!:number;

  showSuccessMessageSbj = new BehaviorSubject<boolean>(false);
  showSuccessMessage$:Observable<boolean> = this.showSuccessMessageSbj.asObservable();

  showFailureMessageSbj = new BehaviorSubject<boolean>(false);
  showFailureMessage$:Observable<boolean> = this.showFailureMessageSbj.asObservable();

  activeSizeSubj = new BehaviorSubject<number|null>(null);
  activeSize$: Observable<number|null> = this.activeSizeSubj.asObservable();

  activeSizeCountSubj = new BehaviorSubject<number|null>(null);
  activeSizeCount$: Observable<number|null> = this.activeSizeCountSubj.asObservable();

  activatedPictureSubj = new BehaviorSubject<ISneakers|null>(null);
  activatedPicture$ = this.activatedPictureSubj.asObservable();

  sneakersSubj = new BehaviorSubject<ISneakers[]|null>(null);
  sneakers$ : Observable<ISneakers[]|null> = this.sneakersSubj.asObservable();

  basketSubj = new BehaviorSubject<ISneakers[]|null>(null);
  basket$: Observable<ISneakers[]|null> = this.store.select(basketSelector);
  
  sizes = Array.from({ length: 48 - 35 + 1 }, (_, i) => 35 + i);
  constructor(
    private route:ActivatedRoute, 
    private catalogService:CatalogService, 
    private router:Router,
    private store:Store){
      this.basket$.subscribe({
        next:(value) => {
          this.basketSubj.next(value);
        },
        error:(error) => {
          console.log('Something went wrong, when trying to load basket', error);
        }
      })
    }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.sneaksId = parseInt(params['id']);
      this.catalogService.getSneakerById(this.sneaksId).subscribe({
        next:(value)=>{
          const sneakers = value.find(sneaker=>sneaker.id === this.sneaksId);
          this.hoveredItem = sneakers?.main_picture as string;
          sneakers?.pictures?.unshift(sneakers.main_picture);
          this.activatedPictureSubj.next(sneakers as ISneakers);
          this.activeIndex = value.indexOf(sneakers as ISneakers);
          this.sneakersSubj.next(value);
        },
        error:(error)=>{
          console.log('Something went wrong',error);
        }
      })
    });

    this.activeSize$.subscribe({ 
      next:(size)=>{
        if(size){
          const sizeCount = (this.sneakersSubj.getValue()  as ISneakers[])[this.activeIndex].sizes?.find((value) => value.size == size)?.count;
          this.activeSizeCountSubj.next(sizeCount as number);  
        }
      }
    })

    this.store.dispatch(getBasket());
  }
  
  changeColor(id:number){
    this.router.navigate(['/details',id]);
    this.activatedPictureSubj.next(null);
    this.activeSizeSubj.next(null);
    this.activeSizeCountSubj.next(null);
    this.sneakersSubj.next(null);
    console.log(this.activeIndex);
  }

  handleItemHovered(item: string) { 
    this.hoveredItem = item; 
  }
  
  sizeExist(size:number){
    return (this.sneakersSubj.getValue()  as ISneakers[])[this.activeIndex].sizes?.some( (value) => value.size == size && value.count > 0);  
  }

  changeSize(size:number){
    this.activeSizeSubj.next(size);
    this.sneakerCount.setValue(1);
  }

  increment(){
    if((this.sneakerCount.value as number) + 1 <=  (this.activeSizeCountSubj.getValue() as number)){
      this.sneakerCount.setValue((this.sneakerCount.value as number) + 1 );
    }
  }

  decrement(){
    if((this.sneakerCount.value as number) > 1){
      this.sneakerCount.setValue((this.sneakerCount.value as number) - 1 );
    }
  }

  saveToBasket(item:ISneakers){
    const auth = localStorage.getItem('token');
    const basketExist = (this.basketSubj.getValue() as ISneakers[]).find(sneaker => (sneaker.id == this.sneaksId && sneaker.size == this.activeSizeSubj.getValue()));
    let count = this.sneakerCount.value as number;
    const countCheck = basketExist?.sizes?.find(sneak => sneak.size == this.activeSizeSubj.getValue())?.count as number;
    if(auth){

      if(basketExist){
        if(countCheck < (basketExist.count as number) + count){
          count = countCheck;
        } else {
          count = (basketExist.count as number) + count;
        }
      }

      const newItem = {...item,size:this.activeSizeSubj.getValue() as number,count:count };
      this.store.dispatch(addBasketItem({ item:newItem }));
      this.triggerSuccessMessage();
    } else {
      this.showFailureMessageSbj.next(true);
    }
    
  }

  triggerSuccessMessage() {
    this.showSuccessMessageSbj.next(true);
    setTimeout(() => {
      this.showSuccessMessageSbj.next(false);
    }, 1000); 
  }

  closeFailureMessage() {
    this.showFailureMessageSbj.next(false);
  }

}
