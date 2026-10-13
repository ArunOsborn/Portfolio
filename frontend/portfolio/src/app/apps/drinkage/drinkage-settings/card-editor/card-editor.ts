import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-card-editor',
	imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
	templateUrl: './card-editor.html',
	styleUrl: './card-editor.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardEditor {
	readonly cards = input('');
	readonly cardsChange = output<string>();
	readonly cardList = computed(() => this.cards().split(/\r?\n/));

	updateCard(value: string, index: number): void {
		const cards = this.cardList();
		cards[index] = value;
		this.cardsChange.emit(cards.join('\n'));
	}

	updateCardFromEvent(event: Event, index: number): void {
		const target = event.target;
		if (target instanceof HTMLTextAreaElement) {
			this.updateCard(target.value, index);
		}
	}

	addCard(): void {
		this.cardsChange.emit(`${this.cards()}\n`);
	}

	removeCard(index: number): void {
		const cards = this.cardList();
		cards.splice(index, 1);
		this.cardsChange.emit(cards.join('\n'));
	}
}
