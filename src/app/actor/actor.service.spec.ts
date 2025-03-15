/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActorService } from './actor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';
import { Movie } from '../movie/movie';
import { Actor } from './actor';
import { Director } from '../director/director';
import { Genre } from '../genre/genre';
import { Trailer } from '../movie/trailer';

describe('Service: Actor', () => {

  let service: ActorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActorService],
    });
    service = TestBed.inject(ActorService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('should ...', inject([ActorService], (service: ActorService) => {
    expect(service).toBeTruthy();
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should ...', inject([ActorService], (service: ActorService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable<Actors[]>', () => {
    const actorsMock: Array<Actor> = [];
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
      const actor = new Actor(
        faker.string.uuid(),
        faker.person.fullName(),
        faker.image.url(),
        faker.location.country(),
        faker.date.recent(),
        faker.lorem.sentence(),
        movieList
      );
      actorsMock.push(actor);
    }

    service.getActors().subscribe((actors) => {
      expect(actors.length).toBe(3);
      expect(actors).toEqual(actorsMock);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/actors');
    expect(req.request.method).toBe('GET');
    req.flush(actorsMock);
  });

  it('should return a single actor by ID', () => {
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
    const mockActor = new Actor(
      faker.string.uuid(),
      faker.person.fullName(),
      faker.image.url(),
      faker.location.country(),
      faker.date.recent(),
      faker.lorem.sentence(),
      movieList
    );
    const actorId = mockActor.id;

    service.getActor(actorId).subscribe((actor) => {
      expect(actor).toEqual(mockActor);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/actors/' + actorId);
    expect(req.request.method).toBe('GET');
    req.flush(mockActor);
  });

  it('should create an actor', () => {
    const newActor: Actor = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      photo: faker.image.url(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
      movies: []
    };

    service.createActor(newActor).subscribe((createdActor) => {
      expect(createdActor).toEqual(newActor);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/actors');
    expect(req.request.method).toBe('POST');
    req.flush(newActor);
  });

});
