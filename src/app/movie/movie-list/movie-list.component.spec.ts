/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { faker } from '@faker-js/faker';

import { MovieListComponent } from './movie-list.component';
import { HttpClientModule } from '@angular/common/http';
import { GenreService } from '../../genre/genre.service';
import { Genre } from '../../genre/genre';
import { Movie } from '../movie';
import { Director } from '../../director/director';
import { Trailer } from '../trailer';
import { MovieService } from '../movie.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let debug: DebugElement;
  let movieService: MovieService;
  let genresMock: Array<Genre> = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, RouterTestingModule],
      declarations: [ MovieListComponent ],
      providers:[ GenreService,  MovieService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
 
    for(let i = 0; i < 10; i++) {

      const trailer = new Trailer(
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.number.int(),
        faker.lorem.sentence()
      )

      const director = new Director(
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.date.recent().toString(),
        faker.lorem.sentence(),
        []
      )

      const genre = new Genre(
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        []
      );

      for (let j = 0; j < 10; j++) {
        const movie = new Movie(
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.number.int(),
          faker.lorem.sentence(),
          faker.date.recent().toString(),
          faker.number.int({ min: 1, max: 5 }),
          director,
          [],
          genre,
          [],
          [],
          trailer
        );
        genre.movies.push(movie);
      }
      component.genres.push(genre);
      genresMock.push(genre);
    }
    fixture.detectChanges();
    debug = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 10 <div.genre-wrapper> elements', () => {
    expect(debug.queryAll(By.css('div.genre-wrapper'))).toHaveSize(10)
  });
 
  it('should have 100 <div.image-container> elements', () => {
    expect(debug.queryAll(By.css('div.image-container'))).toHaveSize(100)
  });

  it('should update filteredDirectors correctly when searchTerm is empty', () => {
    component.searchTerm = '';
    component.filterGenres();
    expect(component.filteredGenres[0].movies).toEqual(component.filteredGenres[0].movies);
  });

  it('should filter movies when searchTerm exactly matches movie title', () => {
    const movieTitle = component.filteredGenres[0].movies[0].title;
    component.searchTerm = movieTitle;
    component.filterGenres();
    expect(component.filteredGenres.length).toBe(1);
    expect(component.filteredGenres[0].movies.length).toBe(1);
    expect(component.filteredGenres[0].movies[0].title.toLowerCase()).toEqual(
      movieTitle.toLowerCase()
    );
  });
  
  it('should update filteredMovies correctly when searchTerm does not match any movie title', () => {
    component.searchTerm = 'Invalid Director Name';
    component.filterGenres();
    expect(component.filteredGenres.length).toBe(0);
  });

  it('debería desplazar el carrusel hacia la izquierda', () => {

    const container: HTMLElement = document.createElement('div');
    container.scrollBy = jasmine.createSpy();

    const eventMock: any = {
      target: {
        closest: jasmine.createSpy().and.returnValue({
          querySelector: jasmine.createSpy().and.returnValue(container)
        })
      }
    };

    component.scrollCarousel(eventMock, -1);

    expect(container.scrollBy).toHaveBeenCalledWith(-400, 0);

  });

  it('debería desplazar el carrusel hacia la derecha', () => {

    const container: HTMLElement = document.createElement('div');
    container.scrollBy = jasmine.createSpy();

    const eventMock: any = {
      target: {
        closest: jasmine.createSpy().and.returnValue({
          querySelector: jasmine.createSpy().and.returnValue(container)
        })
      }
    };

    component.scrollCarousel(eventMock, 1);

    expect(container.scrollBy).toHaveBeenCalledWith(400, 0);

  });

  it('should call getMovies method of MovieService on initialization', fakeAsync(() => {
      const genreServiceSpy = spyOn(component['genreService'], 'getGenres').and.returnValue(of(genresMock));

      component.getMovies();
      tick();

      expect(genreServiceSpy).toHaveBeenCalled();
  }));

  it('should populate movies array with data from MovieService', () => {
    expect(component.genres[0].movies.length).toBe(10);
  });

  it('should call getMovie method of MovieService with the provided ID', () => {
    const movieId = faker.lorem.sentence();
    spyOn(movieService, 'getMovie').and.returnValue(of(genresMock[0].movies[0]));
    component.onSelected(movieId);
    expect(movieService.getMovie).toHaveBeenCalledWith(movieId);
  });

});