import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { IResponse, IResponsev2 } from './../api-models-base.interface';
import {
	IRequestCreateSalev2,
	IRequestListSalesByGenre,
	IResponseListSales,
	IResponseSale,
	IResponseSalev2
} from './sale-api-model.interface';

const URL_SALE = environment.host + '/sale';
const URL_SALE_GET = URL_SALE + '/Get';
const URL_CREATE_SALE = URL_SALE + '/Create';
const URL_LIST_SALE = URL_SALE + '/ListSales';
const URL_LIST_SALE_BY_DATE = URL_SALE + '/ListSalesByDate';

@Injectable({
	providedIn: 'root'
})
export class SaleApiService {
	constructor(private _httpClient: HttpClient) {}

	createSale(sale: IRequestCreateSalev2): Observable<IResponsev2<IRequestCreateSalev2>> {
		return this._httpClient.post<IResponsev2<IRequestCreateSalev2>>(URL_SALE, sale);
	}

	getSale(idSale: number): Observable<IResponse<IResponseSale>> {
		return this._httpClient.get<IResponse<IResponseSale>>(`${URL_SALE_GET}/${idSale}`);
	}

	getSalesUser(filter: string, page?: number, rows?: number): Observable<IResponse<IResponseListSales[]>> {
		let params = new HttpParams();

		if (filter) {
			params = params.set('filter', filter);
		}

		if (page) {
			params = params.set('page', page);
		}

		if (rows) {
			params = params.set('pageSize', rows);
		}
		return this._httpClient.get<IResponse<IResponseListSales[]>>(URL_LIST_SALE, { params });
	}

	getListSales(request: IRequestListSalesByGenre): Observable<IResponse<IResponseListSales[]>> {
		let params = new HttpParams().set('startDate', request.dateStart).set('endDate', request.dateEnd);
		if (request.page) {
			params = params.set('page', request.page);
		}
		if (request.rows) {
			params = params.set('page', request.rows);
		}

		return this._httpClient.get<IResponse<IResponseListSales[]>>(URL_LIST_SALE_BY_DATE, { params });
	}

	getListSalesv2(): Observable<IResponsev2<IResponseSalev2[]>> {
		return this._httpClient.get<IResponsev2<IResponseSalev2[]>>(URL_SALE);
	}

	getListSalesv2_Date(dateIni: string, dateFin: string): Observable<IResponsev2<IResponseSalev2[]>> {
		const URL_LIST_SALE_BY_DATEv2 = URL_SALE + '/find' + '/' + dateIni + '/' + dateFin;
		console.log(URL_LIST_SALE_BY_DATEv2);
		return this._httpClient.get<IResponsev2<IResponseSalev2[]>>(URL_LIST_SALE_BY_DATEv2);
	}

	getSalev2(idSale: number): Observable<IResponsev2<IResponseSalev2>> {
		return this._httpClient.get<IResponsev2<IResponseSalev2>>(`${URL_SALE}/${idSale}`);
	}

	getListSalesv2_Email(email: string): Observable<IResponsev2<IResponseSalev2[]>> {
		const URL_LIST_SALE_BY_Email = URL_SALE + '/find' + '/' + email;
		return this._httpClient.get<IResponsev2<IResponseSalev2[]>>(URL_LIST_SALE_BY_Email);
	}
}
