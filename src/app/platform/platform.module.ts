import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlatformListComponent } from './platform-list/platform-list.component';
import { PlatformCreateComponent } from './platform-create/platform-create.component';
import { PlatformRoutingModule } from './platform-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PlatformRoutingModule,
  ],
  exports: [PlatformListComponent],
  declarations: [PlatformListComponent, PlatformCreateComponent],
})
export class PlatformModule {}
