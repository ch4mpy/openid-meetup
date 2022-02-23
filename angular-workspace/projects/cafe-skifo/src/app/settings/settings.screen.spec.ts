import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsScreen } from './settings.screen';

describe('SettingsScreen', () => {
  let component: SettingsScreen;
  let fixture: ComponentFixture<SettingsScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsScreen ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
