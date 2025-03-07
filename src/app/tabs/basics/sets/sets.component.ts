import {Component, input, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SetModel} from './set.model';

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
  sets= input.required<SetModel[]>();
  cardinality = signal<string>("")
  cardinalityVisible = signal<boolean>(false)
  positionX = signal<number>(0)
  positionY = signal<number>(0)


  getCardinality(event: MouseEvent, set: SetModel) {
    this.positionX.set(event.pageX + 10);
    this.positionY.set(event.pageY + 10);

    let content = [...new Set(
      String(set.setContent)
        .split(",")
        .map(str => str.trim())
        .filter(str => str !== "")
    )];

    this.cardinality.set(`|${set.name}| = ${content.length}`);
    this.cardinalityVisible.set(true);
  }

  hideCardinality() {
    this.cardinalityVisible.set(false)
    this.cardinality.set("");
  }
}
