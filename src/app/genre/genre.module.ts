import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { GenreListComponent } from './genre-list/genre-list.component';
import { GenreRoutingModule } from './genre.routing';
import { GenreCreateComponent } from './genre-create/genre-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GenreRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  exports: [GenreCreateComponent, GenreListComponent],
  declarations: [GenreListComponent, GenreCreateComponent],
  providers: []
})
export class GenreModule { }
