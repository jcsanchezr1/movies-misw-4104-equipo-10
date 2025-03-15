import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationMenuComponent } from './administration-menu/administration-menu.component';
import { GenreCreateComponent } from '../genre/genre-create/genre-create.component';
import { PlatformListComponent } from '../platform/platform-list/platform-list.component';
import { MovieCreateComponent } from '../movie/movie-create/movie-create.component';
import { ActorCreateComponent } from '../actor/actor-create/actor-create.component';
import { DirectorCreateComponent } from '../director/director-create/director-create.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdministrationMenuComponent,
    children: [
      { path: 'genres', component: GenreCreateComponent },
      { path: 'platforms', component: PlatformListComponent },
      { path: 'create-movie', component: MovieCreateComponent },
      { path: 'create-actor', component: ActorCreateComponent },
      { path: 'create-director', component: DirectorCreateComponent },
    ]
  },
  { path: '', redirectTo: '/admin/genres', pathMatch: 'full' }
];

@NgModule(
    {
        imports: [ RouterModule.forChild(routes) ],
        exports: [ RouterModule ]
    }
)

export class AdministrationRoutingModule { }