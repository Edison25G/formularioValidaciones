import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'amc-auth-layout',
	imports: [RouterOutlet, ToastModule],
	templateUrl: './form-layout.component.html',
	styleUrl: './form-layout.component.css',
})
export class FormLayoutComponent {}
