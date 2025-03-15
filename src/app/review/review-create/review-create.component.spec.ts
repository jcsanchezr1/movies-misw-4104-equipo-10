/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ReviewCreateComponent } from './review-create.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ReviewService } from '../review.service';
import { Review } from '../../movie/review';
import { faker } from '@faker-js/faker';

describe('ReviewCreateComponent', () => {
  let component: ReviewCreateComponent;
  let fixture: ComponentFixture<ReviewCreateComponent>;
  let formBuilder: FormBuilder;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let review: Review;

  beforeEach(async(() => {

    reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['createReview', 'notifyReviewCreated']);
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      declarations: [ ReviewCreateComponent ],
      providers: [
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCreateComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();

    review = new Review(
      faker.lorem.word(),
      faker.lorem.sentence(),
      faker.number.int( { min: 1, max: 5}),
      faker.lorem.word()
    )

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancelClicked event when cancel() is called', () => {

    spyOn(component.cancelClicked, 'emit');

    component.cancel();

    expect(component.cancelClicked.emit).toHaveBeenCalled();
  });

  it('should return false if control is valid', () => {
    const formGroup: FormGroup = formBuilder.group({
      creator: ['', Validators.required],
      text: [''] 
    });

    const result = component.isControlInvalid('description');

    expect(result).toBeFalse();
  });

  it('should return null if the control does not contain whitespace', () => {
    const control = new FormControl('TextoSinEspacios');
    const resultado = component.noWhitespaceValidator(control);
    expect(resultado).toBeNull();
  });

  it('should return null if the control is empty', () => {
    const control = new FormControl('    ');
    const result = component.noWhitespaceValidator(control);
    expect(result).toEqual({ 'whitespace': true });
  });

  it('should create review successfully', fakeAsync(() => {

    const movieId = faker.lorem.word();

    reviewServiceSpy.createReview.and.returnValue(of(review));

    component.createReview(movieId, review);

    tick();

    expect(reviewServiceSpy.createReview).toHaveBeenCalledWith(movieId, review);
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('La reseña se ha creado correctamente', 'Confirmación');
    expect(reviewServiceSpy.notifyReviewCreated).toHaveBeenCalled();
  }));

  it('should handle error during review creation', fakeAsync(() => {
    const movieId = '1';

    reviewServiceSpy.createReview.and.returnValue(throwError('Error'));

    component.createReview(movieId, review);

    tick();

    expect(reviewServiceSpy.createReview).toHaveBeenCalledWith(movieId, review);
    expect(toastrServiceSpy.error).toHaveBeenCalledWith('Algo falló al registrar la reseña. Vuelve a intentarlo', 'Error');
  }));

});
