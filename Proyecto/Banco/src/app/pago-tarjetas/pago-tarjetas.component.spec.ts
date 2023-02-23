import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoTarjetasComponent } from './pago-tarjetas.component';

describe('PagoTarjetasComponent', () => {
  let component: PagoTarjetasComponent;
  let fixture: ComponentFixture<PagoTarjetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoTarjetasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoTarjetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
