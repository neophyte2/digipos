import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImgFallbackDirective } from './directives/broken-images.directive';
import { LoaderComponent } from './components/report-loader/loader.component';

const components = [
  ImgFallbackDirective,
  LoaderComponent,
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
