import {Component, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Set} from './set.model';

@Component({
  selector: 'app-sets',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './sets.component.html',
  styleUrl: './sets.component.css'
})
export class SetsComponent {
  @Input() sets!: Set[];
}
