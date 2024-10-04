import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  activeLink:string ='';
  constructor(private router:Router){
    this.router.events.subscribe(() => {
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
}
