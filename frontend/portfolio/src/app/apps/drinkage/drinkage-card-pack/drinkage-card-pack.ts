export interface CardGroup {
	chance: number;
	cards: string[];
	allowRepeats: boolean;
}

export interface DrinkageCardPackData {
	groups: Record<string, CardGroup>;
	punishments: string[];
}

export class DrinkageCardPack {
	groups: Record<string, CardGroup>;
	punishments: string[];

	constructor({ groups, punishments }: DrinkageCardPackData) {
		this.groups = groups;
		this.punishments = punishments;
	}

	getNextCard(): string | null {
		const groups = Object.values(this.groups).filter(
			group =>
				group.cards.length > 0 &&
				Number.isFinite(group.chance) &&
				group.chance > 0,
		);
		const largestChance = Math.max(...groups.map(group => group.chance));
		const totalChance = groups.reduce(
			(total, group) => total + group.chance / largestChance,
			0,
		);

		if (totalChance <= 0) {
			return null;
		}

		let selection = Math.random() * totalChance;
		const selectedGroup =
			groups.find(group => {
				selection -= group.chance / largestChance;
				return selection < 0;
			}) ?? groups[groups.length - 1];
		const cardIndex = Math.floor(Math.random() * selectedGroup.cards.length);

		return selectedGroup.allowRepeats
			? selectedGroup.cards[cardIndex]
			: selectedGroup.cards.splice(cardIndex, 1)[0];
	}
}
