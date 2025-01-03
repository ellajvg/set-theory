import {Component, input, model, signal} from '@angular/core';
import {TableElement} from './table-element.model';
import {DivComponent} from '../../../shared/div/div.component';
import {PropertiesComponent} from './properties/properties.component';

@Component({
  selector: 'app-table',
  imports: [
    DivComponent,
    PropertiesComponent
  ],
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  excluded = signal<string[]>([]);
  tableData = model.required<TableElement[][]>();
  product = input.required<string[]>();
  onSetRelation = input.required<boolean>();

  onCheckboxChange($event: Event) {
    const checkbox = $event.target as HTMLInputElement;
    const checkboxId = checkbox.id;

    for (let row of this.tableData()) {
      for (let element of row) {
        if (element.id === checkboxId) {
          if (element.content === '+') {
            element.content = '-';
            this.excluded.set([...this.excluded(), element.id]);
          } else {
            element.content = '+';
            this.excluded.set(this.excluded().filter(id => id !== element.id));
          }
        }
      }
    }
  }
}
