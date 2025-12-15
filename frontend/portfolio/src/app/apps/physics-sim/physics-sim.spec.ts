import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsSim } from './physics-sim';

describe('PhysicsSim', () => {
  let component: PhysicsSim;
  let fixture: ComponentFixture<PhysicsSim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicsSim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicsSim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
