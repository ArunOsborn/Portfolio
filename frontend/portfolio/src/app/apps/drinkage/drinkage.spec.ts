import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drinkage } from './drinkage';

describe('Drinkage', () => {
  let component: Drinkage;
  let fixture: ComponentFixture<Drinkage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drinkage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Drinkage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
