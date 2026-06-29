import { TestBed } from '@angular/core/testing';

import { RecipeServiceTs } from './recipe.service.ts';

describe('RecipeServiceTs', () => {
  let service: RecipeServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
