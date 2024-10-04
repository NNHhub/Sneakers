import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-cotact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './cotact.component.html',
  styleUrl: './cotact.component.scss'
})
export class ContactComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
}
