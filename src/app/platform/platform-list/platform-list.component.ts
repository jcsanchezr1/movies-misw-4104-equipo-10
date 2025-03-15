import { Component, OnInit } from '@angular/core';
import { Platform } from '../platform';
import { PlatformService } from '../platform.service';

@Component({
  selector: 'app-platform-list',
  templateUrl: './platform-list.component.html',
  styleUrls: ['./platform-list.component.css'],
})
export class PlatformListComponent implements OnInit {
  platforms: Array<Platform> = [];

  constructor(private platformService: PlatformService) {}

  getPlatforms(): void {
    this.platformService.getPlatforms().subscribe((platforms) => {
      this.platforms = platforms.sort((a: Platform, b: Platform) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });
  }

  onPlatformCreated() {
    this.getPlatforms();
  }

  ngOnInit() {
    this.getPlatforms();
  }
}
