/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MovieCreateComponent } from './movie-create.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { MovieService } from '../movie.service';
import { faker } from '@faker-js/faker';
import { Genre } from '../../genre/genre';
import { GenreService } from '../../genre/genre.service';
import { Director } from '../../director/director';
import { DirectorService } from '../../director/director.service';
import { Trailer } from '../trailer';
import { Movie } from '../movie';

describe('MovieCreateComponent', () => {
  let component: MovieCreateComponent;
  let fixture: ComponentFixture<MovieCreateComponent>;
  let movieService: MovieService;
  let genreService: GenreService;
  let directorService: DirectorService;
  let toastrService: ToastrService;
  let toastrErrorSpy: jasmine.Spy;
  let formBuilder: FormBuilder;
  let trailer: Trailer;
  let director: Director;
  let genre: Genre;
  let movie: Movie;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      declarations: [ MovieCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    movieService = TestBed.inject(MovieService);
    genreService = TestBed.inject(GenreService);
    directorService = TestBed.inject(DirectorService);
    toastrService = TestBed.inject(ToastrService);
    formBuilder = TestBed.inject(FormBuilder);
    toastrErrorSpy = spyOn(toastrService, 'error');
    fixture = TestBed.createComponent(MovieCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    trailer = new Trailer(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.number.int(),
      faker.lorem.sentence()
    )

    director = new Director(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.date.recent().toString(),
      faker.lorem.sentence(),
      []
    )

    genre = new Genre(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      []
    );

    movie = new Movie(
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
    )

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent default event when input is not a number', () => {
    const event = document.createEvent('Event');
    event.initEvent('keypress', true, true);
    Object.defineProperty(event, 'charCode', { value: 65 });
    spyOn(event, 'preventDefault');

    component.validateNumber(event as KeyboardEvent);
    
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent default event when input is a number', () => {
    const event = document.createEvent('Event');
    event.initEvent('keypress', true, true);
    Object.defineProperty(event, 'charCode', { value: 49 });
    spyOn(event, 'preventDefault');

    component.validateNumber(event as KeyboardEvent);
    
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should return invalidUrl if URL is invalid', () => {
    const invalidUrlControl = new FormControl('invalid-url');
    const result = component.urlValidator(invalidUrlControl);
    expect(result).toEqual({ invalidUrl: true });
  });

  it('should return false if control is valid', () => {
    const formGroup: FormGroup = formBuilder.group({
      title: ['', Validators.required],
      description: [''] 
    });

    const result = component.isControlInvalid('description');

    expect(result).toBeFalse();
  });

  it('should call registerMovieWithTrailer with correct data and show success toastr on successful registration', () => {
    spyOn(movieService, 'registerMovieWithTrailer').and.returnValue(of({}));

    const date = {
      year: faker.number.int({ min: 1900, max: 2024 }),
      month: faker.number.int({ min: 1, max: 12 }),
      day: faker.number.int({ min: 1, max: 28 })
    }

    const parsedDate = new Date( date.year, date.month -1, date.day )

    component.movieForm.setValue({
      title: movie.title,
      poster: movie.poster,
      releaseDate: date,
      popularity: movie.popularity.toString(),
      duration: movie.duration.toString(),
      country: movie.country,
      trailer: trailer.url,
      director: {id: director.id},
      genre: {id: genre.id}
    });

    component.onSubmit();

    expect(movieService.registerMovieWithTrailer).toHaveBeenCalledWith(
      {
        title: movie.title,
        releaseDate: parsedDate.toISOString(),
        poster: movie.poster,
        popularity: movie.popularity,
        duration: movie.duration,
        country: movie.country,
        director: {id: director.id},
        genre: {id: genre.id},
      },
      {
        name: movie.title,
        url: trailer.url,
        duration: 0,
        channel: 'YouTube'
      }
    );
  });

  it('should show error toastr on failed registration', () => {
    spyOn(movieService, 'registerMovieWithTrailer').and.returnValue(throwError('Error'));

    component.movieForm.setValue({
      title: movie.title,
      poster: movie.poster,
      releaseDate: { year: 2024, month: 5, day: 14 },
      popularity: movie.popularity.toString(),
      duration: movie.duration.toString(),
      country: movie.country,
      trailer: trailer.url,
      director: {id: director.id},
      genre: {id: genre.id}
    });

    component.onSubmit();

    expect(toastrErrorSpy).toHaveBeenCalledWith(
      'Algo falló al registrar la película. Vuelve a intentarlo',
      'Error'
    );
  });

  it('should fetch and sort genres correctly', fakeAsync(() => {
    const genres: Genre[] = [];

    for (let i = 0; i < 10; i++) {
      const genre: Genre = {
        id: faker.lorem.word(),
        type: faker.lorem.word(),
        movies: []
      };
      genres.push(genre);
    }

    spyOn(genreService, 'getGenres').and.returnValue(of(genres));

    component.getGenres();
    tick();

    expect(genreService.getGenres).toHaveBeenCalled();
    expect(component.genres).toEqual(genres.sort((a, b) => a.type.toLowerCase().localeCompare(b.type.toLowerCase())));
  }));

  it('should fetch and sort directors correctly', fakeAsync(() => {
    const directors: Director[] = [];

    for (let i = 0; i < 10; i++) {
      const director: Director = {
        id: faker.lorem.word(),
        name: faker.lorem.word(),
        biography: faker.lorem.paragraph(),
        birthDate: faker.date.birthdate(),
        nationality: faker.lorem.word(),
        photo: faker.image.url(),
        movies: []
      };
      directors.push(director);
    }

    spyOn(directorService, 'getDirectors').and.returnValue(of(directors));

    component.getDirectors();
    tick();

    expect(directorService.getDirectors).toHaveBeenCalled();
    expect(component.directors).toEqual(directors.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
  }));
  
});
