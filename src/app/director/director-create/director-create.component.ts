import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Director } from '../director';
import { DirectorService } from '../director.service';

@Component({
  selector: 'app-director-create',
  templateUrl: './director-create.component.html',
  styleUrls: ['./director-create.component.css'],
})
export class DirectorCreateComponent implements OnInit {
  directorForm!: FormGroup;
  minDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dirctorService: DirectorService,
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) {}

  ngOnInit() {
    this.directorForm = this.formBuilder.group({
      directorName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      directorPhoto: ['', [Validators.required, this.urlValidator]],
      directorNationality: [
        '',
        [Validators.required, Validators.maxLength(30)],
      ],
      directorBirthDate: ['', Validators.required],
      directorBiography: ['', [Validators.required, Validators.maxLength(500)]],
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
  }

  urlValidator(control: AbstractControl): { [key: string]: any } | null {
    const validUrlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (control.value && !validUrlPattern.test(control.value)) {
      return { invalidUrl: true };
    }

    return null;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.directorForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  createDirector(director: Director) {
    const birthDateStruct: NgbDateStruct | null =
      this.directorForm.get('directorBirthDate')?.value;
    let parsedBirthDate: Date | null = null;

    if (birthDateStruct !== null) {
      parsedBirthDate = new Date(
        birthDateStruct.year,
        birthDateStruct.month - 1,
        birthDateStruct.day
      );
    }

    if (parsedBirthDate !== null) {
      director.birthDate = parsedBirthDate;
    }

    director.name = this.directorForm.get('directorName')?.value.trim();
    director.nationality = this.directorForm
      .get('directorNationality')
      ?.value.trim();
    director.photo = this.directorForm.get('directorPhoto')?.value.trim();
    director.biography = this.directorForm
      .get('directorBiography')
      ?.value.trim();

    this.dirctorService.createDirector(director).subscribe((director) => {
      this.toastr.success('Director creado con exito', 'Confirmación');
      this.directorForm.reset();
    });
  }
}
