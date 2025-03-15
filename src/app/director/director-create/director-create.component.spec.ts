/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { faker } from '@faker-js/faker';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

import { DirectorService } from '../director.service';
import { DirectorCreateComponent } from './director-create.component';
import { Director } from '../director';
import { Trailer } from '../../movie/trailer';
import { Genre } from '../../genre/genre';
import { Movie } from '../../movie/movie';

describe('DirectorCreateComponent', () => {
  let component: DirectorCreateComponent;
  let fixture: ComponentFixture<DirectorCreateComponent>;
  let toastrService: ToastrService;
  let directorService: DirectorService;
  let debugElement: DebugElement;
  let director: Director;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      declarations: [DirectorCreateComponent],
      providers: [
        { provide: ToastrService, useValue: { success: () => {} } },
        {
          provide: DirectorService,
          useValue: { createDirector: () => of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorCreateComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    toastrService = TestBed.inject(ToastrService);
    directorService = TestBed.inject(DirectorService);
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

    director = new Director(
      faker.string.uuid(),
      faker.person.fullName(),
      faker.image.url(),
      faker.location.country(),
      faker.date.recent(),
      faker.lorem.sentence(),
      movieList
    );

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize directorForm with empty fields', () => {
    expect(component.directorForm.get('directorName')?.value).toEqual('');
    expect(component.directorForm.get('directorPhoto')?.value).toEqual('');
    expect(component.directorForm.get('directorNationality')?.value).toEqual(
      ''
    );
    expect(component.directorForm.get('directorBirthDate')?.value).toEqual('');
    expect(component.directorForm.get('directorBiography')?.value).toEqual('');
  });

  it('should set minDate correctly', () => {
    const currentDate = new Date();
    const expectedMinDate = {
      year: currentDate.getFullYear() - 1000,
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    };
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should set maxDate correctly', () => {
    const currentDate = new Date();
    const expectedMaxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    };
    expect(component.maxDate).toEqual(expectedMaxDate);
  });

  it('should mark directorName field as invalid if empty', () => {
    const nameField = component.directorForm.get('directorName');
    if (nameField) {
      nameField.setValue('');
      expect(nameField.valid).toBeFalsy();
    } else {
      fail('Name field not found in form');
    }
  });

  it('should create director with faker data when createDirector is called', () => {
    spyOn(directorService, 'createDirector').and.returnValue(of(director));
    component.createDirector(director);
    expect(directorService.createDirector).toHaveBeenCalledWith(director);
  });

  it('should return invalidUrl if URL is invalid', () => {
    const invalidUrlControl = new FormControl('invalid-url');
    const result = component.urlValidator(invalidUrlControl);
    expect(result).toEqual({ invalidUrl: true });
  });

  it('should return false for all controls if all are valid and untouched', () => {
    component.directorForm.setValue({
      directorName: 'John Doe',
      directorPhoto: 'https://example.com/photo.jpg',
      directorNationality: 'USA',
      directorBirthDate: { year: 2000, month: 1, day: 1 },
      directorBiography: 'Lorem ipsum dolor sit amet.',
    });

    expect(component.isControlInvalid('directorName')).toBe(false);
    expect(component.isControlInvalid('directorPhoto')).toBe(false);
    expect(component.isControlInvalid('directorNationality')).toBe(false);
    expect(component.isControlInvalid('directorBirthDate')).toBe(false);
    expect(component.isControlInvalid('directorBiography')).toBe(false);
  });

  it('should return true if control is invalid and touched', () => {
    component.directorForm.get('directorName')?.setErrors({ required: true });
    component.directorForm.get('directorName')?.markAsTouched();
    expect(component.isControlInvalid('directorName')).toBe(true);
  });

  it('should return false if control is null', () => {
    const controlName = 'invalidControlName';
    expect(component.isControlInvalid(controlName)).toBe(false);
  });
});
