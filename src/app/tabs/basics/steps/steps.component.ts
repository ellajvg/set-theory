import {Component, input} from '@angular/core';
import {Step} from './step.model';

@Component({
  selector: 'app-steps',
  imports: [],
  standalone: true,
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css'
})
export class StepsComponent {
  steps = input.required<Step[]>();
}
