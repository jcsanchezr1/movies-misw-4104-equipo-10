import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Actor } from '../actor';
import { ActorService } from '../actor.service';


@Component({
  selector: 'app-actor-create',
  templateUrl: './actor-create.component.html',
  styleUrls: ['./actor-create.component.css']
})
export class ActorCreateComponent implements OnInit {

  actorForm!: FormGroup;
  minDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private actorService: ActorService,
    private ngbDateParserFormatter: NgbDateParserFormatter

  ) { }


  ngOnInit() {
    this.actorForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      photo: ["", [Validators.required, this.urlValidator]],
      nationality: ["", [Validators.required, Validators.maxLength(30)]],
      birthDate: ["", Validators.required],
      biography: ["", [Validators.required, Validators.maxLength(500)]]
    })

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
      return { 'invalidUrl': true };
    }

    return null;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.actorForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  createActor(actor: Actor) {
    const birthDateStruct: NgbDateStruct | null = this.actorForm.get('birthDate')?.value;
    let parsedBirthDate: Date | null = null;

    if (birthDateStruct !== null) {
      parsedBirthDate = new Date(birthDateStruct.year, birthDateStruct.month - 1, birthDateStruct.day);
    }

    if (parsedBirthDate !== null) {
      actor.birthDate = parsedBirthDate;
    }

    actor.photo = this.actorForm.get('photo')?.value.trim();

    this.actorService.createActor(actor).subscribe(actor => {
      this.toastr.success('Actor creado con exito', 'Confirmación');
      this.actorForm.reset();
    });
  }
}
