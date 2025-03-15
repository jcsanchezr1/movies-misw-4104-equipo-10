import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { faker } from '@faker-js/faker';

import { ActorCreateComponent } from './actor-create.component';
import { ActorService } from '../actor.service';
import { Actor } from '../actor';
import { Trailer } from '../../movie/trailer';
import { Director } from '../../director/director';
import { Genre } from '../../genre/genre';
import { Movie } from '../../movie/movie';

describe('ActorCreateComponent', () => {
  let component: ActorCreateComponent;
  let fixture: ComponentFixture<ActorCreateComponent>;
  let toastrService: ToastrService;
  let actorService: ActorService;
  let debugElement: DebugElement;
  let actor: Actor;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgbModule,
        ToastrModule.forRoot()
      ],
      declarations: [ActorCreateComponent],
      providers: [
        { provide: ToastrService, useValue: { success: () => { } } },
        { provide: ActorService, useValue: { createActor: () => of({}) } }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActorCreateComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    toastrService = TestBed.inject(ToastrService);
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

    actor = new Actor(
      faker.string.uuid(),
      faker.person.fullName(),
      faker.image.url(),
      faker.location.country(),
      faker.date.recent(),
      faker.lorem.sentence(),
      movieList
    );


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize actorForm with empty fields', () => {
    expect(component.actorForm.get('name')?.value).toEqual('');
    expect(component.actorForm.get('photo')?.value).toEqual('');
    expect(component.actorForm.get('nationality')?.value).toEqual('');
    expect(component.actorForm.get('birthDate')?.value).toEqual('');
    expect(component.actorForm.get('biography')?.value).toEqual('');
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

  it('should mark name field as invalid if empty', () => {
    const nameField = component.actorForm.get('name');
    if (nameField) {
      nameField.setValue('');
      expect(nameField.valid).toBeFalsy();
    } else {
      fail('Name field not found in form');
    }
  });

  it('should create actor with faker data when createActor is called', () => {
    spyOn(actorService, 'createActor').and.returnValue(of(actor));
    component.createActor(actor);
    expect(actorService.createActor).toHaveBeenCalledWith(actor);
  });

  it('should return invalidUrl if URL is invalid', () => {
    const invalidUrlControl = new FormControl('invalid-url');
    const result = component.urlValidator(invalidUrlControl);
    expect(result).toEqual({ 'invalidUrl': true });
  });

  it('should return false for all controls if all are valid and untouched', () => {
    component.actorForm.setValue({
      name: 'John Doe',
      photo: 'https://example.com/photo.jpg',
      nationality: 'USA',
      birthDate: { year: 2000, month: 1, day: 1 },
      biography: 'Lorem ipsum dolor sit amet.'
    });

    expect(component.isControlInvalid('name')).toBe(false);
    expect(component.isControlInvalid('photo')).toBe(false);
    expect(component.isControlInvalid('nationality')).toBe(false);
    expect(component.isControlInvalid('birthDate')).toBe(false);
    expect(component.isControlInvalid('biography')).toBe(false);
  });

  it('should return true if control is invalid and touched', () => {
    component.actorForm.get('name')?.setErrors({ 'required': true });
    component.actorForm.get('name')?.markAsTouched();
    expect(component.isControlInvalid('name')).toBe(true);
  });

  it('should return false if control is null', () => {
    const controlName = 'invalidControlName';
    expect(component.isControlInvalid(controlName)).toBe(false);
  });



});