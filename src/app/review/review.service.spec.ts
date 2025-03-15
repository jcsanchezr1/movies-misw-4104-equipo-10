/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Review } from '../movie/review';
import { faker } from '@faker-js/faker';

describe('Service: Review', () => {

  let service: ReviewService;
  let mockReview: Review;
  let httpTestingController: HttpTestingController;
  let reviewCreatedSourceSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService]
    });

    service = TestBed.inject(ReviewService);
    httpTestingController = TestBed.inject(HttpTestingController);
    reviewCreatedSourceSpy = spyOn<any>(service['reviewCreatedSource'], 'next').and.callThrough();

    mockReview = new Review(
      faker.lorem.word(),
      faker.lorem.sentence(),
      faker.number.int( { min: 1, max: 5 } ),
      faker.lorem.word()
    )

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should ...', inject([ReviewService], (service: ReviewService) => {
    expect(service).toBeTruthy();
  }));

  it('should create a review', () => {
    
    const movieId = '1';

    service.createReview(movieId, mockReview).subscribe((review: any) => {
      expect(review).toEqual(mockReview);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/v1/movies' + '/' + movieId + '/reviews');
    expect(req.request.method).toEqual('POST');
    req.flush(mockReview);
  });

  it('should notify when review is created', () => {
    service.notifyReviewCreated();

    expect(reviewCreatedSourceSpy).toHaveBeenCalled();
  });

});
