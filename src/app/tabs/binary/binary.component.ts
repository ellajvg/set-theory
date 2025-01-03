import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {TableComponent} from './table/table.component';
import {TableElement} from './table/table-element.model';
import {DivComponent} from '../../shared/div/div.component';

@Component({
  selector: 'app-binary',
  standalone: true,
  imports: [
    TableComponent,
    FormsModule,
    DivComponent
  ],
  templateUrl: './binary.component.html',
  styleUrl: './binary.component.css'
})
export class BinaryComponent {
  selected = signal('onSet');
  buttonText = signal('Binary relation from a set to a set');
  title = signal('BINARY RELATION ON A SET');
  errorMessage = signal('');

  product = signal<string[]>([]);
  tableData = signal<TableElement[][]>([]);
  set1 = signal('');
  set2 = signal('');

  changeSelected() {
    if (this.selected() === 'onSet') {
      this.selected.set('toSet');
      this.buttonText.set('Binary relation on a set');
      this.title.set('BINARY RELATION FROM A SET TO A SET');
    } else {
      this.selected.set('onSet');
      this.buttonText.set('Binary relation from a set to a set');
      this.title.set('BINARY RELATION ON A SET');
      this.set2.set('');
    }

    this.errorMessage.set('');
    this.product.set([]);
    this.tableData.set([]);
  }

  cartesianProduct(set1: string[], set2: string[]):void {
    const product: string[] = [];
    for (let i = 0; i < set1.length; i++) {
      for (let j = 0; j < set2.length; j++) {
        const pair = '⟨' + set1[i] + ', ' + set2[j] + '⟩';
        product.push(pair);
      }
    }
    this.product.set(product);
  }

  getBinaryRelation() {
    if (this.selected() === 'onSet' && this.set1().length === 0) {
      this.errorMessage.set('Please enter a set.');
      this.product.set([]);
      this.tableData.set([]);
      return;
    } else if (this.selected() === 'toSet' &&
      (this.set1().length === 0 || this.set2().length === 0)) {
      this.errorMessage.set('Please enter a set in each field.');
      this.product.set([]);
      this.tableData.set([]);
      return;
    }

    const set1 = [...new Set(
      String(this.set1())
        .split(",")
        .map(str => str.trim())
        .filter(str => str !== "")
    )];

    let set2;
    if (this.selected() === 'toSet') {
      set2 = [...new Set(
        String(this.set2())
          .split(",")
          .map(str => str.trim())
          .filter(str => str !== "")
      )];
    }

    if (set1 && set2) {
      this.cartesianProduct(set1, set2);
      this.tableData.set(this.createTableData(set1, set2));
    } else {
      this.cartesianProduct(set1, set1);
      this.tableData.set(this.createTableData(set1, set1));
    }

    this.errorMessage.set('');
  }

  createTableData(set1: string[], set2: string[]):TableElement[][] {
    let tableData = [];
    let iLabel = 0;
    let iProduct = 0;

    let row1 = [{content: 'R', id: `${iLabel}`}];
    for (let element of set2) {
      iLabel++;
      row1.push({content: element, id: `${iLabel}`});

    }
    tableData.push(row1);

    for (let element of set1) {
      iLabel++;
      let row = [{content: element, id: `${iLabel}`}];
      for (let {} of set2) {
        row.push({content: '+', id: this.product()[iProduct]});
        iProduct++;
      }
      tableData.push(row);
    }

    return tableData;
  }
}
