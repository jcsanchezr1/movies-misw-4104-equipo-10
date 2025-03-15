import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { faker } from '@faker-js/faker';

import { GenreCreateComponent } from './genre-create.component';
import { GenreService } from '../genre.service';
import { Genre } from '../genre';

describe('GenreCreateComponent', () => {
  let component: GenreCreateComponent;
  let fixture: ComponentFixture<GenreCreateComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let genreServiceSpy: jasmine.SpyObj<GenreService>;
  let genreCreatedSource: Subject<void>;

  beforeEach(async(() => {
    genreCreatedSource = new Subject<void>();

    toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    genreServiceSpy = jasmine.createSpyObj('GenreService', ['createGenre', 'getGenres', 'notifyGenreCreated']);
    genreServiceSpy.genreCreated$ = genreCreatedSource.asObservable();

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgbModule,
        ToastrModule.forRoot()
      ],
      declarations: [GenreCreateComponent],
      providers: [
        { provide: ToastrService, useValue: toastrService },
        { provide: GenreService, useValue: genreServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreCreateComponent);
    component = fixture.componentInstance;

    const genre: Genre = {
      id: faker.string.uuid(),
      type: faker.word.noun(),
      movies: []
    };

    genreServiceSpy.createGenre.and.returnValue(of(genre));
    genreServiceSpy.getGenres.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create genre when name is unique', async () => {
    const genre: Genre = { id: '', type: 'Unique Genre', movies: [] };
    genreServiceSpy.getGenres.and.returnValue(of([]));
    genreServiceSpy.createGenre.and.returnValue(of(genre));

    await component.createGenre(genre);

    expect(genreServiceSpy.createGenre).toHaveBeenCalledWith(genre);
    expect(toastrService.success).toHaveBeenCalledWith('Género creado', 'Confirmación');
  });

  it('should not create genre when name already exists', async () => {
    const existingGenre: Genre = { id: faker.string.uuid(), type: 'Existing Genre', movies: [] };
    const genre: Genre = { id: '', type: 'Existing Genre', movies: [] };
    genreServiceSpy.getGenres.and.returnValue(of([existingGenre]));

    await component.createGenre(genre);

    expect(genreServiceSpy.createGenre).not.toHaveBeenCalled();
  });

  it('should mark control as invalid if empty', () => {
    const controlName = 'type';
    component.genreForm.get(controlName)?.setValue('');
    component.genreForm.get(controlName)?.markAsTouched();

    expect(component.isControlInvalid(controlName)).toBe(true);
  });

  it('should not mark control as invalid if valid', () => {
    const controlName = 'type';
    component.genreForm.get(controlName)?.setValue('Valid Genre');
    component.genreForm.get(controlName)?.markAsTouched();

    expect(component.isControlInvalid(controlName)).toBe(false);
  });

  it('should return false if control is null', () => {
    const controlName = 'invalidControlName';
    expect(component.isControlInvalid(controlName)).toBe(false);
  });
});
