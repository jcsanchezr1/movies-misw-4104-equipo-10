import { Component, OnInit } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { Director } from '../director';
import { DirectorService } from '../director.service';

@Component({
  selector: 'app-director-list',
  templateUrl: './director-list.component.html',
  styleUrls: ['./director-list.component.css'],
})
export class DirectorListComponent implements OnInit {
  selected: Boolean = false;
  selectedDirector: Director | null = null;
  searchTerm: string = '';
  directors: Array<Director> = [];
  filteredDirectors: Array<Director> = [];

  constructor(private directorService: DirectorService) {}

  onSelected(id: String): void {
    this.selected = true;
    this.directorService
      .getDirector(id)
      .pipe(
        tap((director: Director) => {
          this.selectedDirector = director;
        })
      )
      .subscribe();
  }

  onReturnClicked() {
    this.selected = false;
  }

  getDirectors(): void {
    this.directorService.getDirectors().subscribe((directors) => {
      this.directors = directors.sort((a: Director, b: Director) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      this.filteredDirectors = directors;
    });
  }

  filterDirectors() {
    if (this.searchTerm === '') {
      this.filteredDirectors = this.directors;
    } else {
      this.filteredDirectors = this.directors.filter((director) =>
        director.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  ngOnInit(): void {
    this.getDirectors();
    this.filteredDirectors = this.directors;
  }
}
