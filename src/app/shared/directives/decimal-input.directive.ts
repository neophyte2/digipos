import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[decimalOnly]'
})
export class DecimalOnlyDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this.el.nativeElement.value;
    const sanitizedValue = initalValue.replace(/[^0-9.]/g, '');
    this.el.nativeElement.value = sanitizedValue;
    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
