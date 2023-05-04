import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideData'
})
export class HideDataPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    }
    let hiddenVal = value.replace(/./g, "*")
    return hiddenVal;
  }
}
