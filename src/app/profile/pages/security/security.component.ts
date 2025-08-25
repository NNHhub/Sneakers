import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { DeleteConfirmComponent } from 'app/confirmation/delete-confirm.component';
import { ProfileService } from 'app/profile/services/profile.service';
import { Store } from '@ngrx/store';
import { ProfileSecurityStoreSelector, ProfileStoreSelector } from 'app/store/selectors/profile.selector';
import { changeProfileSecurity, getProfile, getProfileSecurity } from 'app/store/actions/profile.action';
import { BehaviorSubject,Observable,Subscription,take } from 'rxjs';
import { IProfile } from 'app/profile/models/profile.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ProfileSecurity } from 'app/profile/models/profile-security';


@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    RouterModule,
    DeleteConfirmComponent,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss'
})
export class SecurityComponent implements OnDestroy{
  private subscriptions: Subscription[] = [];
  
  profileData: BehaviorSubject<IProfile | null> = new BehaviorSubject<IProfile|null>(null);
  profile$:Observable<IProfile|null> = this.profileData.asObservable();

  securitySbj: BehaviorSubject<ProfileSecurity | null> = new BehaviorSubject<ProfileSecurity|null>(null);
  security$:Observable<ProfileSecurity|null> = this.securitySbj.asObservable();
  
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private store: Store){
      this.subscriptions.push(
        this.store.select(ProfileStoreSelector).pipe(take(2)).subscribe(data=>{
          if(!data){
            this.store.dispatch(getProfile());
          }else{
            this.profileData.next(data);
          }        
        })
      )
    
      this.subscriptions.push(
        this.store.select(ProfileSecurityStoreSelector).pipe(take(2)).subscribe(data=>{
          if(!data){
            this.store.dispatch(getProfileSecurity());
          }else{
            this.securitySbj.next(data);
          }        
        })
      )
  }

  deleteUser(){
    const dialogRef = this.dialog.open<DeleteConfirmComponent, string>(DeleteConfirmComponent);

    this.subscriptions.push(
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
      })
    )
  }

  onModelChange(value: boolean, changed:string) {
    const newSecurity = {...this.securitySbj.getValue(),[changed]:value};
    this.securitySbj.next(newSecurity as ProfileSecurity);

    this.store.dispatch(changeProfileSecurity({security:this.securitySbj.getValue() as ProfileSecurity}));

    this.subscriptions.push(
      this.profileService.updateProfileSecurity(this.securitySbj.getValue() as ProfileSecurity).subscribe({
        next:()=>{
          console.log('Profile security changed seccessfuly!');
        },
        error:(error)=>{
          console.log('Failed to change profile security', error);
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach( (sub) => {
      if(sub) {
        sub.unsubscribe();
      }
    })
  }
}
