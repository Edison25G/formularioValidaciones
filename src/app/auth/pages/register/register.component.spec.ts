import { TestBed } from '@angular/core/testing';
import  RegisterComponent  from './register.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

describe('RegisterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule, InputTextModule, ButtonModule, PasswordModule],
    }).compileComponents();
  });

  it('should create the register component', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have empty fields by default', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    expect(component.username).toBe('');
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('should display error message when passwords do not match', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    component.password = 'password123';
    component.confirmPassword = 'password456';
    component.register();
    expect(component.errorMessage).toBe('Las contraseñas no coinciden');
  });
});
