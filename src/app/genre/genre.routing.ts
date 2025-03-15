import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenreListComponent } from './genre-list/genre-list.component';
import { GenreCreateComponent } from './genre-create/genre-create.component';


const routes: Routes = [
  {
    path: 'create',
    component: GenreCreateComponent
  },
  {
    path: 'list',
    component: GenreListComponent
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GenreRoutingModule { }
