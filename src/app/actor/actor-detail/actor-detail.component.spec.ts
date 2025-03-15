/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { faker } from '@faker-js/faker';

import { ActorDetailComponent } from './actor-detail.component';
import { Actor } from '../actor';
import { Movie } from '../../movie/movie';
import { Director } from '../../director/director';
import { Trailer } from '../../movie/trailer';
import { Genre } from '../../genre/genre';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { ActorService } from '../actor.service';
import { of } from 'rxjs';

describe('ActorDetailComponent', () => {

  let component: ActorDetailComponent;
  let fixture: ComponentFixture<ActorDetailComponent>;
  let debug: DebugElement;
  let router: Router;
  let actorService: ActorService;

  beforeEach(async(() => {
       
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [ActorDetailComponent],
      providers: [
        ActorService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActorDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    actorService = TestBed.inject(ActorService);
    
    const trailer = new Trailer(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.number.int(),
      faker.lorem.sentence()
    )

    const directorMovie = new Director(
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
        faker.date.recent().toString(),
        faker.number.int({ min: 0, max: 5 }),
        directorMovie,
        [],
        genre,
        [],
        [],
        trailer
      )
    ];
    const actor = new Actor(
      faker.string.uuid(),
      faker.person.fullName(),
      faker.image.url(),
      faker.location.country(),
      faker.date.recent(),
      faker.lorem.sentence(),
      movieList
    );
    component.actorDetail = actor;
    fixture.detectChanges();
    debug = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have only one element to volver ', () => {
    expect(debug.queryAll(By.css('.detail-title'))).toHaveSize(1);
  });

  it('should have a actor-name element with actorDetail.name', () => {
    const element: HTMLElement = debug.query(
      By.css('.actor-name')
    ).nativeElement;
    expect(element.textContent).toContain(component.actorDetail.name);
  });

  it('should have an img element with src= actorDetail.photo', () => {
    expect(debug.query(By.css('img')).attributes['src']).toEqual(component.actorDetail.photo);
  });

  it('should have an img element with alt= actorDetail.name', () => {
    expect(debug.query(By.css('img')).attributes['alt']).toEqual(component.actorDetail.name);
  });

  it('should have an actor along with its biography', () => {
    const element: HTMLElement = debug.query(
      By.css('.actor-biography')
    ).nativeElement;
    expect(element.textContent).toContain(component.actorDetail.biography);
  });

  it('should have two elements along with its nationality and birthDate', () => {
    expect(debug.queryAll(By.css('.info-item'))).toHaveSize(2);
  });

  it('should move the carrousel through left', () => {
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

  it('should move the carrousel through right', () => {

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

  it('should call getActor method of ActorService with correct actorId and assign actorDetail', () => {
    const actorId = '1';
    const mockActor = new Actor(
      '1',
      faker.person.fullName(),
      faker.image.url(),
      faker.location.country(),
      faker.date.recent(),
      faker.lorem.sentence(),
      []
    );
    
    spyOn(actorService, 'getActor').and.returnValue(of(mockActor));

    component.actorId = actorId;
    component.getActor();

    expect(actorService.getActor).toHaveBeenCalledWith(actorId);

    expect(component.actorDetail).toEqual(mockActor);
  });

  it('should navigate to /actors/list when onSelected is called', () => {
    spyOn(router, 'navigate');
    component.onSelected();
    expect(router.navigate).toHaveBeenCalledWith(['/actors/list']);
  });

  it('should call getActor if actorId is present', () => {
    spyOn(component, 'getActor');
    component.ngOnInit();
    expect(component.getActor).toHaveBeenCalled();
  });
}); 
