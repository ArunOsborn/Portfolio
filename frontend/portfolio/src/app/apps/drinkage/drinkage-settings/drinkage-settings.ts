import { Component, Inject, inject, model, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialogClose, MatDialogActions, MatDialogContent, MatDialogTitle, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { MatSliderModule } from "@angular/material/slider";
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-drinkage-settings',
	imports: [MatExpansionModule, FormsModule, MatButtonModule, MatIconModule, CommonModule, MatCardModule, MatSliderModule, MatDialogModule, MatDialogClose, MatDialogActions, MatDialogTitle, MatDialogContent, MatSnackBarModule],
	templateUrl: './drinkage-settings.html',
	styleUrl: './drinkage-settings.scss',
})
export class DrinkageSettings {
	// dialogRef: MatDialogRef<DrinkageSettings> = inject(MatDialogRef<DrinkageSettings>);
	// data = inject(MAT_DIALOG_DATA);
	categories;
	categoryNames: string[] = [];

	constructor(@Optional() public dialogRef: MatDialogRef<DrinkageSettings>, @Optional() @Inject(MAT_DIALOG_DATA) private data: any, private snackBar: MatSnackBar, private dialog: MatDialog) {
		this.categories = this.data.categories;
		this.categoryNames = Object.keys(this.categories);
	}

	close()
	{
		this.dialogRef.close("hi");
	}
}
