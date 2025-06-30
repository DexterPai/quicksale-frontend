import { IResponseEvent } from '../event/event-api-model.interface';

//#region  GET CATEGORY
export interface IResponseDetailsEvent {
	idDetailsEvents: number;
	description: string;
	title: string;
	comments: string;
	urlImageRef: string;
	status: string;
	event: IResponseEvent;
}
//#endregion

//#region CREATE CATEGORY
export interface IRequestCreateUpdateDetailsEvent {
	idDetailsEvents: number;
	description: string;
	title: string;
	comments: string;
	urlImageRef: string;
	status: string;
	event: IResponseEvent;
}
//#endregion
