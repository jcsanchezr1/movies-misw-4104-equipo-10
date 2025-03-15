import { Movie } from "../movie/movie";

export class Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: Date;
  biography: string;
  movies: Movie[];

  constructor(
    id: string,
    name: string,
    photo: string,
    nationality: string,
    birthDate: Date,
    biography: string,
    movies: Movie[]
  ) {
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.nationality = nationality;
    this.birthDate = birthDate;
    this.biography = biography;
    this.movies = movies;
  }

}
