import {Component, inject} from '@angular/core';
import {DivComponent} from '../../../shared/div/div.component';
import {PropertiesComponent} from './properties/properties.component';
import {BinaryService} from '../binary.service';

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
  binaryService = inject(BinaryService);

  onCheckboxChange($event: Event) {
    const checkbox = $event.target as HTMLInputElement;
    const checkboxId = checkbox.id;

    for (let row of this.binaryService.tableData()) {
      for (let element of row) {
        if (element.id === checkboxId) {
          if (element.content === '+') {
            element.content = '-';
            this.binaryService.excluded.set([...this.binaryService.excluded(), element.id]);
          } else {
            element.content = '+';
            this.binaryService.excluded.set(this.binaryService.excluded().filter(id => id !== element.id));
          }
          break;
        }
      }
    }
  }
}
