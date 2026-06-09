import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-card-editor',
	imports: [MatFormFieldModule, MatInputModule, FormsModule],
	templateUrl: './card-editor.html',
	styleUrl: './card-editor.scss',
})
export class CardEditor {
	private _cardList: string[] = [];

	get cardList(): string[]
	{
		return this._cardList;
	}

	set cardList(value: string[])
	{
		this._cardList = value;
		this.cardsChange.emit(this._cardList.join("\n"));
	}

	@Input() set cards(value: string | undefined) {
		this.cardList = value ? value.split('\n') : [];
	}

	@Output() cardsChange = new EventEmitter<string>();

	onCardChange(value: string, index: number): void {
		this._cardList[index] = value;
		this.cardsChange.emit(this._cardList.join('\n'));
	}
}
