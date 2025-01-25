import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { ISneakers } from 'app/catalog/model/sneaker.model';
import { PaginationComponent } from 'app/catalog/pagination/pagination.component';
import { CatalogService } from 'app/catalog/services/catalog.service';
import { deleteAdminStore, getAdminStore } from 'app/store/actions/admin-store.action';
import { adminStoreSelector } from 'app/store/selectors/admin-store.selector';
import { NgxCurrencyDirective } from 'ngx-currency';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, fromEvent, map, Observable, take } from 'rxjs';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    NgxCurrencyDirective
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements AfterViewInit{
  sneakersUpdate:FormGroup;
  sneakName = new FormControl('', Validators.required);
  paginationCurrentPage!: Observable<number>;
  isEditingCard:boolean = false;
  editingId:number|null  = null;
  currentPage = new BehaviorSubject<number>(1);
  suggestedSubj = new BehaviorSubject<string[]>([]);
  suggested$: Observable<string[]>= this.suggestedSubj.asObservable();
  sneakers$ : Observable<ISneakers[]> = this.store.select(adminStoreSelector);
  displayedSneakers$!:Observable<ISneakers[]|null>;
  @ViewChild('inputSearch') inputSearch!: ElementRef<HTMLInputElement>;
  settings = {
    array: this.sneakers$,
    itemPerPage: 15
  }
  constructor(private store: Store, private catalogService: CatalogService, private cd: ChangeDetectorRef, private fb: FormBuilder){
    this.sneakersUpdate = this.fb.group({
      color: ['', Validators.required],
      price: [0, Validators.required],
      mainPic:['',[Validators.required]],
      addPic: this.fb.array([])
    })
    
    this.displayedSneakers$ = combineLatest([this.sneakers$, this.currentPage]).pipe(
          map(([sneakers, currentPage]) => {
            if (sneakers.length) {
              const token = this.catalogService.getNextPageToken;
              if((sneakers.length/this.settings.itemPerPage)<currentPage && token){
                if(this.inputSearch.nativeElement.value){
                  this.store.dispatch(getAdminStore(this.inputSearch.nativeElement.value,token));
                } else {
                  this.store.dispatch(getAdminStore(this.inputSearch.nativeElement.value));
                }
              }
              
              const firstIndex = (currentPage - 1) * this.settings.itemPerPage;
              const lastIndex = firstIndex + this.settings.itemPerPage;
              return sneakers.slice(firstIndex, lastIndex);
            }
            return [];
    }));
  }

  ngAfterViewInit(): void {
      if (this.inputSearch) {
        fromEvent (this.inputSearch.nativeElement,"input").pipe(
          map((response: Event)=> (response.target as HTMLInputElement).value),
          debounceTime(1000),
          distinctUntilChanged()).subscribe((searchItem)=>{
            this.catalogService.selectNames(searchItem).subscribe({
              next:(names)=>{
                if(searchItem){
                  this.suggestedSubj.next(names);
                } else {
                  this.suggestedSubj.next([]);
                }
                
              },
              error:(error)=>{
                console.log('Error of getting selected names',error);
              }
            })
          })
      }    
  
    }

  deleteMainImg(){
    this.sneakersUpdate.patchValue({ mainPic: '' });
  }
  
  deleteAddImg(deleted:number){
    const control = this.sneakersUpdate.get('addPic') as FormArray;
    control.removeAt(deleted);
  }

  onMainFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadFile) => {
        this.sneakersUpdate.patchValue({ mainPic: loadFile.target?.result });
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  onAddFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadFile) => {
        if (loadFile.target?.result !== null) {
          const control = this.sneakersUpdate.get('addPic') as FormArray;
          control.push(this.fb.control(loadFile.target?.result));
          this.cd.detectChanges();
        }
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  search(){
    this.sneakers$.pipe(take(1)).subscribe({
      next:()=>{
        if(this.inputSearch.nativeElement.value){
          this.store.dispatch(deleteAdminStore());
          this.store.dispatch(getAdminStore(this.inputSearch.nativeElement.value));  
        }
      }
    }) 
  } 

  getCurrPage(item: Observable<number>) { 
    this.paginationCurrentPage = item;
    this.paginationCurrentPage.subscribe(value=>{
      this.currentPage.next(value);
    });
  }

  editSneakerCard(id: number){
    this.isEditingCard = true;
    this.editingId = id;
    setTimeout(() => {
      const element = document.querySelector(".change-section"); 
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    this.catalogService.getSneakerById(id).subscribe({
      next:(sneakers)=>{
        const pickedSneaker = sneakers.find(sneker => sneker.color_id === id);
        this.sneakName.patchValue(pickedSneaker?.name as string);
        const addPicArray = this.sneakersUpdate.get('addPic') as FormArray;
        addPicArray.clear();
        const mainPicture = `http://localhost:3000/${pickedSneaker?.main_picture}`;
        pickedSneaker?.pictures?.map(value=>addPicArray.push(this.fb.control(`http://localhost:3000/${value}`)));

        this.sneakersUpdate.patchValue({
          color: pickedSneaker?.color_name,
          price: pickedSneaker?.price,
          mainPic:mainPicture,
        })
      }
    })  
    
  }
  
  updateSneaker(){
    this.isEditingCard = false;
    this.editingId = null;
  }

  
}
