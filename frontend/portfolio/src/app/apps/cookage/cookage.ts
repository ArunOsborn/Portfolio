import { Component, inject } from '@angular/core';
import { CookageSearchBar } from './cookage-search-bar/cookage-search-bar';
import { RecipeService } from './recipe.service.ts';

@Component({
	selector: 'app-cookage',
	imports: [CookageSearchBar],
	templateUrl: './cookage.html',
	styleUrl: './cookage.scss',
})
export class Cookage {
	recipeService: RecipeService = inject(RecipeService);
}
