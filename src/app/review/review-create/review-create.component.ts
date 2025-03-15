import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Review } from '../../movie/review';
import { ReviewService } from '../review.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-review-create',
  templateUrl: './review-create.component.html',
  styleUrls: ['./review-create.component.css']
})
export class ReviewCreateComponent implements OnInit {

  reviewForm!: FormGroup;

  @Input() movieId: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private reviewService: ReviewService
  ) {}
  
  @Output() cancelClicked = new EventEmitter<void>();

  ngOnInit() {

    this.reviewForm = this.formBuilder.group({
      creator: ["", [Validators.required, this.noWhitespaceValidator]],
      score: ["", [Validators.required]],
      text: ["", [Validators.required, this.noWhitespaceValidator]]
    });

  }

  isControlInvalid(controlName: string): boolean {
    const control = this.reviewForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  noWhitespaceValidator(control: any) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  cancel() {
    this.cancelClicked.emit();
  }

  createReview( movieId: string, review: Review ) {

    review.score = parseInt(this.reviewForm.value.score)

    this.reviewService.createReview( movieId, review).subscribe(
      (review) => {
        this.toastr.success('La reseña se ha creado correctamente', 'Confirmación');
        this.cancelClicked.emit();
        this.reviewService.notifyReviewCreated();
      },
      (error) => {
        console.log(movieId),
        console.log(review),
        this.toastr.error('Algo falló al registrar la reseña. Vuelve a intentarlo', 'Error');
      }
    );

  }

}
