import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, Observable, take} from 'rxjs';
import { Store } from '@ngrx/store';
import { CatalogStoreSelector} from 'app/store/selectors/catalog.selector';
import { deleteCatalog, getCatalog, searchInCatalog } from 'app/store/actions/catalog.action';
import { PaginationComponent } from "../pagination/pagination.component";
import { PaginationService } from '../services/pagination.service';
import { RouterModule } from '@angular/router';
import { ISneakers } from '../model/sneaker.model';
import { CatalogService } from '../services/catalog.service';


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
          if((sneakers.length/18)<currentPage && token){
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
    
  }

  ngAfterViewInit(): void {
    if (this.inputSearch) {
      fromEvent(this.inputSearch.nativeElement,"input").pipe(
        map((response: Event)=> (response.target as HTMLInputElement).value),
        debounceTime(1000),
        distinctUntilChanged()).subscribe((searchItem)=>{
          if(searchItem){
            this.catalogService.setNextPageToken = null;
            this.store.dispatch(deleteCatalog());
            this.store.dispatch(searchInCatalog(searchItem));
          } else {
            this.catalogService.setNextPageToken = null;
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

  isFavorite = new BehaviorSubject<boolean[]>([]);

  changeFavorite(index?:number){
  
  }
}
