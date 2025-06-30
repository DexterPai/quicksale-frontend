//#region  GET CATEGORY

export interface IResponseEvent {
	idEvent: number;
	title: string;
	description: string;
	dateEvent: Date;
	image: string;
	place: string;
	ticketsQuantity: number;
	unitPrice: number;
	status: string;
	category: IHomeCategory;
}
//#endregion

//#region CREATE CATEGORY
export interface IRequestCreateUpdateEvent {
	idEvent: number;
	title: string;
	description: string;
	dateEvent: Date;
	image: string;
	place: string;
	ticketsQuantity: number;
	unitPrice: number;
	status: string;
	category: IHomeCategory;
}
//#endregion

export interface IHomeCategory {
	idCategory: number;
	description: string;
	status: string;
}
