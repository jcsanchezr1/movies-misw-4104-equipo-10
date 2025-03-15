/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { faker } from '@faker-js/faker';

import { DirectorDetailComponent } from './director-detail.component';
import { Director } from '../director';
import { Movie } from '../../movie/movie';
import { Genre } from '../../genre/genre';
import { Trailer } from '../../movie/trailer';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('DirectorDetailComponent', () => {
  let component: DirectorDetailComponent;
  let fixture: ComponentFixture<DirectorDetailComponent>;
  let debug: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [DirectorDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorDetailComponent);
    component = fixture.componentInstance;
    const trailer = new Trailer(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.number.int(),
      faker.lorem.sentence()
    );

    const directorMovie = new Director(
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
        faker.date.recent().toString(),
        faker.number.int({ min: 0, max: 5 }),
        directorMovie,
        [],
        genre,
        [],
        [],
        trailer
      ),
    ];
    const director = new Director(
      faker.string.uuid(),
      faker.person.fullName(),
      faker.image.url(),
      faker.location.country(),
      faker.date.recent(),
      faker.lorem.sentence(),
      movieList
    );
    component.directorDetail = director;
    fixture.detectChanges();
    debug = fixture.debugElement;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have only one element to volver ', () => {
    expect(debug.queryAll(By.css('.detail-title'))).toHaveSize(1);
  });

  it('should have a director-name element with directorDetail.name', () => {
    const element: HTMLElement = debug.query(
      By.css('.director-name')
    ).nativeElement;
    expect(element.textContent).toContain(component.directorDetail.name);
  });

  it('should have an img element with src= directorDetail.photo', () => {
    expect(debug.query(By.css('img')).attributes['src']).toEqual(
      component.directorDetail.photo
    );
  });

  it('should have an img element with alt= directorDetail.name', () => {
    expect(debug.query(By.css('img')).attributes['alt']).toEqual(
      component.directorDetail.name
    );
  });

  it('should have an director along with its biography', () => {
    const element: HTMLElement = debug.query(
      By.css('.director-biography')
    ).nativeElement;
    expect(element.textContent).toContain(component.directorDetail.biography);
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
          querySelector: jasmine.createSpy().and.returnValue(container),
        }),
      },
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
          querySelector: jasmine.createSpy().and.returnValue(container),
        }),
      },
    };

    component.scrollCarousel(eventMock, 1);
    expect(container.scrollBy).toHaveBeenCalledWith(400, 0);
  });

  it('should emit returnClicked event when onClick is called', () => {
    const returnClickedSpy = spyOn(component.returnClicked, 'emit');
    component.onClick();
    expect(returnClickedSpy).toHaveBeenCalled();
  });
});
