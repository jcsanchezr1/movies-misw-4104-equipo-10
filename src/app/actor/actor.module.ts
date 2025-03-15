import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActorRoutingModule } from './actor-routing.module';
import { ActorListComponent } from './actor-list/actor-list.component';
import { ActorDetailComponent } from './actor-detail/actor-detail.component';
import { ActorCreateComponent } from './actor-create/actor-create.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ActorRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  exports: [ActorListComponent],
  declarations: [ActorListComponent, ActorDetailComponent, ActorCreateComponent],
  providers: []
})
export class ActorModule { }
