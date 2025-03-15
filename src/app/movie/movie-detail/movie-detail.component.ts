import { Movie } from '../movie';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../review/review.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

  movieId!: string;
  @Input() movieDetail!: Movie;

  defaultImageUrl = 'assets/images/placeholder-platform.jpg';
  showAll: boolean = false;
  selected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  getMovie(){
    this.movieService.getMovie(this.movieId).subscribe(movie =>{
      this.movieDetail = movie;
      this.movieDetail.reviews.sort((a, b) => b.score - a.score);
    })
  }

  onClick() {
    this.router.navigate(['/movies/list']);
  }

  getStars(popularity: number): any[] {
    return Array.from({ length: popularity });
  }
  
  handleImageError(event: any) {
    event.target.src = this.defaultImageUrl;
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  showReviewComponent() {
    this.selected = true;
  }

  hideReviewComponent() {
    this.selected = false;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.reviewService.reviewCreated$.subscribe(() => {
      this.getMovie();
    });
    this.movieId = this.route.snapshot.paramMap.get('id')!
    if (this.movieId) {
      this.getMovie();
    }
  }

}
