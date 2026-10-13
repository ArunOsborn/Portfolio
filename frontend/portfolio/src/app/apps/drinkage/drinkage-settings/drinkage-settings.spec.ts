import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardGroup } from '../drinkage-card-pack/drinkage-card-pack';
import { DrinkageSettings, DrinkageSettingsResult } from './drinkage-settings';

describe('DrinkageSettings', () => {
	let component: DrinkageSettings;
	let fixture: ComponentFixture<DrinkageSettings>;
	let closeResult: DrinkageSettingsResult | undefined;
	const categories: Record<string, CardGroup> = {
		common: { chance: 0.4, allowRepeats: true, cards: ['First card'] },
	};

	beforeEach(async () => {
		closeResult = undefined;
		await TestBed.configureTestingModule({
			imports: [DrinkageSettings],
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: { categories, punishments: ['Penalty card'] },
				},
				{
					provide: MatDialogRef,
					useValue: { close: (result?: DrinkageSettingsResult) => (closeResult = result) },
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(DrinkageSettings);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('creates and initializes a selectable category', () => {
		expect(component).toBeTruthy();
		expect(component.selectedGroup()?.key).toBe('common');
	});

	it('saves edited card groups and punishments in the shared data shape', () => {
		component.updateSelectedText('Edited card\nSecond card');
		component.selectGroup('punishments');
		component.updateSelectedText('Updated penalty');
		component.save();

		expect(closeResult).toEqual({
			categories: {
				common: {
					chance: 0.4,
					allowRepeats: true,
					cards: ['Edited card', 'Second card'],
				},
			},
			punishments: ['Updated penalty'],
		});
	});
});
