import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, fromEvent, map, Observable, take} from 'rxjs';
import { Store } from '@ngrx/store';
import { CatalogStoreSelector} from 'app/store/selectors/catalog.selector';
import { deleteCatalog, getCatalog, searchInCatalog } from 'app/store/actions/catalog.action';
import { PaginationComponent } from "../pagination/pagination.component";
import { RouterModule } from '@angular/router';
import { ISneakers } from '../model/sneaker.model';
import { CatalogService } from '../services/catalog.service';

import { basketIdSelector } from 'app/store/selectors/basket.selector';
import { addBasketItem, deleteBasketItem, getBasket } from 'app/store/actions/basket.action';


@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    PaginationComponent,
    RouterModule
],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements AfterViewInit{
  basketId$:Observable<number[]> = this.store.select(basketIdSelector);

  paginationCurrentPage!: Observable<number>;
  currentPage = new BehaviorSubject<number>(1);
  sneakers$ : Observable<ISneakers[]> = this.store.select(CatalogStoreSelector);

  @ViewChild('inputSearch') inputSearch!: ElementRef<HTMLInputElement>;
  displayedSneakers$!:Observable<ISneakers[]|null>;
  settings = {
    array: this.sneakers$,
    itemPerPage: 15
  }
  constructor(private store:Store, private catalogService:CatalogService){
    this.displayedSneakers$ = combineLatest([this.sneakers$, this.currentPage]).pipe(
      map(([sneakers, currentPage]) => {
        if (sneakers.length) {
          const token = this.catalogService.getNextPageToken;
          if((sneakers.length/15)<currentPage && token){
            if(this.inputSearch.nativeElement.value){
              this.store.dispatch(searchInCatalog(this.inputSearch.nativeElement.value,token));
            } else {
              this.store.dispatch(getCatalog(token));
            } 
          }

          const firstIndex = (currentPage - 1) * this.settings.itemPerPage;
          const lastIndex = firstIndex + this.settings.itemPerPage;
          return sneakers.slice(firstIndex, lastIndex);
        }
        return [];
    }));

    this.sneakers$.pipe(take(1)).subscribe(value=>{
      if(value.length===0){
        this.store.dispatch(getCatalog());
      }   
    })
// if user not authorized don't ask for a basket
    this.store.dispatch(getBasket());
  }

  ngAfterViewInit(): void {
    if (this.inputSearch) {
      fromEvent(this.inputSearch.nativeElement,"input").pipe(
        map((response: Event)=> (response.target as HTMLInputElement).value),
        debounceTime(1000),
        distinctUntilChanged()).subscribe((searchItem)=>{
          if(searchItem){

            this.store.dispatch(deleteCatalog());
            this.store.dispatch(searchInCatalog(searchItem));
          } else {

            this.store.dispatch(deleteCatalog());
            this.store.dispatch(getCatalog());
          }
        })
    }    

  }

  getCurrPage(item: Observable<number>) { 
    this.paginationCurrentPage = item;
    this.paginationCurrentPage.subscribe(value=>{
      this.currentPage.next(value);
    });
  }

  

  changeFavorite(index:number){
    this.basketId$.pipe(take(1)).subscribe({
      next:(value) => {
        if(value.includes(index)){
          this.store.dispatch(deleteBasketItem({ id:index }))
        } else {
          this.sneakers$.pipe(take(1)).subscribe({
            next:(sneaker)=>{
              const item = sneaker.find( val => val.id === index ) as ISneakers;
              this.store.dispatch(addBasketItem({ item }));
            }
          })
        }
      },
      error:(error) => {
        console.log(error);
      }
    })
  }
}
