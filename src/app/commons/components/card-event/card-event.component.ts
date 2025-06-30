import { CommonModule } from '@angular/common';
import { ICardEvent } from '../../models/components.interface';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
	standalone: true,
	selector: 'app-card-event',
	templateUrl: './card-event.component.html',
	styleUrls: ['./card-event.component.scss'],
	imports: [MatCardModule, CommonModule]
})
export class CardEventComponent {
	@Input() event?: ICardEvent;
	@Output() clickCard = new EventEmitter<ICardEvent>();
	isSelect = false;

	clickEvent(): void {
		this.isSelect = true;
		this.clickCard.emit(this.event);
	}
}
