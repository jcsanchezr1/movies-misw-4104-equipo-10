import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlatformListComponent } from './platform-list/platform-list.component';
import { PlatformCreateComponent } from './platform-create/platform-create.component';

const routes: Routes = [
  {
    path: 'list',
    component: PlatformListComponent,
  },
  {
    path: 'create',
    component: PlatformCreateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformRoutingModule {}
