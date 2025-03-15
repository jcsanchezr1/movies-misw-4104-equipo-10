import { Component, OnInit } from '@angular/core';
import { GenreService } from '../../genre/genre.service';
import { Genre } from '../../genre/genre';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {

  selectedMovie: Movie | null = null;
  genres: Array<Genre> = [];
  searchTerm: string = '';
  filteredGenres: Array<Genre> = [];

  constructor(private genreService: GenreService, private movieService: MovieService) {}

  onSelected(id: String): void {
    this.movieService.getMovie(id).pipe(
      tap(
        (movie: Movie) => {
          this.selectedMovie = movie;
        }
      )
    ).subscribe();
  }

  getStars(popularity: number): any[] {
    return Array.from({ length: popularity });
  }

  getMovies(): void {
    this.genreService.getGenres().subscribe((genres) => {
      this.genres = genres.sort((a: Genre, b: Genre) => {
        const nameA = a.type.toLowerCase();
        const nameB = b.type.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      this.genres.forEach((genre) => {
        genre.movies.sort((a, b) => b.popularity - a.popularity);
      });
      this.filteredGenres = genres;
    });
  }

  filterGenres() {
    if (this.searchTerm === '') {
      this.filteredGenres = this.genres;
    } else {
      this.filteredGenres = this.genres
        .map((genre) => {
          const filteredMovies = genre.movies.filter((movie) =>
            movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          return { ...genre, movies: filteredMovies };
        })
        .filter((genre) => genre.movies.length > 0);
    }
  }

  scrollCarousel(event: MouseEvent, direction: number) {
    const container = (event.target as HTMLElement).closest('.carousel-container')?.querySelector('.movie-carousel');
    if (container) {
      const scrollAmount = 400 * direction;
      container.scrollBy(scrollAmount, 0);
    }
  }

  ngOnInit() {
    this.getMovies();
    this.filteredGenres = this.genres;
  }
}
