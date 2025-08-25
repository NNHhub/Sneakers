import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { ISneakers } from 'app/catalog/model/sneaker.model';
import { PaginationComponent } from 'app/catalog/pagination/pagination.component';
import { CatalogService } from 'app/catalog/services/catalog.service';
import { deleteAdminStore, getAdminStore } from 'app/store/actions/admin-store.action';
import { adminStoreSelector } from 'app/store/selectors/admin-store.selector';
import { NgxCurrencyDirective } from 'ngx-currency';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, fromEvent, map, Observable, Subscription, take } from 'rxjs';
import { searchStorePipe } from 'app/admin/pipes/searchStore.pipe';

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
    NgxCurrencyDirective,
    MatAutocompleteModule,
    searchStorePipe
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})

export class StoreComponent implements AfterViewInit, OnDestroy{
  private subscriptions: Subscription[] = [];

  sneakersUpdate:FormGroup;
  searchControl = new FormControl('');
  sizeControl = new FormControl(0);

  isEditingSizes:boolean = false;
  editingSneaker : ISneakers|null = null;

  activeSizeSubj = new BehaviorSubject<number|null>(null);
  activeSize$: Observable<number|null> = this.activeSizeSubj.asObservable();

  isEditingCard:boolean = false;
  editingId:number|null  = null;

  paginationCurrentPage!: Observable<number>;
  currentPage = new BehaviorSubject<number>(1);

  suggestedSubj = new BehaviorSubject<string[]>([]);
  suggested$: Observable<string[]>= this.suggestedSubj.asObservable();

  sneakers$ : Observable<ISneakers[]> = this.store.select(adminStoreSelector);
  displayedSneakers$!:Observable<ISneakers[]|null>;

  sizes = Array.from({ length: 48 - 35 + 1 }, (_, i) => 35 + i);

  @ViewChild('inputSearch') inputSearch!: ElementRef<HTMLInputElement>;
  settings = {
    array: this.sneakers$,
    itemPerPage: 15
  }

  constructor(private store: Store, private catalogService: CatalogService, private cd: ChangeDetectorRef, private fb: FormBuilder){
    this.store.dispatch(deleteAdminStore());
    this.sneakersUpdate = this.fb.group({
      name: ['', Validators.required],
      description:['', Validators.required],
      color: ['', Validators.required],
      price: [0, Validators.required],
      mainPic:['',[Validators.required]],
      addPic: this.fb.array([])
    })
    
    this.displayedSneakers$ = combineLatest([this.sneakers$, this.currentPage]).pipe(
      map(([sneakers, currentPage]) => {
        if (sneakers.length) {
          const token = this.catalogService.getAdminNextPageToken;
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
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.inputSearch) {
      this.subscriptions.push( 
        fromEvent (this.inputSearch.nativeElement,"input").pipe(
          map((response: Event)=> (response.target as HTMLInputElement).value),
          debounceTime(500),
          distinctUntilChanged()).subscribe((searchItem)=>{
            this.catalogService.selectNames(searchItem).subscribe({
              next:(names)=>{
                if(searchItem){
                  this.suggestedSubj.next(names);
                  this.cd.detectChanges();
                } else {
                  this.suggestedSubj.next([]);
                }
                
              },
              error:(error)=>{
                console.log('Error of getting selected names',error);
              }
          })
        })
      )
    }  
  }

  async loadImageFile(url:string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.readAsDataURL(blob);
    });
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
    this.clearUpdate();
    this.subscriptions.push( 
      this.sneakers$.pipe(take(1)).subscribe({
        next:()=>{
          if(this.inputSearch.nativeElement.value){
            this.store.dispatch(deleteAdminStore());
            this.store.dispatch(getAdminStore(this.inputSearch.nativeElement.value));  
          }
        }
      }) 
    )
  } 

  getCurrPage(item: Observable<number>) { 
    this.paginationCurrentPage = item;
    this.subscriptions.push(
      this.paginationCurrentPage.subscribe(value=>{
        this.currentPage.next(value);
      })
    )
  }

  editSneakerCard(id: number){
    this.activeSizeSubj.next(null);
    this.isEditingSizes = false;
    this.isEditingCard = true;
    this.editingId = id;
    setTimeout(() => {
      const element = document.querySelector(".change-section"); 
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    this.subscriptions.push(
      this.catalogService.getSneakerById(id).subscribe(async(sneakers) => {
        const pickedSneaker = sneakers.find(sneaker => sneaker.id === id);
        this.editingSneaker = pickedSneaker as ISneakers;
        const addPicArray = this.sneakersUpdate.get('addPic') as FormArray;
        addPicArray.clear();
        const mainPicture = await this.loadImageFile(`http://localhost:3000/${pickedSneaker?.main_picture}`);
        pickedSneaker?.pictures?.map( async (value) => {
          addPicArray.push(this.fb.control(await this.loadImageFile(`http://localhost:3000/${value}`)));
          this.cd.detectChanges();
        });
        
        this.sneakersUpdate.patchValue({
          name: pickedSneaker?.name,
          description: pickedSneaker?.description,
          color: pickedSneaker?.color_name,
          price: pickedSneaker?.price,
          mainPic:mainPicture,
        })
      })  
    )
  }

  clearUpdate(){
    this.sneakersUpdate.patchValue({
      name: ['', Validators.required],
      description: ['', Validators.required],
      color: ['', Validators.required],
      price: [0, Validators.required],
      mainPic:['',[Validators.required]],
    });
    
    (this.sneakersUpdate.get('addPic') as FormArray).clear();
    
    this.isEditingCard = false;
    this.editingId = null;
  }

  updateSneaker(){
    (this.editingSneaker as ISneakers).color_name = this.sneakersUpdate.get('color')?.value;
    (this.editingSneaker as ISneakers).description = this.sneakersUpdate.get('description')?.value;
    (this.editingSneaker as ISneakers).main_picture = this.sneakersUpdate.get('mainPic')?.value;
    (this.editingSneaker as ISneakers).name = this.sneakersUpdate.get('name')?.value;
    (this.editingSneaker as ISneakers).price = this.sneakersUpdate.get('price')?.value;
    (this.editingSneaker as ISneakers).pictures = this.sneakersUpdate.get('addPic')?.value;
    this.catalogService.updateSneaker(this.editingId as number,this.sneakersUpdate.value).subscribe({
      next:()=>{
        console.log('Item updated seccessfuly');
        this.clearUpdate();
      },
      error:(error)=>{
        console.log('Something wrong', error);
        this.clearUpdate();
      }
    })
    this.isEditingCard = false; 
    this.editingId = null;
  }

  editSize(size: number){
    this.isEditingSizes = true; 
    this.activeSizeSubj.next(size);
    const sizeCount = this.editingSneaker?.sizes?.find((value) => value.size == this.activeSizeSubj.getValue())?.count as number;
    this.sizeControl.patchValue(sizeCount); 
  }

  closeSize(){
    this.isEditingSizes = false;
    this.activeSizeSubj.next(null);
  }

  saveCountSize(){
    const sizeObj = this.editingSneaker?.sizes?.find((value) => value.size == this.activeSizeSubj.getValue());
    const index = this.editingSneaker?.sizes?.indexOf(sizeObj as { size: number; count: number;}) as number;
    (this.editingSneaker?.sizes as { size: number; count: number;}[])[index].count = Number(this.sizeControl.value);
    console.log(this.editingSneaker);
    this.isEditingSizes = false;
    this.activeSizeSubj.next(null);
  }

  ngOnDestroy(): void {

    this.subscriptions.forEach((sub) => {
      if(sub)
        sub.unsubscribe();
    })
  }

}
