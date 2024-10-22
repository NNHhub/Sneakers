import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],

  templateUrl: './delete-confirm.component.html',
  styleUrl: './delete-confirm.component.scss'
})
export class DeleteConfirmComponent {
  passwordControl = new FormControl('');
  constructor(public dialogRef: MatDialogRef<DeleteConfirmComponent>){}

  deleteObj(): void {
    this.dialogRef.close(this.passwordControl.value);
  }

  cancelDel(): void {
    this.dialogRef.close(null);
  }
}
