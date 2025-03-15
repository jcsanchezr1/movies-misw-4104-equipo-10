/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MovieService } from './movie.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Movie } from './movie';
import { Trailer } from './trailer';
import { faker } from '@faker-js/faker';
import { Director } from '../director/director';
import { Genre } from '../genre/genre';
import { of } from 'rxjs';

describe('Service: Movie', () => {

  let service: MovieService;
  let httpMock: HttpTestingController;
  let trailer: Trailer;
  let director: Director;
  let genre: Genre;
  let movie: Movie;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);

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

  afterEach(() => {
    httpMock.verify();
  });

  it('should ...', inject([MovieService], (service: MovieService) => {
    expect(service).toBeTruthy();
  }));

  it('should return a single movie by ID', () => {
    
    const movieId = movie.id;

    service.getMovie(movieId).subscribe((movie) => {
      expect(movie).toEqual(movie);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/movies/' + movieId);
    expect(req.request.method).toBe('GET');
    req.flush(movie);
  });

  it('should create a trailer', () => {
    service.createTrailer(trailer).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/youtube-trailers');
    expect(req.request.method).toBe('POST');
    req.flush(trailer);
  });

  it('should create a movie', () => {

    const movieMock = {
      "title": movie.title,
      "poster": movie.poster,
      "duration": movie.duration,
      "country": movie.country,
      "releaseDate": movie.releaseDate,
      "popularity": movie.popularity,
      "genre": { "id": genre.id },
      "director": { "id": director.id },
      "youtubeTrailer": { "id": trailer.id }
    }

    service.createMovie(movieMock).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/movies');
    expect(req.request.method).toBe('POST');
    req.flush(movie);
  });

  it('should register a movie with trailer', () => {

    const trailerFormData = {
      "id": trailer.id,
      "name": trailer.name,
      "url": trailer.url,
      "duration": trailer.duration,
      "channel": trailer.channel
    }

    const movieFormData = {
      "title": movie.title,
      "poster": movie.poster,
      "duration": movie.duration,
      "country": movie.country,
      "releaseDate": movie.releaseDate,
      "popularity": movie.popularity,
      "genre": { "id": genre.id },
      "director": { "id": director.id },
      "youtubeTrailer": { "id": trailerFormData.id }
    }

    const mockTrailerResponse = { id: trailerFormData.id };
    spyOn(service, 'createTrailer').and.returnValue(of(mockTrailerResponse));

    const mockMovieResponse = movie;
    spyOn(service, 'createMovie').and.returnValue(of(mockMovieResponse));

    service.registerMovieWithTrailer(movieFormData, trailerFormData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    expect(service.createTrailer).toHaveBeenCalledWith(trailerFormData);

    expect(service.createMovie).toHaveBeenCalledWith({
      ...movieFormData,
      genre: { id: movieFormData.genre.id },
      director: { id: movieFormData.director.id },
      youtubeTrailer: { id: mockTrailerResponse.id }
    });
  });

});
