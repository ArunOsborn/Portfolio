import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CardButton {
	label: string;
	action: () => void;
}

@Component({
	selector: 'app-drinkage',
	imports: [CommonModule, FormsModule],
	templateUrl: './drinkage.html',
	styleUrls: ['../legacy css/style game.css'],
})
export class Drinkage implements OnInit {
	@ViewChild('card', { static: false }) cardElement!: ElementRef;
	@ViewChild('nameInput', { static: false }) nameInputElement!: ElementRef;
	@ViewChild('namesContainer', { static: false }) namesContainerElement!: ElementRef;

	// Component state
	recentNames: string[] = [];
	names: string[] = [];
	markedPeople: string[] = [];
	nameInputValue: string = '';
	
	// Card content
	cardContent: string = "Welcome To Drinkage!";
	cardButtons: CardButton[] = [];
	
	// Game data
	common: string[] = [];
	uncommon: string[] = [];
	rare: string[] = [];
	punishments: string[] = [];

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		// Load text files from assets
		this.http.get('/assets/drinkage/common.txt', { responseType: 'text' }).subscribe(text => {
			this.common = text.split('\n').filter(line => line.trim());
		});
		
		this.http.get('/assets/drinkage/uncommon.txt', { responseType: 'text' }).subscribe(text => {
			this.uncommon = text.split('\n').filter(line => line.trim());
		});
		
		this.http.get('/assets/drinkage/rare.txt', { responseType: 'text' }).subscribe(text => {
			this.rare = text.split('\n').filter(line => line.trim());
		});
		
