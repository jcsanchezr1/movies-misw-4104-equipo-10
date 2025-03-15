/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, of, Subscription } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let eventsSubject: BehaviorSubject<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports:[ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    eventsSubject = new BehaviorSubject<any>(null);
    spyOn(router.events, 'subscribe').and.callFake((callback: any) => {
      eventsSubject.subscribe(callback);
      return new Subscription();
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentRoute correctly when navigation ends', () => {
    const testUrl = '/movies';
    const navigationEnd = new NavigationEnd(1, testUrl, testUrl);
    component.ngOnInit();
    eventsSubject.next(navigationEnd);
    expect(component.currentRoute).toEqual('movies');
  });

  it('should set currentRoute to "movies" when url is "/"', () => {
    const navigationEnd = new NavigationEnd(1, '/', '/');
    component.ngOnInit();
    eventsSubject.next(navigationEnd);
    expect(component.currentRoute).toEqual('movies');
  });
});
