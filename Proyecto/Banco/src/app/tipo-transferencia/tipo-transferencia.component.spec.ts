import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTransferenciaComponent } from './tipo-transferencia.component';

describe('TipoTransferenciaComponent', () => {
  let component: TipoTransferenciaComponent;
  let fixture: ComponentFixture<TipoTransferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoTransferenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
