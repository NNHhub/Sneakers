import { AfterViewChecked, Component, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ISneakers } from 'app/catalog/model/sneaker.model';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { PopularSelector } from 'app/store/selectors/popular.selector';
import { getPopularList } from 'app/store/actions/popular.action';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-popular',
  standalone: true,
  imports: [
    SlickCarouselModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.scss'
})
export class PopularComponent implements OnChanges, AfterViewChecked, OnDestroy{
  private popularSubscription: Subscription;
  shownItems : boolean = false;
  @Input() customConfig !: {
    "slidesToShow" ?: number, 
    "slidesToScroll" ?: number,
    autoplay ?: boolean, 
    autoplaySpeed ?: number,
    width:number
  };

  popular$:Observable<ISneakers[]> = this.store.select(PopularSelector);
  slideConfig = {
    "slidesToShow": 1, 
    "slidesToScroll": 1,
    autoplay: true, 
    autoplaySpeed: 3000
  };

  constructor(private store: Store, private render: Renderer2){
    this.store.dispatch(getPopularList());
    this.popularSubscription = this.popular$.subscribe({
      next:(value)=>{
        if(value.length){
          this.shownItems = true;
        }
      }
    })
    
  }

  ngOnChanges(): void {
    this.slideConfig = {
      "slidesToShow": this.customConfig.slidesToShow ? this.customConfig.slidesToShow : 1, 
      "slidesToScroll": this.customConfig.slidesToScroll ? this.customConfig.slidesToScroll : 1,
      autoplay: this.customConfig.autoplay ? this.customConfig.autoplay : true, 
      autoplaySpeed: this.customConfig.autoplaySpeed ? this.customConfig.autoplaySpeed : 3000
    };
   
  }

  ngAfterViewChecked(): void {
    if(this.shownItems){
      const populEl = document.querySelector('.popular-listing') as HTMLElement;
      populEl.style.width = this.slideConfig.slidesToShow * this.customConfig.width + 5 + 'px';
      populEl.style.height = this.customConfig.width + 'px';

      const imglEl = document.querySelectorAll('.carousel-img');
      imglEl.forEach((value) => {
        (value as HTMLElement).style.height = this.customConfig.width + 'px';
        (value as HTMLElement).style.width = this.customConfig.width + 'px'; 
      })
    }
  }

  ngOnDestroy(): void {
    if(this.popularSubscription)
      this.popularSubscription.unsubscribe();
  }
}
