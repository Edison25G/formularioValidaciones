import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { SessionService } from '@dashboard/core/services/sessions.service';
import { AuthService } from '@auth/core/services/auth.service';

@Component({
	selector: 'amc-root',
	standalone: true,
	imports: [RouterOutlet, ButtonModule, ToastModule],
	providers: [],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
	title = 'primeg';

	constructor(
		private sessionService: SessionService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		if (this.authService.isAuthenticated()) {
			this.sessionService.startWatcher();
		}
	}
}
