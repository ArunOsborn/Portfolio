import { vi } from 'vitest';
import { DrinkageCardPack } from './drinkage-card-pack';

describe('DrinkageCardPack', () => {
	afterEach(() => vi.restoreAllMocks());

	it('returns no card when every group is empty or has no selection weight', () => {
		const cardPack = new DrinkageCardPack({
			groups: {
				empty: { chance: 1, allowRepeats: true, cards: [] },
				disabled: { chance: 0, allowRepeats: true, cards: ['Disabled card'] },
			},
			punishments: [],
		});

		expect(cardPack.getNextCard()).toBeNull();
	});

	it('draws without repeats and skips an exhausted group', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		const cardPack = new DrinkageCardPack({
			groups: {
				limited: { chance: 1, allowRepeats: false, cards: ['One-time card'] },
				repeating: { chance: 1, allowRepeats: true, cards: ['Repeatable card'] },
			},
			punishments: [],
		});

		expect(cardPack.getNextCard()).toBe('One-time card');
		expect(cardPack.getNextCard()).toBe('Repeatable card');
	});
});
