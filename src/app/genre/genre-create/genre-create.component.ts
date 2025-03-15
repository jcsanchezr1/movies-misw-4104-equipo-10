import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenreService } from '../genre.service';
import { ToastrService } from 'ngx-toastr';
import { Genre } from '../genre';


@Component({
  selector: 'app-genre-create',
  templateUrl: './genre-create.component.html',
  styleUrls: ['./genre-create.component.css']
})
export class GenreCreateComponent implements OnInit {

  genreForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private genreService: GenreService
  ) {
  }

  ngOnInit() {
    this.genreForm = this.formBuilder.group({
      type: ["", [Validators.required, Validators.maxLength(30)]],
    })
  }

  async createGenre(genre: Genre) {
    const isNameUnique = await this.validateNameGenre(genre.type);
    if (!isNameUnique) {
      this.genreService.createGenre(genre).subscribe(genre => {
        this.toastr.success("Género creado", "Confirmación")
        this.genreForm.reset();
        this.genreService.notifyGenreCreated();
      });
    } else {
      this.toastr.error("El nombre del género ya existe", "Error")
    }
  }

  async validateNameGenre(genreName: string): Promise<boolean> {
    const genres = await this.genreService.getGenres().toPromise();

    if (genres && genres.length > 0) {
      const normalizedGenreName = genreName.toLowerCase();
      const normalizedGenres = genres.map(genre => genre.type.toLowerCase());
      return normalizedGenres.includes(normalizedGenreName);
    } else {
      return false;
    }
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.genreForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

}
