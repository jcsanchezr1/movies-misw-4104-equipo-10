import { Component, OnInit } from '@angular/core';
import { Genre } from '../genre';
import { GenreService } from '../genre.service';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.css']
})
export class GenreListComponent implements OnInit {

  genres: Array<Genre> = [];
  filteredActors: Array<Genre> = [];

  constructor(private genreService: GenreService) { }

  getGenres(): void {
    this.genreService.getGenres().subscribe((genres) => {
      this.genres = genres.sort((a: Genre, b: Genre) => {
        const nameA = a.type.toLowerCase();
        const nameB = b.type.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });
  }

  ngOnInit() {
    this.genreService.genreCreated$.subscribe(() => {
      this.getGenres();
    });
    this.getGenres();
  }
}
