import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchStore',
  standalone: true
})
export class searchStorePipe implements PipeTransform {

  transform(value: string[], filterString:string | null): string[] {
    
    if(value && filterString){
      const lowerCaseFilter = filterString.toLowerCase();
      return value.filter(filtered => filtered.toLowerCase().includes(lowerCaseFilter)) as string[];
    } else {
      return [] as string[];
    }
    
  }

}
