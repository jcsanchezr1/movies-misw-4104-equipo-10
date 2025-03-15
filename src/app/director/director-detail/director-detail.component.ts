import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Director } from '../director';
import { Router } from '@angular/router';

@Component({
  selector: 'app-director-detail',
  templateUrl: './director-detail.component.html',
  styleUrls: ['./director-detail.component.css'],
})
export class DirectorDetailComponent implements OnInit {
  @Input() directorDetail!: Director;

  constructor() {}

  @Output() returnClicked = new EventEmitter<void>();

  onClick() {
    this.returnClicked.emit();
  }

  scrollCarousel(event: MouseEvent, direction: number) {
    const container = (event.target as HTMLElement)
      .closest('.carousel-container')
      ?.querySelector('.movie-carousel');
    if (container) {
      const scrollAmount = 400 * direction;
      container.scrollBy(scrollAmount, 0);
    }
  }

  getStars(popularity: number): any[] {
    return Array.from({ length: popularity });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
