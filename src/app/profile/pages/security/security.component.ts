import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { DeleteConfirmComponent } from 'app/confirmation/delete-confirm.component';
import { ProfileService } from 'app/profile/services/profile.service';
import { Store } from '@ngrx/store';
import { ProfileStoreSelector } from 'app/store/selectors/profile.selector';
import { getProfile } from 'app/store/actions/profile.action';
import { BehaviorSubject,Observable,take } from 'rxjs';
import { IProfile } from 'app/profile/models/profile.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';


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
export class SecurityComponent {
  profileData: BehaviorSubject<IProfile | null> = new BehaviorSubject<IProfile|null>(null);
  profile$:Observable<IProfile|null> = this.profileData.asObservable();
  isOn:boolean = true;
  constructor(
      private router: Router,
      private dialog: MatDialog,
      private profileService: ProfileService,
      private snackBar: MatSnackBar,
      private store: Store){

    this.store.select(ProfileStoreSelector).pipe(take(2)).subscribe(data=>{
      if(!data){
        this.store.dispatch(getProfile());
      }else{
        this.profileData.next(data);
      }        
    });
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
}
