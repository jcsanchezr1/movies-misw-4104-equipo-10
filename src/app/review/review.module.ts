import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewCreateComponent } from './review-create/review-create.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [ ReviewCreateComponent ],
  exports: [ ReviewCreateComponent ]
})
export class ReviewModule { }
