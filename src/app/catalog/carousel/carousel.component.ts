import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnChanges{
  @Output() itemHovered = new EventEmitter<string>();
  componentSettingsSubj = new BehaviorSubject <{
    direction:string,
    shownItems:number,
    itemSkip:number,
    autoPlay:boolean,
    playSpeed:number,
  }> ({
    direction:'vertical',
    shownItems: 4,
    itemSkip: 1,
    autoPlay: false,
    playSpeed: 3000,
  });
  componentSettings$ = this.componentSettingsSubj.asObservable();

  shownContentSubj = new BehaviorSubject<any[]>([]);
  shownContent$ = this.shownContentSubj.asObservable();

  @Input() settings!:{
    direction?:string,
    shownItems?:number,
    itemSkip?:number,
    autoPlay?:boolean,
    playSpeed?:number,
  } | undefined;

  @Input() content:any[] = [];
  ngOnChanges(): void {
    this.componentSettingsSubj.next({
      direction: this.settings?.direction ? this.settings.direction : 'vertical',
      shownItems: this.settings?.shownItems ? this.settings.shownItems : 4,
      itemSkip: this.settings?.itemSkip ? this.settings.itemSkip : 1,
      autoPlay: this.settings?.autoPlay ? this.settings.autoPlay : false,
      playSpeed: this.settings?.playSpeed ? this.settings.playSpeed : 3000,
    })
    setTimeout(() => {
      const elements = document.querySelectorAll(`.${this.componentSettingsSubj.getValue().direction}`);
      const value = 100/this.componentSettingsSubj.getValue().shownItems;
      elements.forEach((element) => { 
        if (this.componentSettingsSubj.getValue().direction === 'vertical') { 
          (element as HTMLElement).style.height = `${value}%`; 
        } else { 
          (element as HTMLElement).style.width = `${value}%`; 
        }
      })
    }, 100);
    
    this.shownContentSubj.next(this.content);
  }
  
  onMouseOver(item: string) { 
    this.itemHovered.emit(item);
  }
  
}
