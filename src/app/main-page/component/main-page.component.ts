import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PopularComponent } from "../../popular/component/popular.component";
import { BehaviorSubject, Observable } from 'rxjs';
import { ISneakers } from 'app/catalog/model/sneaker.model';
import { MainPageService } from '../services/main-page.service';

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
  newAddedSneakerSbj:BehaviorSubject<ISneakers[]> = new BehaviorSubject<ISneakers[]>([]);
  newAddedSneaker$: Observable<ISneakers[]> = this.newAddedSneakerSbj.asObservable();

  slideConfig : { 
    "slidesToShow": number, 
    "slidesToScroll": number, 
    autoplay: boolean, 
    autoplaySpeed: number,
    width:number
  } = {
    "slidesToShow": 4, 
    "slidesToScroll": 1, 
    autoplay: true, 
    autoplaySpeed: 3000,
    width:300
  };
  
  constructor(private mainPageService:MainPageService){
    this.mainPageService.getNewAddedSneakers().subscribe({
      next:(value)=> {
        this.newAddedSneakerSbj.next(value);
      },
      error:(error)=> {
        console.log('Error with getting new items:', error);
      }
    });
  }

}