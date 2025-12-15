import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Drinkage } from './apps/drinkage/drinkage';
import { PhysicsSim } from './apps/physics-sim/physics-sim';

export const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'apps/drinkage',
        component: Drinkage
    },
    {
        path: 'apps/physics-sim',
        component: PhysicsSim
    }
];
