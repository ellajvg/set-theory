import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ButtonsComponent} from './buttons/buttons.component';
import {SetsComponent} from './sets/sets.component';
import {StepsComponent} from './steps/steps.component';

import {type Set} from './sets/set.model';
import {type Step} from './steps/step.model';
import {DivComponent} from '../../shared/div/div.component';

@Component({
  selector: 'app-basics',
  imports: [FormsModule, StepsComponent, SetsComponent, ButtonsComponent, DivComponent],
  templateUrl: './basics.component.html',
  standalone: true,
  styleUrl: './basics.component.css'
})
export class BasicsComponent {
  formula = signal<string | ''>('');
  errorMessage = signal<string | ''> ('');
  sets=  signal<Set[]>([
    { name: 'A', setContent: [] },
    { name: 'B', setContent: [] },
    { name: 'C', setContent: [] },
    { name: '∅', setContent: [] }
  ]);
  steps = signal<Step[]>([]);
  stepId = 1;

  checkAndCorrectInput(inputEvent: Event): void {
    const fullInput = inputEvent.target as HTMLInputElement;
    const validInputs = /^[A-Ca-c0∅()pP'~&*iI⋂|+⋃Uuv×\-–]*$/;
    let correctedInput = '';
    let errorFound = false;

    for (let i = 0; i < fullInput.value.length; i++) {
      let char = fullInput.value.charAt(i);
      if (!validInputs.test(char)) {
        this.errorMessage.set(`${char} is not a valid character.`);
        errorFound = true;
        continue;
      }

      if (char === 'a' || char === 'b' || char === 'c' || char === 'p') {
        correctedInput += char.toUpperCase();
      } else if (char === '0') {
        correctedInput += '∅';
      } else if (char === '~') {
        correctedInput += "'";
      } else if (char === '&' || char === 'i' || char === 'I') {
        correctedInput += '⋂';
      } else if (char === '|' || char === 'U' || char === 'u' || char === 'v') {
        correctedInput += '⋃';
      } else if (char === '-') {
        correctedInput += '–';
      } else if (char === '*') {
        correctedInput += '×';
      } else {
        correctedInput += char;
      }
    }

    if (!errorFound) {
      this.errorMessage.set('');
    }

    fullInput.value = correctedInput;
    this.formula.set(correctedInput);
  }

  hasValidSyntax(formula: string | undefined): boolean {
    //first check: no formula entered or single
    if (!formula) {
      this.errorMessage.set('Please enter a formula.');
      return false;
    }

    //second check: balanced parentheses
    const stack: string[] = [];
    for (const char of formula) {
      if (char === '(') {
        stack.push(char);
      } else if (char === ')') {
        if (stack.pop() !== '(') {
          this.errorMessage.set('Fix unbalanced parentheses.');
          return false;
        }
      }
    }
    if (stack.length > 0) {
      this.errorMessage.set('Fix unbalanced parentheses.');
      return false;
    }

    //third check: back to back sets/operations in formula
    const sets = /^[A-C∅]*$/;
    const unaryOperations = /^['P]*$/
    const binaryOperations = /^[⋂⋃–×]*$/;

    if (formula.length === 1 && !sets.test(formula.charAt(0))) {
      this.errorMessage.set(`${formula.charAt(0)} is not a valid formula.`);
      return false;
    } else if (formula.length === 2 && !(unaryOperations.test(formula.charAt(0))
      && sets.test(formula.charAt(1)))) {
      this.errorMessage.set(`${formula.charAt(0) + formula.charAt(1)} is not a valid sequence.`);
      return false;
    } else {
      let prev = formula.charAt(0);
      for (let i = 1; i < formula.length; i++) {
        if (sets.test(formula.charAt(i)) &&
          (sets.test(prev) || prev === ')')) {
          this.errorMessage.set(`${prev + formula.charAt(i)} is not a valid sequence.`);
          return false;
        } else if (unaryOperations.test(formula.charAt(i)) &&
          (!binaryOperations.test(prev) && !unaryOperations.test(prev)) ) {
          this.errorMessage.set(`${prev + formula.charAt(i)} is not a valid sequence.`);
          return false;
        } else if (binaryOperations.test(formula.charAt(i)) &&
          (!sets.test(prev) && !(prev === ')'))) {
          this.errorMessage.set(`${prev + formula.charAt(i)} is not a valid sequence.`);
          return false;
        } else if (formula.charAt(i) === '(' &&
          (prev === ')' || sets.test(prev) )) {
          this.errorMessage.set(`${prev + formula.charAt(i)} is not a valid sequence.`);
          return false;
        } else if (formula.charAt(i) === ')' &&
          (prev === '(' || (!(prev === ')') && !sets.test(prev)))) {
          this.errorMessage.set(`${prev + formula.charAt(i)} is not a valid sequence.`);
          return false;
        }
        prev = formula.charAt(i);
      }

      if (!sets.test(prev) && prev !== ')') {
        this.errorMessage.set(`${prev} is missing an argument.`);
        return false;
      }
    }
    return true;
  }

  turnSetInputsToArrays(): void {
    for (const set of this.sets()) {
      let content = set.setContent;

      content = [...new Set(
        String(set.setContent)
          .split(",")
          .map(str => str.trim())
          .filter(str => str !== "")
      )];

      set.setContent = content;
    }
  }

  onCalculate(): void {
    this.sets.set(this.sets().slice(0,4)); //reset to array containing A-C
    this.steps.set([]);
    if (this.hasValidSyntax(this.formula())) {
      this.turnSetInputsToArrays();
      let formulaArray = this.formula()!.split('').filter(char => char !== ' ');
      let parentheses = false;
      if (this.formula()!.includes('(')) {
        parentheses = true;
        this.steps().push({
          id: -1,
          step: 'Calculate expressions within parentheses in: ' + formulaArray.join(''),
          class: 'header'
        });
        formulaArray = this.removeParentheses(formulaArray);
      }
      if (formulaArray.length > 1) {
        let step;
        if (parentheses) {
          step = 'Calculate remaining expressions in: ';
        } else {
          step = 'Calculate expressions in: ';
        }
        this.steps().push({
          id: -2,
          step: step + formulaArray.join(''),
          class: 'header'
        });
      }
      const result = this.calculate(formulaArray);
      this.steps().push({
        id: -3,
        step: 'The resulting set is: ' + result.join(''),
        class: 'result'
      });
    }
  }

  removeParentheses(formula: string[]):string[] {
    if (!formula.includes('(')) {
      return this.calculate(formula);
    }

    for (let i = 0; i < formula.length; i++) {
      let j = i+1;
      if (formula[i] === '(') {
        let opening = 1;
        let closing = 0;
        while (opening !== closing) {
          if (formula[j] === '(') {
            opening++;
          } else if (formula[j] === ')') {
            closing++;
          }
          j++;
        }

        const start = formula.slice(0, i);
        const middle = formula.slice(i+1, j-1);
        const end = formula.slice(j);

        formula = [...start, ...this.calculate(this.removeParentheses(middle)), ...end];
      }
    }
    return formula;
  }

  calculate(formula: string[]):string[] {
    const unaryOperations = /^['P]*$/
    for (let i = 0; i < formula.length; i++) {
      if (unaryOperations.test(formula[i])) {
        let j = i + 1;
        while (unaryOperations.test(formula[j])) {
          j++;
        }
        const start = formula.slice(0, i);
        const toSolve = formula.slice(i, j+1);
        const end = formula.slice(j+1);
        formula = [...start, ...this.unaryOperationHelper(toSolve), ...end];
        }
      }

      let set1 = this.sets()
        .find(set => set.name === formula[0])!.setContent as string[];

      while (formula.length > 1) {
        const set2 = this.sets()
          .find(set => set.name === formula[2])!.setContent as string[];
        if (formula[1] === '⋂') {
          set1 = this.intersection(set1, set2);
        } else if (formula[1] === '⋃') {
          set1 = this.union(set1, set2);
        } else if (formula[1] === '–') {
          set1 = this.difference(set1, set2);
        } else if (formula[1] === '×') {
          set1 = this.cartesianProduct(set1, set2);
        }

        const newName = '{' + set1.join(', ') + '}';
        const start = formula.slice(0, 3);
        const end = formula.slice(3);

        this.sets().push({name: newName, setContent: set1});
        this.steps().push({
          id: this.stepId,
          step: start.join('') + " = " + newName
        });
        this.stepId++;
        formula = [newName, ...end];
      }
    return formula;
  }

  unaryOperationHelper(formula: string[]):string[] {
    if (!formula.includes('P') || formula.length === 2) {
      let set = this.sets()
        .find(set => set.name === formula[formula.length-1])!.setContent as string[];
      if (!formula.includes('P')) {
        if ((formula.length-1)%2 !== 0) {
          const newSet = this.complement(set);
          const newName = '{' + newSet.join(', ') + '}';
          this.sets().push({name: newName, setContent: newSet});

          this.steps().push({
            id: this.stepId,
            step: formula.join('') + " = " + newName
          });
          this.stepId++;

          return [newName];
        } else {
          this.steps().push({
            id: this.stepId,
            step: formula.join('') + " = " + formula[formula.length-1]
          });
          this.stepId++;
          return [formula[formula.length-1]];
        }
      } else {
        const newSet = this.powerSet(set);
        const newName = '{' + newSet.join(', ') + '}';
        this.sets().push({name: newName, setContent: newSet});

        this.steps().push({
          id: this.stepId,
          step: formula.join('') + " = " + newName
        });
        this.stepId++;

        return [newName];
      }
    }

    while (formula.length > 1) {
      let j = formula.length-2;
      if (formula[j] === '\'') {
        while (j>=0 && formula[j] === '\'') {
          j--;
        }
        j++;
      }

      const start = formula.slice(0, j);
      const end = formula.slice(j);
      formula = [...start, ...this.unaryOperationHelper(end)];
    }
    return formula;
  }

  powerSet(set: string[]) {
    set = [...new Set([...set])];
    const powerSet: string[] = [];
    const powerSetSize = Math.pow(2, set.length);

    for (let i = 0; i < powerSetSize; i++) {
      const subset: string[] = [];
      for (let j = 0; j < set.length; j++) {
        if (i & (1 << j)) {
          subset.push(set[j]);
        }
      }
      powerSet.push('{' + subset.join(', ') + '}');
    }

    return powerSet.sort((a, b) => a.length - b.length);
  }

  complement(set: string[]): string[] {
    const universe = [...new Set([
      ...this.sets()[0].setContent,
      ...this.sets()[1].setContent,
      ...this.sets()[2].setContent
    ])];
    return universe.filter(element => !set.includes(element));
  }

  union(set1: string[], set2: string[]): string[] {
    return [...new Set([
      ...set1,
      ...set2,
    ])];
  }

  intersection(set1: string[], set2: string[]): string[] {
    return set1.filter(item => set2.includes(item));
  }

  difference(set1: string[], set2: string[]): string[] {
    return set1.filter(item => !set2.includes(item));
  }

  cartesianProduct(set1: string[], set2: string[]):string[] {
    const product: string[] = [];
    for (let i = 0; i < set1.length; i++) {
      for (let j = 0; j < set2.length; j++) {
        const pair = '⟨' + set1[i] + ', ' + set2[j] + '⟩';
        product.push(pair);
      }
    }
    return product;
  }
}
