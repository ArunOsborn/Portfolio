import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookageSearchBar } from './cookage-search-bar';

describe('CookageSearchBar', () => {
  let component: CookageSearchBar;
  let fixture: ComponentFixture<CookageSearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookageSearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookageSearchBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
