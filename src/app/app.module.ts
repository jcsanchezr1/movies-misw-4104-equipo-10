import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActorModule } from './actor/actor.module';
import { DirectorModule } from './director/director.module';
import { MovieModule } from './movie/movie.module';
import { PlatformModule } from './platform/platform.module';
import { PlatformRoutingModule } from './platform/platform-routing.module';
import { MovieRoutingModule } from './movie/movie-routing.module';
import { ActorRoutingModule } from './actor/actor-routing.module';
import { DirectorRoutingModule } from './director/director-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpErrorInterceptorService } from './interceptors/http-error-interceptor.service';
import { GenreModule } from './genre/genre.module';
import { GenreRoutingModule } from './genre/genre.routing';
import { ReviewModule } from './review/review.module';
import { AdministrationRoutingModule } from './administration/administration-routing.module';
import { AdministrationModule } from './administration/administration.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ActorModule,
    DirectorModule,
    MovieModule,
    PlatformModule,
    AdministrationModule,
    MovieRoutingModule,
    ActorRoutingModule,
    GenreRoutingModule,
    DirectorRoutingModule,
    AdministrationRoutingModule,
    GenreModule,
    PlatformRoutingModule,
    ReviewModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    BrowserAnimationsModule
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
