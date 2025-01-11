import {Injectable, signal} from '@angular/core';
import {TableElement} from './table/table-element.model';

@Injectable({
  providedIn: 'root'
})
export class BinaryService {
  selected = signal<'onSet' | 'toSet'>('onSet');
  product = signal<string[]>([]);
  tableData = signal<TableElement[][]>([]);
  excluded = signal<string[]>([]);
}
