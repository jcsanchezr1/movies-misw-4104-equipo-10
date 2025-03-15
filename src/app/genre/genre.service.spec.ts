/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GenreService } from './genre.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from '../movie/movie.service';
import { Genre } from './genre';
import { Trailer } from '../movie/trailer';
import { Director } from '../director/director';
import { faker } from '@faker-js/faker';
import { Movie } from '../movie/movie';

describe('Service: Genre', () => {

  let service: GenreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GenreService]
    });
    service = TestBed.inject(GenreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should ...', inject([GenreService], (service: GenreService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable<Genre[]>', () => {

    const genresMock: Array<Genre> = [];

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
    const movieList: Movie[] = [
      new Movie(
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
      ),
    ];
    for (let i = 0; i < 3; i++) {
      const genre = new Genre(
        faker.string.uuid(),
        faker.person.fullName(),
        movieList
      );
      genresMock.push(genre);
    }

    service.getGenres().subscribe((genres) => {
      expect(genres.length).toBe(3);
      expect(genres).toEqual(genresMock);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/genres');
    expect(req.request.method).toBe('GET');
    req.flush(genresMock);
  });

  it('should create a Genre', () => {
    const newGenre: Genre = {
      id: faker.string.uuid(),
      type: faker.person.fullName(),
      movies: []
    };

    service.createGenre(newGenre).subscribe((createdGenre) => {
      expect(createdGenre).toEqual(newGenre);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/genres');
    expect(req.request.method).toBe('POST');
    req.flush(newGenre);
  });

  it('should notify when a genre is created', () => {
    let genreCreatedEmitted = false;

    service.genreCreated$.subscribe(() => {
      genreCreatedEmitted = true;
    });
    service.notifyGenreCreated();
    expect(genreCreatedEmitted).toBeTruthy();
  });
});
