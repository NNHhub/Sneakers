import { Injectable } from '@angular/core';
import { Paginator } from '../model/paginator.model';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService { 
  currPageSubject = new BehaviorSubject<number>(1);
  private buttonsNumber!:number;
  pageSubject = new BehaviorSubject<number[]>([]);
  lengthSubject = new BehaviorSubject<number>(0);
  private pagination:Paginator={
    length:20,
    itemPerPage:18,
    currentPage$:this.currPageSubject.asObservable(),
    page$: this.pageSubject.asObservable(),
  }
  
  resetPagination(){
    this.pagination.length=20;
    this.pagination.itemPerPage=18;
    this.currPageSubject.next(1);
    this.pageSubject.next([]);
    this.setButtons();
  }
  
  numOfButtons(){
    this.buttonsNumber = Math.ceil(this.pagination.length/this.pagination.itemPerPage);
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
  setPaginationLength(length:number){
    this.pagination.length = length;
    this.setButtons();
  }
  changePage(pos:number){
    this.currPageSubject.next(pos);
  }

  get getButton(){
    return this.pagination.page$;
  }
  get currentPageObservable(){
    return this.pagination.currentPage$;
  }
  get currentPage(){
    return this.currPageSubject.getValue();
  }
  get itemPerPage(){
    return this.pagination.itemPerPage;
  }
}