import { TestBed } from '@angular/core/testing';
import  LoginComponent  from './login.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, InputTextModule, ButtonModule, MessageModule, DividerModule],
    }).compileComponents();
  });

  it('should create the login component', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have empty username and password by default', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component.username).toBe('');
    expect(component.password).toBe('');
  });

  it('should display error message when login fails', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.username = 'wrongUser';
    component.password = 'wrongPassword';
    component.login();
    expect(component.errorMessage).toBe('Usuario o contraseña incorrectos');
  });

  it('should clear error message on successful login', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.username = 'correctUsername';
    component.password = 'correctPassword';
    component.login();
    expect(component.errorMessage).toBe('');
  });
});
