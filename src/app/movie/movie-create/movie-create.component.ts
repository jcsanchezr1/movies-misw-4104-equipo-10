import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GenreService } from '../../genre/genre.service';
import { Genre } from '../../genre/genre';
import { DirectorService } from '../../director/director.service';
import { Director } from '../../director/director';
import { MovieService } from '../movie.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-movie-create',
  templateUrl: './movie-create.component.html',
  styleUrls: ['./movie-create.component.css']
})
export class MovieCreateComponent implements OnInit {

  movieForm!: FormGroup;
  minDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;
  genres: Genre[] = [];
  directors: Director[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private genreService: GenreService,
    private directorService: DirectorService,
    private movieService: MovieService,
    private toastr: ToastrService,
  ) {}

  getGenres(): void {
    this.genreService.getGenres().subscribe((genres) => {
      this.genres = genres.sort((a: Genre, b: Genre) => {
        const nameA = a.type.toLowerCase();
        const nameB = b.type.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });
  }

  getDirectors(): void {
    this.directorService.getDirectors().subscribe((directors) => {
      this.directors = directors.sort((a: Director, b: Director) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });
  }

  ngOnInit() {

    this.movieForm = this.formBuilder.group({
      title: ["", [Validators.required, this.noWhitespaceValidator]],
      duration: ["", [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      releaseDate: ['', Validators.required],
      poster: ['', [Validators.required, this.noWhitespaceValidator, this.urlValidator]],
      country: ['', [Validators.required, this.noWhitespaceValidator]],
      trailer: ['', [Validators.required, this.noWhitespaceValidator, this.urlValidator]],
      popularity: ['', Validators.required],
      director: ['', Validators.required],
      genre: ['', Validators.required]
    });

    const currentDate = new Date();
    this.minDate = {
      year: currentDate.getFullYear() - 1000,
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    };
    this.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    };

    this.getGenres();
    this.getDirectors();

  }

  isControlInvalid(controlName: string): boolean {
    const control = this.movieForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  noWhitespaceValidator(control: any) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  validateNumber(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  urlValidator(control: AbstractControl): { [key: string]: any } | null {
    
    const validUrlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (control.value && !validUrlPattern.test(control.value)) {
      return { invalidUrl: true };
    }

    return null;
  }

  onSubmit() {

    const movieFormData = this.movieForm.value;

    const dateStruct: NgbDateStruct | null = this.movieForm.get('releaseDate')?.value;
    let parsedDate: Date | null = null;

    if (dateStruct !== null) {
      parsedDate = new Date(
        dateStruct.year,
        dateStruct.month - 1,
        dateStruct.day
      );
    }

    if (parsedDate !== null) {
      movieFormData.releaseDate = parsedDate.toISOString();
    }

    movieFormData.popularity = parseInt(movieFormData.popularity);
    movieFormData.duration = parseInt(movieFormData.duration);
    
    const trailerFormData = {
      name: movieFormData.title,
      url: movieFormData.trailer,
      duration: 0,
      channel: 'YouTube'
    };

    delete movieFormData.trailer;

    this.movieService.registerMovieWithTrailer(movieFormData, trailerFormData)
    .subscribe(
      (movie) => {
        this.toastr.success('La película se ha creado correctamente', 'Confirmación');
        this.movieForm.reset();
      },
      (error) => {
        this.toastr.error('Algo falló al registrar la película. Vuelve a intentarlo', 'Error');
      }
    );
  }

}
