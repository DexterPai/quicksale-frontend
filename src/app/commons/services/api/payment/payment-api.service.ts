import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { IResponsev2 } from './../api-models-base.interface';
import { IResponsePayment } from './payment-api-model.interface';

export const URL_PAYMENT = environment.host + '/payment';

@Injectable({
	providedIn: 'root'
})
export class PaymentApiService {
	constructor(private _httpClient: HttpClient) {}

	getPayments(): Observable<IResponsev2<IResponsePayment[]>> {
		return this._httpClient.get<IResponsev2<IResponsePayment[]>>(URL_PAYMENT);
	}
}
