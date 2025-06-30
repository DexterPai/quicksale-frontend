import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { URL_HOME } from '../services/api/home/home-api.service';
import {
	URL_CHANGE_PASSWORD,
	URL_LOGIN,
	URL_REGISTER,
	URL_RESET_PASSWORD,
	URL_SEND_TOKEN_RESET_PASSWORD
} from '../services/api/user/user-api.service';
import { DataUserService } from '../services/local/data-user.service';

const EXEMPTED_URLS = [
	URL_LOGIN,
	URL_REGISTER,
	URL_HOME,
	URL_SEND_TOKEN_RESET_PASSWORD,
	URL_RESET_PASSWORD,
	URL_CHANGE_PASSWORD
];

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
	constructor(private _dataUser: DataUserService, private _router: Router) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request);
	}

	private isExempted(url: string): boolean {
		const exist = EXEMPTED_URLS.find((item) => item === url);
		return exist !== undefined;
	}
}
