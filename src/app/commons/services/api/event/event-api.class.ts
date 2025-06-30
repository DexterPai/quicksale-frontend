import { ICardEvent } from '../../../models/components.interface';
import { IHomeEvent, IResponseHomev2 } from '../home/home-api.interface';

export class ResponseHomev2 {
	events: IHomeEvent[];

	constructor(data: IResponseHomev2) {
		this.events = data.object;
	}

	getDataCardEvent(): ICardEvent[] {
		return this.events.map((item) => {
			const event: ICardEvent = {
				idEvent: item.idEvent,
				urlImage: item.image,
				title: item.title,
				description: item.description,
				date: item.dateEvent,
				hour: '', //???
				price: item.unitPrice,
				genre: item.category.description, //descrip category
				place: item.place
			};

			return event;
		});
	}
}
