import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';
import { DirectorService } from './director.service';
import { Director } from './director';
import { Movie } from '../movie/movie';
import { Genre } from '../genre/genre';
import { Trailer } from '../movie/trailer';

describe('Service: Director', () => {
  let service: DirectorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DirectorService],
    });
    service = TestBed.inject(DirectorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should ...', inject([DirectorService], (service: DirectorService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable<Directors[]>', () => {
    const directorsMock: Array<Director> = [];
    const trailer = new Trailer(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.number.int(),
      faker.lorem.sentence()
    );

    const director = new Director(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.date.recent().toString(),
      faker.lorem.sentence(),
      []
    );

    const genre = new Genre(faker.lorem.sentence(), faker.lorem.sentence(), []);
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
      const director = new Director(
        faker.string.uuid(),
        faker.person.fullName(),
        faker.image.url(),
        faker.location.country(),
        faker.date.recent(),
        faker.lorem.sentence(),
        movieList
      );
      directorsMock.push(director);
    }

    service.getDirectors().subscribe((directors) => {
      expect(directors.length).toBe(3);
      expect(directors).toEqual(directorsMock);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/directors');
    expect(req.request.method).toBe('GET');
    req.flush(directorsMock);
  });

  it('should return a single director by ID', () => {
    const trailer = new Trailer(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.number.int(),
      faker.lorem.sentence()
    );

    const director = new Director(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.date.recent().toString(),
      faker.lorem.sentence(),
      []
    );

    const genre = new Genre(faker.lorem.sentence(), faker.lorem.sentence(), []);
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
    const mockDirector = new Director(
      faker.string.uuid(),
      faker.person.fullName(),
      faker.image.url(),
      faker.location.country(),
      faker.date.recent(),
      faker.lorem.sentence(),
      movieList
    );
    const directorId = mockDirector.id;

    service.getDirector(directorId).subscribe((director) => {
      expect(director).toEqual(mockDirector);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/api/v1/directors/' + directorId
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockDirector);
  });

  it('should create a Director', () => {
    const newDirector: Director = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      photo: faker.image.url(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
      movies: [],
    };

    service.createDirector(newDirector).subscribe((createdDirector) => {
      expect(createdDirector).toEqual(newDirector);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/directors');
    expect(req.request.method).toBe('POST');
    req.flush(newDirector);
  });
});
