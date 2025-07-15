import { Pipe, PipeTransform } from '@angular/core';
import { ISneakers } from '../model/sneaker.model';

@Pipe({
  name: 'catalog',
  standalone: true
})
export class CatalogPipe implements PipeTransform {

  transform(value: ISneakers[]): ISneakers[] {
    return [];
  }

}
