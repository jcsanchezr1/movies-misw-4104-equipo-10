import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Actor } from '../actor';
import { ActorService } from '../actor.service';

@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
  styleUrls: ['./actor-list.component.css'],
})

export class ActorListComponent implements OnInit {

  actors: Array<Actor> = [];
  searchTerm: string = '';
  filteredActors: Array<Actor> = [];

  selectedActor: Actor | null = null;

  constructor(private actorService: ActorService) { }

  getActors(): void {
    this.actorService.getActors().subscribe((actors) => {
      this.actors = actors.sort((a: Actor, b: Actor) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      this.filteredActors = actors;
    });
  }

  filterActors() {
    if (this.searchTerm === '') {
      this.filteredActors = this.actors;
    } else {
      this.filteredActors = this.actors.filter(actor =>
        actor.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSelected(actor: Actor): void {
    this.actorService
      .getActor(actor.id)
      .pipe(
        tap((actor: Actor) => {
          this.selectedActor = actor;
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.getActors();
    this.filteredActors = this.actors;
  }


}
