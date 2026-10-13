import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEditor } from './card-editor';

describe('CardEditor', () => {
  let component: CardEditor;
  let fixture: ComponentFixture<CardEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds and removes cards by emitting the updated list', () => {
    fixture.componentRef.setInput('cards', 'First card');
    fixture.detectChanges();

    let updatedCards = '';
    component.cardsChange.subscribe(value => updatedCards = value);

    component.addCard();
    expect(updatedCards).toBe('First card\n');

    component.removeCard(0);
    expect(updatedCards).toBe('');
  });
});
