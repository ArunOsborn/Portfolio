import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Drinkage } from './apps/drinkage/drinkage';

export const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'apps/drinkage',
        component: Drinkage
    }
];
