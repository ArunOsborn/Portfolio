import { TestBed } from '@angular/core/testing';

import { PhysObject } from './phys-object';

describe('PhysObject', () => {
  let service: PhysObject;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysObject);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
