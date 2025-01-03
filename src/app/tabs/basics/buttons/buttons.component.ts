import {Component, model, output} from '@angular/core';

@Component({
  selector: 'app-buttons',
  imports: [],
  standalone: true,
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css'
})
export class ButtonsComponent {
  formula = model.required<string>();
  formulaChange = output<string>();
  calculate = output<void>();
  symbols = ['A', 'B', 'C', '∅', '\'', 'P', '⋂', '⋃', '–', '×', '(', ')'];

  addSymbol(symbol: string) {
    this.formula.set(this.formula() + symbol);
    this.formulaChange.emit(this.formula());
  }

  removeSymbol() {
    if (this.formula && this.formula().length > 0) {
      this.formulaChange.emit(this.formula().slice(0, -1));
    }
  }

  onCalculate() {
    this.calculate.emit();
  }
}
