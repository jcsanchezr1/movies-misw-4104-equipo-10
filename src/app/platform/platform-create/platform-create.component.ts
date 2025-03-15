import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Platform } from '../platform';
import { PlatformService } from '../platform.service';

@Component({
  selector: 'app-platform-create',
  templateUrl: './platform-create.component.html',
  styleUrls: ['./platform-create.component.css'],
})
export class PlatformCreateComponent implements OnInit {
  platformForm!: FormGroup;
  @Output() platformCreated = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private platformService: PlatformService
  ) {}

  urlValidator(control: AbstractControl): { [key: string]: any } | null {
    const validUrlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (control.value && !validUrlPattern.test(control.value)) {
      return { invalidUrl: true };
    }
    return null;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.platformForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  async createPlatform(platform: Platform) {
    platform.name = this.platformForm.get('namePlatform')?.value.trim();
    const isNameUnique = await this.validateNamePlatform(platform.name);
    if (!isNameUnique) {
      platform.url = this.platformForm.get('webSiteUrl')?.value.trim();
      this.platformService.createPlatform(platform).subscribe((platform) => {
        this.toastr.success('Plataforma creada con exito', 'Confirmación');
        this.platformForm.reset();
        this.platformCreated.emit();
      });
    } else {
      this.toastr.error('El nombre del la plataforma ya existe.', 'Error');
    }
  }

  async validateNamePlatform(platformName: string): Promise<boolean> {
    const platforms = await this.platformService.getPlatforms().toPromise();
    if (platforms && platforms.length > 0) {
      const normalizedPlatformName = platformName.toLowerCase();
      const normalizedPlatforms = platforms.map((platform) =>
        platform.name.toLowerCase()
      );
      return normalizedPlatforms.includes(normalizedPlatformName);
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.platformForm = this.formBuilder.group({
      namePlatform: ['', [Validators.required, Validators.maxLength(50)]],
      webSiteUrl: ['', [Validators.required, this.urlValidator]],
    });
  }
}
