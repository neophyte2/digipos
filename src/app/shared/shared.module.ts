import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImgFallbackDirective } from './directives/broken-images.directive';
import { LoaderComponent } from './components/report-loader/loader.component';
import { DecimalOnlyDirective } from './directives/decimal-input.directive';

const components = [
  ImgFallbackDirective,
  LoaderComponent,
  DecimalOnlyDirective,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...components],
  exports: [
    ...components,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
