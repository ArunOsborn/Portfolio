import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkageSettings } from './drinkage-settings';

describe('DrinkageSettings', () => {
  let component: DrinkageSettings;
  let fixture: ComponentFixture<DrinkageSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkageSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrinkageSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
