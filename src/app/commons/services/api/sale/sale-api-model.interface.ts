import { IResponseEvent } from './../event/event-api-model.interface';
import { IResponseCustomer } from './../customer/customer-api-model.interface';
import { IResponsePayment } from './../payment/payment-api-model.interface';

//#region CREATE SALE
export interface IRequestCreateSale {
	concertId: number;
	ticketsQuantity: number;
}

//#endregion

//#region ListSalesByGenre
export interface IRequestListSalesByGenre {
	dateStart: string;
	dateEnd: string;
	page?: number;
	rows?: number;
}
//#endregion

//#region ListSales
export interface IResponseListSales {
	saleId: number;
	dateEvent: string;
	timeEvent: string;
	genre: string;
	imageUrl: string;
	title: string;
	operationNumber: string;
	fullName: string;
	quantity: number;
	saleDate: string;
	total: number;
}
//#endregion

//#region get sale
export interface IResponseSale {
	id: number;
	dateEvent: string;
	genre: string;
	imageUrl: string;
	title: string;
	operationNumber: string;
	fullName: string;
	quantity: number;
	saleDate: string;
	totalSale: number;
}
//#endregion

//v2
export interface IResponseSalev2 {
	idSale: number;
	saleDate: string;
	operationNumber: string;
	total: number;
	quantity: number;
	status: string;
	event: IResponseEvent;
	customer: IResponseCustomer;
	payment: IResponsePayment;
}

//#region ListSalesByGenre
export interface IRequestCreateSalev2 {
	idSale: number;
	saleDate: Date;
	operationNumber: string;
	quantity: number;
	total: number;
	event: IResponseEvent;
	customer: IResponseCustomer;
	payment: IResponsePayment;
}
//#endregion
