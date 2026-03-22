import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


export class DrinkageCardPack
{
	private http: HttpClient = inject(HttpClient);
	
	groups: {[rarity: "common"|"uncommon"|"rare"|string]: CardGroup} = {};
	punishments: string[] = [];

	constructor({groups, punishments}: {groups: {[rarity: "common"|"uncommon"|"rare"|string]: CardGroup}, punishments: string[]})
	{
		this.groups = groups;

		if (Object.keys(groups).length === 0)
		{
			this.http.get('/assets/drinkage/common.txt', { responseType: 'text' }).subscribe(text => {
				this.groups["common"] = { chance: 0.4, cards: text.split('\n').filter(line => line.trim()), allowRepeats: true };
			});
			
			this.http.get('/assets/drinkage/uncommon.txt', { responseType: 'text' }).subscribe(text => {
				this.groups["uncommon"] = { chance: 0.2, cards: text.split('\n').filter(line => line.trim()), allowRepeats: true };
			});
			
			this.http.get('/assets/drinkage/rare.txt', { responseType: 'text' }).subscribe(text => {
				this.groups["rare"] = { chance: 0.4, cards: text.split('\n').filter(line => line.trim()), allowRepeats: false };
			});
		}

		if (punishments.length > 0)
		{
			this.punishments = punishments;
		}
		else
		{
			this.http.get('/assets/drinkage/punishments.txt', { responseType: 'text' }).subscribe(text => {
				this.punishments = text.split('\n').filter(line => line.trim());
			});
		}
	}

	getNextCard(): string
	{
		let instruction = "";
		let rarity: CardGroup|undefined = undefined;

		const rand = Math.random();
		let cumulativeChance = Object.keys(this.groups).reduce((sum, key) => sum + this.groups[key].chance, 0);
		let runningChance = 0;

		for (let key in this.groups)
		{
			runningChance += this.groups[key].chance / cumulativeChance;
			if (rand < runningChance)
			{
				rarity = this.groups[key];
				break;
			}
		}

		if (!rarity)
		{
			// Fallback to highest chance group if something goes wrong with the random selection
			rarity = Object.values(this.groups).reduce((prev, current) => (prev.chance > current.chance) ? prev : current);
			console.warn("Random selection failed, defaulting to highest chance group:", rarity);
		}

		if (rarity.allowRepeats===true)
		{
			instruction = rarity.cards[Math.floor(Math.random() * rarity.cards.length)];
			return instruction;
		}
		else
		{
			const index = Math.floor(Math.random() * rarity.cards.length);
			instruction = rarity.cards[index];
			rarity.cards.splice(index, 1);
			return instruction;
		}
	}
}

export interface CardGroup
{
	chance: number;
	cards: string[];
	allowRepeats: boolean;
}