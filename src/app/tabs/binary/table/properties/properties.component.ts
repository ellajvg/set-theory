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
      element = element.slice(1, -1)
      let elements = element.split(', ')
      if (elements[0] === elements[1]) {
        reflexive = false;
        break;
      }
    }

    let irreflexive = true;
    for (let element of currentElements) {
      element = element.slice(1, -1)
      let elements = element.split(', ')
      if (elements[0] === elements[1]) {
        irreflexive = false;
        break;
      }
    }

    let symmetric = true;
    for (let element of currentElements) {
      element = element.slice(1, -1)
      let elements = element.split(', ')
      let x = elements[0];
      let y = elements[1];
      if (x !== y) {
        for (let excl of this.binaryService.excluded()) {
          excl = excl.slice(1, -1)
          let excls = excl.split(', ')
          if (x === excls[1] && y === excls[0]) {
            symmetric = false;
          }
        }
      }
    }

    let asymmetric = !symmetric && irreflexive;
    let antisymmetric = !symmetric;
    if (asymmetric || antisymmetric) {
      for (let element of currentElements) {
        element = element.slice(1, -1)
        let elements = element.split(', ')
        let x = elements[0];
        let y = elements[1];
        if (x !== y) {
          for (let excl of currentElements) {
            excl = excl.slice(1, -1)
            let excls = excl.split(', ')
            if (x === excls[1] && y === excls[0]) {
              asymmetric = false;
              antisymmetric = false;
            }
          }
        }
      }
    }

    let transitive = true;
    for (let e1 of currentElements) {
      e1 = e1.slice(1, -1)
      let e1s = e1.split(', ')
      let x = e1s[0];
      let y = e1s[1];
      for (let e2 of currentElements) {
        e2 = e2.slice(1, -1)
        let e2s = e2.split(', ')
        if (y === e2s[0]) {
          let z = e2s[1];
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
      e1 = e1.slice(1, -1)
      let e1s = e1.split(', ')
      let x = e1s[0];
      let y = e1s[1];
      for (let e2 of currentElements) {
        e2 = e2.slice(1, -1)
        let e2s = e2.split(', ')
        if (y === e2s[0]) {
          let z = e2s[1];
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
