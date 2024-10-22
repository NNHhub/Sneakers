import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DeleteConfirmComponent } from 'app/confirmation/delete-confirm.component';
import { ProfileService } from '../profile.service';
import { Store } from '@ngrx/store';
import { ProfileStoreSelector } from 'app/store/selectors/profile.selector';
import { getProfile } from 'app/store/actions/profile.action';
import { BehaviorSubject,take } from 'rxjs';
import { IProfile } from '../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatDialogModule,
    DeleteConfirmComponent
  ],
  providers:[],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileData: BehaviorSubject<IProfile | null> = new BehaviorSubject<IProfile|null>(null);
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private store: Store){
      this.store.select(ProfileStoreSelector).pipe(take(1)).subscribe(data=>{
        this.profileData.next(data);
        if(!this.profileData.getValue()){
          this.store.dispatch(getProfile());
        }
      })
    }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/']);
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
