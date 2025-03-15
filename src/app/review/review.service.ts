import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Review } from '../movie/review';

@Injectable({
  providedIn: 'root'
})

export class ReviewService {

  private apiUrl: string = environment.baseUrl + 'movies';
  private reviewCreatedSource = new Subject<void>();

  reviewCreated$ = this.reviewCreatedSource.asObservable();

  constructor( private http: HttpClient ) { }

  createReview(id: String, review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl + '/' + id + '/reviews', review);
  }

  notifyReviewCreated() {
    this.reviewCreatedSource.next();
  }

}
