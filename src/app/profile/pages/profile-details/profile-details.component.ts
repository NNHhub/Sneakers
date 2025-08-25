import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProfileService } from 'app/profile/services/profile.service';
import { Store } from '@ngrx/store';
import { ProfileStoreSelector } from 'app/store/selectors/profile.selector';
import { changeProfile, getProfile } from 'app/store/actions/profile.action';
import { BehaviorSubject,Observable,Subscription,take } from 'rxjs';
import { IProfile } from 'app/profile/models/profile.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-profile-details',
  standalone: true,
 imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  providers:[provideNgxMask()],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent implements OnDestroy{
  private subscriptions: Subscription[] = [];

  profileData: BehaviorSubject<IProfile | null> = new BehaviorSubject<IProfile|null>(null);
  profile$:Observable<IProfile|null> = this.profileData.asObservable();
  profileForm:FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    phone : new FormControl(),
    email : new FormControl(),
  });

  isProfileDataChanged:boolean = false;
  isEditingFirstName:boolean = false;
  isEditingLastName:boolean = false;
  isEditingPhone:boolean = false;
  isEditingEmail:boolean = false;

  constructor(
    public fb:FormBuilder,
    private profileService: ProfileService,
    private store: Store){
      this.subscriptions.push(
      this.store.select(ProfileStoreSelector).pipe(take(2)).subscribe(data=>{
        if(!data){
          this.store.dispatch(getProfile());
        }else{
          this.profileData.next(data);

          this.profileForm = fb.group({
            firstName:[data.first_name, [Validators.required,Validators.pattern(/^[^\s]+(\s.*)?$/)]],
            lastName:[data.last_name, [Validators.required,Validators.pattern(/^[^\s]+(\s.*)?$/)]],
            phone:[data.phone, [Validators.required]],
            email:[data.email, [Validators.required,Validators.pattern(/^[\w\d_]+@[\w\d_]+\.\w{2,7}$/)]],
          });

          
        }        
      })
    )

    this.subscriptions.push(
      this.profileForm.valueChanges.subscribe({
        next:()=>{
          this.isProfileDataChanged = true
        }
      })
    )
  }

  get profile(){
    return {
      first_name: this.profileForm.controls['firstName'].value,
      last_name: this.profileForm.controls['lastName'].value,
      phone: this.profileForm.controls['phone'].value,
      email: this.profileForm.controls['email'].value
    }
  }

  editFirstName(){
    this.isEditingFirstName = true;
  }

  saveFirstName(){
    this.isEditingFirstName = false;

    if(this.isProfileDataChanged){
      this.store.dispatch(changeProfile({profile:this.profile}));
      this.subscriptions.push(
        this.profileService.updateProfile(this.profile).subscribe({
          next:()=>{
            console.log('Profile changed seccessfuly!');
          },
          error:(error)=>{
            console.log('Failed to change profile', error);
          }
        })
      )
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
        this.subscriptions.push(
          this.profileService.updateProfile(this.profile).subscribe({
          next:()=>{
            console.log('Profile changed seccessfuly!');
          },
          error:(error)=>{
            console.log('Failed to change profile', error);
          }
        })
      )
      
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

      this.subscriptions.push(
        this.profileService.updateProfile(this.profile).subscribe({
          next:()=>{
            console.log('Profile changed seccessfuly!');
          },
          error:(error)=>{
            console.log('Failed to change profile', error);
          }
        })
      )
      
    }
    
    this.isProfileDataChanged = false;
  }

  editEmail(){
    this.isEditingEmail = true;
  }

  saveEmail(){
    this.isEditingEmail = false;

    if(this.isProfileDataChanged){
      this.store.dispatch(changeProfile({ profile:this.profile }));
      this.subscriptions.push(
        this.profileService.updateProfile(this.profile).subscribe({
          next:()=>{
            console.log('Profile changed seccessfuly!');
          },
          error:(error)=>{
            console.log('Failed to change profile', error);
          }
        })
      ) 
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

  ngOnDestroy(): void {
    this.subscriptions.forEach( (sub) => {
      if(sub) {
        sub.unsubscribe();
      }
    })
  }
}
