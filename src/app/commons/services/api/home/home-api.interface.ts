export interface IResponseHome {
	genres: IHomeGenres[];
	concerts: IHomeConcerts[];
	success: boolean;
}

export interface IResponseHomev2 {
	object: IHomeEvent[];
	//success: boolean;
}

export interface IHomeConcerts {
	id: number;
	title: string;
	place: string;
	dateEvent: string;
	timeEvent: string;
	genre: string;
	imageUrl: string;

	description: string;
	ticketsQuantity: number;
	unitPrice: number;
	status: string;
}

export interface IHomeEvent {
	idEvent: number;
	title: string;
	description: string;
	dateEvent: string;
	image: string;
	place: string;
	ticketsQuantity: number;
	unitPrice: number;
	status: string;
	category: IHomeCategory;
}

export interface IHomeGenres {
	id: number;
	name: string;
	status: boolean;
}

export interface IHomeCategory {
	idCategory: number;
	description: string;
	status: string;
}
