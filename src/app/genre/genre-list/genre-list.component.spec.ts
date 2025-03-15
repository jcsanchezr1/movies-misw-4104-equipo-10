import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { faker } from '@faker-js/faker';
import { of, Subject } from 'rxjs';
import { GenreListComponent } from './genre-list.component';
import { GenreService } from '../genre.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Genre } from '../genre';

describe('GenreListComponent', () => {
  let component: GenreListComponent;
  let fixture: ComponentFixture<GenreListComponent>;

  let debug: DebugElement;

  let genreService: GenreService;
  let genreMock: Array<Genre> = [];
  let genreCreatedSubject: Subject<void>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, RouterTestingModule],
      declarations: [GenreListComponent],
      providers: [GenreService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreListComponent);
    component = fixture.componentInstance;
    genreService = TestBed.inject(GenreService);

    const genre = new Genre(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      []
    );

    for (let i = 0; i < 10; i++) {
      const genre = new Genre(
        faker.string.uuid(),
        faker.string.sample({ min: 10, max: 50 }),
        []
      );
      component.genres.push(genre);
      genreMock.push(genre);
    }

    genreCreatedSubject = new Subject<void>();
    genreService.genreCreated$ = genreCreatedSubject.asObservable();

    spyOn(genreService, 'getGenres').and.returnValue(of(genreMock));
    fixture.detectChanges();
    debug = fixture.debugElement
  });

  afterEach(() => {
    genreMock = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getGenres method of GenreService on initialization', () => {
    expect(genreService.getGenres).toHaveBeenCalled();
  });

  it('should populate genres array with data from GenreService', () => {
    expect(component.genres.length).toBe(10);
  });

  it('should refresh genres when a new genre is created', () => {
    genreCreatedSubject.next();
    expect(genreService.getGenres).toHaveBeenCalledTimes(2);
  });
});
