import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RecipeService } from '../recipe.service.ts';

@Component({
	selector: 'app-cookage-search-bar',
	imports: [MatFormField, FormsModule, MatInputModule, MatButtonModule, MatIconModule],
	templateUrl: './cookage-search-bar.html',
	styleUrl: './cookage-search-bar.scss',
})
export class CookageSearchBar {
	recipeService: RecipeService = inject(RecipeService);

	searchQuery: string = "";

	searchRecipes()
	{
		this.recipeService.searchRecipes(this.searchQuery);
	}
}
