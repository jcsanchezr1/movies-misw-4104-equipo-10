/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActorListComponent } from './actor-list.component';
import { HttpClientModule } from '@angular/common/http';
import { faker } from '@faker-js/faker';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActorService } from '../actor.service';
import { Actor } from '../actor';
import { Movie } from '../../movie/movie';
import { Genre } from '../../genre/genre';
import { Director } from '../../director/director';
import { Trailer } from '../../movie/trailer';
import { RouterTestingModule } from '@angular/router/testing';

describe('ActorListComponent', () => {
  let component: ActorListComponent;
  let fixture: ComponentFixture<ActorListComponent>;
  let debug: DebugElement;

  let actorService: ActorService;
  let actorsMock: Array<Actor> = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, RouterTestingModule],
      declarations: [ActorListComponent],
      providers: [ActorService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActorListComponent);
    component = fixture.componentInstance;
    actorService = TestBed.inject(ActorService);

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

    for (let i = 0; i < 10; i++) {
      const actor = new Actor(
        faker.string.uuid(),
        faker.lorem.sentence(),
        faker.image.url(),
        faker.lorem.sentence(),
        faker.date.past(),
        faker.lorem.sentence(),
        movieList
      );
      component.actors.push(actor);
      actorsMock.push(actor);
    }
    spyOn(actorService, 'getActors').and.returnValue(of(actorsMock));
    fixture.detectChanges();
    debug = fixture.debugElement
  });

  afterEach(() => {
    actorsMock = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 10 <div.col.mb-2> elements', () => {
    expect(debug.queryAll(By.css('div.col.mb-2'))).toHaveSize(10)
  });

  it('should have 10 <card.p-0> elements', () => {
    expect(debug.queryAll(By.css('div.card.p-0'))).toHaveSize(10)
  });

  it('should have 10 <img> elements', () => {
    expect(debug.queryAll(By.css('img.card-img-top'))).toHaveSize(10)
  });

  it('should have 10 <div.card-body> elements', () => {
    expect(debug.queryAll(By.css('div.card-body'))).toHaveSize(10)
  });

  it('should have the corresponding src to the book image and alt to the book name', () => {
    debug.queryAll(By.css('img.card-img-top')).forEach((img, i) => {
      expect(img.attributes['src']).toEqual(
        component.actors[i].photo)

      expect(img.attributes['alt']).toEqual(
        component.actors[i].name)
    })
  });

  it('should have h5 tag with the actor.name', () => {
    debug.queryAll(By.css('h5.card-title')).forEach((h5, i) => {
      expect(h5.nativeElement.textContent).toContain(component.actors[i].name)
    });
  });

  it('should have 9 <div.col.mb-2> elements and the deleted actor should not exist', () => {
    const actor = component.actors.pop()!;
    fixture.detectChanges();
    expect(debug.queryAll(By.css('div.col.mb-2'))).toHaveSize(9)

    debug.queryAll(By.css('div.col.mb-2')).forEach((selector, i) => {
      expect(selector.nativeElement.textContent).not.toContain(actor.name);
    });
  });

  it('should display birthDate in the format MMM dd, yyyy', () => {
    debug.queryAll(By.css('p.card-text')).forEach((p, i) => {
      const displayedDate = p.nativeElement.textContent.trim();
      expect(displayedDate).toMatch(new RegExp(/^\w{3} \d{1,2}, \d{4}$/));
    });
  });

  it('should not render any cards if actors list is empty', () => {
    component.actors = [];
    fixture.detectChanges();
    expect(debug.queryAll(By.css('no-results'))).toHaveSize(0);
  });

  it('should update filteredActors correctly when searchTerm is empty', () => {
    component.searchTerm = '';
    component.filterActors();
    expect(component.filteredActors).toEqual(component.actors);
  });

  it('should filter actors when searchTerm exactly matches actor names', () => {
    const actorName = component.actors[0].name;
    component.searchTerm = actorName;
    component.filterActors();
    expect(component.filteredActors.length).toBe(1);
    expect(component.filteredActors[0].name.toLowerCase()).toEqual(actorName.toLowerCase());
  });

  it('should update filteredActors correctly when searchTerm does not match any actor names', () => {
    component.searchTerm = 'Invalid actor Name';
    component.filterActors();
    expect(component.filteredActors.length).toBe(0);
  });

  it('should call getActors method of ActorService on initialization', () => {
    expect(actorService.getActors).toHaveBeenCalled();
  });

  it('should populate actors array with data from ActorService', () => {
    expect(component.actors.length).toBe(10);
  });

  it('should call getActor method of ActorService with the provided ID', () => {
    const actorId = faker.string.uuid();
    spyOn(actorService, 'getActor').and.returnValue(of(actorsMock[0]));
    component.onSelected(component.actors[0]);
    expect(actorService.getActor).toHaveBeenCalledWith(actorsMock[0].id);
  });

});
