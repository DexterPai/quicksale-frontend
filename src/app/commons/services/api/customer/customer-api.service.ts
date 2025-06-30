import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { IResponsev2 } from '../api-models-base.interface';
import { IResponseCustomer } from './customer-api-model.interface';
import { IRequestChangePassword } from '../user/user-api-model.interface';

export const URL_CUSTOMER = environment.host + '/customer';
@Injectable({
	providedIn: 'root'
})
export class CustomerApiService {
	constructor(private _httpClient: HttpClient) {}

	getCustomer(id: number): Observable<IResponsev2<IResponseCustomer>> {
		const url = `${URL_CUSTOMER}/${id}`;
		return this._httpClient.get<IResponsev2<IResponseCustomer>>(url);
	}

	changePassword(request: IRequestChangePassword): Observable<IResponsev2<IResponseCustomer>> {
		const url = `${URL_CUSTOMER}/changePassword`;
		return this._httpClient.put<IResponsev2<IResponseCustomer>>(url, request);
	}
}
