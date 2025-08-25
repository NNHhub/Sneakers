import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,RouterModule,RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})

export class AdminComponent implements OnDestroy {
  private routerSubscription: Subscription;
  activeLink:string ='';

  constructor(private router:Router){
    this.routerSubscription = this.router.events.subscribe(() => {
      this.activeLink = this.router.url;
    });
  }

  ngOnDestroy(): void {

     if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
