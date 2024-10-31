import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  imageSrcSubj = new BehaviorSubject < string | ArrayBuffer | null > (null);
  imageSrc:Observable< string | ArrayBuffer | null > = this.imageSrcSubj.asObservable();
  onFileSelected(): void {
    const file = this.fileInput.nativeElement.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrcSubj.next(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImg(){
    this.imageSrcSubj.next(null);
    this.fileInput.nativeElement.value = '';
  }
}
