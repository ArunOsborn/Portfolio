import { Component, inject } from '@angular/core';
import { CookageSearchBar } from './cookage-search-bar/cookage-search-bar';
import { RecipeService } from './recipe.service.ts';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Formatter } from '../../formatter';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-cookage',
	imports: [CommonModule, CookageSearchBar, MatButtonModule, RouterModule],
	templateUrl: './cookage.html',
	styleUrl: './cookage.scss',
})
export class Cookage {
	recipeService: RecipeService = inject(RecipeService);
	formatterService: Formatter = inject(Formatter);
}
