import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { IResponse } from '../api-models-base.interface';
import { IResponseCustomer } from '../customer/customer-api-model.interface';
import { environment } from './../../../../../environments/environment';
import {
	IRequestChangePassword,
	IRequestLogin,
	IRequestRegister,
	IRequestResetPassword,
	IResponseLogin,
	IRequestLoginv2,
	IResponseLoginv2,
	IRequestRegisterv2
} from './user-api-model.interface';

const URL_USER = environment.host + '/Users';
const URL_CUSTOMER = environment.host + '/customer';

export const URL_LOGINv2 = environment.host + '/customer/login';

export const URL_LOGIN = URL_USER + '/Login';
export const URL_REGISTER = URL_USER + '/Register';

export const URL_SEND_TOKEN_RESET_PASSWORD = URL_USER + '/SendTokenToResetPassword';
export const URL_RESET_PASSWORD = URL_USER + '/ResetPassword';

export const URL_CHANGE_PASSWORD = URL_USER + '/ChangePassword';

@Injectable({ providedIn: 'root' })
export class UserApiService {
	constructor(private _httpClient: HttpClient) {}

	login(request: IRequestLogin): Observable<IResponseLogin> {
		return this._httpClient.post<IResponseLogin>(URL_LOGIN, request).pipe(
			catchError((error) => {
				console.log('ERROR DESDE EL MISMO SERVICIO::::', error);
				throw error;
			})
		);
	}

	loginv2(request: IRequestLoginv2): Observable<IResponseLoginv2> {
		return this._httpClient.post<IResponseLoginv2>(URL_LOGINv2, request).pipe(
			catchError((error) => {
				console.log('ERROR DESDE EL MISMO SERVICIO::::', error);
				throw error;
			})
		);
	}

	registerv2(request: IRequestRegisterv2): Observable<IResponse<IResponseCustomer>> {
		return this._httpClient.post<IResponse<IResponseCustomer>>(URL_CUSTOMER, request);
	}

	register(request: IRequestRegister): Observable<IResponse<string>> {
		return this._httpClient.post<IResponse<string>>(URL_REGISTER, request);
	}

	sendTokenToResetPassword(email: string): Observable<IResponse<string>> {
		return this._httpClient.post<IResponse<string>>(URL_SEND_TOKEN_RESET_PASSWORD, { email });
	}

	resetPassword(request: IRequestResetPassword): Observable<IResponse<string>> {
		return this._httpClient.post<IResponse<string>>(URL_RESET_PASSWORD, request);
	}

	changePassword(request: IRequestChangePassword): Observable<IResponse> {
		return this._httpClient.post<IResponse>(URL_CHANGE_PASSWORD, request);
	}
}
