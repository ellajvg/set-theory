import { Component } from '@angular/core';
import {TabsComponent} from './tabs/tabs.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [
    TabsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
