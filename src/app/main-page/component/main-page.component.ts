import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    SlickCarouselModule,
    CommonModule
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  slides = [
    {img: "assets/nike-what-the-duck-dunk.jpg"},
    {img: "assets/travis-scott-jordan-1-low-medium-olive.jpg"},
  ];
  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1, autoplay: true, autoplaySpeed: 3000};

}
