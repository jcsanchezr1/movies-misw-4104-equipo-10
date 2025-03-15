/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { faker } from '@faker-js/faker';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

import { PlatformCreateComponent } from './platform-create.component';
import { PlatformService } from '../platform.service';
import { Platform } from '../platform';

describe('PlatformCreateComponent', () => {
  let component: PlatformCreateComponent;
  let fixture: ComponentFixture<PlatformCreateComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let platform: Platform;

  beforeEach(async(() => {
    toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    platformServiceSpy = jasmine.createSpyObj('PlatformService', [
      'createPlatform',
      'getPlatforms',
    ]);
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      declarations: [PlatformCreateComponent],
      providers: [
        { provide: ToastrService, useValue: toastrService },
        { provide: PlatformService, useValue: platformServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformCreateComponent);
    component = fixture.componentInstance;

    platform = new Platform(
      faker.string.uuid(),
      faker.person.fullName(),
      faker.image.url(),
      []
    );
    platformServiceSpy.createPlatform.and.returnValue(of(platform));

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize platformForm with empty fields', () => {
    expect(component.platformForm.get('namePlatform')?.value).toEqual('');
    expect(component.platformForm.get('webSiteUrl')?.value).toEqual('');
  });

  it('should mark name field as invalid if empty', () => {
    const nameField = component.platformForm.get('namePlatform');
    if (nameField) {
      nameField.setValue('');
      expect(nameField.valid).toBeFalsy();
    } else {
      fail('Name field not found in form');
    }
  });

  it('should create platform with faker data when createPlatform is called', async () => {
    platformServiceSpy.getPlatforms.and.returnValue(of([]));
    platformServiceSpy.createPlatform.and.returnValue(of(platform));
    await component.createPlatform(platform);
    expect(platformServiceSpy.getPlatforms).toHaveBeenCalledWith();
    expect(platformServiceSpy.createPlatform).toHaveBeenCalledWith(platform);
    expect(toastrService.success).toHaveBeenCalledWith(
      'Plataforma creada con exito',
      'Confirmación'
    );
  });

  it('should display error toastr message if platform name already exists', async () => {
    const existingPlatformName = 'ExistingPlatform';
    component.platformForm.setValue({
      namePlatform: existingPlatformName,
      webSiteUrl: 'https://netflix.com/photo.jpg',
    });
    platformServiceSpy.getPlatforms.and.returnValue(
      of([new Platform('', existingPlatformName, '', [])])
    );
    const newPlatform = new Platform('', existingPlatformName, '', []);
    await component.createPlatform(newPlatform);
    expect(platformServiceSpy.getPlatforms).toHaveBeenCalled();
    expect(toastrService.error).toHaveBeenCalledWith(
      'El nombre del la plataforma ya existe.',
      'Error'
    );
  });

  it('should return invalidUrl if URL is invalid', () => {
    const invalidUrlControl = new FormControl('invalid-url');
    const result = component.urlValidator(invalidUrlControl);
    expect(result).toEqual({ invalidUrl: true });
  });

  it('should return false for all controls if all are valid and untouched', () => {
    component.platformForm.setValue({
      namePlatform: 'Netflix',
      webSiteUrl: 'https://netflix.com/photo.jpg',
    });

    expect(component.isControlInvalid('namePlatform')).toBe(false);
    expect(component.isControlInvalid('webSiteUrl')).toBe(false);
  });

  it('should return true if control is invalid and touched', () => {
    component.platformForm.get('namePlatform')?.setErrors({ required: true });
    component.platformForm.get('namePlatform')?.markAsTouched();
    expect(component.isControlInvalid('namePlatform')).toBe(true);
  });

  it('should return false if control is null', () => {
    const controlName = 'invalidControlName';
    expect(component.isControlInvalid(controlName)).toBe(false);
  });
});
