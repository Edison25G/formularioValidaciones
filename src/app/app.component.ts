import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'amc-root',
	imports: [RouterOutlet, ButtonModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
	providers: [MessageService],
})
export class AppComponent {
	title = 'primeg';
	constructor(private messageService: MessageService) {}

	show() {
		this.messageService.add({ severity: 'info', summary: 'detail', detail: 'Message Content', life: 3000 });
	}
}
