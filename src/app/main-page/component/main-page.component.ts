import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { PopularComponent } from "../../popular/component/popular.component";
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    SlickCarouselModule,
    CommonModule,
    PopularComponent
],
  providers:[HttpClient],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  slideConfig : { 
    "slidesToShow": number, 
    "slidesToScroll": number, 
    autoplay: boolean, 
    autoplaySpeed: number,
    width:number
  } = {
    "slidesToShow": 3, 
    "slidesToScroll": 1, 
    autoplay: true, 
    autoplaySpeed: 3000,
    width:400
  };
  
}