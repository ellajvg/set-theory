import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-buttons',
  imports: [],
  standalone: true,
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css'
})
export class ButtonsComponent {
  @Input() formula: string | undefined;
  @Output() formulaChange = new EventEmitter<string>();
  @Output() calculate = new EventEmitter<void>();
  symbols = ['A', 'B', 'C', '∅', '\'', 'P', '⋂', '⋃', '–', '×'];

  addSymbol(symbol: string) {
    if (this.formula) {
      this.formula = this.formula + symbol;
    } else {
      this.formula = symbol;
    }
    this.formulaChange.emit(this.formula);
  }

  removeSymbol() {
    if (this.formula && this.formula.length > 0) {
      this.formulaChange.emit(this.formula.slice(0, -1));
    }
  }

  onCalculate() {
    this.calculate.emit();
  }
}
