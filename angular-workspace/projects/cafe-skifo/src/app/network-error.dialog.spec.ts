import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkErrorDialog } from './network-error.dialog';

describe('NetworkErrorDialog', () => {
  let component: NetworkErrorDialog;
  let fixture: ComponentFixture<NetworkErrorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkErrorDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkErrorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
