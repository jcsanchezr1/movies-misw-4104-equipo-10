import { Actor } from "../actor/actor";
import { Director } from "../director/director";
import { Genre } from "../genre/genre";
import { Platform } from "../platform/platform";
import { Review } from "./review";
import { Trailer } from "./trailer";

export class Movie {

    id: string;
    title: string;
    poster: string;
    duration: number;
    country: string;
    releaseDate: string;
    popularity: number;
    director: Director;
    actors: Array<Actor>;
    genre: Genre;
    platforms: Array<Platform>;
    reviews: Array<Review>;
    youtubeTrailer: Trailer;

    constructor(
        id: string,
        title: string,
        poster: string,
        duration: number,
        country: string,
        releaseDate: string,
        popularity: number,
        director: Director,
        actors: Array<Actor>,
        genre: Genre,
        platforms: Array<Platform>,
        reviews: Array<Review>,
        youtubeTrailer: Trailer
    ) {
        this.id = id,
        this.title = title,
        this.poster = poster,
        this.duration = duration,
        this.country = country,
        this.releaseDate = releaseDate,
        this.popularity = popularity,
        this.director = director,
        this.actors = actors,
        this.genre = genre,
        this.platforms = platforms,
        this.reviews = reviews,
        this.youtubeTrailer = youtubeTrailer
    }

}