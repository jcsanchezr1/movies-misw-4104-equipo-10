import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationMenuComponent } from './administration-menu/administration-menu.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdministrationRoutingModule
  ],
  declarations: [ AdministrationMenuComponent ]
})
export class AdministrationModule { }
