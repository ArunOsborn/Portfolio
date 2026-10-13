import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Drinkage } from './apps/drinkage/drinkage';
import { PhysicsSim } from './apps/physics-sim/physics-sim';
import { Cookage } from './apps/cookage/cookage';

export const routes: Routes = [
    {
        path: 'home',
        component: HomePage
    },
    {
        path: 'apps/drinkage',
        component: Drinkage
    },
    {
        path: 'apps/physics-sim',
        component: PhysicsSim
    },
    {
        path: 'apps/cookage',
        component: Cookage
    },

    // Redirects
    { path: '**', component: HomePage},
];
