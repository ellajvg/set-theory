import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})

export class TabsComponent {}

/*
export class TabsComponent {
  selectedTab = 'basics';

  showSelectedTab(tab: string): void {
    this.selectedTab = tab;
  }
}
 */
