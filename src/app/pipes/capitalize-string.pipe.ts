import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalizeString',
    standalone: false
})
export class CapitalizeStringPipe implements PipeTransform {

  transform(value: string): unknown {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
