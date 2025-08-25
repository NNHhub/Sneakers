import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { IProfile } from 'app/profile/models/profile.model';
import { ProfileStoreSelector } from 'app/store/selectors/profile.selector';
import { map, Observable, of, Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy{
  activeLink:string ='';
  private routerSubscription: Subscription;

  profile: Observable<IProfile|null> = this.store.select(ProfileStoreSelector);

  constructor(private router:Router, private store:Store){
    this.routerSubscription = this.router.events.subscribe(() => {
      this.activeLink = this.router.url;
    });
  }

  isAutorized(): Observable<boolean> {
    return of(localStorage.getItem('token')).pipe(
      map(token => {
        if (token) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    if(this.routerSubscription)
      this.routerSubscription.unsubscribe();
  }
}
