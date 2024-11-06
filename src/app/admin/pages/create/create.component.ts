import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  sneakersAdd:FormGroup;
  sneakName = new FormControl();
  constructor(private fb:FormBuilder){
    this.sneakersAdd = this.fb.group({
      color:[[],[Validators.required]],
      price:[[],[Validators.required]],
      mainPic:[[],[Validators.required]],
      addPic: this.fb.array([])
    })
  }
  
  @ViewChild('mainFileInput', { static: false }) mainFileInput!: ElementRef;
  @ViewChild('addFileInput', { static: false }) addFileInput!: ElementRef;
  mainImageSrcSubj = new BehaviorSubject < string | ArrayBuffer | null > (null);
  addImageSrcSubj = new BehaviorSubject < (string | ArrayBuffer)[]> ([]);
  mainImageSrc:Observable< string | ArrayBuffer | null > = this.mainImageSrcSubj.asObservable();
  addImageSrc:Observable< (string | ArrayBuffer)[] > = this.addImageSrcSubj.asObservable();

  onMainFileSelected(): void {
    const file = this.mainFileInput.nativeElement.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImageSrcSubj.next(reader.result);
      };
      reader.readAsDataURL(file);
    }
    this.mainFileInput.nativeElement.value = '';
  }

  onAddFileSelected(): void {
    const file = this.addFileInput.nativeElement.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (result !== null) {
          const arr: (string | ArrayBuffer)[] = this.addImageSrcSubj.getValue();
          arr.push(result);
          this.addImageSrcSubj.next(arr);
        }
    };
      reader.readAsDataURL(file);
    }
    this.addFileInput.nativeElement.value = '';
  }

  deleteMainImg(){
    this.mainImageSrcSubj.next(null);
  }

  deleteAddImg(deleted:number){
    const newArr = this.addImageSrcSubj.getValue();
    newArr.splice(deleted, 1);     
  }
}
