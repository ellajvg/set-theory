import {Routes} from '@angular/router';
import {BasicsComponent} from './tabs/basics/basics.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calculator',
    pathMatch: 'full'
  },
  {
    path: 'calculator',
    component: BasicsComponent,
    title: 'Set theory calculator'
  },
  {
    path: 'binary-relations',
    loadComponent: (
    ) => import('./tabs/binary/binary.component').then(mod => mod.BinaryComponent),
    title: 'Binary relations'
  },
  {
    path: '**',
    redirectTo: 'calculator',
  },
];
