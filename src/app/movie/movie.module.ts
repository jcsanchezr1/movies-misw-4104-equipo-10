import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieListComponent } from './movie-list/movie-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { RouterModule } from '@angular/router';
import { MovieRoutingModule } from './movie-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MovieCreateComponent } from './movie-create/movie-create.component';
import { ReviewModule } from '../review/review.module';

@NgModule({
    exports: [MovieListComponent],
    declarations: [
      MovieListComponent,
      MovieDetailComponent,
      MovieCreateComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      MovieRoutingModule,
      ReactiveFormsModule,
      NgbModule,
      ToastrModule.forRoot(),
      ReviewModule
    ]
})
export class MovieModule { }
