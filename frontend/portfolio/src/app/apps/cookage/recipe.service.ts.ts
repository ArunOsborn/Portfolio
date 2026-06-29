import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Injectable({
	providedIn: 'root',
})
export class RecipeService {
	http: HttpClient = inject(HttpClient);
	loadedRecipes: any[] = [];

	async searchRecipes(query: string): Promise<any> {
		const recipes = await lastValueFrom(this.http.get(`${environment.cookageApiUrl}/recipes/search?query=${query}`));
		this.loadedRecipes = recipes as any[];
		return recipes;
	}
}
