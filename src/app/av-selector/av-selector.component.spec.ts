import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvSelectorComponent } from './av-selector.component';

describe('AvSelectorComponent', () => {
  let component: AvSelectorComponent;
  let fixture: ComponentFixture<AvSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
