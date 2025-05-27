import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paginator } from '../model/paginator.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISneakers } from '../model/sneaker.model';


@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnChanges, AfterViewInit{
  
  @Input() inputPaginationSettings!:{
    array:Observable<ISneakers[]>,
    itemPerPage?:number,
  } 
  
  
  private buttonsNumber!:number;
  currPageSubject = new BehaviorSubject<number>(1);
  lengthSubject = new BehaviorSubject<number>(0);
  pageSubject = new BehaviorSubject<number[]>([]);
  pagination = new BehaviorSubject<Paginator>({
      length:this.lengthSubject.getValue(),
      itemPerPage:15,
      currentPage$:this.currPageSubject.asObservable(),
      page$: this.pageSubject.asObservable(),
  });  
  @Output() paginationCurrPage = new EventEmitter<Observable<number>>();
  
  ngOnChanges(): void {
    this.inputPaginationSettings.array.subscribe(value=>{
      if(this.lengthSubject.getValue()>=value.length){
        this.lengthSubject.next(value.length);
        this.resetPagination();
      } else {
        this.lengthSubject.next(value.length);
        this.setButtons();
      }
      
    });

    this.pagination.next({
      length:this.lengthSubject.getValue(),
      itemPerPage:this.inputPaginationSettings?.itemPerPage?this.inputPaginationSettings.itemPerPage:15,
      currentPage$:this.currPageSubject.asObservable(),
      page$: this.pageSubject.asObservable(),
    })
    
  }

  ngAfterViewInit(): void {
    this.paginationCurrPage.emit(this.pagination.getValue().currentPage$);
  }

  constructor(){
    this.setButtons();
  }
  
  resetPagination(){
    this.pagination.next({
      length:this.lengthSubject.getValue(),
      itemPerPage:this.inputPaginationSettings?.itemPerPage?this.inputPaginationSettings.itemPerPage:15,
      currentPage$:this.currPageSubject.asObservable(),
      page$: this.pageSubject.asObservable(),
    })
    this.currPageSubject.next(1);
    this.pageSubject.next([]);
    this.setButtons();
  }
  
  numOfButtons(){
    this.buttonsNumber = Math.ceil(this.lengthSubject.getValue()/this.pagination.getValue().itemPerPage);
  }
  
  setButtons(){
    this.numOfButtons();
    const newPages = [];
    if(this.currPageSubject.getValue()>4){
      for(let index=this.currPageSubject.getValue()-4;index<this.buttonsNumber&&newPages.length<5;index++){
        newPages.push(index+1);
      }
    }
    else{
      for(let index=0;index<this.buttonsNumber&&newPages.length<5;index++){
        newPages.push(index+1);
      }
    }
    this.pageSubject.next(newPages);
  }

  changePage(pos:number){
    this.currPageSubject.next(pos);
  }

  get getButton(){
    return this.pagination.getValue().page$;
  }
  get currentPageObservable(){
    return this.pagination.getValue().currentPage$;
  }
  get currentPage(){
    return this.currPageSubject.getValue();
  }
  get itemPerPage(){
    return this.pagination.getValue().itemPerPage;
  }
  
}
