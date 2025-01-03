import { Component } from '@angular/core';
import {BasicsComponent} from './basics/basics.component';
import {BinaryComponent} from './binary/binary.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    BasicsComponent,
    BinaryComponent
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  selectedTab = 'basics';

  showSelectedTab(tab: string): void {
    this.selectedTab = tab;
  }
}
