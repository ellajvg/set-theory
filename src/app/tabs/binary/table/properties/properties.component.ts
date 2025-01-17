import {Component, effect, inject, signal} from '@angular/core';
import {BinaryService} from '../../binary.service';

@Component({
  selector: 'app-properties',
  imports: [],
  standalone: true,
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent {
  binaryService = inject(BinaryService);
  properties = signal<boolean[]>([]);

  constructor() {
    effect(() => {
      if (this.binaryService.tableData().length > 0 && this.binaryService.excluded()) {
        if (this.binaryService.selected() == 'onSet') {
          this.updateOnSetProperties()
        } else {
          this.updateToSetProperties()
        }
      }
    });
  }

  updateOnSetProperties() {
    let currentElements = this.binaryService.product().filter(
      element => !this.binaryService.excluded().includes(element));

    let reflexive = true;
    for (let element of this.binaryService.excluded()) {
      if (element.charAt(1) === element.charAt(4)) {
        reflexive = false;
        break;
      }
    }

    let irreflexive = true;
    for (let element of currentElements) {
      if (element.charAt(1) === element.charAt(4)) {
        irreflexive = false;
        break;
      }
    }

    let symmetric = true;
    for (let element of currentElements) {
      let x = element.charAt(1);
      let y = element.charAt(4);
      if (x !== y) {
        for (let excl of this.binaryService.excluded()) {
          if (x === excl.charAt(4) && y === excl.charAt(1)) {
            symmetric = false;
          }
        }
      }
    }

    let asymmetric = !symmetric && irreflexive;
    let antisymmetric = !symmetric;
    if (asymmetric || antisymmetric) {
      for (let element of currentElements) {
        let x = element.charAt(1);
        let y = element.charAt(4);
        if (x !== y) {
          for (let excl of currentElements) {
            if (x === excl.charAt(4) && y === excl.charAt(1)) {
              asymmetric = false;
              antisymmetric = false;
            }
          }
        }
      }
    }

    let transitive = true;
    for (let e1 of currentElements) {
      let x = e1.charAt(1);
      let y = e1.charAt(4);
      for (let e2 of currentElements) {
        if (y === e2.charAt(1)) {
          let z = e2.charAt(4);
          if (!(currentElements.includes('⟨' + x + ', ' + z + '⟩'))) {
            transitive = false;
            break;
          }
        }
      }
      if (!transitive) {
        break;
      }
    }

    let intransitive = true;
    for (let e1 of currentElements) {
      let x = e1.charAt(1);
      let y = e1.charAt(4);
      for (let e2 of currentElements) {
        if (y === e2.charAt(1)) {
          let z = e2.charAt(4);
          if (currentElements.includes('⟨' + x + ', ' + z + '⟩')) {
            intransitive = false;
            break;
          }
        }
      }
      if (!intransitive) {
        break;
      }
    }

    let strictOrder = asymmetric && transitive;
    let partialOrder = reflexive && antisymmetric && transitive;

    this.properties.set([
      reflexive, irreflexive, symmetric,
      asymmetric, antisymmetric, transitive,
      intransitive, strictOrder, partialOrder
    ]);
  }

  updateToSetProperties() {
    let leftTotal = true;
    for (let i = 1; i < this.binaryService.tableData().length; i++) {
      let row = this.binaryService.tableData()[i];
      let found = false;
      for (let i = 1; i < row.length; i++) {
        if (row[i].content === '+') {
          found = true;
          break;
        }
      }
      if (!found) {
        leftTotal = false;
        break;
      }
    }

    let rightTotal = true;
    for (let i =  1; i < this.binaryService.tableData()[0].length; i++) {
      let found = false;

      for (let j = 1; j < this.binaryService.tableData().length; j++) {
        if (this.binaryService.tableData()[j][i].content === '+') {
          found = true;
          break;
        }
      }
      if (!found) {
        rightTotal = false;
        break;
      }
    }

    let leftMono = true;
    for (let i = 1; i < this.binaryService.tableData().length; i++) {
      let row = this.binaryService.tableData()[i];
      let plus = 0;
      for (let i = 1; i < row.length; i++) {
        if (row[i].content === '+') {
          plus++;
        }
      }
      if (plus > 1) {
        leftMono = false;
        break;
      }
    }

    let rightMono = true;
    for (let i =  1; i < this.binaryService.tableData()[0].length; i++) {
      let plus = 0;
      for (let j = 1; j < this.binaryService.tableData().length; j++) {
        if (this.binaryService.tableData()[j][i].content === '+') {
          plus++;
        }
      }
      if (plus > 1) {
        rightMono = false;
        break;
      }
    }

    this.properties.set([leftTotal, rightTotal, leftMono, rightMono]);
  }
}
