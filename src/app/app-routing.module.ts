import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListComponent } from './movie/movie-list/movie-list.component';

const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'movies', loadChildren: () => import('./movie/movie.module').then(m => m.MovieModule) },
  { path: 'actors', loadChildren: () => import('./actor/actor.module').then(m => m.ActorModule) },
  { path: 'directors', loadChildren: () => import('./director/director.module').then(m => m.DirectorModule) },
  { path: 'admin', loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
