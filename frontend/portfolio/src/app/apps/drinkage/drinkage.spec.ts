import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Drinkage } from './drinkage';

describe('Drinkage', () => {
	let component: Drinkage;
	let fixture: ComponentFixture<Drinkage>;
	let httpTesting: HttpTestingController;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Drinkage],
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				{
					provide: MatDialog,
					useValue: { open: () => { throw new Error('Unexpected dialog open'); } },
				},
			],
		}).compileComponents();

		httpTesting = TestBed.inject(HttpTestingController);
		fixture = TestBed.createComponent(Drinkage);
		component = fixture.componentInstance;
		fixture.detectChanges();

		httpTesting.expectOne('/assets/drinkage/common.txt').flush('COMMON CARD');
		httpTesting.expectOne('/assets/drinkage/uncommon.txt').flush('UNCOMMON CARD');
		httpTesting.expectOne('/assets/drinkage/rare.txt').flush('RARE CARD');
		httpTesting.expectOne('/assets/drinkage/punishments.txt').flush('PUNISHMENT');
		fixture.detectChanges();
	});

	afterEach(() => httpTesting.verify());

	it('loads the card files and creates', () => {
		expect(component).toBeTruthy();
		expect(component.isLoadingCards()).toBe(false);
		expect(component.cardLoadError()).toBe(false);
	});

	it('adds trimmed players and removes only the selected player', () => {
		component.nameControl.setValue('  Alex  ');
		component.addName();
		component.nameControl.setValue('Alex');
		component.addName();

		expect(component.names()).toEqual(['Alex', 'Alex']);

		component.removeName(0);
		expect(component.names()).toEqual(['Alex']);
	});

	it('asks for players instead of substituting an undefined name', () => {
		expect(component.prepareInstruction('Choose prsn as the next player')).toContain(
			'Add at least one player',
		);
	});
});
