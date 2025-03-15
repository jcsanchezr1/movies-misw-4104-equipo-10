import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Genre } from './genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private apiUrl: string = environment.baseUrl + 'genres';
  private genreCreatedSource = new Subject<void>();

  genreCreated$ = this.genreCreatedSource.asObservable();

  constructor(private http: HttpClient) { }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.apiUrl);
  }

  createGenre(genre: Genre): Observable<Genre> {
    return this.http.post<Genre>(this.apiUrl, genre);
  }

  notifyGenreCreated() {
    this.genreCreatedSource.next();
  }

}
