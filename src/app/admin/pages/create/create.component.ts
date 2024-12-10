import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Component, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule, FormArray } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    NgxCurrencyDirective
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  sneakersAdd:FormGroup;
  sneakName = new FormControl('', Validators.required);
  constructor(private fb:FormBuilder, private cd: ChangeDetectorRef, private http: HttpClient){
    this.sneakersAdd = this.fb.group({
      variants: this.fb.array([
        this.createColorGroup()
      ])
    })
  }

  onMainFileSelected(event: Event, index:number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadFile) => {
        this.variants.at(index).patchValue({ mainPic: loadFile.target?.result });
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  onAddFileSelected(event: Event, index:number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadFile) => {
        if (loadFile.target?.result !== null) {
          const control = this.variants.at(index).get('addPic') as FormArray;
          control.push(this.fb.control(loadFile.target?.result));
          this.cd.detectChanges();
        }
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  get variants(): FormArray {
    return this.sneakersAdd.get('variants') as FormArray;
  }

  deleteMainImg(index:number){
    this.variants.at(index).patchValue({ mainPic: '' });
  }

  deleteAddImg(index:number,deleted:number){
    const control = this.variants.at(index).get('addPic') as FormArray;
    control.removeAt(deleted);
  }

  createColorGroup(): FormGroup {
    return this.fb.group({
        color: ['', Validators.required],
        price: [0, Validators.required],
        mainPic:['',[Validators.required]],
        addPic: this.fb.array([])
    });
  }

  deleteColorGroup(index:number):void{
    this.variants.removeAt(index);
  }

  addColor(): void {
    this.variants.push(this.createColorGroup());
  }

  createSneaker(){
    const body = {name:this.sneakName.value, details: this.variants.value};
    this.http.post('http://localhost:3000/sneakers/create',body).subscribe({
      next:(val)=>{
        console.log('All good', val);
      },
      error:(error)=>{
        console.log('Something wrong', error);
      }
    })
  }

}