		this.http.get('/assets/drinkage/punishments.txt', { responseType: 'text' }).subscribe(text => {
			this.punishments = text.split('\n').filter(line => line.trim());
		});
	}


	specialCompleteScreen(): void {
		this.cardContent = "<p>Your job is done</p>";
		this.cardButtons = [];
	}

	showRandomPunishment(): void {
		const instruction = this.punishments[Math.floor(Math.random() * this.punishments.length)];
		this.cardContent = this.prepareInstruction(instruction);
		this.cardButtons = [];
	}

	markPerson(name: string): void {
		this.markedPeople.push(name);
		console.log(this.markedPeople);
		this.specialCompleteScreen();
	}

	prepareInstruction(instruction: string): string {
		if (typeof instruction !== 'string') {
			console.warn(`Invalid instruction: ${instruction}`);
			return instruction;
		}
		if (instruction.match(/^SPECIAL/g)) {
			instruction = instruction.substr("SPECIAL: ".length);
			
			if (instruction.match(/Guess/g)) {
				return "This really shouldn't have happened. Take a sip for breaking the game!";
			}
			else if (instruction.match(/^Make a choice./g)) {
				console.log("Creating special \"Make a choice\" card");
				
				this.cardButtons = [
					{ label: 'Finish', action: () => this.specialCompleteScreen() },
					{ label: 'Random', action: () => this.showRandomPunishment() }
				];

				return instruction;
			}
			else if (instruction.match(/^Waterfall relay/g)) {
				console.log("Creating special \"Waterfall relay\" card");
				
				this.cardButtons = [
					{ label: 'Give out 5 sips', action: () => this.specialCompleteScreen() },
					{ 
						label: 'Waterfall relay', 
						action: () => {
							const relayInstruction = "<i>Looks like you want everyone to hate you...</i><br>Divide the room into two teams. Each person in a team must finish their drink before the next person starts. Last team to finish all their drinks loses and must do a shot each.";
							this.cardContent = this.prepareInstruction(relayInstruction);
							this.cardButtons = [];
						}
					}
				];

				return "Choose one of the following:<br><span style='color:red;'>(Waterfall Relay is deadly)</span>";
			}
			else { // Goes to original SPECIAL card
				console.log(this.names);
				this.cardButtons = this.names.map(person => ({
					label: person,
					action: () => this.markPerson(person)
				}));
				return instruction;
			}
		}
		
		// Reduces chance of the same name being picked too much
		let selectedPrsn = this.names[Math.floor(Math.random() * this.names.length)];
		if (this.recentNames.includes(selectedPrsn)) {
			selectedPrsn = this.names[Math.floor(Math.random() * this.names.length)];
		}
		if (this.recentNames.length > this.names.length / 2) {
			this.recentNames.pop();
		}
		this.recentNames.unshift(selectedPrsn);
		console.log(`Recent names: ${this.recentNames}`);

		instruction = instruction.replaceAll('prsn', `<b>${selectedPrsn}</b>`);
		console.log(instruction.match(/[^\[\]]+(?=\])/g));
		
		if (instruction.match(/[^\[\]]+(?=\])/g) != null) {
			const options = instruction.match(/[^\[\]]+(?=\])/g)![0].split(",");
			console.log(options);
			console.log(Math.random() * options.length);
			instruction = instruction.replace(/\[([^}]*)\]/g, options[Math.floor(Math.random() * options.length)]);
		}
		return instruction;
	}

	formatNamesList(list: string[]): string {
		if (list.length > 1) {
			let sentence = "";
			for (let x = 0; x < list.length - 2; x++) {
				sentence += `<b>${list[x]}</b>, `;
			}
			sentence += `<b>${list[list.length - 2]}</b> and <b>${list[list.length - 1]}</b>`;
			return sentence;
		}
		else {
			return `<b>${list[0]}</b>`;
		}
	}

	nextCard(): void {
		console.log("Next card please");
		this.cardContent = "<p>Loading card...</p>";
		this.cardButtons = [];
		
		const rand = Math.random();
		const chanceOfCommon = 0.4;
		const chanceOfUncommon = 0.2;
		const chanceOfAssasination = this.markedPeople.length / 50;
		
		let instruction = "";
		
		if (rand < chanceOfAssasination) {
			// Assasinate card selector
			let multipleMarkedPeople = [...new Set(this.markedPeople.filter((item, index) => this.markedPeople.indexOf(item) != index))];
			
			// Multiple pick task (when people are selected multiple times)
			if (multipleMarkedPeople.length > 0) {
				if (multipleMarkedPeople.length == 1) {
					instruction = `<b>${multipleMarkedPeople[0]}</b> was selected multiple times so must down their drink!`;
				}
				else {
					instruction += this.formatNamesList(multipleMarkedPeople);
					instruction += " were selected multiple times so must down their drinks!";
				}
			}
			else {
				// Standard task
				if (this.markedPeople.length == 1) {
					instruction = `<b>${this.markedPeople[0]}</b> must do a dance for 20 seconds`;
				}
				else {
					instruction += this.formatNamesList(this.markedPeople);
					instruction += " must do a 30 second dance together";
				}
			}
			this.markedPeople = []; // Resets marked people
			
			this.cardContent = instruction;
		}
		else if (rand < chanceOfAssasination + chanceOfCommon) {
			// Common cards
			instruction = this.common[Math.floor(Math.random() * this.common.length)];
			instruction = this.prepareInstruction(instruction);
			
			this.cardContent = instruction;
		}
		else if (rand < chanceOfAssasination + chanceOfCommon + chanceOfUncommon) {
			// Uncommon cards
			instruction = this.uncommon[Math.floor(Math.random() * this.uncommon.length)];
			instruction = this.prepareInstruction(instruction);
			
			this.cardContent = instruction;
		}
		else {
			// Rare cards
			const index = Math.floor(Math.random() * this.rare.length);
			instruction = this.rare[index];
			instruction = this.prepareInstruction(instruction);

			this.cardContent = instruction;
			this.rare.splice(index, 1);
		}
	}

	addName(): void {
		// Gets name value and clears field
		console.log("Adding player");
		const name = this.nameInputValue.replace(/^\s|\s$/g, ''); // Removes spaces
		
		if (name != "") {
			this.nameInputValue = "";
			console.log(name);
			this.names.push(name);
		}
	}

	removeName(name: string): void {
		this.names = this.names.filter(n => n != name);
		console.log("Item removed");
	}
}
