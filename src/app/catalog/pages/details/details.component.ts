import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISneakers } from 'app/catalog/model/sneaker.model';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { CatalogService } from 'app/catalog/services/catalog.service';
import { BehaviorSubject } from 'rxjs';
import { CarouselComponent } from "../../carousel/carousel.component";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule, CarouselComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  hoveredItem: string = '';

  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;
  slideConfig = {
    "slidesToShow": 4, 
    "slidesToScroll": 1,
    autoplay: true, 
    vertical:true,
    verticalSwiping:true,
    adaptiveHeight:true,
  };

  sneaksName!:string;
  sneaksId!:number;
  activatedPictureSubj = new BehaviorSubject<ISneakers|null>(null);
  activatedPicture$ = this.activatedPictureSubj.asObservable();
  sneakersSubj = new BehaviorSubject<ISneakers[]|null>(null);
  sneakers$ = this.sneakersSubj.asObservable();

  constructor(
    private route:ActivatedRoute, 
    private catalogService:CatalogService, 
    private router:Router,
    private cdr: ChangeDetectorRef){
    this.sneaksId = parseInt(this.route.snapshot.params['id']);
    this.catalogService.getSneakerById(this.sneaksId).subscribe({
      next:(value)=>{
        console.log('All right');
        const sneakers = value.find(sneaker=>sneaker.color_id === this.sneaksId);
        this.sneaksName = sneakers?.name as string;
        this.hoveredItem = sneakers?.main_picture as string;
        sneakers?.pictures?.unshift(sneakers.main_picture);
        this.activatedPictureSubj.next(sneakers as ISneakers);
        this.sneakersSubj.next(value);
      },
      error:(error)=>{
        console.log('Something went wrong',error);
      }
    })
    
  }

  changeColor(id:number){
    this.router.navigate(['/details',id]);
    this.activatedPictureSubj.next(null);
    this.sneakersSubj.next(null);
    setTimeout(() => {
      this.sneaksId = parseInt(this.route.snapshot.params['id']);
      this.catalogService.getSneakerById(this.sneaksId).subscribe({
        next:(value)=>{
          console.log('All right');
          const sneakers = value.find(sneaker=>sneaker.color_id === this.sneaksId);
          this.hoveredItem = sneakers?.main_picture as string;
          sneakers?.pictures?.unshift(sneakers.main_picture);
          this.activatedPictureSubj.next(sneakers as ISneakers);
          this.sneakersSubj.next(value);
          this.cdr.detectChanges();
        },
        error:(error)=>{
          console.log('Something went wrong',error);
        }
      })
    }, 50);
  }

  handleItemHovered(item: string) { 
    this.hoveredItem = item; 
  }

  zoomMain(){
    const zoomContainer = document.getElementById('main-picture-view') ;
    const zoomImage = document.getElementById('main-img') as HTMLElement;

    zoomContainer?.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = zoomContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      zoomImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      zoomImage.style.transform = 'scale(2)';
    });

    zoomContainer?.addEventListener('mouseleave', () => {
      zoomImage.style.transformOrigin = 'center center';
      zoomImage.style.transform = 'scale(1)';
    });
  }
}
