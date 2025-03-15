import { Movie } from "../movie/movie";

export class Genre {

    id: string;
    type: string;
    movies: Array<Movie>;

    constructor(
        id: string,
        type: string,
        movies: Array<Movie>
    ) {
        this.id = id;
        this.type = type;
        this.movies = movies;
    }

}
