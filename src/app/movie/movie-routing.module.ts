import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MovieCreateComponent } from './movie-create/movie-create.component';

const routes: Routes = [
    {
        path: 'create',
        component: MovieCreateComponent
    },
    {
        path: 'list',
        component: MovieListComponent
    },
    {
        path: ':id',
        component: MovieDetailComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MovieRoutingModule { }
