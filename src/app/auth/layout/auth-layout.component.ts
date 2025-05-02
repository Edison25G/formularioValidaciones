import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@common/components';

@Component({
	selector: 'amc-auth-layout',
	imports: [RouterOutlet, FooterComponent],
	templateUrl: './auth-layout.component.html',
	styleUrl: './auth-layout.component.css',
})
export default class AuthLayoutComponent {}
