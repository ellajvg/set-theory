import {Component, input, model, output, signal} from '@angular/core';
import {TableElement} from '../table-element.model';
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
  onSetRelation = input.required<boolean>();
  product = input.required<string[]>();
  tableData = model.required<TableElement[][]>();
  excluded = signal<string[]>([]);

  updateOnSet = output<string>();
  updateToSet = output<string>();

  onCheckboxChange($event: Event) {
    const checkbox = $event.target as HTMLInputElement;
    const checkboxId = checkbox.id;

    for (let row of this.tableData()) {
      for (let element of row) {
        if (element.id === checkboxId) {
          if (element.content === '+') {
            element.content = '-';
            this.excluded().push(element.id);
          } else {
            element.content = '+';
            this.excluded.set(this.excluded().filter(id => id !== element.id));
          }
        }
      }
    }
  }
}
