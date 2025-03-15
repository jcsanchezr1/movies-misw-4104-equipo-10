import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';
import { PlatformService } from './platform.service';
import { Platform } from './platform';
import { Director } from '../director/director';
import { Genre } from '../genre/genre';
import { Movie } from '../movie/movie';
import { Trailer } from '../movie/trailer';

describe('Service: Platform', () => {
  let service: PlatformService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlatformService],
    });
    service = TestBed.inject(PlatformService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should ...', inject([PlatformService], (service: PlatformService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable<Platform[]>', () => {
    const platformsMock: Array<Platform> = [];

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
        faker.string.uuid(),
        faker.string.sample({ min: 10, max: 50 }),
        faker.string.sample({ min: 10, max: 50 }),
        faker.number.int(),
        faker.location.country(),
        faker.date.recent().toTimeString(),
        faker.number.int({ min: 0, max: 5 }),
        director,
        [],
        genre,
        [],
        [],
        trailer
      ),
    ];

    for (let i = 0; i < 3; i++) {
      const platform = new Platform(
        faker.string.uuid(),
        faker.person.firstName(),
        faker.image.url(),
        movieList
      );
      platformsMock.push(platform);
    }

    service.getPlatforms().subscribe((platforms) => {
      expect(platforms.length).toBe(3);
      expect(platforms).toEqual(platformsMock);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/platforms');
    expect(req.request.method).toBe('GET');
    req.flush(platformsMock);
  });

  it('should create a Platform', () => {
    const newPlatform: Platform = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      url: faker.image.url(),
      movies: [],
    };

    service.createPlatform(newPlatform).subscribe((createdPlatform) => {
      expect(createdPlatform).toEqual(newPlatform);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/platforms');
    expect(req.request.method).toBe('POST');
    req.flush(newPlatform);
  });
});
