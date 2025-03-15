/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { faker } from '@faker-js/faker';

import { MovieDetailComponent } from './movie-detail.component';
import { Trailer } from '../trailer';
import { Director } from '../../director/director';
import { Movie } from '../movie';
import { Genre } from '../../genre/genre';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { of, Subject } from 'rxjs';
import { Review } from '../../review/review';
import { ReviewService } from '../../review/review.service';

describe('MovieDetailComponent', () => {

  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;
  let defaultImageUrl = 'assets/images/placeholder-platform.jpg';
  let router: Router;
  let movieService: MovieService;
  let reviewService: ReviewService; 
  let trailer: Trailer;
  let director: Director;
  let genre: Genre;
  let movie: Movie;
  let reviewCreatedSubject: Subject<void>; 

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ MovieDetailComponent ],
      imports:[HttpClientModule, RouterTestingModule],
      providers: [
        MovieService,
        ReviewService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    })
    .compileComponents();
    reviewCreatedSubject = new Subject<void>();
    TestBed.overrideProvider(ReviewService, { useValue: { reviewCreated$: reviewCreatedSubject }});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    movieService = TestBed.inject(MovieService);
    reviewService = TestBed.inject(ReviewService);

    trailer = new Trailer(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.number.int(),
      faker.lorem.sentence()
    )

    director = new Director(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.date.recent().toString(),
      faker.lorem.sentence(),
      []
    )

    genre = new Genre(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      []
    );

    movie = new Movie(
      faker.string.uuid(),
      faker.string.sample({ min: 10, max: 50 }),
      faker.string.sample({ min: 10, max: 50 }),
      faker.number.int(),
      faker.location.country(),
      faker.date.recent().toString(),
      faker.number.int({ min: 0, max: 5 }),
      director,
      [],
      genre,
      [],
      [],
      trailer
    );
    component.movieDetail = movie;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the src of the target to the default image URL', () => {
    const event = { target: { src: '' } };
    component.handleImageError(event);
    expect(event.target.src).toEqual(defaultImageUrl);
  });

  it('should toggle the value of showAll', () => {
    const initialValue = component.showAll;
    component.toggleShowAll();
    expect(component.showAll).toEqual(!initialValue);
    component.toggleShowAll();
    expect(component.showAll).toEqual(initialValue);
  });

  it('should navigate to /movies/list when onClick is called', () => {
    spyOn(router, 'navigate');
    component.onClick();
    expect(router.navigate).toHaveBeenCalledWith(['/movies/list']);
  });

  it('should call movieService.getMovie() and set movieDetail when getMovie() is called', fakeAsync(() => {
    const movieId = faker.string.uuid();

    const reviews = [];

    for( let i = 0 ; i< 10; i++){

      const review = new Review(
        faker.lorem.word(),
        faker.lorem.sentence(),
        faker.lorem.word(),
        faker.number.int( {min: 1, max: 5 } ),
      )

      reviews.push(review)

    }
    
    movie.reviews = reviews;

    spyOn(movieService, 'getMovie').and.returnValue(of(movie));

    component.movieId = movieId;
    component.getMovie();
    tick();

    expect(movieService.getMovie).toHaveBeenCalledWith(movieId);
    expect(component.movieDetail).toEqual(movie);

    const sortedReviews = component.movieDetail.reviews.sort((a, b) => b.score - a.score);
    expect(component.movieDetail.reviews).toEqual(sortedReviews);

  }));

  it('should call getMovie if movieId is present', () => {
    spyOn(component, 'getMovie');
    component.ngOnInit();
    expect(component.getMovie).toHaveBeenCalled();
  });

  it('showReviewComponent() debería establecer selected en true', () => {
    component.showReviewComponent();
    expect(component.selected).toBeTruthy();
  });

  it('hideReviewComponent() debería establecer selected en false', () => {
    component.hideReviewComponent();
    expect(component.selected).toBeFalsy();
  });

  it('should subscribe to reviewCreated$ and call getMovie()', () => {
    spyOn(component, 'getMovie');
    reviewCreatedSubject.next();
    expect(component.getMovie).toHaveBeenCalled();
  });

});
