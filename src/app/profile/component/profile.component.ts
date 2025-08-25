import { Component, OnDestroy } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnDestroy{
  private routerSubscription: Subscription;
  activeLink:string = '';

  constructor(private router: Router){
    this.router.navigate(['profile/profile-details']);
    this.routerSubscription = this.router.events.subscribe(() => {
      this.activeLink = this.router.url;
    });
  }

  logout(){
    localStorage.removeItem('token');
    location.reload();
  }

  ngOnDestroy(): void {
    if(this.routerSubscription)
      this.routerSubscription.unsubscribe();
  }
}
