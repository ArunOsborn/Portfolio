import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-drinkage-settings',
	imports: [MatExpansionModule, MatButtonModule, MatIconModule, CommonModule],
	templateUrl: './drinkage-settings.html',
	styleUrl: './drinkage-settings.scss',
})
export class DrinkageSettings {
	readonly data = inject(MAT_DIALOG_DATA);
	categoryNames: string[] = Object.keys(this.data.categories);

}
