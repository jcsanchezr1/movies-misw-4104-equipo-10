import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, switchMap } from 'rxjs';
import { Movie } from './movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiUrl: string = environment.baseUrl + 'movies';
  private apiUrlTrailer: string = environment.baseUrl + 'youtube-trailers';

  constructor( private http: HttpClient ) { }

  getMovie(id: String): Observable<Movie> {
    return this.http.get<Movie>(this.apiUrl + '/' + id);
  }

  createTrailer(trailerData: any): Observable<any> {
    return this.http.post<any>(this.apiUrlTrailer, trailerData);
  }

  createMovie(movie: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, movie);
  }

  registerMovieWithTrailer(movieFormData: any, trailerFormData: any): Observable<any> {
    return this.createTrailer(trailerFormData).pipe(
      switchMap((trailerResponse: any) => {
        movieFormData.genre = { id: movieFormData.genre };
        movieFormData.director = { id: movieFormData.director };
        movieFormData.youtubeTrailer = { id: trailerResponse.id };
        console.log(movieFormData);
        return this.createMovie(movieFormData);
      })
    );
  }

}
