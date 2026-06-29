import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cookage } from './cookage';

describe('Cookage', () => {
  let component: Cookage;
  let fixture: ComponentFixture<Cookage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cookage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cookage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
