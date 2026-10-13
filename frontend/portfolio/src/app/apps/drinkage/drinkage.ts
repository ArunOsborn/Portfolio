import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	OnInit,
	signal,
	ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { forkJoin } from 'rxjs';
import { DrinkageCardPack } from './drinkage-card-pack/drinkage-card-pack';
import { DrinkageSettings, DrinkageSettingsResult } from './drinkage-settings/drinkage-settings';

interface CardButton {
	label: string;
	action: () => void;
}

@Component({
	selector: 'app-drinkage',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
	],
	templateUrl: './drinkage.html',
	styleUrls: ['./drinkage.scss', '../legacy css/style game.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drinkage implements OnInit {
	private readonly http = inject(HttpClient);
	private readonly dialog = inject(MatDialog);

	@ViewChild('card') private cardElement?: ElementRef<HTMLDivElement>;

	readonly names = signal<string[]>([]);
	readonly recentNames = signal<string[]>([]);
	readonly markedPeople = signal<string[]>([]);
	readonly cardContent = signal('Welcome to Drinkage!');
	readonly cardButtons = signal<CardButton[]>([]);
	readonly nameControl = new FormControl('', { nonNullable: true });
	readonly isLoadingCards = signal(true);
	readonly cardLoadError = signal(false);

	private cardPack = new DrinkageCardPack({ groups: {}, punishments: [] });

	private pointerId: number | null = null;
	private startX = 0;
	private currentX = 0;
	readonly cardTransform = signal('translateX(0px)');
	readonly cardTransition = signal('none');
	private readonly swipeThreshold = 120;

	ngOnInit(): void {
		this.loadCardPack();
	}

	loadCardPack(): void {
		this.isLoadingCards.set(true);
		this.cardLoadError.set(false);

		forkJoin({
			common: this.http.get('/assets/drinkage/common.txt', { responseType: 'text' }),
			uncommon: this.http.get('/assets/drinkage/uncommon.txt', { responseType: 'text' }),
			rare: this.http.get('/assets/drinkage/rare.txt', { responseType: 'text' }),
			punishments: this.http.get('/assets/drinkage/punishments.txt', { responseType: 'text' }),
		}).subscribe({
			next: cards => {
				this.cardPack = new DrinkageCardPack({
					groups: {
						common: {
							chance: 0.4,
							cards: this.parseCardFile(cards.common),
							allowRepeats: true,
						},
						uncommon: {
							chance: 0.2,
							cards: this.parseCardFile(cards.uncommon),
							allowRepeats: true,
						},
						rare: {
							chance: 0.4,
							cards: this.parseCardFile(cards.rare),
							allowRepeats: false,
						},
					},
					punishments: this.parseCardFile(cards.punishments),
				});
				this.isLoadingCards.set(false);
			},
			error: () => {
				this.isLoadingCards.set(false);
				this.cardLoadError.set(true);
				this.cardContent.set('Unable to load game cards. Check your connection and try again.');
				this.cardButtons.set([]);
			},
		});
	}

	private parseCardFile(text: string): string[] {
		return text
			.split(/\r?\n/g)
			.map(line => line.trim())
			.filter(line => line.length > 0);
	}

	specialCompleteScreen(): void {
		this.cardContent.set('Your job is done.');
		this.cardButtons.set([]);
	}

	showRandomPunishment(): void {
		const punishments = this.cardPack.punishments;
		if (punishments.length === 0) {
			this.cardContent.set('No punishment cards are configured.');
			this.cardButtons.set([]);
			return;
		}

		const instruction = punishments[Math.floor(Math.random() * punishments.length)];
		this.cardButtons.set([]);
		this.cardContent.set(this.prepareInstruction(instruction));
	}

	markPerson(name: string): void {
		this.markedPeople.update(people => [...people, name]);
		this.specialCompleteScreen();
	}

	prepareInstruction(instruction: string): string {
		if (!instruction) {
			return 'No card is available in this group.';
		}

		if (instruction.startsWith('SPECIAL:')) {
			instruction = instruction.slice('SPECIAL:'.length).trimStart();

			if (instruction.includes('Guess')) {
				return 'This special card is invalid. Skip it and draw another card.';
			}
			if (instruction.startsWith('Make a choice')) {
				this.cardButtons.set([
					{ label: 'Finish', action: () => this.specialCompleteScreen() },
					{ label: 'Random', action: () => this.showRandomPunishment() },
				]);
				return instruction;
			}
			if (instruction.startsWith('Waterfall relay')) {
				this.cardButtons.set([
					{ label: 'Give out 5 sips', action: () => this.specialCompleteScreen() },
					{
						label: 'Waterfall relay',
						action: () => {
							const relayInstruction =
								'Divide the room into two teams and complete a friendly relay challenge. The losing team chooses a silly team pose.';
							this.cardContent.set(this.prepareInstruction(relayInstruction));
							this.cardButtons.set([]);
						},
					},
				]);
				return "Choose one of the following:<br><span style='color:red;'>(Waterfall Relay is deadly)</span>";
			}

			const players = this.names();
			if (players.length === 0) {
				this.cardButtons.set([]);
				return 'Add at least one player before using this card.';
			}

			this.cardButtons.set(
				players.map(person => ({
					label: person,
					action: () => this.markPerson(person),
				})),
			);
			return instruction;
		}

		if (instruction.includes('prsn')) {
			const players = this.names();
			if (players.length === 0) {
				this.cardButtons.set([]);
				return 'Add at least one player before drawing this card.';
			}

			const recent = new Set(this.recentNames());
			const availablePlayers = players.filter(person => !recent.has(person));
			const candidates = availablePlayers.length > 0 ? availablePlayers : players;
			const selectedPerson = candidates[Math.floor(Math.random() * candidates.length)];
			const recentNames = [selectedPerson, ...this.recentNames()].slice(
				0,
				Math.floor(players.length / 2),
			);
			this.recentNames.set(recentNames);
			instruction = instruction.replaceAll('prsn', `<b>${selectedPerson}</b>`);
		}

		return instruction.replace(/\[([^\]]*)\]/g, (match, choices: string) => {
			const options = choices.split(',').map(option => option.trim()).filter(Boolean);
			return options.length > 0
				? options[Math.floor(Math.random() * options.length)]
				: match;
		});
	}

	formatNamesList(list: string[]): string {
		if (list.length === 0) {
			return '';
		}
		if (list.length === 1) {
			return `<b>${list[0]}</b>`;
		}

		const names = list.map(name => `<b>${name}</b>`);
		return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
	}

	nextCard(): void {
		if (this.isLoadingCards() || this.cardLoadError()) {
			return;
		}

		const markedOutcomeChance = Math.min(this.markedPeople().length / 50, 1);
		if (Math.random() < markedOutcomeChance) {
			const markedPeople = this.markedPeople();
			const repeatedPeople = [
				...new Set(markedPeople.filter((person, index) => markedPeople.indexOf(person) !== index)),
			];
			let instruction: string;

			if (repeatedPeople.length === 1) {
				instruction = `<b>${repeatedPeople[0]}</b> was selected more than once and must choose a fun challenge.`;
			} else if (repeatedPeople.length > 1) {
				instruction = `${this.formatNamesList(repeatedPeople)} were selected more than once and must choose a group challenge.`;
			} else if (markedPeople.length === 1) {
				instruction = `<b>${markedPeople[0]}</b> must do a dance for 20 seconds`;
			} else {
				instruction = `${this.formatNamesList(markedPeople)} must do a 30 second dance together`;
			}

			this.markedPeople.set([]);
			this.cardContent.set(instruction);
			this.cardButtons.set([]);
			return;
		}

		const instruction = this.cardPack.getNextCard();
		if (instruction === null) {
			this.cardContent.set('No cards are available. Update the card groups in settings.');
			this.cardButtons.set([]);
			return;
		}

		this.cardButtons.set([]);
		this.cardContent.set(this.prepareInstruction(instruction));
	}

	addName(): void {
		const name = this.nameControl.value.trim();
		if (name.length === 0) {
			return;
		}

		this.names.update(names => [...names, name]);
		this.nameControl.reset();
	}

	removeName(index: number): void {
		this.names.update(names => names.filter((_, nameIndex) => nameIndex !== index));
	}

	openSettingsDialog(): void {
		if (this.isLoadingCards() || this.cardLoadError()) {
			return;
		}

		const dialogRef = this.dialog.open<DrinkageSettings, unknown, DrinkageSettingsResult>(
			DrinkageSettings,
			{
				width: '95%',
				maxWidth: '95%',
				height: '95%',
				data: {
					categories: this.cardPack.groups,
					punishments: this.cardPack.punishments,
				},
			},
		);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.cardPack = new DrinkageCardPack({
					groups: result.categories,
					punishments: result.punishments,
				});
			}
		});
	}

	onPointerDown(event: PointerEvent): void {
		if (!this.cardElement || this.isLoadingCards()) {
			return;
		}
		if (event.target instanceof HTMLElement && event.target.closest('button, input, textarea')) {
			return;
		}

		this.pointerId = event.pointerId;
		this.startX = event.clientX;
		this.currentX = 0;
		this.cardTransition.set('none');
		this.cardElement.nativeElement.setPointerCapture(event.pointerId);
		event.preventDefault();
	}

	onPointerMove(event: PointerEvent): void {
		if (this.pointerId !== event.pointerId) {
			return;
		}

		this.currentX = Math.min(0, event.clientX - this.startX);
		this.cardTransform.set(`translateX(${this.currentX}px)`);
	}

	onPointerUp(event: PointerEvent): void {
		if (this.pointerId !== event.pointerId) {
			return;
		}

		if (this.cardElement?.nativeElement.hasPointerCapture(event.pointerId)) {
			this.cardElement.nativeElement.releasePointerCapture(event.pointerId);
		}

		this.pointerId = null;
		if (this.currentX < -this.swipeThreshold) {
			const screenWidth = window.innerWidth;
			this.cardTransition.set('transform 200ms ease-out');
			this.cardTransform.set(`translateX(-${screenWidth}px)`);
			setTimeout(() => {
				this.nextCard();
				this.cardTransition.set('none');
				this.cardTransform.set(`translateX(${screenWidth}px)`);
				requestAnimationFrame(() => {
					this.cardTransition.set('transform 300ms ease-out');
					this.cardTransform.set('translateX(0px)');
					setTimeout(() => this.cardTransition.set('none'), 320);
				});
			}, 200);
			return;
		}

		this.cardTransition.set('transform 200ms ease-out');
		this.cardTransform.set('translateX(0px)');
		setTimeout(() => this.cardTransition.set('none'), 200);
	}

	onPointerCancel(event: PointerEvent): void {
		if (this.pointerId !== event.pointerId) {
			return;
		}

		if (this.cardElement?.nativeElement.hasPointerCapture(event.pointerId)) {
			this.cardElement.nativeElement.releasePointerCapture(event.pointerId);
		}
		this.pointerId = null;
		this.currentX = 0;
		this.cardTransition.set('transform 200ms ease-out');
		this.cardTransform.set('translateX(0px)');
		setTimeout(() => this.cardTransition.set('none'), 200);
	}
}
