import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { Toast } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'amc-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    ButtonModule,
    DividerModule,
    ToastModule,
    MessageModule,
    Toast,
  ],
  providers: [MessageService],
})
export default class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      contraseña: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor, completa todos los campos.',
      });
      return;
    }

    const credentials = this.loginForm.value;

    this.userService.login(credentials).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenido',
          detail: 'Inicio de sesión exitoso',
        });
        setTimeout(() => this.router.navigate(['/dashboard/home']), 1500);
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales inválidas',
        });
        console.error(err);
      },
    });
  }
}
