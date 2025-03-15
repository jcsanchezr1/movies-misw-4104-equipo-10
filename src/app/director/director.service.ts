import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Director } from './director';

@Injectable({
  providedIn: 'root',
})
export class DirectorService {
  private apiUrl: string = environment.baseUrl + 'directors';

  constructor(private http: HttpClient) {}

  getDirectors(): Observable<Director[]> {
    return this.http.get<Director[]>(this.apiUrl);
  }

  getDirector(id: String): Observable<Director> {
    return this.http.get<Director>(this.apiUrl + '/' + id);
  }

  createDirector(director: Director): Observable<Director> {
    return this.http.post<Director>(this.apiUrl, director);
  }
}
