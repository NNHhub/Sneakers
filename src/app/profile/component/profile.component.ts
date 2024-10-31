import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DeleteConfirmComponent } from 'app/confirmation/delete-confirm.component';
import { ProfileService } from '../profile.service';
import { Store } from '@ngrx/store';
import { ProfileStoreSelector } from 'app/store/selectors/profile.selector';
import { changeProfile, getProfile } from 'app/store/actions/profile.action';
import { BehaviorSubject,Observable,take } from 'rxjs';
import { IProfile } from '../models/profile.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    DeleteConfirmComponent,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  providers:[provideNgxMask()],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileData: BehaviorSubject<IProfile | null> = new BehaviorSubject<IProfile|null>(null);
  profile$:Observable<IProfile|null> = this.profileData.asObservable();
  profileForm:FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    phone : new FormControl()
  });

  isProfileDataChanged:boolean = false;
  isEditingFirstName:boolean = false;
  isEditingLastName:boolean = false;
  isEditingPhone:boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public fb:FormBuilder,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private store: Store){
      this.store.select(ProfileStoreSelector).pipe(take(2)).subscribe(data=>{
        if(!data){
          this.store.dispatch(getProfile());
        }else{
          this.profileData.next(data);

          this.profileForm = fb.group({
            firstName:[data.first_name, [Validators.required,Validators.pattern(/^[^\s]+(\s.*)?$/)]],
            lastName:[data.last_name, [Validators.required,Validators.pattern(/^[^\s]+(\s.*)?$/)]],
            phone:[data.phone, [Validators.required]]
          });

          this.profileForm.valueChanges.subscribe({
            next:()=>{
              this.isProfileDataChanged = true
            }
          });

        }        
      });
    }

  logout(){
    localStorage.removeItem('token');
    location.reload()
  }

  deleteUser(){
    const dialogRef = this.dialog.open<DeleteConfirmComponent, string>(DeleteConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.profileService.deleteProfile(result).subscribe({
          next:()=>{
            console.log('User deleted seccessfully!');
            localStorage.removeItem('token');
            this.router.navigate(['/']);
          },
          error:(error)=>{
            console.log('Failed to delete user',error);
            this.snackBar.open('Failed to delete user', '', {
              duration: 2000,
              panelClass: ['snackbar-error']
            });
          }
        })
      }
    });
  }

  get profile(){
    return {
      first_name: this.profileForm.controls['firstName'].value,
      last_name: this.profileForm.controls['lastName'].value,
      phone: this.profileForm.controls['phone'].value,
    }
  }

  editFirstName(){
    this.isEditingFirstName = true;
  }

  saveFirstName(){
    this.isEditingFirstName = false;

    if(this.isProfileDataChanged){
      this.store.dispatch(changeProfile({profile:this.profile}));
      this.profileService.updateProfile(this.profile).subscribe({
        next:()=>{
          console.log('Profile changed seccessfuly!');
        },
        error:(error)=>{
          console.log('Failed to change profile', error);
        }
      });
    }
    this.isProfileDataChanged = false;
  }

  editLastName(){
    this.isEditingLastName = true;
  }

  saveLastName(){
    this.isEditingLastName = false;
    if(this.isProfileDataChanged){
      this.store.dispatch(changeProfile({profile:this.profile}));
      this.profileService.updateProfile(this.profile).subscribe({
        next:()=>{
          console.log('Profile changed seccessfuly!');
        },
        error:(error)=>{
          console.log('Failed to change profile', error);
        }
      });
    }
    this.isProfileDataChanged = false;
  }

  editPhone(){
    this.isEditingPhone = true;
  }

  savePhone(){
    this.isEditingPhone = false;
    if(this.isProfileDataChanged){
      this.profileForm.controls['phone'].setValue(this.applyMask(this.profileForm.controls['phone'].value));
      
      this.store.dispatch(changeProfile({profile:this.profile}));

      this.profileService.updateProfile(this.profile).subscribe({
        next:()=>{
          console.log('Profile changed seccessfuly!');
        },
        error:(error)=>{
          console.log('Failed to change profile', error);
        }
      });
    }
    
    this.isProfileDataChanged = false;
  }

  applyMask(value: string): string {
    const cleaned = value.replace(/\D+/g, '');
    const match = cleaned.match(/^(\d)(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return value;
  }

}
