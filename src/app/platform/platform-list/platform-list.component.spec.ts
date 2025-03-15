import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { faker } from '@faker-js/faker';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { Platform } from '../platform';
import { PlatformService } from '../platform.service';
import { PlatformListComponent } from './platform-list.component';
import { PlatformCreateComponent } from '../platform-create/platform-create.component';
import { Director } from '../../director/director';
import { Genre } from '../../genre/genre';
import { Movie } from '../../movie/movie';
import { Trailer } from '../../movie/trailer';

describe('PlatformListComponent', () => {
  let component: PlatformListComponent;
  let fixture: ComponentFixture<PlatformListComponent>;
  let debug: DebugElement;
  let platformService: PlatformService;
  let platformsMock: Array<Platform> = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        RouterTestingModule,
        NgbModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      declarations: [PlatformListComponent, PlatformCreateComponent],
      providers: [PlatformService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformListComponent);
    component = fixture.componentInstance;
    platformService = TestBed.inject(PlatformService);

    const trailer = new Trailer(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.number.int(),
      faker.lorem.sentence()
    );

    const director = new Director(
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.date.recent().toString(),
      faker.lorem.sentence(),
      []
    );

    const genre = new Genre(faker.lorem.sentence(), faker.lorem.sentence(), []);

    const movieList: Movie[] = [
      new Movie(
        faker.string.uuid(),
        faker.string.sample({ min: 10, max: 50 }),
        faker.string.sample({ min: 10, max: 50 }),
        faker.number.int(),
        faker.location.country(),
        faker.date.recent().toTimeString(),
        faker.number.int({ min: 0, max: 5 }),
        director,
        [],
        genre,
        [],
        [],
        trailer
      ),
    ];

    for (let i = 0; i < 10; i++) {
      const platform = new Platform(
        faker.string.uuid(),
        faker.person.firstName(),
        faker.image.url(),
        movieList
      );
      component.platforms.push(platform);
      platformsMock.push(platform);
    }
    spyOn(platformService, 'getPlatforms').and.returnValue(of(platformsMock));
    fixture.detectChanges();
    debug = fixture.debugElement;
  }));

  afterEach(() => {
    platformsMock = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPlatforms method of PlatformService on initialization', () => {
    expect(platformService.getPlatforms).toHaveBeenCalled();
  });

  it('should populate platforms array with data from PlatformService', () => {
    expect(component.platforms.length).toBe(10);
  });

  it('should call getPlatforms() when onPlatformCreated() is called', () => {
    component.onPlatformCreated();
    expect(platformService.getPlatforms).toHaveBeenCalled();
    expect(component.platforms.length).toBe(10);
  });
});
