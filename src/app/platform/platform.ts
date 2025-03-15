import { Movie } from '../movie/movie';

export class Platform {
  id: string;
  name: string;
  url: string;
  movies: Array<Movie>;

  constructor(id: string, name: string, url: string, movies: Array<Movie>) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.movies = movies;
  }
}
