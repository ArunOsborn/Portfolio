import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
	selector: 'app-home-page',
	imports: [MatButtonModule, MatCardModule, MatTooltipModule],
	templateUrl: './home-page.html',
	styleUrl: './home-page.scss',
})
export class HomePage {
	
}
