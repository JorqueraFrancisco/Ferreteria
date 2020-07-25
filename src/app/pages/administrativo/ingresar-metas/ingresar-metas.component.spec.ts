import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarMetasComponent } from './ingresar-metas.component';

describe('IngresarMetasComponent', () => {
  let component: IngresarMetasComponent;
  let fixture: ComponentFixture<IngresarMetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresarMetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
