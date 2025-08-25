import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, fromEvent, map, Observable, Subscription, take} from 'rxjs';
import { Store } from '@ngrx/store';
import { CatalogStoreSelector} from 'app/store/selectors/catalog.selector';
import { deleteCatalog, getCatalog, searchInCatalog } from 'app/store/actions/catalog.action';
import { PaginationComponent } from "../pagination/pagination.component";
import { RouterModule } from '@angular/router';
import { ISneakers } from '../model/sneaker.model';
import { CatalogService } from '../services/catalog.service';
import { basketIdSelector } from 'app/store/selectors/basket.selector';
import { getBasket } from 'app/store/actions/basket.action';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    PaginationComponent,
    RouterModule,
    FormsModule,
    MatIconModule
],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements AfterViewInit, OnDestroy{
  private subscriptions: Subscription[] = [];

  basketId$:Observable<number[]> = this.store.select(basketIdSelector);
  selected:string ='';
  selectedValue:string ='';
  paginationCurrentPage!: Observable<number>;
  currentPage = new BehaviorSubject<number>(1);
  sneakers$ : Observable<ISneakers[]> = this.store.select(CatalogStoreSelector);
 
  sortListActive:boolean = false;

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
            this.store.dispatch(searchInCatalog(this.inputSearch.nativeElement.value,token,this.selectedValue));
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

    this.subscriptions.push( 
      this.sneakers$.pipe(take(1)).subscribe(value=>{
        if(value.length===0){
          this.store.dispatch(getCatalog());
        }   
      })
    )

    if(localStorage.getItem('token')){
      this.store.dispatch(getBasket());
    } 
  
  }

  ngAfterViewInit(): void {
    if (this.inputSearch) {
      this.subscriptions.push(
      fromEvent(this.inputSearch.nativeElement,"input").pipe(
        map((response: Event)=> (response.target as HTMLInputElement).value),
        debounceTime(1000),
        distinctUntilChanged()).subscribe((searchItem)=>{
          if(searchItem){
            this.store.dispatch(deleteCatalog());
            this.store.dispatch(searchInCatalog(searchItem,0,this.selectedValue));
          } else {
            this.store.dispatch(deleteCatalog());
            this.store.dispatch(getCatalog());
          }
        })
      )
    }    

    const select = document.querySelector('.sort-list') as HTMLInputElement;

    select.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'LI') {
        const selectedText = target.dataset['value'] as string;
        this.selectedValue = selectedText;
        this.selected = target.textContent as string;
        if (this.inputSearch.nativeElement.value) {
          this.store.dispatch(deleteCatalog());
          this.store.dispatch(searchInCatalog(this.inputSearch.nativeElement.value,0,this.selectedValue));
        } else {
          this.store.dispatch(deleteCatalog());
          this.store.dispatch(getCatalog(0,selectedText));
        }
        this.sortListActive = false;
      }
    });
  }

  getCurrPage(item: Observable<number>) { 
    this.paginationCurrentPage = item;
    this.subscriptions.push(
      this.paginationCurrentPage.subscribe(value=>{
        this.currentPage.next(value);
      })
    )
  }

  openSelect (){
    if(this.sortListActive) {
      this.sortListActive = false;
    } else {
      this.sortListActive = true;
    }
  }

  removeSort(){
    this.selectedValue = '';
    this.selected = '';
    this.store.dispatch(deleteCatalog());
    this.store.dispatch(getCatalog());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach( (sub) => {
      if(sub){
        sub.unsubscribe();
      }
    })
  }

}
