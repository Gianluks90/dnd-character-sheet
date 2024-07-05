import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeString'
})
export class CapitalizeStringPipe implements PipeTransform {

  transform(value: string): unknown {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
