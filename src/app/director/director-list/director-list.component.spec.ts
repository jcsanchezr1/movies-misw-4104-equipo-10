import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { faker } from '@faker-js/faker';

import { DirectorListComponent } from './director-list.component';
import { HttpClientModule } from '@angular/common/http';
import { Director } from '../director';
import { DirectorService } from '../director.service';
import { Movie } from '../../movie/movie';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Genre } from '../../genre/genre';
import { Trailer } from '../../movie/trailer';
import { RouterTestingModule } from '@angular/router/testing';

describe('DirectorListComponent', () => {
  let component: DirectorListComponent;
  let fixture: ComponentFixture<DirectorListComponent>;
  let debug: DebugElement;
  let directorService: DirectorService;
  let directorsMock: Array<Director> = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, RouterTestingModule],
      declarations: [DirectorListComponent],
      providers: [DirectorService],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorListComponent);
    component = fixture.componentInstance;
    directorService = TestBed.inject(DirectorService);

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
    for (let i = 0; i < 10; i++) {
      const director = new Director(
        faker.string.uuid(),
        faker.person.fullName(),
        faker.image.url(),
        faker.location.country(),
        faker.date.recent(),
        faker.lorem.sentence(),
        movieList
      );
      component.directors.push(director);
      directorsMock.push(director);
    }
    spyOn(directorService, 'getDirectors').and.returnValue(of(directorsMock));
    fixture.detectChanges();
    debug = fixture.debugElement;
  }));

  afterEach(() => {
    directorsMock = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 10 <div.col.mb-2> elements', () => {
    expect(debug.queryAll(By.css('div.col.mb-2'))).toHaveSize(10);
  });

  it('should have 10 <card.p-0> elements', () => {
    expect(debug.queryAll(By.css('div.card.p-0'))).toHaveSize(10);
  });

  it('should have 10 <img> elements', () => {
    expect(debug.queryAll(By.css('img'))).toHaveSize(10);
  });

  it('should have 10 <div.card-body> elements', () => {
    expect(debug.queryAll(By.css('div.card-body'))).toHaveSize(10);
  });

  it('should have the corresponding src to the director image and alt to the director name', () => {
    debug.queryAll(By.css('img')).forEach((img, i) => {
      expect(img.attributes['src']).toEqual(component.directors[i].photo);

      expect(img.attributes['alt']).toEqual(component.directors[i].name);
    });
  });

  it('should have h5 tag with the director.name', () => {
    debug.queryAll(By.css('h5.card-title')).forEach((h5, i) => {
      expect(h5.nativeElement.textContent).toContain(
        component.directors[i].name
      );
    });
  });

  it('should have 9 <div.col.mb-2> elements and the deleted director should not exist', () => {
    const director = component.directors.pop()!;
    fixture.detectChanges();
    expect(debug.queryAll(By.css('div.col.mb-2'))).toHaveSize(9);

    debug.queryAll(By.css('div.col.mb-2')).forEach((selector, i) => {
      expect(selector.nativeElement.textContent).not.toContain(director.name);
    });
  });

  it('should have directors with valid birth dates', () => {
    debug.queryAll(By.css('div.card-body p')).forEach((p, i) => {
      const birthDate = new Date(component.directors[i].birthDate);
      expect(birthDate instanceof Date && !isNaN(birthDate.getTime())).toBe(
        true
      );
    });
  });

  it('should update filteredDirectors correctly when searchTerm is empty', () => {
    component.searchTerm = '';
    component.filterDirectors();
    expect(component.filteredDirectors).toEqual(component.directors);
  });

  it('should filter directors when searchTerm exactly matches director names', () => {
    const directorName = component.directors[0].name;
    component.searchTerm = directorName;
    component.filterDirectors();
    expect(component.filteredDirectors.length).toBe(1);
    expect(component.filteredDirectors[0].name.toLowerCase()).toEqual(
      directorName.toLowerCase()
    );
  });

  it('should update filteredDirectors correctly when searchTerm does not match any director names', () => {
    component.searchTerm = 'Invalid Director Name';
    component.filterDirectors();
    expect(component.filteredDirectors.length).toBe(0);
  });

  it('should call getDirectors method of DirectorService on initialization', () => {
    expect(directorService.getDirectors).toHaveBeenCalled();
  });

  it('should populate directors array with data from DirectorService', () => {
    expect(component.directors.length).toBe(10);
  });

  it('should call getDirector method of DirectorService with the provided ID', () => {
    const directorId = faker.string.uuid();
    spyOn(directorService, 'getDirector').and.returnValue(of(directorsMock[0]));
    component.onSelected(directorId);
    expect(directorService.getDirector).toHaveBeenCalledWith(directorId);
  });

  it('should set selected to true after calling onSelected method', () => {
    const directorId = faker.string.uuid();
    spyOn(directorService, 'getDirector').and.returnValue(of(directorsMock[0]));
    component.onSelected(directorId);
    expect(component.selected).toBeTrue();
  });

  it('should set selected to false when onReturnClicked() is called', () => {
    component.selected = true;
    component.onReturnClicked();
    expect(component.selected).toBeFalse(); // Verifica que selected se haya establecido en false
  });
});
