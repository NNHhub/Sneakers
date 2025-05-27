import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/component/header.component';
import { FooterComponent } from './footer/component/footer.component';
import { Store } from '@ngrx/store';
import { getProfile } from './store/actions/profile.action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'sneakers';
  constructor(private store:Store){
    if(localStorage.getItem('token')){
      this.store.dispatch(getProfile());
    }
  }
}
