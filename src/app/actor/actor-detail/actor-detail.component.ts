import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Actor } from '../actor';
import { ActivatedRoute, Router } from '@angular/router';
import { ActorService } from '../actor.service';

@Component({
  selector: 'app-actor-detail',
  templateUrl: './actor-detail.component.html',
  styleUrls: ['./actor-detail.component.css']
})
export class ActorDetailComponent implements OnInit  {

  actorId!: string;
  @Input() actorDetail!: Actor;

  constructor(
    private route: ActivatedRoute,
    private actorService: ActorService,
    private router: Router
  ) { }

  getActor(){
    this.actorService.getActor(this.actorId).subscribe(actor =>{
      this.actorDetail = actor;
    })
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.actorId = this.route.snapshot.paramMap.get('id')!
    if (this.actorId) {
      this.getActor();
    }
  }

  scrollCarousel(event: MouseEvent, direction: number) {
    const container = (event.target as HTMLElement).closest('.carousel-container')?.querySelector('.movie-carousel');
    if (container) {
      const scrollAmount = 400 * direction;
      container.scrollBy(scrollAmount, 0);
    }
  }

  getStars(popularity: number): any[] {
    return Array.from({ length: popularity });
  }

  onSelected() {
    this.router.navigate(['/actors/list']);
  }

}
