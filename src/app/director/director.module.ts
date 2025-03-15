import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { DirectorListComponent } from './director-list/director-list.component';
import { DirectorDetailComponent } from './director-detail/director-detail.component';
import { DirectorRoutingModule } from './director-routing.module';
import { DirectorCreateComponent } from './director-create/director-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DirectorRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  exports: [DirectorListComponent],
  declarations: [
    DirectorListComponent,
    DirectorDetailComponent,
    DirectorCreateComponent,
  ],
})
export class DirectorModule {}
